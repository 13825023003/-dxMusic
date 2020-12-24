<template>
  <div class="CD">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title" class="van-ellipsis">歌单详情</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 标题栏 -->
    <div class="CD-head clearfix">
      <div class="CD-img fl">
        <img :src="CD[2]" class="auto-img" alt="" />
        <span class="CD-count">{{ CD[3] }}</span>
      </div>
      <div class="CD-title fr">
        <div class="CD-name van-multi-ellipsis--l2">
          {{ CD[1] }}
        </div>
        <div class="CD-enname clearfix">
          <img :src="CD[5]" class="auto-img fl" alt="" />
          <div class="CD-artists van-ellipsis fr">{{ CD[4] }}</div>
        </div>
      </div>
      <van-icon
        class="fr"
        :name="isSub ? 'star' : 'star-o'"
        :color="isSub ? 'red ' : 'black'"
        @click="toggleSub()"
        size="36"
      ></van-icon>
    </div>
    <!-- 歌曲栏 -->
    <div class="CD-songlist">
      <div class="song-title">
        歌曲列表
      </div>
      <van-list
        class="loading-box"
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="20"
        @load="loadData"
      >
        <div class="songs-content">
          <div
            class="song-item clearfix"
            v-for="(item, index) in songList"
            :key="index"
          >
            <span class="song-play">
              <van-icon
                name="play-circle-o"
                color="#505050"
                size="26"
                @click="
                  play(item.id, item.name, item.al.picUrl, item.ar[0].name)
                "
              ></van-icon>
            </span>
            <div class="song-count fl">
              {{ index + 1 }}
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
      </van-list>
    </div>
  </div>
</template>

<script>
import '../assets/less/CD.less'
import { formatDuring } from '../assets/js/formatDuring'
export default {
  name: 'CD',
  data() {
    return {
      // 歌单数据
      CD: [],
      // 歌曲数据
      songList: [],
      allsongList: [],
      currentIndex: 0,
      // 每次触底加载8条数据
      dataCount: 8,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      isSub: false,
    }
  },
  created() {
    for (let i in this.$route.params) {
      this.CD.push(this.$route.params[i])
    }
    // 获取歌单详情
    this.getsongList()
  },
  methods: {
    // 获取歌单详情
    getsongList() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/playlist/detail',
        params: {
          id: this.CD[0],
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            result.data.playlist.tracks.map((v) => {
              this.allsongList.push(v)
            })

            this.songList = this.allsongList.slice(
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
        let data = this.allsongList.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.songList.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 收藏
    toggleSub() {
      this.isSub = !this.isSub
    },
    // 返回上一页
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
  },
}
</script>
