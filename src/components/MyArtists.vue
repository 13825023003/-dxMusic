<template>
  <div class="MyArtists">
    <div class="aritsts-content">
      <div
        class="artists-item clearfix"
        v-for="(item, index) in artists"
        :key="index"
      >
        <div class="item-img fl">
          <van-image
            lazy-load
            :src="item.picUrl"
            alt="无图片显示"
            class="auto-img"
            @click="
              goArtists(
                item.id,
                item.name,
                item.picUrl,
                item.musicSize,
                item.albumSize
              )
            "
          />
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyArtists',
  props: {
    artists: {
      type: Array,
    },
  },
  data() {
    return {}
  },

  watch: {
    $route(e) {
      console.log('e', e.name)
    },
  },
  methods: {
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

<style lang="less" scoped>
.MyArtists {
  .artists-item {
    box-sizing: border-box;
    height: 90px;
    padding: 10px;
    &:nth-child(even) {
      background-color: #f7f7f7;
    }
  }
  .item-img {
    width: 90px;
    height: 74px;
    position: relative;
    top: -2px;
  }
  .item-text {
    width: 250px;
    padding-top: 10px;
  }
  .item-enname {
    font-size: 14px;
    color: #d3c7c7;
  }
}
</style>
