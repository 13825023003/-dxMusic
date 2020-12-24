<template>
  <div class="detail">
    <!-- 顶部导航栏 -->
    <!-- 下拉刷新与懒加载 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
            <div id="nav-title" class="van-ellipsis">{{ audioName }}</div>
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
            {{ artists }}
          </div>
          <div
            class="img-box"
            :style="
              isRotate ? 'animation: rotate 60s linear infinite forwards;' : ''
            "
          >
            <img :src="pic" class="auto-img" />
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
              :src="audioSrc"
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
            </div>
            <div class="autoplay-like">
              <van-icon
                size="32"
                :name="isLike ? 'like' : 'like-o'"
                :color="isLike ? 'red ' : 'black'"
                @click="toggleLike(1)"
              ></van-icon>
            </div>
            <div class="autoplay-download">
              <img
                @click="downloadSong(songId)"
                src="../assets/image/下载.png"
                class="auto-img"
                alt=""
              />
            </div>
          </div>
          <!-- 歌单层 -->
          <div class="CD" v-show="finished">
            <div class="CD-title">
              包含这首歌的歌单
            </div>
            <div class="CD-content">
              <div class="CD-item" v-for="(item, index) in CD" :key="index">
                <div class="CD-img">
                  <img
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
            <div class="smilar-title">
              喜欢这首歌的人也听
            </div>
            <div class="smilar-content">
              <div
                class="smilar-item clearfix van-hairline--bottom"
                v-for="(item, index) in smilarSong"
                :key="index"
              >
                <div class="smilar-img fl">
                  <img :src="item.album.picUrl" class="auto-img" alt="" />
                </div>
                <div class="smilar-text fr clearfix">
                  <div class="smilar-name fl">
                    <div class="smilar-enname van-ellipsis">
                      {{ item.name }}
                    </div>
                    <div class="smilar-artists van-ellipsis">
                      {{ item.artists[0].name }}
                    </div>
                  </div>
                  <div class="smilar-time fr">
                    <div class="smilar-times">
                      {{ item.duration }}
                    </div>
                    <div class="smilar-icon clearfix">
                      <van-icon
                        size="16"
                        :name="item.isLike ? 'like' : 'like-o'"
                        :color="item.isLike ? 'red ' : 'black'"
                        @click="toggleLike(2, item)"
                      ></van-icon>
                      <img
                        class="fr"
                        @click="downloadSong(item.id)"
                        src="../assets/image/下载.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 评论层 -->
          <div class="comment" v-show="finished">
            <div class="comment-title">
              精彩评论
            </div>
            <div class="comment-content">
              <div
                class="comment-item clearfix "
                v-for="(item, index) in comment"
                :key="index"
              >
                <div class="comment-img fl">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="comment-version fr">
                  <div class="comment-artists">
                    {{ item.user.nickname }}
                  </div>
                  <div class="comment-time">
                    {{ item.time }}
                  </div>
                  <div class="comment-text">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import lyric from 'lrc-file-parser'
import '../assets/less/Detail.less'
import { mapState } from 'vuex'
import { formatDuring } from '../assets/js/formatDuring'
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
      // 喜欢状态
      isLike: false,
      // 歌单
      CD: [],
      // 相似单曲
      smilarSong: [],
      // 热门评论
      comment: [],
      // 懒加载状态
      loading: false,
      finished: false,
      // 刷新状态
      refreshing: false,
    }
  },
  computed: {
    audioSrc() {
      return this.$store.state.audioSrc
    },
    artists() {
      return this.$store.state.artists
    },
    currentTime() {
      return this.$store.state.currentTime
    },
    pic() {
      return this.$store.state.pic
    },
    lyric() {
      return this.$store.state.lyric
    },
    audioName() {
      return this.$store.state.audioName
    },
  },
  components: {
    scroll,
  },
  created() {
    //   歌曲id
    this.songId = this.$route.params.id
    // 获取歌曲url
    this.songName = this.$route.params.name
    // 获取歌曲index值
    this.songIndex = this.$route.params.index || 0
    // 获取歌曲总时间
    this.time = formatDuring.formatDuring(this.$route.params.time)
    this.times = this.$route.params.time / 1000
    // 获取歌曲喜欢状态
    this.isLike = this.$route.params.like
    // 获取歌曲详情
    this.getSongDetail()
    // 获取歌曲播放地址
    this.getSongUrl(this.songId)
    // 获取歌曲歌词
    this.getSonglyric(this.songId)
  },
  methods: {
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
        if (this.refreshing) {
          this.smilarSong = []
          this.CD = []
          this.comment = []
          this.refreshing = false
        }
        // 获取相似音乐
        this.getSmilarSong(this.songId)
        // 获取歌单
        this.getCD()
        // 获取热门评论
        this.getSongComment(this.songId)
        this.loading = false
        if (this.smilarSong != [] && this.CD != [] && this.comments != []) {
          this.finished = true
        }
      }, 1500)
    },
    // 刷新列表事件
    onRefresh() {
      this.finished = false
      this.songDetail = []
      this.getSongDetail()
      this.onLoad()
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
        url: '/cloudsearch',
        params: {
          keywords: this.songName,
          type: 1,
        },
      })
        .then((result) => {
          this.$toast.clear()

          result.data.result.songs.map((v) => {
            this.songDetail.push(v)
          })
          let index = Number(this.songIndex)
          this.changeName(this.songDetail[index].name)
          this.changeArtists(this.songDetail[index].ar[0].name)
          this.changePic(this.songDetail[index].al.picUrl)
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
          limit: 10,
        },
      })
        .then((result) => {
          this.$toast.clear()

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
            this.changeLyric(result.data.lrc.lyric)
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
    changeCurrentTime(time) {
      this.currentTimes = formatDuring.secondDuring(time)
      this.$store.commit('changeCurrentTime', time)
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
            window.location.href = result.data.data[0].url
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 切换喜欢歌曲
    toggleLike(count, item) {
      if (count == 1) {
        this.isLike = !this.isLike
        this.tracks = this.songId
      } else {
        item.isLike = !item.isLike
        this.tracks = item.id
      }
    },
    // 显示歌曲列表
    toggleBars() {},
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
