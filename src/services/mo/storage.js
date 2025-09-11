import { request, config } from '../../utils'

const { storages } = config.api

//查询存储设备
export async function query (params) {
	let newDate = {
		q: params.q ? params.q : '',
		page: params.page ? params.page : 0,
		pageSize: params.pageSize ? params.pageSize : 10,
		/* firstClass: params.firstClass ? params.firstClass : '',
		secondClass: params.secondClass ? params.secondClass : '',
		thirdClass: params.thirdClass ? params.thirdClass : '', */
	}
	return request({
    	url: storages,
    	method: 'get',
    	data: newDate,
  	})
}

//批量删除存储设备
export async function remove (params) {
	return request({
		url: storages,
		method: 'delete',
		data: params.uuid,
	})
}

//更新存储设备
export async function update (params) {
	return request({
		url: storages + params.uuid,
		method: 'patch',
		data: params,
	})
}

//增加存储设备
export async function create (params) {
	return request({
		url: storages,
		method: 'post',
		data: params,
	})
}

//获取单个存储设备
export async function findById (params) {
	return request({
		url: storages + params.uuid,
		method: 'get',
//		data: params,
	})
}
