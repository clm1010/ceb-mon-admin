import { request, config } from '../../utils'

const { branchip } = config.api

export async function querybranchips (params) {
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
    		url: branchip,
    		method: 'get',
    		data: newdata,
  	})
}

export async function createbranchips (params) {
  	return request({
    		url: branchip,
    		method: 'post',
    		data: params,
  	})
}
/*
 * 批量删除
 */
export async function removebranchips (params) {
  	return request({
    		url: branchip,
    		method: 'delete',
    		data: params,
  	})
}

export async function updatebranchips (params) {
  	return request({
    		url: branchip + params.uuid,
    		method: 'patch',
    		data: params,
  	})
}
/*
 * 删除单个资源
 */
export async function deletebranchips (params) {
  return request({
    url: branchip + params.uuid,
    method: 'delete',
    data: params,
  })
}
