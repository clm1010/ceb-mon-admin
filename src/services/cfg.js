import { request, config } from '../utils'

const { cfgs } = config.api

export async function query (params) {
  return request({
    url: `${cfgs + params.uuid}/cfgs`,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: `${cfgs + params.parentId}/cfgs`,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: `${cfgs + params.parentId}/cfgs/${params.uuid}`,
    method: 'delete',
    data: params,
  })
}

export async function allremove (params) {
  let ids = []
  if (params && params.ids) {
	  ids = params.ids
  }
  return request({
    url: `${cfgs + params.toolId}/cfgs/`,
    method: 'delete',
    data: ids,
  })
}

export async function update (params) {
  return request({
    url: `${cfgs + params.parentId}/cfgs/${params.uuid}`,
    method: 'patch',
    data: params,
  })
}

export async function policynum (params) {
  return request({
    url: `${cfgs + params.uuid}/policy-num`,
    method: 'get',
    data: params,
  })
}
