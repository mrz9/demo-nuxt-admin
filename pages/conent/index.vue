<template>
  <div class="content-page">
    <el-form label-width="100px" :model="form">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="分类">
         <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="单图">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="多图">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容">
        <div class="total-wrap" style="position: relative">
          <el-input
            id="redactor_content"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.textarea">
          </el-input>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      imageUrl: '',
      form: {
        title:'',
        category:'',
        textarea:''
      },
      categorys: [
        {
          value: 0,
          label: '视频'
        },
        {
          value: 1,
          label: '小说'
        },
        {
          value: 2,
          label: '图书'
        }
      ]
    }
  },
  mounted(){
    this.$nextTick(()=>{
      $('#redactor_content').redactor({
          imageWebUpload: '?ct=upload&ac=upload',
          imageUpload: '?ct=upload&ac=upload_html5',
          imageDir: 'image',
          thumbWidth: 0,
          thumbHeight: 0,
          videoUpload: '?ct=upload&ac=upload_chunked',
          videoDir: 'video',
          plugins: [ 'fullscreen', 'webuploadImage', 'webuploadVideo', 'pasteImage', 'fontcolor'],
          minHeight: '480px',
          maxHeight: '480px',
          lang: 'zh_cn',
          imgFileNumLimit: 3,
          videoFileNumLimit: 3,
      });
    });
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>

<style>

</style>
