import { request, config } from '../utils'

const { osts } = config.api

export async function queryAllosts (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
	}

  return request({
    url: osts,
    method: 'get',
    data,
  })
}

export async function creates (params) {
  return request({
    url: osts,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: osts,
    method: 'delete',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: osts + params.uuid,
    method: 'patch',
    data: params,
  })
}
export async function query (params) {
  return request({
    url: osts,
    method: 'get',
    data: params,
  })
}
export async function findById (params) {
	return request({
		url: osts + params.uuid,
		method: 'get',
	})
}
export async function queryBySql (params) {
  return request({
    url: `${osts}query`,
    method: 'get',
    data: params,
  })
}
