import { request, config } from '../utils'

const { indexlist, indexinfo } = config.api

export async function query (params) {
  let newdata = {}
  if (newdata) {
    newdata.pageSize = params.pageSize ? params.pageSize : 10
    newdata.page = params.page ? params.page : 0
  }
  newdata.parentUUID = params.q
  return request({
    url: indexlist,
    method: 'get',
    data: newdata,
  })
}

export async function queryindexinfo (params) {
  // let newdata = {}
  // newdata.kpiUUID = params.kpiUUID
  // newdata.parentUUID = params.appCode
  return request({
    url: indexinfo + params.kpiUUID,
    method: 'get',
    //   data : newdata,
  })
}

