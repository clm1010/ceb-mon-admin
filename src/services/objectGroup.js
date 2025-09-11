import { request, config } from '../utils'

const { objectGroups, objectsMO } = config.api

export async function query (params) {
  return request({
    url: objectGroups,
    method: 'get',
    data: params,
  })
}
