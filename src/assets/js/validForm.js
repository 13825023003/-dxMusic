import Vue from 'vue'

// 导入提示组件
import { Toast } from 'vant'

// 注册提示组件

Vue.use(Toast)

// 表单验证脚本
class ValidForm {
    constructor() {}
        // 验证 注册表单方法
    valid(obj) {
        for (let key in obj) {
            if (!obj[key].reg.test(obj[key].value)) {
                // 提示错误信息
                Toast(obj[key].errorMsg);
                // 表单验证不通过
                return false
            }
        }
        return true;
    }
}

// 导出表单验证模块实例
export const validForm = new ValidForm()