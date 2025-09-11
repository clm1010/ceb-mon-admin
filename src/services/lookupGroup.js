import { request, config } from '../utils'

const { lookupGroups, lookup } = config.api

export async function query (params) {
  	return request({
	    url: lookupGroups,
	    method: 'post',
	    data: params,
  	})
}

export async function create (params) {
	return request({
	    url: `${lookup}a/`,
	    method: 'post',
	    data: params,
	})
}

export async function remove (params) {
  	return request({
	    url: `${lookup}d/`,
	    method: 'delete',
	    data: params,
  	})
}

export async function update (params) {
  	return request({
	    url: `${lookup}u/`,
	    method: 'PATCH',
	    data: params,
  	})
}
