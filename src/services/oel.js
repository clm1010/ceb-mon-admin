import { request, config } from '../utils'

const { eventviews } = config.api


export async function queryAllViews (params) {
	let data = {}
	if (params.q === undefined || params.q === '') {
		data = {
    	pageSize: 9999999999,
    }
	} else {
		data = {
			q: params.q,
    	pageSize: 9999999999,
    }
	}
  return request({
    url: eventviews,
    method: 'get',
    data,
  })
}

export async function create (params) {
  return request({
    url: eventviews,
    method: 'post',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url: eventviews,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: eventviews + params.uuid,
    method: 'patch',
    data: params,
  })
}
