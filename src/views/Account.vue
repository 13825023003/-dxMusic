<template>
  <div class="account">
    <!-- 顶部导航栏 -->
    <van-nav-bar>
      <template #title>
        <div id="nav-title">个人中心</div>
      </template>
      <template #left>
        <van-icon name="arrow-left" size="26" @click="back" />
      </template>
      <template #right>
        <van-icon name="fire-o" size="26" />
      </template>
    </van-nav-bar>
    <!-- 内容层 -->
    <div class="account-content">
      <div class="account-title">
        我的资料
      </div>
      <van-cell title="头像" :center="true">
        <div>
          <div class="user-img fr">
            <van-image lazy-load :src="userImg" class="auto-img" alt="" />
            <van-uploader
              class="upload-box"
              :after-read="uploadUserImg"
              :max-size="2 * 1024 * 1024"
            ></van-uploader>
          </div>
        </div>
      </van-cell>
      <van-cell title="用户id" :center="true" value-class="font-color">{{
        userId
      }}</van-cell>
      <van-cell title="昵称" :center="true" value-class="font-color">
        <div class="nickName-content">
          <van-field
            v-model="accountInfo.nickName"
            class="field-box"
            placeholder="输入名称"
            maxlength="6"
            input-align="right"
          >
          </van-field>
        </div>
      </van-cell>
      <van-cell title="性别" :center="true">
        <van-radio-group v-model="accountInfo.gender" direction="horizontal">
          <van-radio name="1">男</van-radio>
          <van-radio name="2">女</van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell
        title="生日"
        :center="true"
        :value="accountInfo.birthday"
        value-class="font-color"
        @click="showDateSelect = true"
      ></van-cell>
      <van-calendar
        v-model="showDateSelect"
        @confirm="sureDate()"
        :min-date="minDate"
        :max-date="maxDate"
      ></van-calendar>
      <van-cell title="签名" :center="true" value-class="font-color">
        <div class="desc-box">
          <div class="desc-content">
            <van-field
              v-model="accountInfo.signature"
              rows="1"
              autosize
              type="textarea"
              placeholder="输入个人签名"
              maxlength="11"
              input-align="right"
            />
          </div>
        </div>
      </van-cell>
    </div>
    <div class="account-btn">
      <van-button color="#505050" round size="large" @click="save()"
        >保存当前信息</van-button
      >
    </div>
  </div>
</template>

<script>
import '../assets/less/Account.less'
import { formatDuring } from '../assets/js/formatDuring'
import areaList from '../assets/js/area'
export default {
  name: 'Account',
  data() {
    return {
      // 用户id
      userId: 0,
      // 用户头像
      userImg: '',
      // 是否显示日期选择
      showDateSelect: false,
      // 日期时间戳
      birthday: '',
      // 最小日期
      minDate: new Date(2021, 0, 1),
      // 最大日期
      maxDate: new Date(2021, 11, 31),
      // 用户信息
      accountInfo: {
        // 昵称
        nickName: '',
        // 生日
        birthday: '',
        // 性别
        gender: '1',
        // 省份id
        province: '',
        // 城市id
        city: '',
        // 用户签名
        signature: '',
      },
    }
  },
  created() {
    // 登录
    this.login()
  },
  methods: {
    sureDate() {
      this.showDateSelect = false
      this.accountInfo.birthday = formatDuring.dateDuring(this.birthday)
    },
    // 登录
    login() {
      let phone = localStorage.getItem('_phone')
      let password = localStorage.getItem('_password')
      this.userId = localStorage.getItem('_userID')
      this.accountInfo.nickName = localStorage.getItem('_nickname')
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: '/login/cellphone?timestamp=1503019930000',
        params: {
          phone: phone,
          password: password,
        },
      })
        .then((result) => {
          this.$toast.clear()
          this.userImg = result.data.profile.avatarUrl
          this.birthday = result.data.profile.birthday
          this.accountInfo.birthday = formatDuring.dateDuring(this.birthday)
          this.accountInfo.gender = `${result.data.profile.gender}`
          this.accountInfo.province = result.data.profile.province
          this.accountInfo.city = result.data.profile.city
          this.accountInfo.signature = result.data.profile.signature
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 上传用户头像
    uploadUserImg(file) {},

    // 保存信息
    save() {
      this.accountInfo.gender = Number(this.accountInfo.gender)
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      // 发起登录请求
      this.axios({
        method: 'GET',
        url: 'user/update',
        params: {
          gender: this.accountInfo.gender,
          birthday: this.birthday,
          nickname: this.accountInfo.nickName,
          province: this.accountInfo.province,
          city: this.accountInfo.city,
          signature: this.accountInfo.signature,
        },
      })
        .then((result) => {
          this.$toast.clear()
          // localStorage.setItem('nickName')
        })
        .catch((err) => {
          this.$toast.clear()
        })
    },
    // 返回上一页
    back() {
      this.$router.go(-1)
    },
  },
}
</script>
