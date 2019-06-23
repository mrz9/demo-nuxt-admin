<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <div class="box">
          <h3>分片上传</h3>
          <p>基于<code>el-upload</code>封装的分片上传组件，主要是通过<code>http-request</code>覆盖上传行为</p>
          <div class="block">
            <div class="source">
                <el-upload
                  drag
                  multiple
                  :data="{
                    uid: '3d02f6fe19d955e1b8c612b237055c79',
                    token: '9218f008879299df58a111f489cab2be3d02f6fe19d955e1b8c612b237055c79'
                  }"
                  :max-chunk='100'
                  :auto-upload="true"
                  :http-request="$utils.upload.request"
                  :before-remove="$utils.upload.removeFile"
                  :limit="10"
                  action="http://lecsstaffapi1.lemajestic.com/?ct=im&ac=upload_chunked&os=web"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="less">
.box {
  &>h3 {
    margin:55px 0 20px
  }
  &>p {
    margin:1em 0;
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
  code {
    background-color: #f9fafc;
    padding: 0 4px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
  }
  .block {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin-bottom: 24px;
    .source {
      padding: 24px;
    }
  }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
