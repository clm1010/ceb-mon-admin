import { request, config } from '../utils'
const { ReportFunctions, NodeReports } = config.api

export async function create (params) {
  	return request({
    	url: ReportFunctions,
    	method: 'post',
    	data: params,
  	})
}

export async function remove (params) {
  	return request({
    	url: ReportFunctions,
    	method: 'delete',
    	data: params.uuid,
  	})
}

export async function update (params) {
  	return request({
    	url: `${ReportFunctions + params.id}/reportfunction`,
    	method: 'patch',
    	data: params,
  	})
}

export async function query (params) {
	if (params.q !== '' && params.q) {
		params.q += ';url!=null'
	} else {
		params.q = 'url!=null'
	}
	return request({
	    url: ReportFunctions,
	    method: 'get',
	    data: params,
	})
}

export async function queryTree (params) {
	return request({
	    url: `${ReportFunctions}gaintreemenu`,
	    method: 'get',
	    data: params,
	})
}

export async function findById (params) {
	return request({
		url: `${ReportFunctions + params.id}/reportfunction`,
		method: 'get',
	})
}

export async function nodeQuery (params) {
	if (params.id === undefined || params.id === '') {
		params.id = '8a81873851ab439f015262b8abcf0001'
	}
	if (params.template === undefined || params.template === '') {
		params.template = 'week'
	}
	return request({
		url: `${NodeReports}?keyword=${params.id}&template=${params.template}`,
		method: 'get',
	})
}
