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
          <MySonglist2 :song="searchResult"></MySonglist2>
        </van-tab>
        <van-tab title="歌手">
          <MyArtists :artists="searchResult"></MyArtists>
        </van-tab>
        <van-tab title="歌单">
          <MyCD :CD="searchResult"></MyCD>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../assets/less/SearchResult.less'
import { formatDuring } from '../assets/js/formatDuring'
import MyCD from '../components/MyCD'
import MyArtists from '../components/MyArtists'
import MySonglist2 from '../components/MySonglist2'
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
  components: {
    MyCD,
    MyArtists,
    MySonglist2,
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
  },
}
</script>
