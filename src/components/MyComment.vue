<template>
  <div class="MyComment">
    <div class="comment-content">
      <div
        class="comment-item clearfix "
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="comment-img fl">
          <van-image lazy-load :src="item.user.avatarUrl" alt="" />
        </div>
        <div class="comment-version fr">
          <div class="comment-artists">
            {{ item.user.nickname }}
          </div>
          <div class="comment-time">
            {{ item.time }}
          </div>
          <div class="comment-text">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyComment',
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.MyComment {
  .comment-content {
    margin-top: 20px;
    position: relative;
  }
  .comment-count {
    font-size: 14px;
    position: absolute;
    right: 8px;
    top: -2px;
  }
  .comment-item {
    margin-top: 10px;
    padding-bottom: 10px;
  }
  .comment-img {
    width: 40px;
  }
  /deep/ .van-image__img {
    transform: translateY(2px);
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  .comment-version {
    width: 310px;
  }
  .comment-artists {
    color: #505050;
  }

  .comment-time {
    font-size: 12px;
  }
  .comment-text {
    font-weight: bold;
    margin-top: 6px;
  }
}
</style>
