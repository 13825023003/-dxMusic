class FormatDuring {
    constructor() {}
        // 毫秒转换
    formatDuring(mss) {
            mss = parseInt(mss)
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
            let seconds = Math.floor((mss % (1000 * 60)) / 1000)
            seconds = seconds > 9 ? seconds : '0' + seconds
            minutes = minutes > 9 ? minutes : '0' + minutes
            return minutes + ':' + seconds
        }
        // 秒转换
    secondDuring(mss) {
            mss = parseInt(mss)
            let minutes = Math.floor(mss / 60)
            let seconds = mss % 60
            seconds = seconds > 9 ? seconds : '0' + seconds
            minutes = minutes > 9 ? minutes : '0' + minutes
            return minutes + ':' + seconds
        }
        // 毫秒转换为年月日
    dateDuring(mss) {
            let date = new Date(mss)
            let year = date.getFullYear()
            let mount = date.getMonth() + 1
            let day = date.getDate()
            return year + '年' + mount + '月' + day + '日'
        }
        // 过滤对象
    filterObj(obj, arr) {
        let result = {}
        Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
            result[key] = obj[key]
        })
        return result
    }
}
// 导出表单验证模块实例
export const formatDuring = new FormatDuring()