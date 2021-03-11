import { download } from './download'
class downloadFile {
  constructor() {}
  downloadFile(url, strFileName, strMimeType) {
    let xmlHttp = new XMLHttpRequest()
    if (xmlHttp != null) {
      xmlHttp.open('get', url, true)
      xmlHttp.responseType = 'blob' //关键
      xmlHttp.send()
      //   设置回调函数
      xmlHttp.onreadystatechange = doResult
    }
    function doResult() {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          download.download(xmlHttp.response, strFileName, strMimeType)
          console.log(111)
        }
      }
    }
  }
}
export const myDownloadFile = new downloadFile()
