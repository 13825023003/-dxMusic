<template>
  <div class="home">
    <van-nav-bar>
      <template #title>
        <div
          id="nav-title"
          :class="{ active: activeIndex == index }"
          v-for="(item, index) in listData"
          :key="index"
          @click="toggleList(index, item.name)"
        >
          {{ item.title }}
        </div>
      </template>
      <template #left>
        <van-icon name="search" size="26" @click="goSearch" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div>
      <!-- 三级路由 -->
      <router-view> </router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 激活标签栏名称
      activeName: 'Recommend',
      activeIndex: 0,
      listData: [
        {
          title: '推荐',
          //   标签名称 路由名称
          name: 'Recommend',
          path: '/recommend',
        },
        {
          title: '分类',
          //   标签名称 路由名称
          name: 'Classify',
          path: '/classify',
        },
      ],
    }
  },
  created() {
    for (let i = 0; i < this.listData.length; i++) {
      if (this.listData[i].name == this.$route.name) {
        this.activeIndex = i
        break
      }
    }
  },
  methods: {
    // 跳转页面事件
    goPage(name) {
      this.$router.push({ name })
    },
    // 切换页面事件
    toggleList(index, name) {
      if (this.activeIndex == index) {
        return
      }
      this.activeIndex = index
      this.goPage(name)
    },
    // 跳转到搜索页面事件
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
  },
}
</script>
<style lang="less" scoped>
.home {
  /deep/ .van-nav-bar__title {
    display: flex;
    left: 0;
    bottom: 0;
    justify-content: space-around;
    width: 150px;
    .active {
      border-bottom: 4px solid #f5b83f;
    }
  }
  /deep/ #nav-title {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
  }
}
</style>
