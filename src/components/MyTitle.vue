<template>
  <div class="MyTitle clearfix">
    <div class="MyTitle-left fl">
      {{ title }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MyTitle',
  props: {
    //   标题
    title: {
      type: String,
      default: '左边标题',
    },
  },
}
</script>

<style lang="less" scoped>
.MyTitle {
  height: 30px;
  .MyTitle-left {
    box-sizing: border-box;
    height: 26px;
    line-height: 26px;
    padding-left: 22px;
    font-size: 16px;
    font-weight: bold;
    border-left: 4px solid #f5b83f;
  }
}
</style>
