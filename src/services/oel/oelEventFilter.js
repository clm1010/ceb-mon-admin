import { request, config } from '../../utils'

const { oelEventFilter } = config.api

export async function queryAllFilters (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
    sort: 'name,desc',
	}

  return request({
    url: oelEventFilter,
    method: 'get',
    data,
  })
}

export async function queryById (params) {
  return request({
    url: oelEventFilter + params.oelFilter,
    method: 'get',
  })
}

export async function query (params) {
  if (params.q) {
    params.q.sort = 'name,desc'
  }
  return request({
    url: oelEventFilter,
    method: 'get',
    data: params.q,
  })
}

export async function create (params) {
  return request({
    url: oelEventFilter,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: oelEventFilter + params.uuid,
    method: 'delete',
    data: params,
  })
}

export async function removeall (params) {
  return request({
    url: oelEventFilter,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: oelEventFilter + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function MoveTo (params) {
  return request({
    url: `${zabbixItemsGroups}move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo (params) {
  return request({
    url: `${zabbixItemsGroups}copy-to`,
    method: 'post',
    data: params,
  })
}

