<template>
  <div class="recommend">
    <!-- 轮播图层 -->
    <div class="banner">
      <van-swipe :autoplay="2000" loop>
        <van-swipe-item v-for="(item, index) in bannerData" :key="index">
          <van-image
            lazy-load
            :src="item.pic"
            class="auto-img"
            @click="goBannerDetail(item.song)"
          />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 新音乐推荐层 -->
    <div class="musician-recommend">
      <MyTitle title="最新音乐推荐">
        <template
          ><div class="title-right fr" @click="goSearch()">
            更多>>>
          </div></template
        >
      </MyTitle>
      <div class="newmusic-contant">
        <div
          class="music-box clearfix"
          v-for="(item, index) in newMusicData"
          :key="index"
        >
          <div
            class="music-img fl"
            @click="
              play(item.id, item.name, item.picUrl, item.song.artists[0].name)
            "
          >
            <span
              ><van-image lazy-load src="../assets/image/播放.png" alt=""
            /></span>
            <van-image :src="item.picUrl" alt="" class="auto-img " lazy-load />
          </div>
          <div class="text fr">
            <div
              class="music-name van-ellipsis"
              @click="
                goDetail(
                  item.id,
                  item.name,
                  item.picUrl,
                  item.song.artists[0].name
                )
              "
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
            <span
              ><van-image lazy-load src="../assets/image/播放.png" alt=""
            /></span>
            <van-image
              lazy-load
              :src="item.al.picUrl"
              alt=""
              class="auto-img"
            />
          </div>
          <div class="top-text fr">
            <div
              class="top-name van-multi-ellipsis--l1"
              @click="
                goDetail(item.id, item.name, item.al.picUrl, item.ar[0].name)
              "
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
      <MyTitle title="最热MV推荐">
        <div class="title-right CD-title-right fr" @click="refreshMV">
          刷新一下
        </div>
      </MyTitle>
      <MyMV :list="MV" :isHasMV="true"></MyMV>
    </div>
    <!-- 歌单推荐层 -->
    <div class="CD">
      <MyTitle title="最热歌单推荐">
        <div
          class="title-right CD-title-right fr"
          v-show="finished"
          @click="refresh"
        >
          刷新一下
        </div>
      </MyTitle>
      <van-list
        class="loading-box"
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="loadData"
      >
        <MyCD :CD="newSongData"></MyCD>
      </van-list>
    </div>
  </div>
</template>
<script>
import { formatDuring } from '../assets/js/formatDuring'
import { mapActions, mapState } from 'vuex'
import MyMV from '../components/MyMV'
import MyCD from '../components/MyCD'
import MyTitle from '../components//MyTitle'
import '../assets/less/Recommend.less'
export default {
  name: 'Recommend',
  components: {
    MyMV,
    MyCD,
    MyTitle,
  },
  data() {
    return {
      // 轮播层数据
      bannerData: [],
      // 推荐层数据
      newMusicData: [],
      // 截取的歌单数据
      newSongData: [],
      // 所有的歌单数据
      allNewSongData: [],
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
    this.getNewMusicData()
    // 获取推荐新歌单
    this.getNewSongData()
    // 获取榜单数据
    this.getTopData()
    // 获取MV数据
    this.getMV()
  },
  computed: {
    ...mapState({
      audio: (state) => state.playList.playList,
    }),
  },
  methods: {
    ...mapActions('playList', ['unshiftPlayList', 'deletePlayList']),
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
            result.data.banners.map((v) => {
              this.bannerData.push(v)
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 播放音乐
    play(id, name, pic, artists) {
      let hasID = this.audio.find((v) => {
        return v.id == id
      })
      console.log(hasID)
      if (hasID) {
        this.deletePlayList(id)
      }
      // 获取歌曲URL
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
            let url = result.data.data[0].url
            let musicStr = `id=${id};name=${name};artist=${artists};url=${url};cover=${pic};`
            // 获取歌词
            this.getLyric(id, musicStr, name)
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取歌词
    getLyric(id, musicStr, name) {
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
            let lyric = result.data.lrc.lyric
            musicStr += `${musicStr}lrc=${lyric};`
            let musicObj = formatDuring.parseStrObjByRegExp(musicStr)
            this.unshiftPlayList(musicObj)
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取推荐新音乐
    getNewMusicData() {
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
              this.newMusicData.push(v)
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取榜单数据
    getTopData() {
      this.topId = this.isWeek ? 19723756 : 3778678
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
            requestAnimationFrame(() => {
              // 获取top5数据
              for (let i = 0; i < 5; i++) {
                result.data.playlist.tracks[i].isShow = false
                this.top.push(result.data.playlist.tracks[i])
              }
            })
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
            requestAnimationFrame(() => {
              this.$toast.clear()
              // 获取top5数据
              result.data.data.map((v) => {
                this.MV.push(v)
              })
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 刷新MV事件
    refreshMV() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.offset = this.offset > 40 ? 0 : this.offset + 4
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
    // 获取推荐新歌单
    getNewSongData() {
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
            requestAnimationFrame(() => {
              result.data.playlists.map((v) => {
                this.allNewSongData.push(v)
              })
              // 获取最后一个歌单的updateTime
              this.updateTime = this.allNewSongData[
                this.allNewSongData.length - 1
              ].updateTime
              // 根据开始截取位置和截取数据数量设置购物袋显示的数据
              this.newSongData = this.allNewSongData.slice(
                this.startCount,
                this.startCount + this.dataCount
              )
              this.startCount += this.dataCount
              // 未加载
              this.loading = false
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    loadData() {
      setTimeout(() => {
        let data = this.allNewSongData.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.newSongData.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 刷新歌单事件
    refresh() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.newSongData = this.newSongData.splice(0, -1)

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
            requestAnimationFrame(() => {
              this.$toast.clear()
              result.data.playlists.map((v) => {
                this.newSongData.push(v)
              })
              this.updateTime = this.newSongData[
                this.newSongData.length - 1
              ].updateTime
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 前往详情页事件
    goDetail(id, name, pic, artists) {
      if (id) {
        this.axios({
          method: 'GET',
          url: '/check/music',
          params: {
            id: id,
          },
        })
          .then((result) => {
            if (result.status == 200) {
              requestAnimationFrame(() => {
                if (result.data.success) {
                  this.play(id, name, pic, artists)
                  this.$router.push({
                    name: 'Detail',
                    params: { id },
                  })
                } else {
                  this.$toast(result.data.message)
                }
              })
            }
          })
          .catch((err) => {
            this.$toast.clear()
          })
      } else {
        this.$toast.clear('版权问题,无法跳转到响应页面')
      }
    },
    goBannerDetail(bannerObj) {
      if (bannerObj) {
        this.$router.push({
          name: 'Detail',
          params: {
            id: bannerObj.id,
            name: bannerObj.name,
            time: bannerObj.dt,
          },
        })
      } else {
        this.$toast('版权问题,无法跳转')
      }
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
