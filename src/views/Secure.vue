<template>
  <div class="secure">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">修改密码</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div class="secure-title">
      <div class="secure-text">
        您的手机号为{{
          userInfo._phone
        }},请设置新的登录密码,密码长度为8-15位字符,必须包含数字/字母/字符中两种以上组合
      </div>
    </div>
    <van-form class="clearfix">
      <van-field
        v-model="userInfo.password"
        type="password"
        name="password"
        placeholder="password"
        autocomplete="off"
        left-icon="goods-collect-o"
      />
      <van-field
        v-model="userInfo.surepassword"
        type="password"
        placeholder="surePassword"
        autocomplete="off"
        left-icon="goods-collect-o"
      />
      <div class="commit-btn">
        <van-button round block color="#1c1c1c" @click="getCaptcha">
          修改密码
        </van-button>
      </div>
    </van-form>
    <van-dialog
      v-model="isShow"
      show-cancel-button
      ref="dialog"
      :beforeClose="beforeClose"
    >
      <template #title>
        <div>
          已向{{ userInfo._phone }}
          用户发送验证码,请输入验证码进行进一步操作
        </div>
      </template>
      <template #default>
        <div>
          <van-field
            v-model="userInfo.captcha"
            type="captcha"
            placeholder="captcha"
            autocomplete="off"
            left-icon="goods-collect-o"
          />
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<script>
import { validForm } from '../assets/js/validForm'
import { Dialog } from 'vant'
export default {
  name: 'Secure',
  data() {
    return {
      // 用户注册信息
      userInfo: {
        phone: 0,
        _phone: 0,
        password: '',
        surepassword: '',
        captcha: '',
      },
      isShow: false,
    }
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  created() {
    this.getUserInfo()
    this.$nextTick(() => {})
  },
  methods: {
    // 设置获取手机验证码事件
    getCaptcha() {
      // 发起获取手机获取验证码请求
      let obj = {
        password: {
          value: this.userInfo.password,
          errorMsg: '密码格式不正确',
          reg: /^[A-Za-z]\w{8,15}$/,
        },
        surepassword: {
          value: this.userInfo.surepassword,
          errorMsg: '两次输入不正确',
          reg: /^[A-Za-z]\w{8,15}$/,
        },
      }
      let isPass =
        validForm.valid(obj) &&
        this.userInfo.password === this.userInfo.surepassword
      if (isPass) {
        this.isShow = true
        this.axios({
          method: 'GET',
          url: '/captcha/sent',
          params: {
            phone: this.userInfo.phone,
          },
        })
          .then((result) => {})
          .catch((err) => {})
      }
    },
    // 获取用户信息
    getUserInfo() {
      this.userInfo.phone = localStorage.getItem('_phone')
      this.userInfo.nickname = localStorage.getItem('_nickname')
      let phone = this.userInfo.phone
      phone =
        phone.substring(0, 3) +
        phone.substring(3, 7).replace(/\d/g, '*') +
        phone.substring(7, 11)
      this.userInfo._phone = phone
    },
    // 修改密码事件
    beforeClose(action, done) {
      if (action === 'confirm') {
        setTimeout(() => {
          let obj = {
            captcha: {
              value: this.userInfo.captcha,
              errorMsg: '验证码格式不正确',
              reg: /^\d{4}$/,
            },
          }
          let isPass = validForm.valid(obj)
          if (isPass) {
            // 启动加载提示
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
                  this.$toast('修改密码成功,请重新登录')
                  localStorage.removeItem('_phone')
                  localStorage.removeItem('_password')
                  localStorage.removeItem('_userID')
                  localStorage.removeItem('_nickname')
                  localStorage.removeItem('_tk')
                  localStorage.removeItem('historyData')
                  this.$router.push({ name: 'Login' })
                  done()
                }
              })
              .catch((err) => {
                this.$toast('验证码输入不正确')
                done(false)
              })
          } else {
            this.$toast('验证码格式不正确')
            done(false)
          }
        }, 1000)
      } else if (action === 'cancel') {
        done()
      }
    },
    // 返回上一页面
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.secure {
  .secure-title {
    padding: 0 10px 10px;
    margin-top: 20px;
  }
  .secure-text {
    font-size: 14px;
    color: #1c1c1c;
  }

  /deep/.van-form .van-cell {
    padding-top: 6px;
    padding-bottom: 4px;
    width: calc(100% - 20px);
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
  }
  input::-webkit-input-placeholder {
    color: red;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/.van-form .commit-btn .van-button {
    &:first-child {
      width: 60px;
      margin: 20px auto;
      width: 250px;
      font-size: 20px;
    }
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
