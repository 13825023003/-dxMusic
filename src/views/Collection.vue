<template>
  <div class="collection">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">我的歌单</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div
      class="CD-head clearfix"
      v-for="(item, index) in userCreateImg"
      :key="index"
    >
      <div class="CD-img fl">
        <van-image lazy-load :src="item" class="auto-img" alt="" />
      </div>
      <div class="CD-title fr">
        <div class="CD-name van-multi-ellipsis--l2">
          大轩是我男神收藏与创建的歌单
        </div>
      </div>
    </div>
    <!-- 内容层 -->
    <div class="create-CD">
      <van-tabs v-model="active">
        <van-tab title="收藏的歌单">
          <div class="collectionCD-content">
            <van-list
              class="loading-box"
              v-model="collectionData.loading"
              :finished="collectionData.finished"
              finished-text="哎呀，没有数据可加载了!"
              offset="20"
              @load="CollectionLoadData"
            >
              <div
                class="songs-item clearfix"
                v-for="(item, index) in userCollectionCD"
                :key="index"
              >
                <van-swipe-cell>
                  <div class="item-img fl">
                    <van-image
                      lazy-load
                      :src="item.coverImgUrl"
                      alt="无图片显示"
                      class="auto-img"
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
                    />
                    <span>
                      <van-icon
                        name="play-circle-o"
                        size="40"
                        color="#fff"
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
                      </van-icon>
                    </span>
                  </div>
                  <div class="item-text fr">
                    <div
                      class="item-name van-multi-ellipsis--l2"
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
                      {{ item.name }}
                    </div>
                    <div class="item-enname">{{ item.trackCount }}首</div>
                  </div>
                  <template #right>
                    <van-button
                      square
                      text="删除"
                      type="danger"
                      class="delete-button"
                      @click="deleteSongList(item, index, 1)"
                    />
                  </template>
                </van-swipe-cell>
              </div>
            </van-list>
          </div>
        </van-tab>
        <van-tab title="创建的歌单">
          <div class="createCD-content">
            <van-list
              class="loading-box"
              v-model="createData.loading"
              :finished="createData.finished"
              finished-text="哎呀，没有数据可加载了!"
              offset="20"
              @load="createLoadData"
            >
              <div
                class="songs-item clearfix"
                v-for="(item, index) in userCreateCD"
                :key="index"
              >
                <van-swipe-cell>
                  <div class="item-img fl">
                    <van-image
                      lazy-load
                      :src="item.coverImgUrl"
                      alt="无图片显示"
                      class="auto-img"
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
                    />
                    <span>
                      <van-icon name="play-circle-o" size="40" color="#fff">
                      </van-icon>
                    </span>
                  </div>
                  <div class="item-text fr">
                    <div
                      class="item-name van-multi-ellipsis--l2"
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
                      {{ item.name }}
                    </div>
                    <div class="item-enname">{{ item.trackCount }}首</div>
                  </div>
                  <template #right>
                    <van-button
                      square
                      text="删除"
                      type="danger"
                      class="delete-button"
                      @click="deleteSongList(item, index, 2)"
                    />
                  </template>
                </van-swipe-cell>
              </div>
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import '../assets/less/Collection.less'
export default {
  name: 'Collection',
  data() {
    return {
      // 选项框索引值
      active: 0,
      // 用户id
      userId: 0,
      // 用户名称
      userNickname: '',
      // 用户歌单
      userCD: [],
      // 所有用户创建的歌单
      alluserCreateCD: [],
      // 用户创建的歌单
      userCreateCD: [],
      // 所有用户收藏的歌单
      alluserCollectionCD: [],
      // 用户收藏的歌单
      userCollectionCD: [],
      // 用户收藏的歌单图
      userCreateImg: [],
      createData: {
        // 每次触底加载10条数据
        dataCount: 10,
        // 开始截取歌单数据位置
        startCount: 0,
        // 触发加载
        loading: true,
        // 是否全部加载完成数据
        finished: false,
      },
      collectionData: {
        // 每次触底加载10条数据
        dataCount: 10,
        // 开始截取歌单数据位置
        startCount: 0,
        // 触发加载
        loading: true,
        // 是否全部加载完成数据
        finished: false,
      },
    }
  },
  created() {
    // 获取用户歌单
    this.getUserCD()
  },
  methods: {
    // 获取用户歌单
    getUserCD() {
      this.userId = Number(localStorage.getItem('_userID'))
      this.userNickname = localStorage.getItem('_nickname')
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: 'user/playlist',
        params: {
          uid: this.userId,
        },
      })
        .then((result) => {
          this.$toast.clear()
          result.data.playlist.map((v) => {
            this.userCD.push(v)
          })

          this.userCreateImg.push(this.userCD[0].coverImgUrl)
          this.alluserCreateCD = this.userCD.filter(
            (item) => item.creator.nickname == this.userNickname
          )
          this.alluserCollectionCD = this.userCD.slice(
            this.alluserCreateCD.length,
            this.userCD.length
          )
          // 创建歌单懒加载
          this.userCreateCD = this.alluserCreateCD.slice(
            this.createData.startCount,
            this.createData.startCount + this.createData.dataCount
          )
          this.createData.startCount += this.createData.dataCount
          // 未加载
          this.createData.loading = false
          // 收藏歌单懒加载
          this.userCollectionCD = this.alluserCollectionCD.slice(
            this.collectionData.startCount,
            this.collectionData.startCount + this.collectionData.dataCount
          )
          this.collectionData.startCount += this.collectionData.dataCount
          // 未加载
          this.collectionData.loading = false
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 创建歌单懒加载事件
    createLoadData() {
      setTimeout(() => {
        let data = this.alluserCreateCD.slice(
          this.createData.startCount,
          this.createData.startCount + this.createData.dataCount
        )
        this.createData.startCount += this.createData.dataCount
        this.userCreateCD.push(...data)
        if (data.length < this.dataCount) {
          this.createData.finished = true
        } else {
          this.createData.loading = false
        }
      }, 1500)
    },
    // 收藏的歌单懒加载
    CollectionLoadData() {
      setTimeout(() => {
        let data = this.alluserCollectionCD.slice(
          this.collectionData.startCount,
          this.collectionData.startCount + this.collectionData.dataCount
        )
        this.collectionData.startCount += this.collectionData.dataCount
        this.userCollectionCD.push(...data)
        if (data.length < this.dataCount) {
          this.collectionData.finished = true
        } else {
          this.collectionData.loading = false
        }
      }, 1500)
    },
    deleteSongList(item, index, i) {
      item.id = Number(item.id)
      this.$dialog
        .confirm({
          title: '提示内容',
          message: '是否删除当前选中的歌曲',
        })
        .then(() => {
          this.axios({
            url: '/playlist/delete',
            params: {
              id: item.id,
            },
          })
            .then((result) => {
              console.log(result)
              if (i == 1) {
                this.userCollectionCD.splice(index, 1)
              } else {
                this.userCreateCD.splice(index, 1)
              }
              this.$toast('删除歌单成功')
            })
            .catch((err) => {})
        })
        .catch(() => {
          // on cancel
        })
    },
    // 返回上一个页面
    back() {
      this.$router.go(-1)
    },
    goCDDetail(id, name, img, playCount, nickname, avatarUrl) {
      this.$router.push({
        name: 'CD',
        params: { id, name, img, playCount, nickname, avatarUrl },
      })
    },
  },
}
</script>
