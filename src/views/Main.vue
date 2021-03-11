<template>
  <div class="mian">
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>
    <!-- 底部标签栏 -->
    <!-- 底部标签栏 -->
    <van-tabbar
      class="tabbar"
      v-model="activeName"
      active-color="#f5b83f"
      inactive-color="#000"
      route
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :icon="item.icon"
        :key="index"
        :name="item.name"
        replace
        :to="item.path"
      >
        <span>{{ item.title }}</span>
        <!-- 自定义图标 -->
        <template #icon="props">
          <van-image
            lazy-load
            :src="props.active ? item.activeImg : item.inactiveImg"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data() {
    return {
      //   默认激活标签
      activeName: 'Home',
      // 标签栏数据
      tabbarData: [
        {
          title: '首页',
          icon: 'home-o',
          //   标签名称 路由名称
          name: 'Home',
          path: '/home/recommend',
          inactiveImg: require('../assets/image/music.png'),
          activeImg: require('../assets/image/music (1).png'),
        },
        {
          title: '圈子',
          icon: 'search',
          //   标签名称 路由名称
          name: 'CircleTalk',
          path: '/circleTalk',
          inactiveImg: require('../assets/image/圈子.png'),
          activeImg: require('../assets/image/圈子 (1).png'),
        },
        {
          title: '列表',
          icon: 'friends-o',
          //   标签名称 路由名称
          name: 'List',
          path: '/list',
          inactiveImg: require('../assets/image/菜单.png'),
          activeImg: require('../assets/image/菜单 (1).png'),
        },
        {
          title: '我的',
          icon: 'setting-o',
          //   标签名称 路由名称
          name: 'My',
          path: '/my',
          inactiveImg: require('../assets/image/我 的.png'),
          activeImg: require('../assets/image/我 的 (1).png'),
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
}
.van-tabbar--fixed {
  bottom: -3px;
  z-index: 999;
}
</style>
