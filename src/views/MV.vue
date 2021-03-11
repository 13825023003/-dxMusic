<template>
  <div class="mv">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title" class="van-ellipsis">{{ MVName }}</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 视频播放层 -->
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
      :x5-video-player-fullscreen="true"
    >
    </video-player>

    <!-- MV内容层 -->
    <div class="MV-content">
      <van-tabs sticky>
        <van-tab title="详情">
          <div class="MV-detail">
            <div class="content-top">
              <div class="artists clearfix">
                <div class="artists-img fl">
                  <van-image
                    lazy-load
                    :src="artistImg"
                    class="auto-img"
                    alt=""
                    @click="goArtistsDetail()"
                  />
                </div>
                <!-- 歌手描述 -->
                <div class="artists-text fl">
                  <div class="artists-name">{{ artistName }}</div>
                  <div class="artists-follow">42.2万关注</div>
                </div>
                <div class="artists-icon fr" v-if="isArtistsFollow">
                  已关注
                </div>
                <div class="artists-icon fr" v-else>
                  +关注
                </div>
              </div>
              <!-- 描述 -->
              <div class="MV-text">
                <div class="MV-title van-ellipsis">
                  {{ MVName }}
                  <van-icon
                    :name="isShowDesc ? 'arrow-up' : 'arrow-down'"
                    class="arrow-down"
                    @click="showMVDesc"
                  />
                  <span class="MV-duration"
                    >{{ playcount }} {{ publishTime }}次播放</span
                  >
                </div>
                <div
                  class="MV-desc"
                  :style="isShowDesc ? 'display : block' : 'display:none'"
                >
                  {{ desc }}
                </div>
                <!-- 图标 -->
                <div class="MV-icon van-hairline--bottom">
                  <div class="good-job-o">
                    <van-icon name="good-job-o" size="32px" />
                    <div class="text">{{ subCount }}</div>
                  </div>
                  <div class="download">
                    <van-icon name="down" size="32px" @click="downloadMV" />
                    <div class="text">下载</div>
                  </div>
                  <div class="like">
                    <van-icon name="like-o" size="32px" />
                    <div class="text">收藏</div>
                  </div>
                  <div class="share">
                    <van-icon name="share-o" size="32px" />
                    <div class="text">{{ shareCount }}</div>
                  </div>
                </div>
                <!-- 相关视频 -->
                <div class="MV-similarMV">
                  <div class="similarMV-title">
                    相关视频
                  </div>
                  <div class="similarMV-content" v-if="isHasMV">
                    <div
                      class="similarMV-box"
                      v-for="(item, index) in similarMV"
                      :key="index"
                    >
                      <div
                        class="similarMV-img"
                        @click="goMVDetail(item.id || item.vid)"
                      >
                        <van-image
                          lazy-load
                          :src="item.cover || item.coverUrl"
                          class="auto-img"
                          alt=""
                        />
                        <span class="similarMV-play"
                          >{{ item.playCount }} {{ item.playTime }}</span
                        >
                      </div>
                      <div
                        class="similarMV-text van-multi-ellipsis--l2"
                        @click="goMVDetail(item.id)"
                      >
                        {{ item.name }} {{ item.title }}
                      </div>
                    </div>
                  </div>
                  <div class="similarMV-else" v-else>
                    <h2>该歌手暂无相关MV</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab>
          <template #title>评论{{ MVComments }}</template>
          <MyComment :list="comments"></MyComment>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../assets/less/MV.less'
import { myDownloadFile } from '../assets/js/downloadFile'
import MyComment from '../components/MyComment'
export default {
  name: 'MV',
  components: {
    MyComment,
  },
  data() {
    return {
      // MVID
      MVID: 0,
      // MV类型
      MVType: '',
      // 视频名称
      MVName: '',
      // 是否显示详情介绍
      isShowDesc: false,
      // 评论数
      MVComments: 0,
      // 是否关注歌手
      isArtistsFollow: false,
      // 歌手id
      artistId: 0,
      // 歌手名
      artistName: '',
      // 歌手头像
      artistImg: '',
      // MV描述
      desc: '',
      // MV播放量
      playcount: 0,
      // MV发布时间
      publishTime: '',
      // MV点赞数
      subCount: 0,
      // MV分享数
      shareCount: 0,
      // 视频参数
      playerOptions: {
        // 播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        // 是否自动播放
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        passive: false,
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', // 类型
            src: '', // url地址
          },
        ],
        poster: '', // 封面地址
        // notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
      // 相关视频
      similarMV: [],
      // 是否有相关视频
      isHasMV: true,
      // 评论
      comments: [],
    }
  },
  created() {
    // 获取传入的MVID
    this.MVID = this.$route.params.id
    // 获取传入的MV类型
    this.MVType = this.$route.params.type
    // 获取MV地址
    this.getMVUrl()
    // 获取MV详情
    this.getMVDetail()
    // 获取相关视频
    this.getSimilarMV()
    // 获取MV评论
    this.getMVComments()
  },
  methods: {
    // 获取MV地址
    getMVUrl() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      if (this.MVType == 'MV') {
        this.axios({
          method: 'GET',
          url: '/mv/url',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('MVID==>', result)
            this.playerOptions.sources[0].src = result.data.data.url
          })
          .catch((err) => {
            this.$toast.clear()
          })
      } else {
        this.axios({
          method: 'GET',
          url: '/video/url',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('MVID==>', result)
            this.playerOptions.sources[0].src = result.data.urls[0].url
          })
          .catch((err) => {
            this.$toast.clear()
          })
      }
    },
    // 获取MV详情
    getMVDetail() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      if (this.MVType == 'MV') {
        this.axios({
          method: 'GET',
          url: '/mv/detail',
          params: {
            mvid: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('MVDetail==>', result)
            this.playerOptions.poster = result.data.data.cover
            this.MVName = result.data.data.name
            this.MVComments = result.data.data.commentCount
            this.isArtistsFollow = result.data.data.artists[0].follow
            this.artistId = result.data.data.artistId
            this.artistName = result.data.data.artistName
            this.artistImg = result.data.data.artists[0].img1v1Url
            this.desc = result.data.data.desc
            this.playcount = result.data.data.playCount
            this.publishTime = result.data.data.publishTime
            this.subCount = result.data.data.subCount
            this.shareCount = result.data.data.shareCount
          })
          .catch((err) => {
            this.$toast.clear()
          })
      } else {
        this.axios({
          method: 'GET',
          url: '/video/detail',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('MVDetail==>', result)
            this.playerOptions.poster = result.data.data.coverUrl
            this.MVName = result.data.data.title
            this.MVComments = result.data.data.commentCount
            this.isArtistsFollow = result.data.data.creator.follow
            this.artistId = result.data.data.creator.userId
            this.artistName = result.data.data.creator.nickname
            this.artistImg = result.data.data.avatarUrl
            this.desc = result.data.data.description
            this.playcount = result.data.data.playCount
            this.publishTime = result.data.data.publishTime
            this.subCount = result.data.data.praisedCount
            this.shareCount = result.data.data.shareCount
          })
          .catch((err) => {
            this.$toast.clear()
          })
      }
    },
    // 获取相关MV
    getSimilarMV() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      if (this.MVType == 'MV') {
        this.axios({
          method: 'GET',
          url: '/simi/mv',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('smilarMV==>', result)
            result.data.mvs.map((v) => {
              this.similarMV.push(v)
            })
            console.log(this.similarMV)
          })
          .catch((err) => {
            console.log(err)
            this.$toast.clear()
          })
      } else {
        this.axios({
          method: 'GET',
          url: '/related/allvideo',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('smilarMV==>', result)
            result.data.data.map((v) => {
              this.similarMV.push(v)
            })
            console.log(this.similarMV)
          })
          .catch((err) => {
            console.log(err)
            this.$toast.clear()
          })
      }
    },
    // 获取MV评论
    getMVComments() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      if (this.MVType == 'MV') {
        this.axios({
          method: 'GET',
          url: '/comment/mv',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('mvcomment==>', result)
            result.data.comments.map((v) => {
              this.comments.push(v)
            })
          })
          .catch((err) => {
            console.log(err)
            this.$toast.clear()
          })
      } else {
        this.axios({
          method: 'GET',
          url: '/comment/video',
          params: {
            id: this.MVID,
          },
        })
          .then((result) => {
            this.$toast.clear()
            console.log('mvcomment==>', result)
            result.data.comments.map((v) => {
              this.comments.push(v)
            })
          })
          .catch((err) => {
            console.log(err)
            this.$toast.clear()
          })
      }
    },
    // 去往MV详情
    goMVDetail(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      setTimeout(() => {
        this.playerOptions.poster = ''
        this.MVName = ''
        this.MVComments = ''
        this.isArtistsFollow = ''
        this.artistId = ''
        this.artistName = ''
        this.artistImg = ''
        this.desc = ''
        this.playcount = ''
        this.publishTime = ''
        this.subCount = ''
        this.shareCount = ''
        this.playerOptions.sources[0].src = ''
        this.similarMV = this.similarMV.splice(0, -1)
        this.MVID = id
        // 获取MV地址
        this.getMVUrl()
        // 获取MV详情
        this.getMVDetail()
        // 获取相关视频
        this.getSimilarMV()
        this.$toast.clear()
      }, 800)
    },
    // 切换标签事件
    switchTabs() {
      console.log('name,title =>', name, title)
    },
    // MV详情显示隐藏
    showMVDesc() {
      this.isShowDesc = !this.isShowDesc
    },
    // MV下载事件
    downloadMV() {
      this.$dialog
        .confirm({
          title: `是否下载${this.MVName}`,
        })
        .then(() => {
          myDownloadFile.downloadFile(
            this.playerOptions.sources[0].src,
            this.MVName,
            'video'
          )
        })
        .catch(() => {
          return
        })
    },
    // 去往歌手详情页
    goArtistsDetail() {
      let id = Number(this.artistId)
      let Name = this.artistName
      this.$router.push({ name: 'Artists', params: { id, Name } })
    },
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
  },
}
</script>
