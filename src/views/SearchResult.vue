<template>
  <div class="searchResult">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">搜索结果</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 搜索栏 -->
    <!-- 搜索栏 -->
    <div class="search-box">
      <!-- 搜索建议层 -->
      <div class="search-remind" v-show="isshowremindSearch">
        <div class="remind-songtitle">
          歌曲
        </div>
        <div
          class="remind-songitem"
          v-for="(item, index) in remindSearchsongs"
          :key="index"
          @click="goSearchResult(item.name)"
        >
          {{ item.name }} - {{ item.artist.name }}
        </div>
        <div class="remind-authortitle">
          歌手
        </div>
        <div
          class="remind-authoritem"
          v-for="(item, index) in remindSearchauthors"
          :key="'info2-' + index"
          @click="goSearchResult(item.name)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="search-input">
        <van-search
          background="#505050"
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          shape="round"
          maxlength="12"
          left-icon=""
          @input="getremindSearch"
        >
          <template #right-icon>
            <div @click="search()">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <!-- 搜索结果内容层 -->
    <div class="result-num">
      <h1>共找到{{ count }}个结果</h1>
    </div>
    <div class="result-tab">
      <van-tabs @click="onClick">
        <van-tab title="歌曲">
          <div class="songs-content">
            <div
              class="songs-item clearfix"
              v-for="(item, index) in searchResult"
              :key="index"
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
                @click="
                  goDetail(item.id, keywords, index, item.dt, item.isLike)
                "
              >
                {{ item.name }}
              </div>

              <div class="times fr">{{ item.dts }}</div>
            </div>
          </div>
        </van-tab>
        <van-tab title="歌手"
          ><div class="aritsts-content">
            <div
              class="artists-item clearfix"
              v-for="(item, index) in searchResult"
              :key="index"
            >
              <div class="item-img fl">
                <img :src="item.picUrl" alt="无图片显示" class="auto-img" />
              </div>
              <div class="item-text fr">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-enname">专辑数:{{ item.albumSize }}</div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="歌单">
          <div class="CD-content">
            <div
              class="CD-item"
              v-for="(item, index) in searchResult"
              :key="index"
            >
              <div class="CD-img">
                <span class="playCount">{{ item.playCount }}</span>
                <img
                  :src="item.coverImgUrl"
                  alt="无图片显示"
                  class="auto-img"
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
              <div class="CD-text van-multi-ellipsis--l2">
                {{ item.name }}
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../assets/less/SearchResult.less'
import { formatDuring } from '../assets/js/formatDuring'
export default {
  name: 'SearchResult',
  data() {
    return {
      isshowremindSearch: false,
      searchValue: '',
      remindSearchsongs: [],
      remindSearchauthors: [],
      searchResult: [],
      count: 0,
      keywords: '',
      number: 0,
      name: '',
      artist: '',
      isLike: false,
      songsUrl: '',
      listFolded: true,
    }
  },
  created() {
    //   获取搜索关键词
    this.keywords = this.$route.params.searchvalue

    // 获取搜索详情
    this.getSearchResult(1, this.keywords)
  },
  methods: {
    //   获取详情方法
    getremindSearch() {
      this.remindSearchsongs = this.remindSearchsongs.splice(0, -1)
      this.remindSearchauthors = this.remindSearchauthors.splice(0, -1)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/search/suggest',
        params: {
          keywords: this.searchValue,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.isshowremindSearch = true
            this.$toast.clear()
            result.data.result.albums.map((v) => {
              this.remindSearchsongs.push(v)
            })
            result.data.result.artists.map((v) => {
              this.remindSearchauthors.push(v)
            })
          }
        })
        .catch((err) => {
          this.isshowremindSearch = false
          this.$toast.clear()
        })
    },
    // 返回上一页
    back() {
      this.$router.go(-1)
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
    // 切换标签
    onClick(name) {
      if (name == 0) {
        this.getSearchResult(1, this.keywords)
      } else if (name == 1) {
        this.getSearchResult(100, this.keywords)
      } else {
        this.getSearchResult(1000, this.keywords)
      }
    },
    // 点击搜索
    search() {
      if (this.searchvalue != '') {
        this.isshowremindSearch = false
        this.keywords = this.searchValue
        this.number = 0
        this.getSearchResult(1, this.keywords)
      } else {
        this.$toast('搜索内容不能为空')
      }
    },
    // 获取搜索详情
    getSearchResult(type, keywords) {
      this.searchResult = this.searchResult.splice(0, -1)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/cloudsearch',
        params: {
          keywords: keywords,
          type: type,
        },
      })
        .then((result) => {
          this.$toast.clear()

          this.count =
            result.data.result.songCount ||
            result.data.result.playlistCount ||
            result.data.result.artistCount
          if (this.count == result.data.result.songCount) {
            result.data.result.songs.map((v) => {
              v.isLike = false
              this.searchResult.push(v)
            })
          } else if (this.count == result.data.result.artistCount) {
            result.data.result.artists.map((v) => {
              this.searchResult.push(v)
            })
          } else {
            result.data.result.playlists.map((v) => {
              this.searchResult.push(v)
            })
          }

          this.searchResult.map((v) => {
            if (v.dt) {
              v.dts = formatDuring.formatDuring(v.dt)
            }
          })
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
    goDetail(id, name, index, time, like) {
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
                params: { id, name, index, time, like },
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
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
  },
}
</script>
