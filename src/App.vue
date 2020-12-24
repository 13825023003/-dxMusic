<template>
  <div id="app">
    <router-view> </router-view>
    <!-- 音乐播放器 -->
    <div class="autoplay" v-if="aplayerShow">
      <a-player
        ref="aplayer"
        @timeupdate="Playing()"
        :lrcType="1"
        fixed
        autoplay
        :listFolded="false"
        :audio="{
          name: audioName,
          artist: artists,
          url: audioSrc,
          cover: pic,
          lrc: lyric,
        }"
      ></a-player>
    </div>
  </div>
</template>

<script>
import { APlayer } from '@moefe/vue-aplayer'
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      aplayerShow: true,
      arr: ['Welcome', 'Login', 'Register', 'Forgot', 'Detail'],
      arr2: ['Recommend', 'CircleTalk', 'List', 'My', 'Classify'],
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.aplayer.play()
    })
  },
  computed: {
    ...mapState([
      'audioSrc',
      'lyric',
      'pic',
      'artists',
      'audioName',
      'currentTime',
    ]),
  },
  watch: {
    // 监听路由的跳转
    $route(e) {
      let index = this.arr.findIndex((ele) => {
        return ele == e.name
      })

      if (index != -1) {
        this.aplayerShow = false
      } else {
        this.aplayerShow = true
        setTimeout(() => {
          let aplayerEle = this.$refs.aplayer.$children[0].$el
          let lyricEle = this.$refs.aplayer.$children[2].$el
          if (this.arr2.indexOf(e.name) == -1) {
            aplayerEle.style.bottom = 0
            lyricEle.style.bottom = 0
          } else {
            aplayerEle.style.bottom = 46 + 'px'
            lyricEle.style.bottom = 46 + 'px'
          }
        })
      }
    },
  },
  methods: {
    // 音乐播放中事件
    Playing() {
      const { media } = this.$refs.aplayer
      this.changeCurrentTime(media.currentTime)
    },
    changeCurrentTime(time) {
      this.$store.commit('changeCurrentTime', time)
    },
  },
}
</script>

<style lang="less">
body {
  background-color: white;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #646566;
}
.auto-img {
  width: 100%;
  height: 100%;
  display: block;
}
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
}

.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.aplayer.aplayer-fixed .aplayer-body {
  bottom: 46px;
}
.aplayer.aplayer-fixed .aplayer-lrc {
  bottom: 48px;
  z-index: 99999;
}

.aplayer .aplayer-fixed .aplayer-list {
  margin-bottom: 106px;
}
/deep/ .aplayer-icon.aplayer-icon-menu {
  display: block;
}
</style>
