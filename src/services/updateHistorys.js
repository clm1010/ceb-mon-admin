import { request, config } from '../utils'

const { UpdateHistorys } = config.api

export async function query (params) {
  return request({
    url: UpdateHistorys,
    method: 'get',
    data: params,
  })
}
