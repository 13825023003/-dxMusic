<template>
  <div class="MySonglist2">
    <div class="songs-content">
      <div
        class="songs-item clearfix"
        v-for="(item, index) in song"
        :key="index"
      >
        <div class="img-box fl">
          <van-icon
            :name="item.isLike ? 'like' : 'like-o'"
            :color="item.isLike ? 'red ' : 'black'"
            @click="toggleLike(item, item.id)"
          ></van-icon>
          <van-icon
            name="down"
            style="margin-left:6px"
            @click="download(item.id)"
          ></van-icon>
          <van-icon
            style="margin-left:6px"
            name="play-circle-o"
            @click="play(item.id, item.name, item.al.picUrl, item.ar[0].name)"
          ></van-icon>
        </div>
        <div
          class="name fl van-ellipsis"
          @click="goDetail(item.id, index, item.dt, item.isLike)"
        >
          {{ item.name }}
        </div>

        <div class="times fr">{{ item.dts }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { formatDuring } from '../assets/js/formatDuring'
export default {
  name: 'MySonglist2',
  props: {
    song: {
      type: Array,
    },
  },
  created() {
    console.log(this.song)
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      audio: (state) => state.playList.playList,
    }),
  },
  methods: {
    ...mapActions('playList', ['unshiftPlayList', 'deletePlayList']),
    // 播放音乐
    play(id, name, pic, artists) {
      console.log(this.audio)
      let hasID = this.audio.find((v) => {
        return v.id == id
      })
      console.log(id, name, pic, artists)
      console.log(hasID)
      if (hasID) {
        this.deletePlayList(id)
      }
      // 获取歌曲URL
      let url = ''
      let musicStr = ''
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
            musicStr = `id=${id};name=${name};artist=${artists};url=${url};cover=${pic};`
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
            musicStr += musicStr + 'lrc=' + lyric + ';'
            let musicObj = formatDuring.parseStrObjByRegExp(musicStr)
            this.unshiftPlayList(musicObj)
            console.log(this.$store.state)
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 切换是否喜爱歌曲
    toggleLike(item, id) {
      item.isLike = !item.isLike
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/like',
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
    // 下载歌曲
    download(id) {
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
            this.$toast.clear()
            result.data.data.map((v) => {
              this.songsUrl = v.url
            })

            window.location.href = this.songsUrl
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 去往详情页
    goDetail(id, like) {
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
              this.$router.push({
                name: 'Detail',
                params: { id, like },
              })
            } else {
              this.$toast(result.data.message)
            }
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
  },
}
</script>

<style lang="less" scoped>
.MySonglist2 {
  .songs-item {
    color: #333;
    padding: 8px 10px;
    &:nth-child(even) {
      background-color: #f7f7f7;
    }
    .name {
      width: 200px;
    }
    .img-box {
      margin-top: 4px;
      margin-right: 10px;
    }
  }
}
</style>
