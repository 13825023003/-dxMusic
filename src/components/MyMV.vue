<template>
  <div class="MyMV">
    <div class="MV-content" v-if="isHasMV">
      <div class="MV-box" v-for="(item, index) in list" :key="index">
        <div class="MV-img" @click="goMV(item.id)">
          <van-image
            lazy-load
            :src="item.cover || item.imgurl"
            class="auto-img"
            alt=""
          />
          <span class="MV-play">{{ item.playCount }}</span>
        </div>
        <div class="MV-text van-multi-ellipsis--l2" @click="goMV(item.id)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="MV-else" v-else>
      <h2>该歌手暂无相关MV</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyMV',
  props: {
    list: {
      type: Array,
    },
    isHasMV: {
      type: Boolean,
      default: 'true',
    },
  },
  data() {
    return {}
  },
  methods: {
    // 点击MV事件
    goMV(id) {
      this.$router.push({
        name: 'MV',
        params: { id: id, type: 'MV' },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.MyMV {
  .MV-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .MV-box {
    flex: 0 0 50%;
    box-sizing: border-box;
    height: 140px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .MV-img {
    margin: 0 auto;
    width: 156px;
    height: 100px;
    position: relative;
  }
  .MV-play {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 99;
    width: 70px;
    padding-left: 18px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    background: url('../assets/image/播放.png') no-repeat 0 center;
    background-size: 20%;
  }
  .MV-text {
    padding-left: 8px;
    color: #1c1c1c;
    font-weight: bold;
    font-size: 16px;
    padding-right: 8px;
  }
}
</style>
