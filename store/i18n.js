export default {
  namespaced: true,
  state: () => ({
    locales: ['zh-CN', 'en'],
    locale: localStorage.getItem('LANG') || 'zh-CN'
  }),
  mutations: {
    set_lang(state, locale) {
      if (state.locales.indexOf(locale) !== -1) {
        state.locale = locale
        localStorage.setItem('LANG',locale)
      }
    },
    add_lang(state,lang){
      state.locales.indexOf(lang) == -1 && state.locales.push(lang);
    }
  }
}
