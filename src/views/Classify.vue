<template>
  <div class="classify">
    <!-- 顶部导航栏 -->
    <van-sticky>
      <div class="classify-top">
        <div class="classify-area clearfix">
          <div
            class=" area-item fl"
            :class="areaIndex == index ? 'active' : ''"
            v-for="(item, index) in classifyArea"
            :key="index"
            @click="getallArtistsData(item.area, index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="classify-type clearfix">
          <div
            class="type-item fl"
            :class="typeIndex == index ? 'active' : ''"
            v-for="(item, index) in classifyType"
            :key="index"
            @click="getallArtistsData(item.type, index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </van-sticky>
    <!-- 分类内容层 -->
    <div class="classify-artists">
      <div class="classify-title">
        热门歌手
      </div>
      <div class="classify-content">
        <van-list
          class="loading-box"
          v-model="loading"
          :finished="finished"
          finished-text="哎呀，没有数据可加载了!"
          offset="20"
          @load="loadData"
        >
          <div
            class="classify-item clearfix"
            v-for="(item, index) in artistsData"
            :key="'info2-' + index"
          >
            <div class="item-img fl">
              <img :src="item.picUrl" alt="无图片显示" class="auto-img" />
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
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/less/Classfiy.less'
export default {
  name: 'Classify',
  created() {
    this.getallArtistsData()
  },
  data() {
    return {
      // Area索引值
      areaIndex: 0,
      // 性别索引值
      typeIndex: 0,
      // 国家分类
      classifyArea: [
        {
          name: '全部',
          area: -1,
        },
        {
          name: '华语',
          area: 7,
        },
        {
          name: '欧美',
          area: 96,
        },
        {
          name: '日本',
          area: 8,
        },
        {
          name: '韩国',
          area: 16,
        },
        {
          name: '其他',
          area: 0,
        },
      ],
      // 性别分类
      classifyType: [
        {
          name: '全部',
          type: -1,
        },
        {
          name: '男歌手',
          type: 1,
        },
        {
          name: '女歌手',
          type: 2,
        },
        {
          name: '乐队',
          type: 3,
        },
      ],
      areaCount: [-1, 7, 96, 8, 16, 0],
      // 国家信息
      area: -1,
      // 性别信息
      type: -1,
      // 所有歌手信息
      allArtistsData: [],
      // 歌手信息
      artistsData: [],
      currentIndex: 0,
      // 每次触底加载8条数据
      dataCount: 10,
      // 开始截取歌单数据位置
      startCount: 0,
      // 触发加载
      loading: true,
      // 是否全部加载完成数据
      finished: false,
      // 记录歌单的updateTime
    }
  },
  methods: {
    // 获取歌手信息事件
    getallArtistsData(item, index) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.allArtistsData = this.allArtistsData.splice(0, -1)
      this.artistsData = this.artistsData.splice(0, -1)
      if (this.areaCount.indexOf(item) != -1) {
        this.area = item
        this.areaIndex = index
      } else {
        this.type = item
        this.typeIndex = index
      }
      this.axios({
        method: 'GET',
        url: '/artist/list',
        params: {
          limit: 50,
          type: this.type,
          area: this.area,
        },
      })
        .then((result) => {
          this.$toast.clear()

          result.data.artists.map((v) => {
            this.allArtistsData.push(v)
          })
          this.artistsData = this.allArtistsData.slice(
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
        let data = this.allArtistsData.slice(
          this.startCount,
          this.startCount + this.dataCount
        )
        this.startCount += this.dataCount
        this.artistsData.push(...data)
        if (data.length < this.dataCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 1500)
    },
    // 去往歌手详情页
    goArtists(id, name, pic, songCount, albumCount) {
      this.$router.push({
        name: 'Artists',
        params: { id, name, pic, songCount, albumCount },
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
