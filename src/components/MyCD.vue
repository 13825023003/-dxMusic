<template>
  <div class="MyCD">
    <div class="CD-content">
      <div class="CD-item" v-for="(item, index) in CD" :key="index">
        <div
          class="item-img"
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
        >
          <van-image
            lazy-load
            :src="item.coverImgUrl"
            class="auto-img"
            alt=""
          />
          <span class="playCount">{{ item.playCount }}</span>
        </div>
        <div
          class="item-text van-multi-ellipsis--l2"
          @click="goDetail(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyCD',
  props: {
    CD: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  methods: {
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.MyCD {
  .CD-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .CD-item {
    box-sizing: border-box;
    flex: 0 0 48%;
    height: 200px;
    margin-bottom: 16px;
  }
  .item-img {
    width: 165px;
    height: 165px;
    margin: 0 auto 4px;
    position: relative;
    /deep/ img {
      border-radius: 8px;
    }
  }
  .playCount {
    position: absolute;
    left: 10px;
    bottom: 8px;
    z-index: 99;
    width: 70px;
    padding-left: 18px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    background: url('../assets/image/播放.png') no-repeat 0 center;
    background-size: 20%;
  }
  .item-text {
    padding-left: 10px;
    color: #1c1c1c;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
