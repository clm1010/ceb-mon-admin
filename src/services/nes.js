import { request, config } from '../utils'

const {
 policyInstance, timePeriods, indicators, nes, objectsMO,
} = config.api

export async function query (params) {
	let uuid = ''
	let policyType = ''
	let val = {}
	if (params) {
		uuid = params.policyInstanceId
		policyType = params.policyType
		if (params.page) {
			val = { ...val, page: params.page }
		}
		if (params.pageSize) {
			val = { ...val, pageSize: params.pageSize }
		}
	}

  return request({
    url: `${nes + uuid}/policies?type=${policyType}`,
    method: 'get',
	data: val,
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
    url: indicators + id,
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
  return request({
    url: policyInstance + params.id,
    method: 'patch',
    data: params,
  })
}

/*
	获取网元 对应的接口信息
*/
export async function queryInfs (params) {
  	let neUUID = ''
	let val = {}
	if (params) {
		neUUID = params.neUUID
		if (params.page) {
			val = { ...val, page: params.page }
		}
		if (params.pageSize) {
			val = { ...val, pageSize: params.pageSize }
		}
	}
  	return request({
   		url: `${nes + neUUID}/intfs`,
    		method: 'get',
		data: val,
  	})
}

/*
	网元获取信息（交换机、路由器、防火墙、负载均衡）
*/
export async function nesquery (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			firstClass: (params.firstClass ? params.firstClass : ''),
			secondClass: (params.secondClass ? params.secondClass : ''),
			thirdClass: (params.thirdClass ? params.thirdClass : ''),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  return request({
    url: nes,
    method: 'get',
    data: newdata,
  })
}

/*
	网元获取信息（交换机、路由器、防火墙、负载均衡）
*/
export async function interfacequery (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			firstClass: (params.firstClass ? params.firstClass : ''),
			secondClass: (params.secondClass ? params.secondClass : ''),
			thirdClass: (params.thirdClass ? params.thirdClass : ''),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  return request({
    url: nes,
    method: 'get',
    data: newdata,
  })
}

export async function nescreate (params) {
  return request({
    url: nes,
    method: 'post',
    data: params,
  })
}

export async function nesupdate (params) {
  return request({
    url: nes + params.uuid,
    method: 'patch',
    data: params,
  })
}
//删除单个资源
export async function nesdelete (params) {
  return request({
    url: nes + params.uuid,
    method: 'delete',
  })
}
//批量删除资源
export async function nesdeleteAll (params) {
  return request({
    url: nes,
    method: 'delete',
    data: params,
  })
}

export async function nesIntfscreate (params) {
  return request({
    url: `${nes + params.belongsTo.uuid}/intfs`,
    method: 'post',
    data: params,
  })
}

export async function nesIntfsupdate (params) {
  return request({
    url: `${nes + params.belongsTo.uuid}/intfs/${params.uuid}`,
    method: 'patch',
    data: params,
  })
}

//删除单个接口
export async function nesIntfsdelete (params) {
  return request({
    url: `${nes + params.belongsTo.uuid}/intfs/${params.uuid}`,
    method: 'delete',
    data: params,
  })
}
//批量删除接口
export async function nesIntfsdeleteAll (params) {
  return request({
    url: `${nes}intfs/`,
    method: 'delete',
    data: params,
  })
}

export async function nesquerys (params) {
//	console.log('nesquery params : ', params.neUUID)
  	return request({
    		url: nes + params.neUUID,
    		method: 'get',
    		data: params,
  	})
}
//查询单个设备下的所有接口
export async function allInterfs (params) {
	let newdata = {}
	newdata = {
		...params,
		page: 0,
    pageSize: 10000,
	}

	newdata.sort = 'snmpIndex,asc'

	return request({
		url: `${nes + params.uuid}/intfs`,
		method: 'get',
		data: newdata,
	})
}

//查询单个设备下的所有接口---性能部分使用
export async function allInterfsDeatil (params) {
	let newdata = {}
	newdata = {
		...params,
		page: (params.page ? params.page : 0),
		pageSize: (params.pageSize ? params.pageSize : 10),
	}
	delete newdata.uuid
	newdata.sort = 'snmpIndex,asc'

	return request({
		url: `${nes + params.uuid}/intfs`,
		method: 'get',
		data: newdata,
	})
}

//获取单个接口的信息
export async function findInterfsByuuid (params) {
	return request({
		url: objectsMO + params.uuid,
		method: 'get',
	})
}
