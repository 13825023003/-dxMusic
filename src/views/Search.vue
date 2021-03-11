<template>
  <div class="search">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">搜索</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
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
            <div @click="search">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <!-- 搜索历史栏 -->
    <div class="search-history">
      <div class="history-title">
        搜索历史:
        <span>(最多显示8条)</span>
      </div>
      <div class="history-content">
        <div
          class="history-text"
          v-for="(item, index) in historyData"
          :key="index"
          @click="historySearch(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <!-- 热搜栏 -->
    <div class="search-hot">
      <div class="hot-title">大轩音乐热搜榜</div>
      <van-list
        class="loading-box"
        v-model="loading"
        :finished="finished"
        finished-text="哎呀，没有数据可加载了!"
        offset="30"
        @load="loadData"
      >
        <div
          class="hot-item clear-fix"
          v-for="(item, index) in hotSearch"
          :key="index"
        >
          <div class="hot-list fl">{{ index + 1 }}</div>
          <div class="hot-text fr">
            <div class="hot-name" @click="goSearchResult(item.searchWord)">
              {{ item.searchWord }}
              <span class="hot-logo"
                ><img lazy-load src="../assets/image/hot.png" alt=""
              /></span>
              <span class="hot-count">{{ item.score }}</span>
            </div>
            <div class="hot-enname van-ellipsis">
              {{ item.content }}
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import '../assets/less/Search.less'
export default {
  name: 'Search',
  data() {
    return {
      listFolded: true,
      currentIndex: 0,
      // 每次触底加载10条数据
      dataCount: 10,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      allhotSearch: [],
      hotSearch: [],
      // 是否全部加载完成数据
      finished: false,
      isshowremindSearch: false,
      searchValue: '',
      // 搜索歌曲
      remindSearchsongs: [],
      remindSearchauthors: [],
      // 搜索历史
      historyData: [],
    }
  },
  created() {
    this.getHotSearch()
    let a = localStorage.historyData
    if (a) {
      this.historyData = JSON.parse(a)
    }
  },
  methods: {
    // 获取热搜事件
    getHotSearch() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/search/hot/detail',
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
            // 获取top5数据
            result.data.data.map((v) => {
              this.allhotSearch.push(v)
            })
            this.hotSearch = this.allhotSearch.slice(
              this.startCount,
              this.startCount + this.dataCount
            )
          }
          this.startCount += this.dataCount

          this.loading = false
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 懒加载事件
    loadData() {
      setTimeout(() => {
        let data = this.allhotSearch.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.hotSearch.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 获取搜索建议
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
    // 搜索方法
    search() {
      let searchvalue = this.searchValue
      let index = this.historyData.findIndex((ele) => {
        return ele == this.searchValue
      })
      if (index != -1) {
        this.historyData.splice(index, 1)
      }
      this.historyData.unshift(this.searchValue)
      if (this.searchValue.length > 8) {
        this.historyData.splice(9, 1)
      }
      localStorage.historyData = JSON.stringify(this.historyData)
      this.$router.push({ name: 'SearchResult', params: { searchvalue } })
    },
    // 搜索历史
    historySearch(item) {
      let searchvalue = item
      this.$router.push({ name: 'SearchResult', params: { searchvalue } })
    },
    // 去往搜索详情页
    goSearchResult(searchvalue) {
      this.$router.push({ name: 'SearchResult', params: { searchvalue } })
    },
  },
}
</script>
