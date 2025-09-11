import Cookie from './cookie'
function download(options,callback) {
  let {
    method = 'get',
    data,
    url,
  } = options
  let cookie = new Cookie('cebcookie')
  // 文件下载Authorization的判断
  let Authorization = 'Bearer ' + cookie.getCookie()
  if (url.includes("fileAssistantAPI") || url.includes("flinkapi")) {
    Authorization = `Basic dXNlcjpDaGluYUA5MzA5MjA=`
  }
  //    let Url = `${url}?q=${encodeURIComponent(data.q)}`
  let xmlResquest = new XMLHttpRequest()
  xmlResquest.open(method, url, true)
  xmlResquest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
  xmlResquest.setRequestHeader('Authorization', Authorization)
  xmlResquest.responseType = 'blob'
  xmlResquest.onload = function (oEvent) {
    let content = xmlResquest.response
    let elink = document.createElement('a')
    //elink.download = `${data.filename}.xlsx`
    // let fileName = (data.filename.match(/\.csv$/) || data.filename.match(/\.pptx$/)) ? data.filename : `${data.filename}.xlsx`;
    // 获取请求头的信息
    // let headersMes = xmlResquest.getResponseHeader("Content-Disposition").split(";")
    let fileName = data.filename.includes(".") ? data.filename : `${data.filename}.xlsx`;
    elink.download = fileName;
    elink.style.display = 'none'
    let blob = new Blob([content])
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    callback && callback()
    document.body.removeChild(elink)
  }
  xmlResquest.send()
}

export default download
