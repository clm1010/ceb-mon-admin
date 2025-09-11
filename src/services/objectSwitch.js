import { request, config } from '../utils'

const { objectSwitch } = config.api

export async function query (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			groupUUID: (params.groupUUID ? params.groupUUID : ''),
		}
	} else {
		newdata = { ...params }
	}
  return request({
    url: objectSwitch,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: objectSwitch,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: objectSwitch,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: objectSwitch + params.uuid,
    method: 'patch',
    data: params,
  })
}
