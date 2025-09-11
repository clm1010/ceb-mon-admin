import { request, config } from '../utils'

const { eventviews } = config.api


export async function queryAllViews (params) {
	let data = {
		current: 0,
		page: 0,
    pageSize: 99999,
    q: params.q || '',
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

export async function queryViewer (params) {
  return request({
    url: eventviews + params.oelViewer,
    method: 'get',
  })
}
