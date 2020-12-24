import Vue from 'vue'
// 导入ajax
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

// 登录验证脚本
class Login {
    constructor() {}
        // 验证 登录状态方法
    login(phone, password) {
        // 发起登录请求
        this.axios({
                method: 'GET',
                url: '/login/cellphone',
                params: {
                    phone: phone,
                    password: password,
                },
            })
            .then((result) => {})
            .catch((err) => {

            })
            // 验证登录状态
        this.axios({
                method: 'GET',
                url: '/login/status',
            }).then((result) => {

            })
            .catch((err) => {

            })
    }
}

// 导出表单验证模块实例
export const login = new Login()