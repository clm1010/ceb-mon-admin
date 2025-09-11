import { request, config } from '../../utils'
const { tservers } = config.api

export async function create (params) {
  	return request({
    	url: tservers,
    	method: 'post',
    	data: params,
  	})
}

export async function remove (params) {
  	return request({
    	url: tservers,
    	method: 'delete',
    	data: params.uuid,
  	})
}

export async function update (params) {
  	return request({
    	url: tservers + params.uuid,
    	method: 'patch',
    	data: params,
  	})
}

export async function query (params) {
	return request({
	    url: tservers,
	    method: 'get',
	    data: params,
	})
}

export async function findById (params) {
	return request({
		url: tservers + params.uuid,
		method: 'get',
	})
}
