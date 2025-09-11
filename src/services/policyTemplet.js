import { request, config } from '../utils'
import download from '../utils/download'
const {
 policyTemplet, timePeriods, stdindicators, policyInstance,dlTemplate,tools
} = config.api

export async function query (params) {
	let id = ''
	if (typeof (params.id) !== 'undefined') {
		id = params.id
	}

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
    url: policyTemplet + id,
    method: 'get',
    data: newdata,
  })
}
 export async function stdquery (params) {
  return request({
    url: stdindicators,
    method: 'get',
    data: params,
  })
}

export async function queryTime () {
  return request({
    url: timePeriods,
    method: 'get',
    data: {
    	pageSize: 9999999999,
    },
  })
}

export async function create (params) {
  return request({
    url: policyTemplet,
    method: 'post',
    data: params,
  })
}

export async function search (params) {
  return request({
    url: tools,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: policyTemplet,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: policyTemplet + params.id,
    method: 'patch',
    data: params,
  })
}

export async function MoveTo (params) {
  return request({
    url: `${policyTemplet}groups/move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo (params) {
  return request({
    url: `${policyTemplet}groups/copy-to`,
    method: 'post',
    data: params,
  })
}

export async function Formula (params) {
  return request({
    url: `${policyTemplet}prom-formula`,
    method: 'post',
    data: params,
  })
}

export async function Perfdata (params) {
  return request({
    url: `${tools}perf-data`,
    method: 'post',
    data: params,
  })
}

export async function queryGroup (params) {
  return request({
    url: `${policyTemplet}groups/`,
    method: 'get',
    data: params,
  })
}

export async function createGroup (params) {
  return request({
    url: `${policyTemplet}groups/` + `?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function removeGroup (params) {
  return request({
    url: `${policyTemplet}groups/${params}`,
    method: 'delete',
    data: params,
  })
}

export async function updateGroup (params) {
  return request({
    url: `${policyTemplet}groups/` + `{uuid}?uuid=${params.uuid}`,
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
    url: `${policyTemplet + uuid}/policies`,
    method: 'get',
    data: val,
  })
}

/*
export async function queryMOS (params) {

	let uuid = ''
	let val = {}
	if(params){
		uuid = params.uuid
		if(params.page){
			val = {...val,page:params.page}
		}
		if(params.pageSize){
			val = {...val,pageSize:params.pageSize}
		}
	}

  return request({
    url: policyTemplet + uuid + '/mos',
    method: 'get',
    data: val,
  })
}*/

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
		url: policyTemplet + params.uuid,
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
    //url:policyTempletIO+'export' +param,
    url: dlTemplate+param,
    method: 'get',
    data: params
  })
}
