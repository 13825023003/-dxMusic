<template>
  <div class="MySonglist">
    <div class="smilar-content">
      <div
        class="smilar-item clearfix van-hairline--bottom"
        v-for="(item, index) in song"
        :key="index"
      >
        <div class="smilar-img fl">
          <van-image
            lazy-load
            :src="item.album.picUrl || item.al.picurl"
            class="auto-img"
            alt=""
          />
        </div>
        <div class="smilar-text fr clearfix">
          <div class="smilar-name fl">
            <div
              class="smilar-enname van-ellipsis"
              @click="goDetail(item.id, item.isLike)"
            >
              {{ item.name }}
            </div>
            <div class="smilar-artists van-ellipsis">
              {{ item.artists[0].name }}
            </div>
            <van-icon size="16" name="play-circle-o"></van-icon>
          </div>
          <div class="smilar-time fr">
            <div class="smilar-times">
              {{ item.duration }}
            </div>
            <div class="smilar-icon clearfix">
              <van-icon
                size="16"
                :name="item.isLike ? 'like' : 'like-o'"
                :color="item.isLike ? 'red ' : 'black'"
                @click="toggleLike(item)"
              ></van-icon>
              <img
                class="fr"
                @click="downloadSong(item.id, item.name)"
                src="../assets/image/download.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MySonglist',
  props: {
    song: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  created() {
    console.log(this.$props.song)
  },
  methods: {
    // 去往详情页
    goDetail(id, like) {
      this.axios({
        method: 'GET',
        url: '/check/music',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.status == 200) {
            if (result.data.success) {
              this.$router.push({
                name: 'Detail',
                params: { id, like },
              })
            } else {
              this.$toast(result.data.message)
            }
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 喜欢歌曲
    toggleLike(item, id) {
      item.isLike = !item.isLike
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/like',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 下载歌曲
    downloadSong(id, name) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      this.axios({
        method: 'GET',
        url: '/song/url',
        params: {
          id: id,
        },
      })
        .then((result) => {
          if (result.data.code == 200) {
            myDownloadFile.downloadFile(result.data.data[0].url, name, 'mp3')
            this.$toast.clear()
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
  },
}
</script>

<style lang="less" scoped>
.MySonglist {
  margin-top: 20px;
  .smilar-item {
    height: 46px;
    margin-top: 10px;
    padding-bottom: 10px;
  }
  .smilar-img {
    width: 42px;
    height: 42px;
    transform: translateY(2px);
  }
  .smilar-text {
    width: 290px;
  }
  .smilar-enname {
    width: 200px;
    color: #505050;
  }
  .smilar-artists {
    font-size: 14px;
  }
  .smilar-time {
    transform: translateY(2px);
  }
}
</style>
