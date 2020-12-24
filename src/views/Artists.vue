<template>
  <div class="artists">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title" class="van-ellipsis">歌手详情</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 歌手层头部 -->
    <div class="artists-head clearfix">
      <div class="artists-img fl">
        <img :src="artistsData[2]" class="auto-img" alt="" />
      </div>
      <div class="artists-text fr clearfix">
        <div class="artists-name ">
          {{ artistsData[1] }}
          <van-icon
            class="artists-icon"
            :name="isSub ? 'star' : 'star-o'"
            :color="isSub ? 'red ' : 'black'"
            @click="toggleSub()"
            size="28"
          ></van-icon>
        </div>
        <div class="artists-enname van-ellipsis">
          单曲数:{{ artistsData[3] }} 专辑数:{{ artistsData[4] }} MV数:{{
            artistsData[5]
          }}
        </div>
      </div>
    </div>
    <!-- 歌手层内容层 -->
    <div class="artists-content">
      <van-tabs
        @click="tabs"
        sticky
        title-active-color="#f5b83f"
        title-inactive-color="#1c1c1c"
        line-width="40"
        v-model="activeName"
      >
        <van-tab title="热门50首">
          <div class="songs-content">
            <van-list
              class="loading-box"
              v-model="loading"
              :finished="finished"
              finished-text="哎呀，没有数据可加载了!"
              offset="20"
              @load="loadData"
            >
              <div
                class="songs-item clearfix"
                v-for="(item, index) in topSong"
                :key="'info2-' + index"
              >
                <div class="img-box fl">
                  <van-icon
                    :name="item.isLike ? 'like' : 'like-o'"
                    :color="item.isLike ? 'red ' : 'black'"
                    @click="toggleLike(item, item.id)"
                  ></van-icon>
                </div>
                <div class="img-box fl">
                  <img
                    src="../assets/image/下载.png"
                    class="auto-img fl"
                    alt=""
                    @click="download(item.id)"
                  />
                </div>
                <div
                  class="name fl van-ellipsis"
                  @click="goDetail(item.id, item.name, 0, item.dt)"
                >
                  {{ item.name }}
                </div>

                <div class="times fr">{{ item.dts }}</div>
              </div>
            </van-list>
          </div>
        </van-tab>
        <van-tab title="详情">
          <div class="artists-detail">
            <div class="desc-title">
              歌手简介
            </div>
            <div class="desc-text">
              {{ artistsText }}
            </div>
          </div>
        </van-tab>
        <van-tab title="MV">
          <div class="MV-content" v-if="hasMV">
            <div
              class="MV-item"
              v-for="(item, index) in MV"
              :key="'info3-' + index"
            >
              <div class="MV-img" @click="fail()">
                <img :src="item.imgurl" class="auto-img" alt="" />
              </div>
              <div class="MV-name van-multi-ellipsis--l2">
                {{ item.name }}
              </div>
              <span class="MV-count">
                {{ item.playCount }}
              </span>
              <span class="MV-time">
                {{ item.duration }}
              </span>
            </div>
          </div>
          <div class="MV-else" v-else>
            <h2>该歌手暂无相关MV</h2>
          </div>
        </van-tab>
        <van-tab title="相似歌手">
          <div class="smilar-content" v-if="hasSimilar">
            <div
              class="similar-item clearfix"
              v-for="(item, index) in similar"
              :key="'info4-' + index"
            >
              <div class="item-img fl">
                <img
                  :src="item.picUrl"
                  alt="无图片显示"
                  class="auto-img"
                  @click="goAritsts(item.id)"
                />
              </div>
              <div class="item-text fr">
                <div
                  class="item-name"
                  @click="
                    goArtists(
                      item.id,
                      item.name,
                      item.picUrl,
                      item.musicSize,
                      item.albumSize
                    )
                  "
                >
                  {{ item.name }}
                </div>
                <div class="item-enname">专辑数:{{ item.albumSize }}</div>
              </div>
            </div>
          </div>
          <div class="smilar-else" v-else>
            <h2>暂无该歌手相似歌手的数据</h2>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../assets/less/Artists.less'
import { formatDuring } from '../assets/js/formatDuring'
export default {
  name: 'Artist',
  data() {
    return {
      // 记录是否收藏
      isSub: false,
      // 歌手信息
      artistsData: [],
      // 歌手详情
      artistsText: '',
      // 歌手id
      artistsID: '',
      // 歌手所有热门歌曲
      allTopSong: [],
      // 歌手热门歌曲
      topSong: [],
      currentIndex: 0,
      // 每次触底加载8条数据
      dataCount: 10,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      // 记录歌手是否有MV
      hasMV: true,
      // MV数据
      MV: [],
      // 相似歌手数据
      similar: [],
      // 是否有相似歌手数据
      hasSimilar: true,
      // 当前点击数据
      activeName: 0,
    }
  },
  created() {
    // 获取歌手信息
    this.getArtistsData()
    // 获取歌手MV
    this.getMV(this.artistsID)
    // 获取歌手热门50首
    this.getallTopSong(this.artistsID)
    // 获取歌手详情
    this.getArtistsText(this.artistsID)
    // 获取相似歌手
    this.getSimilar(this.artistsID)
  },
  methods: {
    // 获取歌手信息
    getArtistsData() {
      for (let i in this.$route.params) {
        this.artistsData.push(this.$route.params[i])
      }
      this.artistsID = this.artistsData[0]
    },
    // 获取歌手MV
    getMV(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/artist/mv',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            this.artistsData.push(result.data.mvs.length)
            if (result.data.mvs.length == 0) {
              this.hasMV = false
              return
            } else {
              result.data.mvs.map((v) => {
                v.duration = formatDuring.formatDuring(v.duration)
                this.MV.push(v)
              })
            }
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取歌手热门50首
    getallTopSong(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/artist/top/song',
        params: {
          id: id,
        },
      })
        .then((result) => {
          this.$toast.clear()

          result.data.songs.map((v) => {
            v.dts = formatDuring.formatDuring(v.dt)
            this.allTopSong.push(v)
          })
          this.topSong = this.allTopSong.slice(
            this.startCount,
            this.startCount + this.dataCount
          )
          this.startCount += this.dataCount
          // 未加载
          this.loading = false
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    loadData() {
      setTimeout(() => {
        let data = this.allTopSong.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.topSong.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 获取歌手详情
    getArtistsText(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/artist/desc',
        params: {
          id: id,
        },
      })
        .then((result) => {
          this.$toast.clear()

          this.artistsText = result.data.briefDesc
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 获取相似歌手
    getSimilar(id) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/simi/artist',
        params: {
          id: id,
        },
      })
        .then((result) => {
          this.$toast.clear()

          if (result.data.artists.length == 0) {
            this.hasSimilar = false
            return
          } else {
            this.hasSimilar = true
            result.data.artists.map((v) => {
              this.similar.push(v)
            })
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 切换Tab栏
    tabs(name, title) {},
    // 收藏
    toggleSub() {
      this.isSub = !this.isSub
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
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
    // 点击MV事件
    fail() {
      this.$toast.fail({
        message: '版权问题,无法观看MV',
        forbidClick: true,
      })
    },
    // 去往歌曲详情页
    goDetail(id, name, index, time) {
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
                params: { id, name, index, time },
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
    // 去往歌手详情页
    goArtists(id, name, pic, songCount, albumCount) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      setTimeout(() => {
        this.artistsData = this.artistsData.splice(0, -1)
        this.allTopSong = this.allTopSong.splice(0, -1)
        this.topSong = this.topSong.splice(0, -1)
        this.MV = this.MV.splice(0, -1)
        this.similar = this.similar.splice(0, 1)
        this.artistsData.push(id, name, pic, songCount, albumCount)

        this.artistsID = id
        // 获取歌手MV
        this.getMV(this.artistsID)
        // 获取歌手热门50首
        this.getallTopSong(this.artistsID)
        // 获取歌手详情
        this.getArtistsText(this.artistsID)
        // 获取相似歌手
        this.getSimilar(this.artistsID)
        this.activeName = 0
        this.$toast.clear()
      }, 800)
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
  },
}
</script>
