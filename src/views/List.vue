<template>
  <div class="list">
    <!-- 顶部-->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">歌单列表</div>
      </template>
      <template #left>
        <van-icon name="search" size="26" @click="goSearch" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 顶部导航栏 -->
    <van-sticky>
      <div class="list-top">
        <div class="list-hot clearfix">
          <div
            class="hot-item fl"
            v-for="(item, index) in hotCDTag"
            :key="index"
          >
            <span
              :class="hotCDTagIndex == index ? 'active' : ''"
              @click="getHotCD(item.name, index)"
              >{{ item.name }}</span
            >
          </div>
        </div>
      </div>
    </van-sticky>
    <!-- 歌单层 -->
    <div class="list-content">
      <van-list
        class="loading-box"
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="loadData"
      >
        <div class="list-item" v-for="(item, index) in hotCD" :key="index">
          <div class="CD-img">
            <span class="playCount">{{ item.playCount }}</span>
            <img
              :src="item.coverImgUrl"
              alt="无图片显示"
              class="auto-img"
              @click="
                goCDDetail(
                  item.id,
                  item.name,
                  item.coverImgUrl,
                  item.playCount,
                  item.creator.nickname,
                  item.creator.avatarUrl
                )
              "
            />
          </div>
          <div class="CD-text van-multi-ellipsis--l2">
            {{ item.name }}
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import '../assets/less/List.less'
export default {
  name: 'List',
  data() {
    return {
      // 热门歌单标签
      hotCDTag: [],
      // 热门歌单索引值
      hotCDTagIndex: 0,
      // 所有热门歌单
      allHotCD: [],
      // 热门歌单
      hotCD: [],
      currentIndex: 0,
      // 每次触底加载9条数据
      dataCount: 12,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      // 记录歌单的updateTime
    }
  },
  created() {
    // 获取热门歌单标签
    this.gethotCDTag()
    // 获取热门歌单
    this.getHotCD(this.hotCDTag[0], 0)
  },
  methods: {
    // 获取热门歌单标签列表
    gethotCDTag() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      this.axios({
        method: 'GET',
        url: '/playlist/hot',
      })
        .then((result) => {
          this.$toast.clear()

          result.data.tags.map((v) => {
            this.hotCDTag.push(v)
          })
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取热门歌单
    getHotCD(name, index) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.hotCDTagIndex = index
      this.hotCD = this.hotCD.splice(0, -1)
      this.allHotCD = this.allHotCD.splice(0, -1)
      this.axios({
        method: 'GET',
        url: '/top/playlist',
        params: {
          limit: 60,
          cat: name,
        },
      })
        .then((result) => {
          this.$toast.clear()

          result.data.playlists.map((v) => {
            this.allHotCD.push(v)
          })
          this.hotCD = this.allHotCD.slice(
            this.startCount,
            this.startCount + this.dataCount
          )
          this.startCount += this.dataCount

          // 未加载
          this.loading = false
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    loadData() {
      setTimeout(() => {
        let data = this.allHotCD.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.hotCD.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 跳到搜索页面
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
    // 跳转到详情界面
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
