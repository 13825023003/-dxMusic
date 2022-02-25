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
      <waterfall :col="2" :data="allcircleImage" @loadmore="getallcircleImage">
        <template>
          <div
            class="cell-item"
            v-for="(item, index) in allcircleImage"
            :key="index"
            :width="itemWidth"
            :gutterWidth="gutterWidth"
            @click="goMV(item.id)"
          >
            <img class="auto-img" :lazy-src="item.src" alt="加载错误" />
            <div class="item-body">
              <span class="info-playCount">{{ item.playcount }}</span>
              <div class="item-text">{{ item.info }}</div>
              <div class="item-avatar">by {{ item.avatar }}</div>
            </div>
          </div>
        </template>
      </waterfall>
    </div>
  </div>
</template>

<script>
import '../assets/less/CircleTalk.less'
export default {
  name: 'CircleTalk',
  data() {
    return {
      // 开始截取下标
      startCount: 0,
      // 每次截取的数量
      dataCount: 10,
      // 结束截取下标
      endCount: 200,
      // 每次截取瀑布流数据
      circleImage: [],
      // 所有瀑布流数据
      allcircleImage: [],
      // 分页数
      offset: 1,
    }
  },
  created() {
    this.getallcircleImage()
  },
  computed: {
    itemWidth() {
      return 334 * 0.5 * (document.documentElement.clientWidth / 375)
    },
    gutterWidth() {
      return 36 * 0.5 * (document.documentElement.clientWidth / 375)
    },
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
        url: '/video/timeline/recommend',
        params: {
          offset: this.offset,
        },
      })
        .then((result) => {
          this.$toast.clear()
          console.log(result)
          result.data.datas.map((v) => {
            this.circleImage.push({
              id: v.data.vid,
              src: v.data.coverUrl,
              link: v.data.coverUrl,
              info: v.data.title,
              avatar: v.data.creator.nickname,
              playcount: v.data.playTime,
            })
          })
          this.allcircleImage = this.allcircleImage.concat(this.circleImage)
          console.log('this.allcircleImage', this.allcircleImage)
          this.circleImage = this.circleImage.splice(0, -1)
          this.offset++
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 跳到搜索页面
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
    // 跳转到MV详情页
    goMV(id) {
      this.$router.push({
        name: 'MV',
        params: {
          id: id,
        },
      })
    },
  },
}
</script>
