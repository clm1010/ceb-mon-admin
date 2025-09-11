import { request, config } from '../utils'

const { jobs } = config.api

//查询
export async function query (params) {
  params.sort = 'submitTime,desc'
  return request({
    url: jobs,
    method: 'get',
    data: params,
  })
}

//查询单个任务
export async function findById (params) {
  return request({
    url: jobs + params.uuid,
    method: 'get'
  })
}

//查看任务下发详情
export async function jobDetail (params) {
  return request({
    url: jobs +'detail/'+ params.uuid,
    method: 'get'
  })
}

//删除接口
export async function deleteJobs (params) {
  return request({
    url: jobs ,
    method: 'delete',
    data: params
  })
}
