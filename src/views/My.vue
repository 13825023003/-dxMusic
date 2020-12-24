<template>
  <div class="my">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">个人中心</div>
      </template>
      <template #left>
        <van-icon name="search" size="26" @click="goSearch" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div class="user-top clearfix">
      <div class="user-img fl">
        <img :src="userImg" class="auto-img" alt="" />
      </div>
      <div class="user-text fr">
        <div class="user-name">{{ nickname }}</div>
        <div class="user-enname">
          关注 : {{ userFollowCount }} 粉丝 : {{ userFollowesCount }}
        </div>
      </div>
    </div>
    <!-- 内容层 -->
    <van-cell
      v-for="(item, index) in listData"
      :key="index"
      :title="item.title"
      :icon="item.icon"
      is-link
      @click="goPage(item.name)"
    ></van-cell>
    <div class="user-btn">
      <van-button color="#505050" round size="large" @click="logout"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import '../assets/less/My.less'
import { formatDuring } from '../assets/js/formatDuring'
import areaList from '../assets/js/area'
export default {
  name: 'My',
  data() {
    return {
      areaList,
      // 用户名称
      nickname: '',
      // 用户ID
      userId: 0,
      // 用户头像
      userImg: '',
      // 用户关注数量
      userFollowCount: 0,
      // 用户粉丝数量
      userFollowesCount: 0,
      // 用户城市信息
      userCityData: '',
      listData: [
        {
          title: '个人资料',
          name: 'Account',
          icon: 'smile-o',
        },
        {
          title: '喜欢的音乐',
          name: 'Like',
          icon: 'like-o',
        },
        {
          title: '收藏的歌单',
          name: 'Collection',
          icon: 'star-o',
        },
        {
          title: '修改密码',
          name: 'Secure',
          icon: 'setting-o',
        },
      ],
    }
  },
  created() {
    // 登录
    this.login()
    // 获取登录状态
    this.getLoginStatus()
    // 获取用户关注列表
    this.getuserFollow()
    // 获取用户粉丝列表
    this.getuserFolloweds()
  },
  methods: {
    // 登录
    login() {
      let phone = localStorage.getItem('_phone')
      let password = localStorage.getItem('_password')
      this.userId = localStorage.getItem('_userID')
      this.nickname = localStorage.getItem('_nickname')
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: '/login/cellphone?timestamp=1503019930000',
        params: {
          phone: phone,
          password: password,
        },
      })
        .then((result) => {
          this.$toast.clear()
          this.userImg = result.data.profile.avatarUrl
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取登录状态
    getLoginStatus() {
      setTimeout(() => {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        })
        this.axios({
          method: 'GET',
          url: '/user/account',
        })
          .then((result) => {
            this.$toast.clear()
          })
          .catch((err) => {
            this.$toast.clear()
          })
      })
    },
    // 获取用户关注列表
    getuserFollow() {
      setTimeout(() => {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        })
        this.axios({
          method: 'GET',
          url: '/user/follows',
          params: {
            uid: this.userId,
          },
        })
          .then((result) => {
            this.$toast.clear()
            this.userFollowCount = result.data.follow.length
          })
          .catch((err) => {
            this.$toast.clear()
          })
      })
    },
    // 获取用户粉丝列表
    getuserFolloweds() {
      setTimeout(() => {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
        })
        this.axios({
          method: 'GET',
          url: '/user/followeds',
          params: {
            uid: this.userId,
          },
        })
          .then((result) => {
            this.$toast.clear()
            this.userFollowesCount = result.data.followeds[0].followeds
          })
          .catch((err) => {
            this.$toast.clear()
          })
      })
    },
    // 音乐播放中事件
    Playing() {
      const { media } = this.$refs.aplayer
      this.changeCurrentTime(media.currentTime)
    },
    changeCurrentTime(time) {
      this.currentTimes = formatDuring.secondDuring(time)
      this.$store.commit('changeCurrentTime', time)
    },
    // 跳到搜索页面
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
    goPage(name) {
      this.$router.push({ name })
    },
    // 退出登录
    logout() {
      this.$dialog
        .confirm({
          message: '是否退出',
          forbidClick: true,
        })
        .then(() => {
          this.axios({
            method: 'GET',
            url: '/logout',
          })
            .then((result) => {
              this.$toast.clear()
              localStorage.removeItem('_phone')
              localStorage.removeItem('_password')
              localStorage.removeItem('_userID')
              localStorage.removeItem('_nickname')
              localStorage.removeItem('_tk')
              localStorage.removeItem('historyData')
              this.$router.push({ name: 'Welcome' })
            })
            .catch((err) => {
              this.$toast.clear()
            })
        })
        .catch(() => {
          return
        })
    },
  },
}
</script>
