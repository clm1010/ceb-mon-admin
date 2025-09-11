import { request, config } from '../utils'

const { mtsGroups } = config.api

export async function query (params) {
  return request({
    url: mtsGroups,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: `${mtsGroups}?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: mtsGroups + params,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: `${mtsGroups}{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}
