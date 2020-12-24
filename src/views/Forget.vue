<template>
  <div class="forget">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">找回密码</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <div class="forget-title">
      <div class="forget-text">
        请输入手机号码,以及设置新的登录密码,密码长度为8-15位字符,必须包含数字/字母/字符中两种以上组合
      </div>
    </div>
    <van-form class="clearfix">
      <van-field
        v-model="userInfo.nickname"
        type="nickname"
        name="nickname"
        placeholder="nickname"
        autocomplete="off"
        left-icon="goods-collect-o"
      />
      <van-field
        v-model="userInfo.phone"
        type="phone"
        name="phone"
        placeholder="phone"
        autocomplete="off"
        left-icon="goods-collect-o"
      />
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
          已向{{ _phone }}
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
  name: 'Forget',
  data() {
    return {
      userInfo: {
        nickname: '',
        phone: '',
        password: '',
        surePassword: '',
        captcha: '',
      },
      _phone: '',
      isShow: false,
    }
  },
  created() {},
  methods: {
    // 获取验证码
    getCaptcha() {
      // 发起获取手机获取验证码请求
      let phone = this.userInfo.phone
      phone =
        phone.substring(0, 3) +
        phone.substring(3, 7).replace(/\d/g, '*') +
        phone.substring(7, 11)
      this._phone = phone
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
    // 找回密码
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
    back() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.forget {
  .forget-title {
    padding: 0 10px 10px;
    margin-top: 20px;
  }
  .forget-text {
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
