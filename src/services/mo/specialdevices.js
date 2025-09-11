import { request, config } from '../../utils'
const { SpecialDevices } = config.api

export async function create (params) {
  	return request({
    	url: SpecialDevices,
    	method: 'post',
    	data: params,
  	})
}

export async function remove (params) {
  	return request({
    	url: SpecialDevices,
    	method: 'delete',
    	data: params.uuid,
  	})
}

export async function update (params) {
  	return request({
    	url: SpecialDevices + params.uuid,
    	method: 'patch',
    	data: params,
  	})
}

export async function query (params) {
	return request({
	    url: SpecialDevices,
	    method: 'get',
	    data: params,
	})
}

export async function findById (params) {
	return request({
		url: SpecialDevices + params.uuid,
		method: 'get',
		//data: params,
	})
}
