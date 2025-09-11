import { request, config } from '../utils'

const { trackTimer } = config.api

export async function query (params) {
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
    url: trackTimer,
    method: 'get',
    data: newdata,
  })
}


export async function create (params) {
  return request({
    url: trackTimer,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: trackTimer,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: trackTimer + params.uuid,
    method: 'patch',
    data: params,
  })
}
