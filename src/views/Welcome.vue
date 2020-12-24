<template>
  <div class="welcome">
    <div class="welcome-content">
      <div class="img-box">
        <img src="../assets/image/音乐.png" alt="" class="auto-img" />
      </div>
      <div class="welcome-text">
        <div class="name">大轩音乐</div>
        <div class="enname">welcome to daxuan music</div>
      </div>
      <div class="welcome-button">
        <van-button round type="info" size="large" @click="goLogin"
          >登录</van-button
        >
        <van-button round type="info" size="large" @click="goRegister"
          >注册</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  methods: {
    goLogin() {
      this.$router.push({ name: 'Login' })
    },
    goRegister() {
      this.$router.push({ name: 'Register' })
    },
  },
}
</script>

<style lang="less" scoped>
.welcome {
  background: url('../assets/image/login-bg.jpg') no-repeat center center;
  background-size: cover;
  padding-bottom: 50px;
  .welcome-content {
    padding-top: 200px;
    padding-bottom: 100px;
  }
  .img-box {
    width: 100px;
    height: 100px;
    margin: auto;
  }
  .welcome-text {
    text-align: center;
    width: 200px;
    color: white;
    margin: 10px auto;
  }
  .name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .welcome-button {
    width: 250px;
    margin: 20px auto;
    font-size: 18px;
    font-weight: bold;
  }
  .van-button {
    &:first-child {
      border: #1c1c1c;
      background-color: #1c1c1c;
      border-radius: 30px;
      margin-bottom: 20px;
    }
    &:last-child {
      border: 2px solid #1c1c1c;
      background-color: transparent;
      border-radius: 30px;
    }
  }
}
</style>
