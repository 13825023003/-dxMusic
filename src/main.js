import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入ajax
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import Vuex from 'vuex'
import APlayer from '@moefe/vue-aplayer'
import 'default-passive-events'
import VueScroller from 'vue-scroller'
import SlideVerify from 'vue-monoplasty-slide-verify'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import waterfall from 'vue-waterfall2'
import 'video.js/dist/video-js.css'
// 导入rem适配文件
import 'lib-flexible/flexible'

import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Loading,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  Icon,
  Tab,
  Tabs,
  Lazyload,
  Grid,
  GridItem,
  Card,
  Slider,
  PullRefresh,
  Sticky,
  Cell,
  Dialog,
  Uploader,
  RadioGroup,
  Radio,
  Calendar,
  Pagination,
  Image,
} from 'vant'

Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(SlideVerify)
Vue.use(VideoPlayer)
Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: true,
})
Vue.use(VueScroller)
Vue.use(waterfall)
Vue.use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Loading)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Lazyload)
  .use(Grid)
  .use(GridItem)
  .use(Card)
  .use(Slider)
  .use(PullRefresh)
  .use(Sticky)
  .use(Cell)
  .use(Dialog)
  .use(Uploader)
  .use(Radio)
  .use(RadioGroup)
  .use(Calendar)
  .use(Pagination)
  .use(Image)

Vue.config.productionTip = false
// 配置请求基本路径
axios.defaults.baseURL = 'http://localhost:3000'
// axios拦截器, 在发起请求之前执行
axios.defaults.withCredentials = true
axios.interceptors.request.use((config) => {
  // 处理post参数,进行参数序列化
  if (config.method == 'post') {
    // 序列化post请求参数
    let paramsString = ''
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`
    }
    // 重新赋值config.data
    config.data = paramsString.slice(0, -1)
  }
  // 必须返回config
  return config
})
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
