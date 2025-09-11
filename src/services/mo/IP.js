import { request, config } from '../../utils'
const { IP } = config.api

export async function create (params) {
  	return request({
    	url: IP,
    	method: 'post',
    	data: params,
  	})
}

export async function remove (params) {
  	return request({
    	url: IP,
    	method: 'delete',
    	data: params.uuid,
  	})
}

export async function update (params) {
  	return request({
    	url: IP + params.uuid,
    	method: 'patch',
    	data: params,
  	})
}

export async function query (params) {
	return request({
	    url: IP,
	    method: 'get',
	    data: params,
	})
}

export async function findById (params) {
	return request({
		url: IP + params.uuid,
		method: 'get',
		//data: params,
	})
}
