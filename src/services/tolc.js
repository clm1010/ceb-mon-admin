import { request, config } from '../utils'
import { message } from 'antd'

const { tolc } = config.api

export async function getLogToken(params) {
	let userinfor = {
		"di_uname":"k00157",
		"di_pwd": "X44@EsaC"
	}
	return request({
		url: `${tolc}/restlogin`,
		method: 'post',
		data: userinfor
	})
}

export async function getaskID(params) {
	params.time.start = params.time.start || 0
	params.time.end = params.time.end || new Date().getTime()
	// if(params.q && params.q !=""){
	// 	params.q = '| where ' + params.q
	// }
	let paramsObj = {}
	if(params.message && params.message!=''){
		paramsObj = {
			"params": {
				"refreshCache": false,
				"stageSize": 5000
			},
			// "dsl": `es \"_tolc-u2-applog-%{YYYY.MM},tolc-app-ump-oplog-%{YYYY.MM}\" --query=\"(* ) AND (@timestamp:[0 TO ${time}])\"| where name == \"${params.name}\"`
			"dsl": `es \"${params.indexs}\" --query=\"(${params.message} ) AND (@timestamp:[${params.time.start} TO ${params.time.end}])\" ${params.q ? params.q : ''} | sort ts desc`
		}
	}else{
		paramsObj = {
			"params": {
				"refreshCache": false,
				"stageSize": 5000
			},
			// "dsl": `es \"_tolc-u2-applog-%{YYYY.MM},tolc-app-ump-oplog-%{YYYY.MM}\" --query=\"(* ) AND (@timestamp:[0 TO ${time}])\"| where name == \"${params.name}\"`
			"dsl": `es \"${params.indexs}\" --query=\"(* ) AND (@timestamp:[${params.time.start} TO ${params.time.end}])\" ${params.q ? params.q : ''} | sort ts desc`
		}
	}

	return request({
		url:  `${tolc}/explorer/query/`,
		method: 'post',
		data: paramsObj
	})
}

export async function gettaskState(params) {
	return request({
		url: `${tolc}/explorer/query/${params.content.id}`,
		method: 'get',
	})
}

export async function getData(params) {
	params.page.from = params.page.from || 0
	params.page.size = params.page.size || 100

	return request({
		url: `${tolc}/explorer/query/${params.content.id}/result/${params.page.from}/${params.page.size}`,
		method: 'get',
	})
}

/**
 * 参数：
 * 1.索引 index ； 
 * 2.参数 q；
 * 3.时间 time；
 * 4.分页 page ；
 */

export async function getTOLCdata(params) {
	// 登录
	const user = await getLogToken()
	if (user.code == 1) {
		// 保持token值，之后接口调用使用
		sessionStorage.setItem('TOLCToken', user.token)
		// 提交查询的请求获取任务id
		const taskID = await getaskID(params)
		if (taskID.status == 'success') {
			//	通过任务id来获取任务状态
			let taskState = ''
			//  异步循环 判断任务是否完成
			while (taskState != 'SUCCESS') {
				let aaa = await gettaskState(taskID)
				taskState = aaa.content.state
				if (taskState == 'ERROR' || taskState == 'TERMINATED') {
					message.error("任务执行失败")
					return
				}
			}
			//	任务完成后，通过id和分页信息获取结果
			// const data = await getData(taskID)
			return await getData(Object.assign({},taskID,params))
		} else {
			message.error("任务执行失败")
		}
	} else {
		message.error("登录TOCL失败")
	}
}