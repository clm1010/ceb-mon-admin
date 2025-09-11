import { request, config } from '../utils'
import download from '../utils/download'
const { stdindicators, stdindicatorsGroups, policyInstance ,dlIndicator,zabbixItemsinfo} = config.api

export async function query (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			groupUUID: (params.groupUUID ? params.groupUUID : ''),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
  return request({
    url: stdindicators,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: stdindicators,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: stdindicators,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: stdindicators + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function MoveTo (params) {
  return request({
    url: `${stdindicatorsGroups}move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo (params) {
  return request({
    url: `${stdindicatorsGroups}copy-to`,
    method: 'post',
    data: params,
  })
}


export async function queryPolicies (params) {
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
    url: `${stdindicators + uuid}/policies`,
    method: 'get',
    data: val,
  })
}


export async function queryTemplates (params) {
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
    url: `${stdindicators + uuid}/policy-templates`,
    method: 'get',
    data: val,
  })
}

export async function queryMOS (params) {
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
    url: `${stdindicators + uuid}/mos`,
    method: 'get',
    data: val,
  })
}

//根据策略实例uuid获取对应的监控工具实例
export async function queryToolsInstance (parms) {
	let uuids = ''
	if (parms && parms.uuids) {
		uuids = parms.uuids
	}
	return request({
    url: `${policyInstance + uuids}/tool-instances`,
    method: 'get',
    data: parms,
  })
}

export async function findById (params) {
	return request({
		url: stdindicators + params.uuid,
		method: 'get',
	})
}
export async function onDown(params) {
	let param = ''
	if(params && params.q && params.groupUUID){
		param ='?q='+ encodeURIComponent(params.q) + '&groupUUID=' + params.groupUUID
	}else if(params && params.q){
		param ='?q='+ encodeURIComponent(params.q)
	}else if(params && params.groupUUID!=''){
		param ='?groupUUID=' + params.groupUUID
	}
  return download({
    //url:stdIO + 'export' +param,
	url:dlIndicator +param ,
    method: 'get',
    data: params
  })
}

export async function queryZabbixItem (params) {
	let newdata = {}
	newdata.q = `stdIndicator.name=='${params.name}'`
	newdata.sort = 'name,asc'
	return request({
		url: zabbixItemsinfo,
		method: 'get',
		data : newdata
	})
}