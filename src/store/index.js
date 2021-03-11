import Vue from 'vue'
import Vuex from 'vuex'
// 引入登录模块
import user from './modules/user'
// 引入播放列表模块
import playList from './modules/playList'
// 引入外部模块
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

//状态管理 ==> 公共数据库, 所有组件都可以访问
export default new Vuex.Store({
  // 开启严格模式
  strict: true,
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  modules: {
    user,
    playList,
  },
})
