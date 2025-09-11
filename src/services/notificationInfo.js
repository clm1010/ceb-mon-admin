import { request, config } from '../utils'

const { notificationInfo } = config.api

export async function query (params) {
  return request({
    url: notificationInfo,
    method: 'get',
    data: params,
  })
}
