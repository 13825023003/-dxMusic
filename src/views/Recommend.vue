<template>
  <div class="recommend">
    <!-- 轮播图层 -->
    <div class="banner">
      <van-swipe :autoplay="2000" loop>
        <van-swipe-item v-for="(item, index) in bannerData" :key="index">
          <img
            :src="item.pic"
            class="auto-img"
            @click="goDetail(item.song.id, item.song.name, item.song.dt)"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 新音乐推荐层 -->
    <div class="musician-recommend">
      <div class="musician-title clearfix">
        <div class="title-left fl">最新音乐推荐</div>
        <div class="title-right fr" @click="goSearch()">更多>>></div>
      </div>
      <div class="newmusic-contant">
        <div
          class="music-box clearfix"
          v-for="(item, index) in newmusicData"
          :key="index"
        >
          <div
            class="music-img fl"
            @click="
              play(item.id, item.name, item.picUrl, item.song.artists[0].name)
            "
          >
            <span><img src="../assets/image/播放.png" alt=""/></span>
            <img :src="item.picUrl" alt="" class="auto-img " />
          </div>
          <div class="text fr">
            <div
              class="music-name van-ellipsis"
              @click="goDetail(item.id, item.name, item.song.duration)"
            >
              {{ item.name }}
            </div>
            <div class="music-enname van-ellipsis">
              {{ item.song.artists[0].name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一周榜单 -->
    <div class="top">
      <div class="top-title clearfix">
        <div class="title-left fl" v-if="!isWeek">
          日榜单<span class="top-toggle" @click="toggleTop">切换到周榜单</span>
        </div>
        <div class="title-left fl" v-else>
          周榜单<span class="top-toggle" @click="toggleTop">切换到日榜单</span>
        </div>
        <div class="title-right fr" @click="goSearch()">更多>>></div>
      </div>
      <div class="top-content" v-for="(item, index) in top" :key="index">
        <div class="top-box clearfix">
          <div
            class="top-img fl"
            @click="play(item.id, item.name, item.al.picUrl, item.ar[0].name)"
          >
            <span><img src="../assets/image/播放.png" alt=""/></span>
            <img :src="item.al.picUrl" alt="" class="auto-img" />
          </div>
          <div class="top-text fr">
            <div
              class="top-name van-multi-ellipsis--l1"
              @click="goDetail(item.id, item.name, item.dt)"
            >
              0{{ index + 1 }}、{{ item.al.name }}
              <span class="hot">人气值:{{ item.dt }}</span>
            </div>
            <div class="top-enname van-multi-ellipsis--l2">
              {{ item.ar[0].name }}
              云音乐新歌榜：云音乐用户一周内收听所有新歌（一月内最新发行）
              官方TOP排行榜，每天更新。
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MV推荐层 -->
    <div class="MV">
      <div class="MV-title clearfix">
        <div class="title-left fl">最热MV推荐</div>
        <div class="title-right CD-title-right fr" @click="refeshMV">
          刷新一下
        </div>
      </div>
      <div class="MV-content">
        <div class="MV-box" v-for="(item, index) in MV" :key="index">
          <div class="MV-img" @click="fail()">
            <img :src="item.cover" class="auto-img" alt="" />
            <span class="MV-play">{{ item.mv.dayplays }}</span>
          </div>
          <div class="MV-text van-multi-ellipsis--l2" @click="fail()">
            {{
              item.mv.desc
            }}云音乐新歌榜：云音乐用户一周内收听所有新歌（一月内最新发行）
            官方TOP排行榜，每天更新。
          </div>
        </div>
      </div>
    </div>
    <!-- 歌单推荐层 -->
    <div class="CD">
      <div class="CD-title clearfix">
        <div class="title-left fl">最热歌单推荐</div>
        <div
          class="title-right CD-title-right fr"
          v-show="finished"
          @click="refesh"
        >
          刷新一下
        </div>
      </div>
      <van-list
        class="loading-box"
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="loadData"
      >
        <div class="CD-content">
          <div
            class="CD-item"
            v-for="(item, index) in newsongsData"
            :key="index"
          >
            <div
              class="item-img"
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
            >
              <img :src="item.coverImgUrl" class="auto-img" alt="" />
              <span class="playCount">{{ item.playCount }}</span>
            </div>
            <div
              class="item-text van-multi-ellipsis--l2"
              @click="goDetail(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
// 导入登录验证验证脚本
import { login } from '../assets/js/login'
import { formatDuring } from '../assets/js/formatDuring'
import '../assets/less/Recommend.less'
export default {
  name: 'Recommend',
  data() {
    return {
      // 轮播层数据
      bannerData: [],
      // 推荐层数据
      newmusicData: [],
      // 截取的歌单数据
      newsongsData: [],
      // 所有的歌单数据
      allNewsongsData: [],
      currentIndex: 0,
      // 每次触底加载8条数据
      dataCount: 4,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      // 记录歌单的updateTime
      updateTime: 0,
      // MV数据
      MV: [],
      // 榜单数据
      top: [],
      // 是否为周榜单
      isWeek: false,
      // 榜单id
      topId: 0,
      // 记录MV的分页数据
      offset: 0,
      // 是否显示音乐播放列表
      isShowList: false,
    }
  },
  created() {
    this.getBannerData()
    // 获取推荐新音乐
    this.getNewmusicData()
    // 获取推荐新歌单
    this.getNewsongsData()
    // 获取榜单数据
    this.getTopData()
    // 获取MV数据
    this.getMV()
  },
  methods: {
    // 获取轮播图数据事件
    getBannerData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/banner',
        params: {
          type: 2,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            console.log('banner =>', result)
            result.data.banners.map((v) => {
              this.bannerData.push(v)
            })
            console.log(this.bannerData)
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 播放音乐
    play(id, name, pic, artists) {
      // 获取歌曲URL
      let url = ''
      this.changePic(pic)
      this.changeArtists(artists)
      this.changeName(name)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/song/url',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            url = result.data.data[0].url
            this.changeSrc(url)
            // 获取歌词
            this.getLyric(id)
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取歌词
    getLyric(id) {
      let lyric = ''
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/lyric',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            lyric = result.data.lrc.lyric
            this.changeLyric(lyric)
            this.$refs.aplayer.play()
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取推荐新音乐
    getNewmusicData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/personalized/newsong',
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            result.data.result.map((v) => {
              this.newmusicData.push(v)
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 修改src元素,保存在公共数据state中
    changeSrc(url) {
      this.$store.commit('changeSrc', url)
    },
    changeLyric(lyric) {
      this.$store.commit('changeLyric', lyric)
    },
    changePic(pic) {
      this.$store.commit('changePic', pic)
    },
    changeArtists(artists) {
      this.$store.commit('changeArtists', artists)
    },
    changeName(name) {
      this.$store.commit('changeName', name)
    },
    // 获取榜单数据
    getTopData() {
      if (this.isWeek) {
        this.topId = 19723756
      } else {
        this.topId = 3778678
      }
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/playlist/detail',
        params: {
          id: this.topId,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            // 获取top5数据
            for (let i = 0; i < 5; i++) {
              result.data.playlist.tracks[i].isShow = false
              this.top.push(result.data.playlist.tracks[i])
            }
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 切换榜单数据
    toggleTop() {
      this.isWeek = !this.isWeek
      this.top = this.top.splice(0, -1)
      this.getTopData()
    },
    // 获取MV数据
    getMV() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/top/mv',
        params: {
          limit: 4,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            // 获取top5数据
            result.data.data.map((v) => {
              this.MV.push(v)
            })
            //
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 刷新MV事件
    refeshMV() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.offset = this.offset + 4
      this.MV = this.MV.splice(0, -1)
      this.axios({
        method: 'GET',
        url: '/top/mv',
        params: {
          limit: 4,
          offset: this.offset,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            result.data.data.map((v) => {
              this.MV.push(v)
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 点击MV事件
    fail() {
      this.$toast.fail({
        message: '版权问题,无法观看MV',
        forbidClick: true,
      })
    },
    // 获取推荐新歌单
    getNewsongsData() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/top/playlist',
        params: {
          limit: 10,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            result.data.playlists.map((v) => {
              this.allNewsongsData.push(v)
            })
            // 获取最后一个歌单的updateTime
            this.updateTime = this.allNewsongsData[
              this.allNewsongsData.length - 1
            ].updateTime
            // 根据开始截取位置和截取数据数量设置购物袋显示的数据
            this.newsongsData = this.allNewsongsData.slice(
              this.startCount,
              this.startCount + this.dataCount
            )
            this.startCount += this.dataCount
            // 未加载
            this.loading = false
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    loadData() {
      setTimeout(() => {
        let data = this.allNewsongsData.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.newsongsData.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 刷新歌单事件
    refesh() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.newsongsData = this.newsongsData.splice(0, -1)

      this.axios({
        method: 'GET',
        url: '/top/playlist/highquality',
        params: {
          limit: 10,
          before: this.updateTime,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            result.data.playlists.map((v) => {
              this.newsongsData.push(v)
            })
            this.updateTime = this.newsongsData[
              this.newsongsData.length - 1
            ].updateTime
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 前往详情页事件
    goDetail(id, name, time) {
      this.axios({
        method: 'GET',
        url: '/check/music',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            if (result.data.success) {
              this.$router.push({ name: 'Detail', params: { id, name, time } })
            } else {
              this.$toast(result.data.message)
            }
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    goArtistsDetail(id, name) {
      this.$router.push({ name: 'Artists', params: { id, name } })
    },
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
    // 跳转到搜索页面事件
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
  },
}
</script>
