import { request, config } from '../../utils'

const { middleWares } = config.api

export async function querymws (params) {
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
    		url: middleWares,
    		method: 'get',
    		data: newdata,
  	})
}

export async function createmws (params) {
  	return request({
    		url: middleWares,
    		method: 'post',
    		data: params,
  	})
}

export async function removemws (params) {
  	return request({
    		url: middleWares,
    		method: 'delete',
    		data: params,
  	})
}

export async function updatemws (params) {
  	return request({
    		url: middleWares + params.uuid,
    		method: 'patch',
    		data: params,
  	})
}
export async function deletemws (params) {
  return request({
    url: middleWares + params.uuid,
    method: 'delete',
    data: params,
  })
}
