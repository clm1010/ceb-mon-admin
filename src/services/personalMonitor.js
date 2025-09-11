import { request, config } from '../utils'

const { specialPolicy,label ,stdindicators,toolLable,personalCurve} = config.api


export async function create(params) {
  return request({
    url: specialPolicy,
    method: 'post',
    data: params,
  })
}

export async function remove(params) {
  return request({
    url: specialPolicy,
    method: 'delete',
    data: params,
  })
}
export async function update(params) {
  return request({
    url: specialPolicy + params.uuid,
    method: 'patch',
    data: params,
  })
}
export async function query(params) {
  return request({
    url: specialPolicy,
    method: 'get',
    data: params,
  })
}
export async function findById(params) {
  return request({
    url: specialPolicy + params.uuid,
    method: 'get',
  })
}
export async function queryTag(params) {
  if(params.q){
    params.q +=';group.name == 监控对象'
  }else{
    params.q ='group.name == 监控对象'
  }
  params.pageSize = params.pageSize ? params.pageSize : 20
  return request({
    url: label,
    method: 'get',
    data: params,
  })
}
export async function queryIndicator(params) {
  if(params.q){
    params.q +=';group.name == Prometheus'
  }else{
    params.q ='group.name == Prometheus'
  }
  params.pageSize = params.pageSize ? params.pageSize : 20
  return request({
    url: stdindicators,
    method: 'get',
    data: params,
  })
}

export async function ToolLable(params){
  return request({
    url: toolLable,
    method: 'post',
    data: params,
  })
}

export async function PersonalCurve(params){
  return request({
    url: personalCurve,
    method: 'post',
    data: params,
  })
}