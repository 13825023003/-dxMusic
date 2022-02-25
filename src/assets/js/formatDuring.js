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
    Object.keys(obj)
      .filter((key) => arr.includes(key))
      .forEach((key) => {
        result[key] = obj[key]
      })
    return result
  }
  // 字符串转化为对象
  parseStrObjByRegExp(strDes) {
    let obj = {}
    strDes.replace(/(\w+)(?:=([^;]*))?/g, (str, key, value) => {
      obj[key] = value
    })
    return obj
  }
//   函数防抖
debounce(fn,delay){
    let ctx;
    let args;
    let timer = null;

    let later = () =>{
        fn.apply(ctx,args)
        ///当事件真正执行后,清空定时器
        timer = null
    }

    return function(){
        ctx = this;
        args = arguments;
        // 当持续触发事件时,若发现事件触发的定时器已设置时,则清除之前的定时器
        if(timer){
            clearTimeout(timer);
            timer = null;
        }
        // 重新设置事件触发的定时器
        timer = setTimeout(later,delay)
    }
}
}
// 导出表单验证模块实例
export const formatDuring = new FormatDuring()
