import qs from 'qs';

export default function({ $axios, app, redirect }) {
  const noopLoading = {
    finish: () => { },
    start: () => { },
    fail: () => { },
    set: () => { }
  }

  const $loading = () => (window.$nuxt && window.$nuxt.$loading && window.$nuxt.$loading.set) ? window.$nuxt.$loading : noopLoading

  $axios.onRequest(config => {
    $loading().start();

    let os = 'web';
    let token = localStorage.getItem("LMS_token");
    let uid = localStorage.getItem("LMS_uid");

    try {
      config.baseURL = window.$config.host.base;
      // 跨域修改header需要后端配置header跨域
      //header('Access-Control-Allow-Headers:x-requested-with,content-type');
      // config.headers['Authorization'] = `Bearer ${token}`;
    } catch (e) {}

    // 扩展url参数
    config.params = {
      os
    };

    !config.data && (config.data = {});

    /**
     * 登陆的请求有login_type字段，无需带上token校验
     */
    if (!config.data.login_type) {
      config.data.token = token;
      config.data.uid = uid;
    }

    config.transformRequest = [function(data, headers) {
      return qs.stringify(data);
    }];

    // 此方法会触发一次options的请求
    delete config.onUploadProgress;

  });

  $axios.onResponse(response => {
    // 参数错误且uid或token不存在时，跳到登录页面
    if(response.data.code === -10000
        || !localStorage.getItem('LMS_token')
        || !localStorage.getItem('LMS_uid')){
      setTimeout(()=>{
        window.$nuxt.$router.push(`/account/login?ref=${window.$nuxt.$route.fullPath}`)
      }, 1000);
    }
    $loading().finish()
    return response;
  });

  $axios.onError(error => {
    console.error(error);
    $loading().fail()
    $loading().finish()

    // app.$message(error)
  });
}
