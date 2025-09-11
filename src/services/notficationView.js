import { request, config } from '../utils'

const { notfications } = config.api

export async function query(params) {
  params.sort = 'firstOccurrence,asc'
  return request({
    url: notfications,
    method: 'get',
    data: params,
  })
}

export async function userReadStats(params) {
  return request({
    url: notfications + 'userReadStats',
    method: 'get',
    data: params,
  })
}
