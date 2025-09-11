import { request, config } from '../utils'
const { umdbs } = config.api

export async function query(params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}

	newdata.sort = 'mainCluster,desc'
	// console.log(99, newdata, params)
	return request({
		url: umdbs,
		method: 'get',
		data: newdata,
	})
}
export async function create(params) {
	return request({
		url: umdbs,
		method: 'post',
		data: params,
	})
}

export async function remove(params) {
	return request({
		url: umdbs,
		method: 'delete',
		data: params.payload,
	})
}

export async function update(params) {
	return request({
		url: umdbs + params.uuid,
		method: 'PATCH',
		data: params,
	})
}
export async function findById(params) {
	return request({
		url: umdbs + params.uuid,
		method: 'get',
	})
}
export async function dubbo(params) {
	return request({
		url: umdbs + 'getSqlServiceStatus',
		method: 'post',
	})
}