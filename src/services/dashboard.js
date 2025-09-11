import { request, config,request_t } from '../utils'
import { findIndex } from '../utils/FunctionTool'
const {
  api,
} = config
const {
  dashboard,
  performance,
  performanceproxy,
  npmLog,
} = api

export async function query (params) {
  return request({
    url: dashboard,
    method: 'get',
    data: params,
  })
}

export async function queryLos (params) {
	// let now = new Date().getTime()
	// let nowYear = new Date(now).getFullYear()
	// let nowMon = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
	// let second = now - 2592000000
	// let secondYear = new Date(second).getFullYear()
	// let secondMon = new Date(second).getMonth() >= 9 ? `${new Date(second).getMonth() + 1}` : `0${new Date(second).getMonth() + 1}`
	// let three = second - 2592000000
	// let threeYear = new Date(three).getFullYear()
	// let threeMon = new Date(three).getMonth() >= 9 ? `${new Date(three).getMonth() + 1}` : `0${new Date(three).getMonth() + 1}`
	// let paths = performanceproxy + '/u2performance-2019.12.14/_search/'
	// if(new Date(now).getMonth() === 0 && new Date(now).getHours() < 8){
	//     paths = `${performanceproxy}/u2performance-${secondYear}.${secondMon}*,u2performance-${threeYear}.${threeMon}*/_search/`
	// }else{
	//     paths = `${performanceproxy}/u2performance-${nowYear}.${nowMon}*,u2performance-${secondYear}.${secondMon}*,u2performance-${threeYear}.${threeMon}*/_search/`
	// }
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

export async function queryHours (params) {
	// let now = new Date().getTime()
	// let nowYear = new Date(now).getFullYear()
	// let nowMon = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
	// let second = now - 2592000000
	// let secondYear = new Date(second).getFullYear()
	// let secondMon = new Date(second).getMonth() >= 9 ? `${new Date(second).getMonth() + 1}` : `0${new Date(second).getMonth() + 1}`
	// let three = second - 2592000000
	// let threeYear = new Date(three).getFullYear()
	// let threeMon = new Date(three).getMonth() >= 9 ? `${new Date(three).getMonth() + 1}` : `0${new Date(three).getMonth() + 1}`
	// let paths = ''
	// if(new Date(now).getMonth() === 0 && new Date(now).getHours() < 8){
	//     paths = `${performanceproxy}/u2hourperformance-${secondYear}.${secondMon}\\*,u2hourperformance-${threeYear}.${threeMon}\\*/_search/`
	// }else{
	//     paths = `${performanceproxy}/u2hourperformance-${nowYear}.${nowMon}\\*,u2hourperformance-${secondYear}.${secondMon}\\*,u2hourperformance-${threeYear}.${threeMon}\\*/_search/`
	// }
  //let paths = `${performanceproxy}/u2hourperformance-${nowYear}.${nowMon}\\*,u2hourperformance-${secondYear}.${secondMon}\\*,u2hourperformance-${threeYear}.${threeMon}\\*/_search/`
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
//u2config
export async function queryConfig (params) {
  let path = ''
	let now = new Date().getTime()
	let secoend = now-86400000
	let secoendYear = new Date(secoend).getFullYear()
	let secoendMon = new Date(secoend).getMonth() >= 9 ? `${new Date(secoend).getMonth() + 1}` : `0${new Date(secoend).getMonth() + 1}`
	let secoendDay = new Date(secoend).getDate() >= 10 ? `${new Date(secoend).getDate()}` : `0${new Date(secoend).getDate()}`

	let year = `${new Date(now).getFullYear()}`
	let mons = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
	let day = new Date(now).getDate() >= 10 ? `${new Date(now).getDate()}` : `0${new Date(now).getDate()}`
	if(new Date(now).getHours() <= 8){
	    path = `${performanceproxy}/u2config-${year}.${mons}.${day},u2config-${secoendYear}.${secoendMon}.${secoendDay}/_search/`
	}else{
	    path = `${performanceproxy}/u2config-${year}.${mons}.${day}/_search/`
	}
  return request({
    url: path,
    method: 'post',
    data: params,
  })
}
//按天的索引
export async function queryByDay (params) {
  let path = ''
	let now = new Date().getTime()
	let secoend = now-86400000
	let secoendYear = new Date(secoend).getFullYear()
	let secoendMon = new Date(secoend).getMonth() >= 9 ? `${new Date(secoend).getMonth() + 1}` : `0${new Date(secoend).getMonth() + 1}`
	let secoendDay = new Date(secoend).getDate() >= 10 ? `${new Date(secoend).getDate()}` : `0${new Date(secoend).getDate()}`

	let year = `${new Date(now).getFullYear()}`
	let mons = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
	let day = new Date(now).getDate() >= 10 ? `${new Date(now).getDate()}` : `0${new Date(now).getDate()}`
	if(new Date(now).getHours() <= 8){
	    path = `${performanceproxy}/u2performance-${year}.${mons}.${day},u2performance-${secoendYear}.${secoendMon}.${secoendDay}/_search/`
	}else{
	    path = `${performanceproxy}/u2performance-${year}.${mons}.${day}/_search/`
	}
  return request({
    url: path,
    method: 'post',
    data: params,
  })
}
//按天的索引
export async function queryByDay1 (params) {
  let time = params.query.bool.must
  let clock
  time.forEach(item => {
    if(item.range && item.range.clock){
      clock = item.range.clock
    }
  })
  if(!clock.lt){
    clock.lt = Date.parse(new Date())/1000
  }
  let path = findIndex(clock.gt*1000,clock.lt*1000,'u2performance-', 'day', `${performanceproxy}`)//按时间生成索引
  return request({
    url: path,
    method: 'post',
    data: params,
  })
}
//npmLog日志
export async function queryNpmLog (params) {
  let now = new Date().getTime()
  let secoend = now-86400000
  let secoendYear = new Date(secoend).getFullYear()
  let secoendMon = new Date(secoend).getMonth() >= 9 ? `${new Date(secoend).getMonth() + 1}` : `0${new Date(secoend).getMonth() + 1}`
  let secoendDay = new Date(secoend).getDate() >= 10 ? `${new Date(secoend).getDate()}` : `0${new Date(secoend).getDate()}`

  let year = `${new Date(now).getFullYear()}`
  let mons = new Date(now).getMonth() >= 9 ? `${new Date(now).getMonth() + 1}` : `0${new Date(now).getMonth() + 1}`
  let day = new Date(now).getDate() >= 10 ? `${new Date(now).getDate()}` : `0${new Date(now).getDate()}`

  console.log(`${performanceproxy}/npm-${params.path}-${year}${mons}${day}/_search/`)
  return request({
    url: `${performanceproxy}/npm-${params.path}-${year}${mons}${day},npm-${params.path}-${secoendYear}${secoendMon}${secoendDay}/_search/`,
    method: 'post',
    data: params.queryLog,
  })
}


//
export async function queryUyun (params) {
	return request({
		url: params.paths,
		method: 'post',
		data: params.sql
	})	
}
//
export async function queryES (params) {
	return request({
		url: performanceproxy + params.paths,
		method: 'post',
		data: params.es
	})	
}
// 
export async function queryMES (params) {
	return request_t({
		url: performanceproxy + params.paths,
		method: 'post',
		data: params.es
	})	
}