import { request, config } from '../utils'

const { stdindicatorsGroups } = config.api

export async function query (params) {
  return request({
    url: stdindicatorsGroups,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: `${stdindicatorsGroups}?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: stdindicatorsGroups + params,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: `${stdindicatorsGroups}{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}
