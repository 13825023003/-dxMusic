<template>
  <div class="register">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title" class="van-ellipsis">注册</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 图片内容层 -->
    <div class="register-content">
      <div class="img-box">
        <img src="../assets/image/音乐.png" class="auto-img" alt="" />
      </div>
      <div class="text-box">
        <div class="name">大轩音乐</div>
        <div class="enname">welcome to daxuan music</div>
      </div>
    </div>
    <!-- 注册内容层 -->
    <van-form class="clearfix">
      <van-field
        v-model="userInfo.nickname"
        name="Nickname"
        placeholder="Nickname"
        autocomplete="off"
        left-icon="contact"
      />
      <van-field
        v-model="userInfo.phone"
        name="PhoneNumber"
        placeholder="PhoneNumber"
        autocomplete="off"
        left-icon="contact"
      />
      <van-button
        class="captcha-button"
        round
        block
        color="transparent"
        hairline
        @click="getCaptcha"
        size="mini"
      >
        获取手机验证码
      </van-button>
      <van-field
        v-model="userInfo.captcha"
        name="captcha"
        placeholder="captcha"
        autocomplete="off"
        left-icon="contact"
        class="contact"
      />
      <van-field
        v-model="userInfo.password"
        type="password"
        name="password"
        placeholder="password"
        autocomplete="off"
        left-icon="goods-collect-o"
        class="password"
      />
      <van-field
        v-model="userInfo.surepassword"
        type="password"
        placeholder="surePassword"
        autocomplete="off"
        left-icon="goods-collect-o"
        class="surepassword"
      />
      <div class="commit-btn">
        <van-button round block color="#1c1c1c" @click="register">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入表单验证脚本
import { validForm } from '../assets/js/validForm'
export default {
  name: 'Register',
  data() {
    return {
      // 用户注册信息
      userInfo: {
        nickname: '',
        phone: '',
        password: '',
        surepassword: '',
        captcha: '',
      },
    }
  },
  methods: {
    // 设置获取手机验证码事件
    getCaptcha() {
      let obj = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: '手机号格式不正确',
          reg: /^1[3-9]\d{9}$/,
        },
      }
      let isPass = validForm.valid(obj)
      if (isPass) {
        // 发起获取手机获取验证码请求
        this.axios({
          method: 'GET',
          url: '/captcha/sent?',
          params: {
            phone: this.userInfo.phone,
          },
        })
          .then((result) => {})
          .catch((err) => {})
      }
    },
    // 设置注册事件
    register() {
      let obj = {
        nickName: {
          value: this.userInfo.nickname,
          errorMsg: '用户ID不正确',
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
        phone: {
          value: this.userInfo.phone,
          errorMsg: '手机号格式不正确',
          reg: /^1[3-9]\d{9}$/,
        },
        captcha: {
          value: this.userInfo.captcha,
          errorMsg: '验证码格式不正确',
          reg: /^\d{4}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: '密码格式不正确',
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        surepassword: {
          value: this.userInfo.surepassword,
          errorMsg: '两次输入不正确',
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      }
      let isPass =
        validForm.valid(obj) &&
        this.userInfo.password === this.userInfo.surepassword
      // 启动加载提示

      if (isPass) {
        // 判断验证码是否正确
        this.$toast.loading({
          // 文本提示
          message: '加载中...',
          // 禁止穿透点击
          forbidClick: true,
          // 提示时间
          duration: 0,
        })
        this.axios({
          method: 'GET',
          url: '/captcha/verify?',
          params: {
            phone: this.userInfo.phone,
            captcha: this.userInfo.captcha,
          },
        })
          .then((result) => {
            if (result.data.code == 200) {
              this.axios({
                method: 'GET',
                url: '/register/cellphone',
                params: {
                  phone: this.userInfo.phone,
                  password: this.userInfo.password,
                  captcha: this.userInfo.captcha,
                  nickname: this.userInfo.nickname,
                },
              })
                .then((result) => {
                  if (result.data.code == 200) {
                    this.$toast('注册成功')
                    this.$router.push({ name: 'Login' })
                  }
                })
                .catch((err) => {})
            }
          })
          .catch((err) => {
            this.$toast('验证码输入不正确')
          })
      }
    },
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.register {
  background: url('../assets/image/login-bg.jpg') no-repeat center center;
  background-size: cover;
  padding-bottom: 50px;
  .register-content {
    padding-top: 80px;
  }

  .img-box {
    width: 60px;
    height: 60px;
    margin: 0 auto;
    margin-bottom: 20px;
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
  /deep/.van-form .contact {
    margin-left: 62px;
    position: relative;
    top: -20px;
  }
  /deep/.van-form .password {
    position: relative;
    top: -20px;
  }
  /deep/.van-form .surepassword {
    position: relative;
    top: -20px;
  }
  input::-webkit-input-placeholder {
    color: red;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/.van-form .commit-btn .van-button {
    &:first-child {
      position: relative;
      top: -70px;
      width: 60px;
      margin-top: 80px;
      width: 250px;
      font-size: 20px;
    }

    font-weight: bold;
  }
  /deep/ .van-form .van-button--block[data-v-63ae9146] {
    width: 100px;
    font-size: 11px;
    float: right;
    position: relative;
    bottom: 40px;
    right: 70px;
  }
  /deep/ .van-button--hairline {
    padding-left: 18px;
  }
}
</style>
