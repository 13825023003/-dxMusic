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
        :audio="audio"
      ></a-player>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      aplayerShow: true,
      arr: ['Welcome', 'Login', 'Register', 'Forget', 'Detail', 'MV'],
      arr2: ['Recommend', 'CircleTalk', 'List', 'My', 'Classify'],
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.aplayer.play()
    })
  },
  computed: {
    ...mapState({
      audio: (state) => state.playList.playList,
      currentTime: (state) => state.playList.currentTime,
    }),
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
          console.log(this.$refs.aplayer)
          let aplayerEle = this.$refs.aplayer.$children[0].$el
          let listEle = this.$refs.aplayer.$children[1].$el
          let lyricEle = this.$refs.aplayer.$children[2].$el
          if (this.arr2.indexOf(e.name) == -1) {
            aplayerEle.style.bottom = 0
            listEle.style.marginBottom = 65 + 'px'
            lyricEle.style.bottom = 0
          } else {
            aplayerEle.style.bottom = 46 + 'px'
            listEle.style.marginBottom = 109 + 'px'
            lyricEle.style.bottom = 46 + 'px'
          }
        })
      }
    },
  },
  methods: {
    ...mapActions('playList', ['changeCurrentTime']),
    // 音乐播放中事件
    Playing() {
      const { media } = this.$refs.aplayer
      this.changeCurrentTime(media.currentTime)
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
  color: #505050;
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
  bottom: 2.875rem;
  max-width: 100%;
}
.aplayer.aplayer-fixed .aplayer-lrc {
  bottom: 3rem;
  z-index: 99999;
}

.aplayer .aplayer-fixed .aplayer-list {
  margin-bottom: 6.625rem;
}
/deep/ .aplayer-icon.aplayer-icon-menu {
  display: block;
}
</style>
