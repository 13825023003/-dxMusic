<template>
  <div class="login">
    <!-- 图片内容层 -->
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title" class="van-ellipsis">登录</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div class="login-content">
      <div class="img-box">
        <img src="../assets/image/音乐.png" class="auto-img" alt="" />
      </div>
      <div class="text-box">
        <div class="name">大轩音乐</div>
        <div class="enname">welcome to daxuan music</div>
      </div>
    </div>
    <!-- 登录层 -->
    <!-- 注册内容层 -->
    <van-form class="clearfix">
      <van-field
        v-model="userInfo.phone"
        name="PhoneNumber"
        placeholder="PhoneNumber"
        autocomplete="off"
        left-icon="contact"
      />
      <van-field
        v-model="userInfo.password"
        type="password"
        name="password"
        placeholder="password"
        autocomplete="off"
        left-icon="goods-collect-o"
      />
      <slide-verify
        v-if="slideShow"
        ref="slideblock"
        @again="onAgain"
        @fulfilled="onFulfilled"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        :accuracy="accuracy"
        :slider-text="text"
      ></slide-verify>
      <div class="successMsg">{{ msg }}</div>
      <div class="forget fr" @click="goForget">
        忘记密码
      </div>
      <div class="commit-btn">
        <van-button round block color="#1c1c1c" @click="login">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- 其他登录方式 -->
    <div class="else-login">
      <div class="else-text">
        第三方登录
      </div>
      <div class="else-image">
        <img class="auto-img" src="../assets/image/微博.png" alt="" />
        <img class="auto-img" src="../assets/image/QQ.png" alt="" />
        <img class="auto-img" src="../assets/image/微信.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { validForm } from '../assets/js/validForm'
export default {
  name: 'Login',
  data() {
    return {
      userInfo: {
        phone: '',
        password: '',
      },
      likeCD: [],
      likeCDPid: 0,
      // 滑块验证
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 1,
      slideShow: false,
    }
  },
  updated() {},
  methods: {
    // 登录事件
    login() {
      let obj = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: '手机号格式不正确',
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: '密码格式为字母开头,6-16位',
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      }
      let isPass = validForm.valid(obj)
      if (isPass) {
        this.slideShow = !this.slideShow
      }
    },
    // 获取我喜欢的歌单
    getUserSubcount() {
      let userId = Number(localStorage.getItem('_userID'))
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
          uid: userId,
        },
      })
        .then((result) => {
          this.$toast.clear()
          this.likeCD.push(result.data.playlist[0])
          this.likeCDPid = this.likeCD[0].id
          localStorage.setItem('CDPid', this.likeCDPid)
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    goForget() {
      this.$router.push({ name: 'Forget' })
    },
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
    // 滑块验证回调
    onSuccess(times) {
      this.$toast.loading({
        // 文本提示
        message: '加载中...',
        // 禁止穿透点击
        forbidClick: true,
        // 提示时间
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: '/login/cellphone?timestamp=1503019930000',
        params: {
          phone: this.userInfo.phone,
          password: this.userInfo.password,
        },
      })
        .then((result) => {
          this.msg = `登录成功, 耗时${(times / 1000).toFixed(1)}s`
          this.$toast(this.msg)
          if (result.data.code == 200) {
            // 保存cookies, 以便后面验证登录
            localStorage.setItem('_phone', result.config.params.phone)
            localStorage.setItem('_password', result.config.params.password)
            localStorage.setItem('_userID', result.data.profile.userId)
            localStorage.setItem('_nickname', result.data.profile.nickname)
            localStorage.setItem('_tk', result.data.cookie)
            this.getUserSubcount()
            setTimeout(() => {
              this.$router.push({ name: 'Recommend' })
            }, 1000)
          } else {
            this.$toast('账号或密码输入错误,请重新输入')
          }
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    onFail() {
      this.$toast('验证不通过')
    },
    onRefresh() {
      this.$toast('刷新成功')
    },
    onFulfilled() {
      this.$toast('刷新成功')
    },
    onAgain() {
      this.$toast('检测到非人操作')
      // 刷新
      this.$refs.slideblock.reset()
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  background: url('../assets/image/login-bg.jpg') no-repeat center center;
  background-size: cover;
  padding-bottom: 50px;
  .login-content {
    padding-top: 80px;
    margin-bottom: 40px;
  }

  .img-box {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  .slide-verify {
    margin: 0 auto 10px;
  }
  .successMsg {
    text-indent: 1rem;
  }
  .text-box {
    width: 200px;
    margin: 0 auto;
    text-align: center;
    color: white;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  /deep/.van-form .van-cell {
    padding-top: 6px;
    padding-bottom: 4px;
    width: 250px;
    margin: 10px auto;
    background-color: transparent;
    border-bottom: 1px solid #1c1c1c;
    color: #1c1c1c;
  }
  /deep/ .van-cell::after {
    border: none;
  }
  /deep/ .van-field__control {
    color: #1c1c1c;
  }
  input::-webkit-input-placeholder {
    color: red;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/.van-form .commit-btn .van-button {
    &:first-child {
      margin: 50px auto;
      width: 250px;
      font-size: 20px;
    }

    font-weight: bold;
  }
  /deep/ .van-form .van-button--block[data-v-63ae9146] {
    width: 100px;
    font-size: 10px;
    position: relative;
    bottom: 40px;
    right: 70px;
  }
  .else-login {
    width: 250px;
    margin: 30px auto;
    border-top: 1px solid transparent;
    position: relative;
  }
  .else-text {
    width: 60px;
    text-align: center;
    color: white;
    position: absolute;
    left: 50%;
    top: -8px;
    margin-left: -30px;
    background-color: #a0b0b0;
    font-size: 12px;
    z-index: 99;
  }
  .else-image {
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
    img {
      flex: 0 0 10%;
    }
  }
  .forget {
    margin-right: 60px;
    font-size: 14px;
    color: white;
  }
}
</style>
