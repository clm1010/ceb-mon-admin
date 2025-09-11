import { request, config } from '../utils'
import download from '../utils/download'
const { zabbixItemsinfo, zabbixItemsGroups, stdindicators ,dlIndicatorImpl} = config.api

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
    if(newdata.q && newdata.q.includes('filters_filterItems_value---')){
			newdata.q = newdata.q.replace(/filters_filterItems_value---/g, 'filters.filterItems.value')
		}
	}
	newdata.sort = 'name,asc'
  return request({
    url: zabbixItemsinfo,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: zabbixItemsinfo,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: zabbixItemsinfo,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: zabbixItemsinfo + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function MoveTo (params) {
  return request({
    url: `${zabbixItemsGroups}move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo (params) {
  return request({
    url: `${zabbixItemsGroups}copy-to`,
    method: 'post',
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

export async function findById (params) {
	return request({
		url: zabbixItemsinfo + params.uuid,
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
    //url:zabbixIO +'export' +param,
    url:dlIndicatorImpl+param,
    method: 'get',
    data: params
  })
}