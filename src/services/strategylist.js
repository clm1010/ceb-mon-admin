import { request, config } from '../utils'

const { strategylist } = config.api

export async function query (params) {
  let newdata = {}
  if (newdata) {
    newdata.pageSize = params.pageSize ? params.pageSize : 10
    newdata.page = params.page ? params.page : 0
  }
  newdata.parentUUID = params.q
  return request({
    url: strategylist,
    method: 'get',
    data: newdata,
  })
}
