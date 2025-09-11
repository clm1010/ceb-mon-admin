import axios from 'axios'
import qs from 'qs'
import { YQL, CORS, sessionTime } from './config'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import Cookie from './cookie'
import {ozr} from './clientSetting'
import otherToken from './otherToken'
const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
  		if (e.message !== 'Expected "0" to be defined') {
  			message.error(e.message)
  		}
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  let fbRoute = '';
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }
  let cookie = new Cookie('cebcookie')
  //如果是登陆的请求，则不加token串
	if (options.url.indexOf('/api/v1/users/login') === -1 && options.url.indexOf('/api/v1/users/iam-sso') === -1 && options.url.indexOf('/_search/') === -1 
      && options.url.indexOf('api/forest/v1') === -1 && options.url.indexOf('/datainsight/') === -1 && options.url.indexOf('/ump_cpaas/') === -1 && 
      options.url.indexOf('/journa/') === -1) {
		//axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
    axios.defaults.headers.common.Authorization = `Bearer ${cookie.getCookie()}`
    fbRoute = window.location.pathname;
 } else if (options.url.indexOf('/_search/')!=-1){
  	axios.defaults.headers.common.Authorization = ozr('esUser')
    fbRoute = '';
  }else if (options.url.indexOf('api/forest/v1')!=-1){
  	axios.defaults.headers.common.Authorization = otherToken.ODA_token
    fbRoute = '';
  }else if (options.url.indexOf('/datainsight/')!=-1){
  	axios.defaults.headers.common.Authorization =  `Bearer ${sessionStorage.getItem('TOLCToken')}`
    fbRoute = '';
  }else if (options.url.indexOf('/ump_cpaas/')!=-1){
  	axios.defaults.headers.common.Authorization =  otherToken.Cpass_token
    fbRoute = '';
  }else {
		axios.defaults.headers.common.Authorization = ''
	}
  /*指明请求头是UTF-8*/if (options.url.indexOf('/api/v1/users/iam-sso') !== -1) {
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  }

	//如果localStorge里没有时间戳，则写入
  if (!sessionStorage.getItem('lastReqTime')) {
  	sessionStorage.setItem('lastReqTime', new Date().getTime())
    localStorage.setItem('lastReqTime',sessionStorage.getItem('lastReqTime'))
  }
  //否则，获取当前时间戳，减去lastReqTime，如果大于设定值，则跳转登录页面，否则，写入
  else {
  	let lastReqTime = sessionStorage.getItem('lastReqTime') > localStorage.getItem('lastReqTime') ? sessionStorage.getItem('lastReqTime') : localStorage.getItem('lastReqTime')
    // let lastReqTime = sessionStorage.getItem('lastReqTime')
  	let currReqTime = new Date().getTime()
  	let gap = currReqTime - lastReqTime

  	//如果时间差超过会话时间，则跳转登录页面
  	if (gap >= sessionTime) {
  		//本地清除lastReqTime
      //sessionStorage.removeItem('lastReqTime') or
  		sessionStorage.clear()
  		cookie.delCookie()
  		//跳转登录页面
  		window.location = `${location.origin}`
  		return
  	}
  	//如果小于会话时间，则刷新lastReqTime

  		sessionStorage.setItem('lastReqTime', currReqTime)
      localStorage.setItem('lastReqTime',sessionStorage.getItem('lastReqTime'))
        cookie.setCookie(cookie.getCookie(), sessionTime)
    
    // for user behaviour analysis
    if ('' !== fbRoute) {
      // check if new window orno session
      if (!window.name || ('' === window.name) || isNaN(parseInt(sessionStorage.getItem('sessionSeq')))) {
        let r = Math.ceil(Math.random()*1000);
        sessionStorage.setItem('sessionId',currReqTime + '' + r);
        sessionStorage.setItem('sessionSeq','0');
        window.name = 'reload';
      } 
      // adding pathname to header
      axios.defaults.headers['fb-route'] = fbRoute;
      // adding session-id & session-seq to header
      sessionStorage.setItem('sessionSeq',parseInt(sessionStorage.getItem('sessionSeq'))+1);
      axios.defaults.headers['session-id'] = sessionStorage.getItem('sessionId');
      axios.defaults.headers['session-seq'] = sessionStorage.getItem('sessionSeq');
    } else {
      if ('fb-route' in axios.defaults.headers) delete axios.defaults.headers['fb-route'];
      if ('session-id' in axios.defaults.headers) delete axios.defaults.headers['session-id'];
      if ('session-seq' in axios.defaults.headers) delete axios.defaults.headers['session-seq'];
    }
 }

  return fetch(options).then((response) => {
    const { statusText, status } = response

    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data

    if (data.constructor === Array) {
      data = { arr: data }
    }
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    const { response } = error
    let msg
    let status
    let otherData = {}

    if (response) {
      const { data, statusText } = response
      otherData = data
      //如果返回的存在refreshToken，则更新本地token，重新发起请求
      if (data.refreshToken) {
        sessionStorage.setItem('token', data.refreshToken)
        request(options)
      }
      status = response.status
      msg = data.message || data.msg
    } else {
      status = 600
      msg = 'Network Error'
    }
    //if (response.data.error !== 'Unauthorized' && response.data.path !== '/api/v1/users/current') {
    	//message.error(msg)
    //}
    return {
 success: false, status, message: msg, ...otherData,
}
  })
}
