<template>
  <div class="circle">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">圈子</div>
      </template>
      <template #left>
        <van-icon name="search" size="26" @click="goSearch" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 中部内容层 -->
    <div class="circle-content">
      <vue-waterfall-easy
        :mobliegap="30"
        :height="600"
        :imgWidth="170"
        ref="waterfall"
        :imgsArr="circleImage"
        :reachBottomDistance="20"
        @scrollReachBottom="scrollLoading"
      >
        <div class="info" slot-scope="props">
          <div class="info-enname">
            <span class="info-img">
              <img :src="circleImage[props.index].avatar" alt="" />
            </span>
            <span class="info-nickname">
              {{ circleImage[props.index].nickname }}
            </span>
          </div>
          <div class="info-text">
            {{ circleImage[props.index].info }}
          </div>
        </div>
      </vue-waterfall-easy>
    </div>
  </div>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import '../assets/less/CircleTalk.less'
export default {
  name: 'CircleTalk',
  data() {
    return {
      // 开始截取下标
      startCount: 0,
      // 每次截取的数量
      dataCount: 6,
      // 结束截取下标
      endCount: 30,
      // 每次截取瀑布流数据
      circleImage: [],
      // 所有瀑布流数据
      allcircleImage: [],
    }
  },
  created() {
    this.getallcircleImage()
  },
  components: {
    vueWaterfallEasy,
  },
  methods: {
    // 获取所有瀑布流图片
    getallcircleImage() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/comment/hotwall/list',
      })
        .then((result) => {
          this.$toast.clear()

          result.data.data.map((v) => {
            this.allcircleImage.push({
              src: v.simpleResourceInfo.songCoverUrl,
              link: v.simpleResourceInfo.songCoverUrl,
              info: v.content,
              nickname: v.simpleUserInfo.nickname,
              avatar: v.simpleUserInfo.avatar,
            })
          })
          this.circleImage = this.allcircleImage.slice(
            this.startCount,
            this.startCount + this.dataCount
          )
          this.startCount += this.dataCount
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    scrollLoading() {
      let data = this.allcircleImage.slice(
        this.startCount,
        this.startCount + this.dataCount
      )
      this.startCount += this.dataCount
      this.circleImage.push(...data)
      if (data.length < this.dataCount) {
        this.$refs.waterfall.waterfallOver()
      }
    },
    // 跳到搜索页面
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
  },
}
</script>

<style lang="less" scoped></style>
