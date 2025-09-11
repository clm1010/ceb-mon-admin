import { request, config } from '../utils'

const { objectsMO, osts, jobs } = config.api

//查询监控对象
export async function queryMO (params) {
  return request({
    url: objectsMO,
    method: 'get',
    data: params,
  })
}

//查询告警
export async function queryAlarms (params) {
  let data = {
    filtername: '网络_环路告警',
    page: (params.page ? params.page : 0),
    pageSize: (params.pageSize && params.pageSize !== 0 ? params.pageSize : 100),
  }
  return request({
    url: osts + 'byfiltername',
    method: 'get',
    data: data
  })
}

//提交下发IP
export async function issuIPs (params) {
  return request({
    url: 'http://192.168.0.158:9010/api/v1/jobs/poller/issue',
    method: 'post',
    data: params
  })
}
