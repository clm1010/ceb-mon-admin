import { request, config } from '../utils'

const { tools, toolcheck } = config.api

export async function query (params) {
	let id = ''

	if (typeof (params.uuid) !== 'undefined') {
		id = params.uuid
		params = ''
	}

	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
  return request({
    url: tools + id,
    method: 'get',
    data: newdata,
  })
}

export async function getToolById (params) {
  return request({
    url: tools + params.uuid,
    method: 'get',
  })
}

export async function create (params) {
  return request({
    url: tools,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: tools,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: tools + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function check (params) {
  return request({
    url: toolcheck,
    method: 'get',
    data: params,
  })
}

export async function queryToolsURL (params) {
  	return request({
	    url: tools,
	    method: 'get',
	    data: params,
  	})
}
