import { request, config } from '../../utils'

const { applications } = config.api

export async function queryapps (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10000),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  	return request({
    		url: applications,
    		method: 'get',
    		data: newdata,
  	})
}

export async function createapps (params) {
  	return request({
    		url: applications,
    		method: 'post',
    		data: params,
  	})
}

export async function removeapps (params) {
  	return request({
    		url: applications,
    		method: 'delete',
    		data: params,
  	})
}

export async function updateapps (params) {
  	return request({
    		url: applications + params.uuid,
    		method: 'patch',
    		data: params,
  	})
}
export async function deleteapps (params) {
  return request({
    url: applications + params.uuid,
    method: 'delete',
    data: params,
  })
}
