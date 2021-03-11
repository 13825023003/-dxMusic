<template>
  <div class="detail">
    <!-- 顶部导航栏 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="30"
      :immediate-check="false"
    >
      <van-nav-bar>
        <template #title>
          <div id="nav-title" class="van-ellipsis">
            {{ audio[currentIndex].name }}
          </div>
        </template>
        <template #left>
          <van-icon name="arrow-left" size="26" @click="back" />
        </template>
        <template #right>
          <van-icon name="fire-o" size="26" />
        </template>
      </van-nav-bar>
      <!-- 中部内容层 -->
      <div class="detail-content">
        <div class="artist-box">
          {{ audio[currentIndex].artists }}
        </div>
        <div
          id="img-box"
          :style="
            isRotate
              ? 'animation-play-state:running;'
              : 'animation-play-state:paused;'
          "
        >
          <van-image
            lazy-load
            :src="audio[currentIndex].cover"
            class="auto-img"
          />
        </div>
        <!-- 歌词层 -->
        <ul class="lyric"></ul>
        <!-- 音乐播放器 -->
        <div class="detail-autoplay">
          <div class="autoplay-play">
            <span class="autoplay-back" @click="goLastSong()">
              <img src="../assets/image/上一首.png" alt="" />
            </span>
            <van-icon
              :name="isPlay ? 'pause' : 'play'"
              size="36"
              @click="play()"
            ></van-icon>
            <span class="autoplay-next">
              <img
                src="../assets/image/下一首.png"
                alt=""
                @click="goNextSong()"
              />
            </span>
            <span class="autoplay-voice" @click="showVoice">
              <img src="../assets/image/声音.png" alt="" />
              <span class="slide-box" v-show="isShowVoice">
                <van-slider
                  class="voice-slide"
                  v-model="voice"
                  max="100"
                  button-size="10px"
                  @change="changeVoice"
                ></van-slider>
              </span>
            </span>
          </div>
          <audio
            :src="audio[currentIndex].url"
            ref="audio"
            @timeupdate="Playing()"
            @pause="Pause()"
            @abort="Abort()"
            autoplay
          ></audio>
          <van-slider
            v-model="slidetime"
            :button-size="16"
            :max="times"
            bar-height="4"
            active-color="#c18a26"
            class="slider"
            @change="changeSlider"
          />
          <span class="autoplay-time"> {{ currentTimes }} / {{ time }} </span>
        </div>
        <!-- 音乐下载层 -->
        <div class="download van-hairline--bottom">
          <div class="autoplay-list">
            <van-icon size="32" name="bars" @click="toggleBars"></van-icon>
            <van-popup
              v-model="showList"
              round
              closeable
              position="bottom"
              :style="{ height: '50%' }"
            ></van-popup>
          </div>
          <div class="autoplay-like">
            <van-icon
              size="32"
              :name="isLike ? 'like' : 'like-o'"
              :color="isLike ? 'red ' : 'black'"
              @click="toggleLike()"
            ></van-icon>
          </div>
          <div class="autoplay-download">
            <img
              @click="downloadSong(songId)"
              src="../assets/image/download.png"
              class="auto-img"
              alt=""
            />
          </div>
        </div>
        <!-- 歌单层 -->
        <div class="CD" v-show="finished">
          <MyTitle title="包含这首歌的歌单"></MyTitle>
          <div class="CD-content">
            <div class="CD-item" v-for="(item, index) in CD" :key="index">
              <div class="CD-img">
                <van-image
                  lazy-load
                  :src="item.coverImgUrl"
                  class="auto-img"
                  alt=""
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
              <div class="CD-text">
                <div class="CD-name van-ellipsis">{{ item.name }}</div>
                <div class="CD-enname van-ellipsis">
                  {{ item.creator.nickname }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 相似单曲层 -->
        <div class="smilar" v-show="finished">
          <MyTitle title="喜欢这首歌的人也听"> </MyTitle>
          <MySonglist :song="smilarSong"></MySonglist>
        </div>
        <!-- 评论层 -->
        <div class="comment" v-show="finished">
          <MyTitle title="精彩评论">
            <span class="comment-title">(已有{{ commentTotal }}条评论)</span>
          </MyTitle>
          <myComment :list="comment" :commentTotal="commentTotal"></myComment>
        </div>
        <!-- 分页层 -->
        <van-pagination
          v-show="pageShow"
          v-model="currentPage"
          @change="getSongComment(songId)"
          :total-items="commentTotal"
          :items-per-page="20"
          :show-page-size="5"
          force-ellipses
        />
      </div>
    </van-list>
  </div>
</template>

<script>
import '../assets/less/Detail.less'
import { formatDuring } from '../assets/js/formatDuring'
import { mapState, mapActions } from 'vuex'
import MyComment from '../components/MyComment'
import MySonglist from '../components/MySonglist'
import { myDownloadFile } from '../assets/js/downloadFile'
import MyTitle from '../components/MyTitle'
export default {
  name: 'Detail',
  data() {
    return {
      // 歌曲ID
      songId: 0,
      // 喜欢歌曲的ID
      tracks: 0,
      // 判断添加删除
      op: '',
      // 歌曲索引值
      songIndex: 0,
      // 歌曲名
      songName: '',
      // 歌手名
      songArtists: '',
      // 歌曲索引值
      value: 0,
      // 歌曲详情
      songDetail: [],
      // 歌曲总时间
      time: 0,
      times: 0,
      currentTimes: 0,
      slidetime: 0,
      // 歌词对象
      oLRC: {
        ti: '', //歌曲名
        ar: '', //演唱者
        al: '', //专辑名
        by: '', //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [], //歌词数组{t:时间,c:歌词}
      },
      // 记录是否播放
      isPlay: true,
      // 记录图片是否选转
      isRotate: true,
      // 记录音量
      voice: 50,
      // 是否显示控制音量
      isShowVoice: false,
      //   是否显示歌曲列表
      showList: false,
      // 喜欢状态
      isLike: false,
      // 歌单
      CD: [],
      // 相似单曲
      smilarSong: [],
      // 热门评论
      comment: [],
      // 热评数量
      commentTotal: 0,
      // 懒加载状态
      loading: false,
      finished: false,
      // 当前页面
      currentPage: 1,
      pageShow: false,
    }
  },
  computed: {
    ...mapState({
      audio: (state) => state.playList.playList,
      currentTime: (state) => state.playList.currentTime,
      currentIndex: (state) => state.playList.currentIndex,
    }),
  },
  components: {
    MyComment,
    MySonglist,
    MyTitle,
  },
  created() {
    //   歌曲id
    this.songId = this.audio[this.currentIndex].id
    // 获取歌曲喜欢状态
    this.isLike = this.$route.params.like
    // 获取歌曲详情
    this.getSongDetail()
    // 获取歌曲播放地址
    this.getSongUrl(this.songId)
  },
  methods: {
    ...mapActions('playList', [
      'changeCurrentTime',
      'unshiftPlayList',
      'deletePlayList',
    ]),
    // 返回上一页
    back() {
      this.$refs.audio.pause()
      setTimeout(() => {
        this.$router.go(-1)
      }, 100)
    },
    // 切换上一首歌
    goLastSong() {},
    // 懒加载事件
    onLoad() {
      setTimeout(() => {
        // 获取相似音乐
        this.getSmilarSong(this.songId)
        // 获取歌单
        this.getCD()
        // 获取热门评论
        this.getSongComment(this.songId)
        this.loading = false
        if (this.smilarSong != [] && this.CD != [] && this.comments != []) {
          this.finished = true
          this.pageShow = true
        }
      }, 1500)
    },
    // 获取歌曲详情
    getSongDetail() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/song/detail',
        params: {
          ids: this.songId,
        },
      })
        .then((result) => {
          this.$toast.clear()
          console.log('this.songDetail', result)
          result.data.songs.map((v) => {
            this.songDetail.push(v)
          })
          console.log('this.songDetail2', this.songDetail)
          this.songName = this.songDetail[0].name
          this.time = formatDuring.formatDuring(this.songDetail[0].dt)
          this.times = this.songDetail[0].dt / 1000
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 或取歌曲播放网址
    getSongUrl(id) {
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
            this.changeSrc(result.data.data[0].url)
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取评论
    getSongComment(id) {
      this.comment = this.comment.splice(0, -1)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/comment/music',
        params: {
          id: id,
          limit: 20,
          offset: (this.currentPage - 1) * 20,
        },
      })
        .then((result) => {
          this.$toast.clear()
          console.log('commentresult =>', result)
          this.commentTotal = result.data.total
          result.data.comments.map((v) => {
            v.time = formatDuring.dateDuring(v.time)
            this.comment.push(v)
          })
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 相似歌曲
    getSmilarSong(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/simi/song',
        params: {
          id: id,
        },
      })
        .then((result) => {
          this.$toast.clear()

          result.data.songs.map((v) => {
            v.duration = formatDuring.formatDuring(v.duration)
            v.isLike = false
            this.smilarSong.push(v)
          })
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取歌词
    getSonglyric(id) {
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
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 实例化歌词
    createLrcObj(lrc) {
      if (lrc.length == 0) {
        return
      }
      let lrcs = lrc.split('\n')
      for (let i in lrcs) {
        lrcs[i] = lrcs.replace(/(^\s*)|(\s*$)/g, '')
        let t = lrcs[i].substring(
          lrcs[i].indexOf('[') + 1,
          lrcs[i].indexOf(']')
        )
        let s = t.split(':')
        if (isNaN(parseInt(s[0]))) {
          for (let i in this.oLRC) {
            if (i != 'ms' && i == s[0].toLowerCase()) {
              this.oLRC[i] = s[1]
            }
          }
        } else {
          let arr = lrcs[i].match(/\[(\d+:.+?)\]/g)
          let start = 0
          for (let k in arr) {
            start += arr[k].length
          }
          let content = lrcs[i].substring(start)
          for (let k in arr) {
            let t = arr[k].substring(1, arr[k].length - 1)
            let s = t.split(':')
            this.oLRC.ms.push({
              t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
              c: content,
            })
          }
        }
      }
      this.oLRC.ms.sort((a, b) => {
        return a.t - b.t
      })
    },
    // 音乐播放
    play() {
      this.isPlay = !this.isPlay
      this.isRotate = !this.isRotate
      if (this.isPlay) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    // 音乐播放中事件
    Playing() {
      this.slidetime = this.$refs.audio.currentTime
      this.currentTimes = formatDuring.secondDuring(
        this.$refs.audio.currentTime
      )
      this.changeCurrentTime(this.$refs.audio.currentTime)
    },
    // 音乐暂停事件
    Pause() {
      this.changeCurrentTime(this.$refs.audio.currentTime)
    },
    // 音乐停止事件
    Abort() {
      this.changeCurrentTime(this.$refs.audio.currentTime)
    },
    // 改变进度条
    changeSlider() {
      this.$refs.audio.currentTime = this.slidetime
      this.changeCurrentTime(this.$refs.audio.currentTime)
    },
    // 显示音量
    showVoice() {
      this.isShowVoice = !this.isShowVoice
    },
    // 音量改变
    changeVoice() {
      let voice = this.voice / 100
      this.$refs.audio.volume = voice
    },
    // 切换喜欢歌曲
    toggleLike() {
      this.isLike = !this.isLike
      this.tracks = this.songId
    },
    // 显示歌曲列表
    toggleBars() {
      this.showList = !this.showList
    },
    // 获取歌单
    getCD() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/cloudsearch',
        params: {
          keywords: this.songName,
          type: 1000,
        },
      })
        .then((result) => {
          this.$toast.clear()

          for (let i = 0; i < 3; i++) {
            this.CD.push(result.data.result.playlists[i])
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 下载歌曲
    downloadSong(id) {
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
            myDownloadFile.downloadFile(
              result.data.data[0].url,
              this.audioName,
              'mp3'
            )
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 去往详情页
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
  },
}
</script>
