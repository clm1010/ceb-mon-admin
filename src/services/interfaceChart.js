import { request, config } from '../utils'
const { performance, performanceproxy } = config.api

export async function queryInterfaceInfo (params) {
  let now, year, mons, day
  let arry = []
  let moments = new Date().getTime()
  // if( new Date(moments).getHours() < 8 ){
  //   moments = new Date().getTime() - 86400000
  // }else {
  //   moments = new Date().getTime()
  // }
  for(let i = 0; i<=7; i++){
    now = moments - 86400000*i
    year = `${new Date(now).getFullYear()}`
    mons = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
    day = new Date(now).getDate() >= 10 ? `${new Date(now).getDate()}` : `0${new Date(now).getDate()}`
    arry.push(`u2performance-${year}.${mons}.${day}`)
  }

  let paths = `${performanceproxy}`+`/${arry.join(',')}/_search/`
  return request({
    url: paths,
    method: 'post',
    data: params,
  })
}

export async function queryInterfaceHours (params) {

  let now, year, mons, day
  let arry = []
  let moments = new Date().getTime()
  if( new Date(moments).getHours() < 8 ){
    moments = new Date().getTime() - 86400000
  }else {
    moments = new Date().getTime()
  }
  for(let i = 0; i<=14; i++){
    now = moments - 86400000*i
    year = `${new Date(now).getFullYear()}`
    mons = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
    day = new Date(now).getDate() >= 10 ? `${new Date(now).getDate()}` : `0${new Date(now).getDate()}`
    arry.push(`u2hourperformance-${year}.${mons}.${day}`)
  }

  let paths = `${performanceproxy}`+`/${arry.join(',')}/_search/`
  return request({
    url: paths,
    method: 'post',
    data: params,
  })
}

export async function queryInterface (params) {
	return request({
		url: performanceproxy + params.paths,
		method: 'post',
		data: params.es
	})	
}

export async function querybase (params) {
	return request({
		url: '/network/performance/minute/base',
    method: 'get',
    data: params
	})	
}
