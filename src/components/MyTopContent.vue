<template>
  <div class="myTopContent">
    <slot></slot>
    <div class="play-all fl" v-show="playShow" @click="playAll()">
      <van-icon
        name="play"
        class="playAll-icon"
        size="20"
        color="#fff"
      ></van-icon>
      播放全部
    </div>
  </div>
</template>

<script>
export default {
  name: 'myTopContent',
  props: {
    list: {
      type: Array,
    },
    playShow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    playAll() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="less" scoped>
.myTopContent {
  background: url('../assets/image/detail-bg.jpg') no-repeat center center;
  background-size: cover;
  padding: 20px 16px 20px;
  .play-all {
    font-size: 16px;
    margin-top: 10px;
    margin-left: 14px;
    width: 120px;
    height: 34px;
    border-radius: 20px;
    line-height: 34px;
    text-align: center;
    background-color: #f5b83f;
    color: #505050;
    font-weight: bold;
  }
  .playAll-icon {
    transform: translate(-4px, 4px);
  }
}
</style>
