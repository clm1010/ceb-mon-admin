import { request, config } from '../../utils'

const { servers } = config.api

export async function queryservers (params) {
	let newdata = {}
	if (params && params.q == '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10000),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  	return request({
    		url: servers,
    		method: 'get',
    		data: newdata,
  	})
}

export async function createservers (params) {
  	return request({
    		url: servers,
    		method: 'post',
    		data: params,
  	})
}

export async function removeservers (params) {
  	return request({
    		url: servers,
    		method: 'delete',
    		data: params,
  	})
}

export async function updateservers (params) {
  	return request({
    		url: servers + params.uuid,
    		method: 'patch',
    		data: params,
  	})
}

export async function deleteservers (params) {
  return request({
    url: servers + params.uuid,
    method: 'delete',
    data: params,
  })
}
