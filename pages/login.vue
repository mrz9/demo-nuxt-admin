<template>
  <div class="page-login layout-full page-dark">
    <div class="page height-full">
      <div class="page-content height-full">
        <div class="page-brand-info vertical-align animation-slide-left hidden-xs">
          <div class="page-brand vertical-align-middle">
            <div class="brand">
              <img class="brand-img" src="~/assets/img/logo-white-min.svg" height="50">
              <span>PHPCALL</span>
            </div>
          </div>
        </div>
        <div class="page-login-main animation-fade">
          <!-- start 表单错误提示 -->
          <div class="alert alert-danger alert-dismissible hide-tip" role="alert" id="error-tip"></div>
          <!-- end 表单错误提示 -->
          <div class="vertical-align">

            <div v-if="type == 'login'" class="vertical-align-middle">
              <el-row class="brand hidden-sm-and-up" type="flex" justify="center" align="center">
                <img class="brand-img" src="~/assets/img/logo.svg" height="50" />
                <span>PHPCALL</span>
              </el-row>
              <h3 class="hidden-sm-and-down">
                登录 PHPCALL
              </h3>

              <el-form action="" class="login-form" method="post" id="loginForm">
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>

                <div v-if="image_code" class="form-group">
                  <label class="sr-only" for="password">验证码</label>
                  <div class="input-group">
                    <input type="text" class="form-control" name="validate" placeholder="请输入验证码" datatype="*" nullmsg="验证码不能为空" />
                    <a class="input-group-addon nopadding reload-vify" href="javascript:;">
                      <img style="display:none" height="32" />
                      <span class="vify-wrap">点击获取验证码</span>
                    </a>
                  </div>
                </div>

                <el-row class="remember-box" type="flex" justify="space-between" align="center">
                  <el-checkbox>自动登录</el-checkbox>
                  <a href="javascript:;" @click="show_reset_pwd_alert = !show_reset_pwd_alert">忘记密码了？</a>
                </el-row>

                <el-alert
                  v-show="show_reset_pwd_alert"
                  :closable="false"
                  title="请联系管理员重置密码。"
                  type="warning">
                </el-alert>

                <el-button class="login-btn" type="primary" size="medium">立即登录</el-button>
                <div v-if="third_login" class="login-auth m-t">
                  <span>使用集团账号登录：</span>
                  <a href=""><img src="~/assets/img/h-icon.svg" alt="" /></a>
                  <a href=""><img src="~/assets/img/t-icon.svg" alt="" /></a>
                </div>
              </el-form>
            </div>

            <div v-else-if="type == 'reset_pwd'" class="vertical-align-middle">
              <el-row class="brand hidden-sm-and-up" type="flex" justify="center" align="center">
                <img class="brand-img" src="~/assets/img/logo.svg" height="50" />
                <span>修改初始密码</span>
              </el-row>
              <h3 class="hidden-sm-and-down">
                修改初始密码
              </h3>
              <p class="hidden-sm-and-down">为了您的账号安全，首次登录时请修改初始密码。</p>

              <el-form action="" class="login-form" method="post" id="loginForm">
                <el-form-item prop="name">
                  <el-input type="password" placeholder="设置密码"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <el-input type="password" placeholder="确认密码" show-password></el-input>
                </el-form-item>

                <el-button class="login-btn" type="primary" size="medium">立即修改</el-button>
  
              </el-form>
            </div>

            <div v-else-if="type ==  'mfa'" class="approve-wrap vertical-align-middle">
              <el-row class="brand hidden-sm-and-up text-center" >
                <img class="brand-img" src="~/assets/img/logo.svg" height="50" />
                <span>MFA认证</span>
              </el-row>
              <h3 class="hidden-sm-and-down">
                MFA认证
              </h3>
              <!--<p class="hidden-xs">账号保护已开启，请根据提示完成以下操作</p>-->
              <el-form action="" class="login-form mfa-form" method="post" id="loginForm">
                <h6 class="m-t">账号保护已开启，请根据提示完成以下操作</h6>
                <img src="~/assets/img/otp_auth.png" alt="" />
                <p class="mfa-info"> 请打开手机Google Authenticator应用，输入6位动态码</p>

                <el-form-item prop="name">
                  <el-input type="number" placeholder="6位数字"></el-input>
                </el-form-item>

                <el-button class="login-btn" type="primary" size="medium">下一步</el-button>
                <div class="mfa-tip">
                  <a href="#">
                    <small>如果不能提供MFA验证码，请联系管理员!</small>
                  </a>
                </div>
  
              </el-form>
            </div>
          </div>
          <footer class="page-copyright">
            <p>LE MAJESTIC GLOBAL CO.,LTD &copy;
              <a href="#" target="_blank">ultron.com</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'page',
    data() {
      return {
        //login reset_pwd mfa
        type: 'login',
        image_code: false, //是否需要验证码
        third_login: false, //第三方登陆

        ruleForm: {
          username: '',
          password: ''
        },
        show_reset_pwd_alert:false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      remember() {
        return false
      }
    },
    methods: {
      submit(){
        //授权成功后需要
      }
    }
  }

</script>
<style src="element-ui/lib/theme-chalk/display.css"></style>
<style lang="less" src='~/assets/less/login.less'></style>

