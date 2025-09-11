import { request, config } from '../utils'

const { objects } = config.api

export async function query (params) {
  return request({
    url: objects,
    method: 'get',
    data: params,
  })
}
