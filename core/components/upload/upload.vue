<template>
  <el-upload
      class="avatar-uploader"
      action
      :show-file-list="false"
      :data="data"
      :http-request="httpRequest">
      <p>下载</p>
    </el-upload>
</template>

<script>
function loop(){}

import axios from 'axios'

export default {
  props:{
    chunked:{
      type:Boolean,
      default: false
    },
    chunkSize:{
      type: Number,
      default: 1 * 1024 * 1024 // 默认1m
    },
    formatPostData:Function, // 过滤上传参数
    action:{
      type:String,
      required:true
    },
    maxSize:{
      type:Number,
      default:-1 //默认不限制
    },
    data:{
      type:Object,
      default:()=>({})
    }
  },
  data(){
    return {
      requestCancelQueue:[]
    }
  },
  mounted(){
  },
  methods:{
    // 格式化文件大小显示文字
    getSize (size) {
      return size > 1024
        ? size / 1024 > 1024
          ? size / (1024 * 1024) > 1024
            ? (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
            : (size / (1024 * 1024)).toFixed(2) + 'MB'
          : (size / 1024).toFixed(2) + 'KB'
        : (size).toFixed(2) + 'B'
    },
    async httpRequest(options){
      const { maxSize, chunked, chunkSize } = this

      const { file, onProgress, onSuccess, onError } = options
      if (maxSize > 0 && file.size > maxSize) {
        return this.$message({
          message: `您选择的文件大于${this.getSize(maxSize)}`,
          type: 'error'
        })
      }

      const uploadFunc = file.size > chunkSize && chunked  ? this.splitUpload : this.singleUpload
      try {
        await uploadFunc(file, onProgress)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        onSuccess()
      } catch (e) {
        console.error(e)
        this.$message({
          message: e.message,
          type: 'error'
        })
        onError()
      }
      const prom = new Promise((resolve, reject) => {})
      prom.abort = () => {}
      return prom
    },
    // 单文件直接上传
    singleUpload (file, onProgress) {
      return this.postFile({ file, guid: file.uid, realname: file.fileName }, onProgress)
    },
    // 大文件分块上传
    splitUpload (file, onProgress) {
      return new Promise(async (resolve, reject) => {
        try {
          const { chunkSize } = this
          const chunks = Math.ceil(file.size / chunkSize)
          const fileChunks = await this.splitFile(file, chunkSize, chunks)
          let currentChunk = 0
          for (let i = 0; i < fileChunks.length; i++) {
            // 服务端检测已经上传到第currentChunk块了，那就直接跳到第currentChunk块，实现断点续传
            console.log(currentChunk, i)
            // if (Number(currentChunk) === i) {
              // 每块上传完后则返回需要提交的下一块的index
              currentChunk = await this.postFile({
                chunk: i,
                chunks,
                chunkSize,
                realname: file.name,
                size: file.size,
                guid: file.uid,
                file: fileChunks[i]
              }, onProgress)
            }
          // }
          // const isValidate = await this.validateFile({
          //   chunks: fileChunks.length,
          //   fileName: file.name,
          //   fullSize: file.size,
          //   uid: file.uid
          // })
          // if (!isValidate) {
          //   throw new Error('文件校验异常')
          // }
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile (file, chunkSize, chunks) {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            const fileChunk = []
            for (let chunk = 0; chunks > 0; chunks--) {
              fileChunk.push(file.slice(chunk, chunk + chunkSize))
              chunk += chunkSize
            }
            resolve(fileChunk)
          }, 0)
        } catch (e) {
          console.error(e)
          reject(new Error('文件切块发生错误'))
        }
      })
    },
    removeFile (file) {
      this.requestCancelQueue[file.uid]()
      delete this.requestCancelQueue[file.uid]
      return true
    },
    postFile (param, onProgress) {
      const { data, formatPostData } = this;
      let postData = {};
      
      for (let p in param) {
        postData[p] = param[p]
      }

      for (let p in data) {
        postData[p] = data[p]
      }

      //如果定义过滤
      if (formatPostData) {
        postData = this.formatPostData(postData);
      }

      const formData = new FormData()

      for (let p in postData) {
        formData.append(p, postData[p])
      }

      const { requestCancelQueue } = this
      const config = {
        cancelToken: new axios.CancelToken(function executor (cancel) {
          if (requestCancelQueue[param.uid]) {
            requestCancelQueue[param.uid]()
            delete requestCancelQueue[param.uid]
          }
          requestCancelQueue[param.uid] = cancel
        }),
        onUploadProgress: e => {
          if (param.chunked) {
            e.percent = Number(((((param.chunk * (param.chunkSize - 1)) + (e.loaded)) / param.fullSize) * 100).toFixed(2))
          } else {
            e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
          }
          onProgress(e)
        }
      }
      return axios.post(this.action, formData, config).then(rs => rs.data)
    },
    post(rawFile, chunk) {
      if (!chunk && this.chunked) {
        let chunkFile = this.CuteFile(rawFile);
        this.postChunk(chunkFile);
        return false;
      }

      /**
       * 此uid是用来记录req的
       * 如果不是分片的情况下，uid为file.uid
       * 如果是chunk，uid为file.uid+ chunk.chunk
       */
      let uid = chunk ? `${rawFile.uid}${chunk.chunk}` : rawFile.uid;

      let data = this.data || {};
      for (const p in chunk) {
        if (p !== 'file' && chunk.hasOwnProperty(p)) {
          data[p] = chunk[p];
        }
      }

      // 分片上传guid要一致
      data.guid = rawFile.uid;

      let formatData = data;
      if (this.formatPostData) {
        formatData = this.formatPostData(data);
      }
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile.chunk || rawFile,
        data: formatData,
        filename: this.name,
        action: this.action,
        onProgress: e => {
          // 如果不是分片，或者只剩下一个分片时，更新
          if (!chunk || rawFile.blocks.length === 1) {
            this.onProgress(e, rawFile);
          } else {
            let sum = chunk.file.chunk_status.reduce((a, c) => a + c);
            e.percent = e.percent * sum / chunk.chunks;
            this.onProgress(e, rawFile);
          }
        },
        onSuccess: res => {
          if (chunk) {
            // 分片上传成功后删掉分片
            chunk.file.chunk_status[chunk.chunk] = 1;
            let sum = chunk.file.chunk_status.reduce((a, c) => a + c);
            // 全部已上传
            if (sum === chunk.chunks) {
              this.onSuccess(res, rawFile);
            }
          } else {
            this.onSuccess(res, rawFile);
          }
          this.reqs[uid] && delete this.reqs[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          this.reqs[uid] && delete this.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    CuteFile(file) { // 负责将文件切片。
      let { chunkSize } = this;
      let pending = [];
      let chunk_status = []; // 分片的上传状态数组，成功后值为1
      let total = file.size;
      let chunks = chunkSize ? Math.ceil(total / chunkSize) : 1;
      let start = 0;
      let index = 0;
      let len;
      let api;

      api = {
        file: file,

        has: function() {
          return !!pending.length;
        },

        shift: function() {
          return pending.shift();
        },

        unshift: function(block) {
          pending.unshift(block);
        }
      };

      while (index < chunks) {
        len = Math.min(chunkSize, total - start);
        // 默认状态为0
        chunk_status.push(0);
        pending.push({
          file: file,
          start: start,
          end: chunkSize ? (start + len) : total,
          total: total,
          name: file.name,
          type: file.type,
          size: file.size,
          chunks: chunks,
          chunk: index++
        });
        start += len;
      }

      file.blocks = pending.concat();
      file.remaning = pending.length;
      file.chunk_status = chunk_status;
      return api;
    },
    postChunk(chunkFile) { // 上传chuck文件
      chunkFile.file.blocks.forEach(item=>{
        let chunk = item.file.slice(item.start, item.end);
        chunk = chunk.slice(0, chunk.size, item.file.type);
        chunk.lastModifiedDate = new Date();
        chunk.name = item.name;
        
        let file = {};
        for (let i in item.file) {
          file[i] = item.file[i];
        }
        file.chunk = chunk;
        this.post(file, item);
      });
    }
  }
}
</script>

