import { request, config } from '../utils'

const { zabbixItemsGroups } = config.api

export async function query (params) {
  return request({
    url: zabbixItemsGroups,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: `${zabbixItemsGroups}?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: zabbixItemsGroups + params,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: `${zabbixItemsGroups}{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}
