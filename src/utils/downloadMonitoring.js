import Cookie from './cookie'

export default function download (options) {
  let {
    method = 'get',
    url,
  } = options
  let cookie = new Cookie('cebcookie')
  let Authorization = 'Bearer ' + cookie.getCookie()
  let Url = url
  let xmlResquest = new XMLHttpRequest()
  xmlResquest.open(method, Url, true)
  xmlResquest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
  xmlResquest.setRequestHeader('Authorization', Authorization)
  xmlResquest.responseType = 'blob'
  xmlResquest.onload = function () {
    let content = xmlResquest.response
    let elink = document.createElement('a')
    elink.download = 'eval.xlsx'
    elink.style.display = 'none'
    let blob = new Blob([content])
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    document.body.removeChild(elink)
  }
  xmlResquest.send()
}
