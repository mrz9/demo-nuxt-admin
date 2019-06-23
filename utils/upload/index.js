/**
 * 封装用于element-ui的文件分片上传
 */
import axios from 'axios'
import getSize from '../getSize';

// 配置上传参数
const SETTING = {
  maxSize: 20 * 1024 * 1024, // 上传最大文件限制 最大上传限制20m
  multiUploadSize: 1 * 1024 * 1024, // 大于这个大小的文件使用分块上传,超过1m就分片
  chunkSize: 1 * 1024 * 1024, // 每块文件大小 每片1m
  requestCancelQueue: {}, // 请求方法队列（调用取消上传
}
// el-upload传入进来的配置
let OPTIONS = {};

let UPLOAD_STATUS = [];

// 不需要分片上传
function singleUpload (file, onProgress, action = '') {
  return postFile({
    file, 
    guid: file.uid, 
    name: file.name 
    }, onProgress, action)
}

// 文件分块,利用Array.prototype.slice方法
function splitFile (file, chunkSize, chunks) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const fileChunk = []
        for (let chunk = 0; chunks > 0; chunks--) {
          let chunkFile = file.slice(chunk, chunk + chunkSize);
              chunkFile = chunkFile.slice(0, chunkFile.size, file.type);
              chunkFile.name = file.name;
              chunkFile.uid = file.uid;
          fileChunk.push(chunkFile)
          chunk += chunkSize
        }
        resolve(fileChunk)
      }, 0)
    } catch (e) {
      console.error(e)
      reject(new Error('文件切块发生错误'))
    }
  })
}

// 大文件分块上传
function splitUpload (file, onProgress,action = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const { chunkSize } = SETTING
      const chunks = Math.ceil(file.size / chunkSize)
      const fileChunks = await splitFile(file, chunkSize, chunks);
      let rs = [];
      for (let i = 0; i < fileChunks.length; i++) {
        UPLOAD_STATUS.push(0);
        try{
          rs.push(postFile({
            chunked:true,
            chunk: i,
            chunks,
            name: file.name,
            size: file.size,
            guid: file.uid,
            file: fileChunks[i]
          }, onProgress, action))
        }catch(e){// 如果有一个错误，则中断该次请求
          removeFile(file);
          throw e;
        }
      }
      let res = await Promise.all(rs);
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

// 上传失败上传文件
function removeFile (file) {
  const { requestCancelQueue } = SETTING;
  if(requestCancelQueue[file.uid] && requestCancelQueue[file.uid].length){
    requestCancelQueue[file.uid].forEach(cancel=>cancel());
    delete requestCancelQueue[file.uid]
  }
  return true
}

// 提交文件方法,将参数转换为FormData, 然后通过axios发起请求
async function postFile (param, onProgress, action = '') {
  const formData = new FormData()
  for (let p in param) {
    if(p !== 'file'){
      formData.append(p, param[p])
    }
  }
  if(OPTIONS.data){
    for(let d in OPTIONS.data){
      formData.append(d, OPTIONS.data[d])
    }
  }
  /**
   * 此处不能少不然分片上传时后台接收到的file的name是blob
   */
  formData.append(param.filename || 'file', param.file, param.file.name);

  const { requestCancelQueue,chunkSize } = SETTING
  const config = {
    cancelToken: new axios.CancelToken(function executor (cancel) {
      if (requestCancelQueue[param.file.uid] ) {
        requestCancelQueue[param.file.uid].push(cancel);
      }else{
        requestCancelQueue[param.file.uid] = [cancel]
      }
    }),
    onUploadProgress: e => {
      if (param.chunked) {
        UPLOAD_STATUS[param.chunk] = Number(e.loaded / e.total);
        let sum = UPLOAD_STATUS.reduce((a, c) => a + c);
        e.percent = (100 * sum / param.chunks).toFixed(2);
      } else {
        e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
      }
      onProgress(e)
    }
  }
  const rs = await axios.post(action, formData, config)
  const {data} = rs;
  if(data.code == 0){
    if(param.chunks){
      UPLOAD_STATUS[param.chunk] = 1;
    }
    return data;
  }else{
    throw new Error(data.msg || '接口异常');
  }
}

/**
 * 暴露给el-upload的http-request方法
 * @param {*} options el-upload 传入的配置
 */
function request(options){
  OPTIONS = options
  UPLOAD_STATUS = [];
  const { maxSize, multiUploadSize,requestCancelQueue } = SETTING

  const { file, onProgress, onSuccess, onError } = options
  if (file.size > maxSize) {
    onError()
    return this.$message({
      message: `您选择的文件大于${getSize(maxSize)}`,
      type: 'error'
    })
  }
  const uploadFunc = file.size > multiUploadSize ? splitUpload : singleUpload
  const rs = uploadFunc(file, onProgress, options.action).then(rs=>{
    let result = rs.length ? rs.find(item=>item.data.realname) : rs;
    onSuccess(result);
  }).catch(e=>{
    if(e.message){
      onError()
    }
  })

  return {
    then(){
      return Promise.resolve(rs)
    },
    abort(){
      removeFile(file);
    }
  }
}

export default {
  request,
  removeFile
}
