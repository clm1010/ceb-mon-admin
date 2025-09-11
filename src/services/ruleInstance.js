import { request, config } from '../utils'

const { ruleInstance, monitorRules ,forbidIssu,promTree} = config.api

export async function query (params) {
	let id = ''

	if (typeof (params.uuid) !== 'undefined') {
		id = params.uuid
		params = ''
	}

	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'mo.discoveryIP,name,asc'
  return request({
    url: ruleInstance,
    method: 'get',
    data: newdata,
  })
}
export async function queryManual (params) {
	let id = ''

	if (typeof (params.uuid) !== 'undefined') {
		id = params.uuid
		params = ''
	}

	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}

  return request({
    url: `${ruleInstance}manual-instances`,
    method: 'get',
    data: newdata,
  })
}
export async function create (params) {
  return request({
    url: ruleInstance,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: ruleInstance,
    method: 'delete',
    data: params,
  })
}
export async function MoveTo (params) {
  return request({
    url: `${ruleInstance}groups/move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo (params) {
  return request({
    url: `${ruleInstance}groups/copy-to`,
    method: 'post',
    data: params,
  })
}
export async function queryMonitorInstanceById (params) {
  return request({
    url: ruleInstance + params.uuid,
    method: 'get',
  })
}
export async function createMonitorInstance (params) {
  return request({
    url: ruleInstance,
    method: 'post',
    data: params,
  })
}
export async function updateMonitorInstance (params) {
  return request({
    url: ruleInstance + params.uuid,
    method: 'patch',
    data: params,
  })
}

//监控实例数弹窗
export async function queryInfsrule (params) {
  let uuid = ''
	let val = {}
	if (params) {
		uuid = params.uuid
		if (params.page) {
			val = { ...val, page: params.page }
		}
		if (params.pageSize) {
			val = { ...val, pageSize: params.pageSize }
		}
	}
  	return request({
    		url: `${monitorRules + uuid}/instances`,
    		method: 'get',
		data: val,
  	})
}

//网络域的下发接口
export async function issue (params) {
	return request({
    url: `${monitorRules}issue`,
    method: 'post',
    data: params,
  })
}

//APM下发接口
export async function apmIssue (params) {
	return request({
    url: `${monitorRules}issue/apm`,
    method: 'post',
    data: params,
  })
}

//分布式下发接口
export async function DCSIssue (params) {
  let url = `${monitorRules}issue/distributed`
  if(params.incr){
    url = `${monitorRules}issue/distributed?incr=${params.incr}`
  }
  let newParams = params
  delete newParams.incr
	return request({
    url: url,
    method: 'post',
    data: newParams,
  })
}

//
//非网络域的下发接口
export async function issueMo (params) {
	return request({
    url: `${ruleInstance}issue`,
    method: 'post',
    data: params,
  })
}
//
export async function queryGroup (params) {
  return request({
    url: `${ruleInstance}groups/`,
    method: 'get',
    data: params,
  })
}

export async function createGroup (params) {
  return request({
    url: `${ruleInstance}groups/` + `?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function removeGroup (params) {
  return request({
    url: `${ruleInstance}groups/${params}`,
    method: 'delete',
    data: params,
  })
}

export async function errorInfsrule (params) {
	return request({
		url: `${ruleInstance + params.uuid}/issuestatus`,
		method: 'get',
		data: params,
	})
}

export async function updateGroup (params) {
  return request({
    url: `${ruleInstance}groups/` + `{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}
export async function onforbid (params) {
  return request({
    url: forbidIssu+params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function queryState (params) {
  return request({
    url: forbidIssu,
    method: 'get',
  })
}

//查询分布式下发层级
export async function queryDCSlevel (params) {
  return request({
    url: promTree,
    method: 'get',
  })
}