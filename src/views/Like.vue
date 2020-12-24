<template>
  <div class="like">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">喜欢的音乐</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 标题层 -->
    <div class="CD-head clearfix" v-for="(item, index) in likeCD" :key="index">
      <div class="CD-img fl">
        <img :src="item.coverImgUrl" class="auto-img" alt="" />
        <span class="CD-count">{{ item.playCount }}</span>
      </div>
      <div class="CD-title fr">
        <div class="CD-name van-multi-ellipsis--l2">
          {{ item.name }}
        </div>
        <div class="CD-enname clearfix">
          <img :src="item.creator.avatarUrl" class="auto-img fl" alt="" />
          <div class="CD-artists van-ellipsis fr">
            {{ item.creator.nickname }}
          </div>
        </div>
      </div>
    </div>

    <!-- 歌曲栏 -->
    <div class="CD-songlist" v-if="hasSong">
      <div class="song-title">
        歌曲列表
      </div>

      <div class="songs-content">
        <div
          class="song-item clearfix"
          v-for="(item, index) in likeSong"
          :key="'info2-' + index"
        >
          <span class="song-play">
            <van-icon
              name="play-circle-o"
              color="#505050"
              size="26"
              @click="play(item.id, item.name, item.al.picUrl, item.ar[0].name)"
            ></van-icon>
          </span>
          <div class="song-count fl">
            {{ index + 50 * (currentPage - 1) + 1 }}
          </div>
          <div class="song-text fr van-hairline--bottom">
            <div
              class="song-name van-ellipsis"
              @click="goDetail(item.id, item.name, item.dt)"
            >
              {{ item.name }}
            </div>
            <div class="song-enname van-ellipsis">
              {{ item.ar[0].name }}-{{ item.al.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="CD-noSong" v-else>
      <van-empty description="暂无喜欢的音乐">
        <van-button
          round
          type="danger"
          class="bottom-button"
          @click="goRecommend"
        >
          去听音乐
        </van-button>
      </van-empty>
    </div>
    <!-- 分页层 -->
    <van-pagination
      v-model="currentPage"
      @change="getLikeMusic"
      :total-items="totalItem"
      :items-per-page="50"
      :show-page-size="3"
      force-ellipses
    />
  </div>
</template>

<script>
import { formatDuring } from '../assets/js/formatDuring'
import '../assets/less/Like.less'
export default {
  name: 'Like',
  data() {
    return {
      // 用户ID
      userId: 0,
      // 喜欢的音乐歌单
      likeCD: [],
      // 喜欢的音乐的歌单ID
      likeCDId: '',
      // 喜欢的音乐
      likeSong: [],
      // 所有喜欢的音乐
      allLikeSong: [],
      // 当前页码
      currentPage: 1,
      // 总记录数
      totalItem: 0,
      hasSong: false,
      isSub: false,
    }
  },
  created() {
    this.getUserSubcount()
  },
  methods: {
    // 获取我喜欢的歌单
    getUserSubcount() {
      this.userId = Number(localStorage.getItem('_userID'))
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: 'user/playlist',
        params: {
          uid: this.userId,
        },
      })
        .then((result) => {
          this.$toast.clear()
          this.likeCD.push(result.data.playlist[0])
          this.getLikeMusic()
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取喜欢的音乐
    getLikeMusic(index) {
      this.likeCDId = Number(this.likeCD[0].id)
      this.likeSong = this.likeSong.splice(0, -1)
      this.allLikeSong = this.allLikeSong.splice(0, -1)
      this.axios({
        url: '/playlist/detail',
        params: {
          id: this.likeCDId,
        },
      })
        .then((result) => {
          if (result.data.playlist.trackCount) {
            this.hasSong = true
            let tracks = result.data.playlist.tracks
            this.totalItem = tracks.length
            for (
              let i = (this.currentPage - 1) * 50;
              i < this.currentPage * 50;
              i++
            ) {
              this.likeSong.push(tracks[i])
            }
          } else {
            this.hasSong = false
          }
        })
        .catch((err) => {})
    },
    // 返回上一个页面
    back() {
      this.$router.go(-1)
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
            console.log('lyric', result)
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
    goRecommend() {
      this.$router.push({ name: 'Recommend' })
    },
  },
}
</script>

<style lang="less" scoped></style>
