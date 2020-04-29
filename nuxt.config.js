const pkg = require('./package')

module.exports = {
  mode: 'spa',
  env: {
    env: process.env.env,
  },
  /*
   ** Headers of the page
   */
  head: {
    title: '个人博客',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: '//at.alicdn.com/t/font_1051756_1kvcubm8opw.css'
      },
      {
        rel: 'stylesheet',
        href: '/vendor/redactor/css/redactor.css'
      },
    ],
    script: [
      {
        src: '/vendor/redactor/js/jquery-2.0.3.min.js'
      },
      {
        src: '/vendor/redactor/js/redactor.js'
      },
      {
        src: '/vendor/webuploader/webuploader.js'
      },
      {
        src: '/vendor/redactor/plugins/webuploadImage.js'
      },
      {
        src: '/vendor/redactor/plugins/webuploadVideo.js'
      },
      {
        src: '/vendor/redactor/plugins/fullscreen.js'
      },
      {
        src: '/vendor/redactor/js/zh_cn.js'
      },
      {
        src: '/vendor/redactor/plugins/fonttotal.js'
      },
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/core/assets/less/ui.less'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/ui',
    '@/plugins/config',
    '@/plugins/axios',
    '@/plugins/utils',
    '@/plugins/directive',
    '@/plugins/errorHandler'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/style-resources',
    '~/core/index.js'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  styleResources: {
    less: [
      '~/assets/less/modules/var.less',
      '~/core/assets/less/modules/var.less',
      '~/core/assets/less/modules/mixins.less',
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
    },
    publicPath: '/static/',
  }
}
