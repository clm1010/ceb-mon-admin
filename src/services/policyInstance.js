import { request, config } from '../utils'

const {
 policyInstance, timePeriods, stdindicators, policyTemplet, objectSwitch, outside, monitorRules,
} = config.api

export async function query (params) {
	let id = ''
	if (typeof (params.id) !== 'undefined') {
		id = params.id
		params = ''
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
    url: policyInstance + id,
    method: 'get',
    data: newdata,
  })
}

export async function queryIndicators (params) {
	let id = ''
	if (params === undefined) {
		id = ''
	} else {
		let current = 0
		let pageSize = 10
		let q = ''
		if (params.current !== undefined) {
			current = params.current - 1
		}
		if (params.pageSize !== undefined) {
			pageSize = params.pageSize - 1
		}
		id = `?page=${current}&pageSize=${pageSize}`
	}

  return request({
    url: stdindicators + id,
    method: 'get',
    data: params,
  })
}

export async function stdquery (params) {
  return request({
    url: stdindicators,
    method: 'get',
    data: params,
  })
}
export async function queryTemplat (params) { //模板详情
  return request({
    url: policyTemplet + params.uuid,
    method: 'get',
    //data: params,
  })
}
export async function queryobInfo (params) { //监控对象
  return request({
    url: objectSwitch,
    method: 'get',
    data: params,
  })
}
export async function queryobjMos (params) { //监控对象续
  return request({
    url: `${policyInstance + params.uuid}/mos`,
    method: 'get',
    data: params,
  })
}
export async function stdDescquery (params) {
  return request({
    url: stdindicators + params,
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
    url: policyInstance,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: policyInstance,
    method: 'delete',
    data: params,
  })
}

export async function issue (params) {
  return request({
    url: `${policyInstance}issue-by-objects`,
    method: 'post',
    data: params,
  })
}
export async function update (params) {
	let uuid = params.id
//	delete params.collectParams.uuid
	//delete params.monitorParams.uuid
	//delete params.monitorParams.ops.uuid
	//delete params.id
	//if(params.monitorParams.ops.length !== 0){
		//params.monitorParams.ops.forEach((item)=>{
			//delete item.uuid
		//})
	//}
  return request({
    url: policyInstance + uuid,
    method: 'patch',
    data: params,
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
    url: `${policyInstance + uuid}/mos`,
    method: 'get',
    data: val,
  })
}

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

//策略实例分组-------------start
export async function queryGroup (params) {
  return request({
    url: `${policyInstance}groups/`,
    method: 'get',
    data: params,
  })
}

export async function createGroup (params) {
  return request({
    url: `${policyInstance}groups/` + `?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function removeGroup (params) {
  return request({
    url: `${policyInstance}groups/${params}`,
    method: 'delete',
    data: params,
  })
}

export async function updateGroup (params) {
  return request({
    url: `${policyInstance}groups/` + `{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}

export async function viewStrategy (params) {
	const newData = {
		 criteria: 'branch == TY',
  		 moCriteria: `uuid==${params.uuid}`,
  		 ruleCriteria: 'branch == TY',
	}
	return request({
		url: `${monitorRules}preview/`,
		method: 'post',
		data: newData,
	})
}
