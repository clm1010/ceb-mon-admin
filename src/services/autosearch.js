import { request, config } from '../utils'

import download from '../utils/download'
const { testapi, clusertapi,namespaceapi ,serviceapi,monitorapi,monitorSuffix , monitorExport,monitorProject,evaluate} = config.api

export async function query (params) {
  params.pageSize = params.pageSize ? params.pageSize : 10
  params.page = params.page ? params.page : 0
  params.sort = 'appName,desc'
  return request({
    url: testapi + `/?page=${params.page}&pageSize=${params.pageSize}&sort=appName,asc`,
    // url: testapi,
    method: 'post',
    data: params.qContion,
  })
}
export async function projectquery (params) {
  return request({
    url: monitorProject,
    method: 'post',
    data: params,
  })
}
export async function clusertquery (params) {
  return request({
    url: clusertapi,
    method: 'post',
    data: params,
  })
}
export async function namespacequery (params) {
  return request({
    url: namespaceapi,
    method: 'post',
    data: params,
  })
}
export async function servicequery (params) {
  return request({
    url: serviceapi,
    method: 'post',
    data: params,
  })
}
export async function monitorTagquery (params) {
  return request({
    url: monitorapi,
    method: 'get',  
    data: params,
  })
}

export async function querySuffix (params) {
  return request({
    url: monitorSuffix,
    method: 'get',  
    data: params,
  })
}

export async function onDown (params) {
  return download({
    url: monitorExport + `?parentCode=${params.parentCode}`,
    method: 'get',  
    data: params,
  })
}

export async function calculatorProject (params) {
  return request({
    url: evaluate + `?project=${params.project}`,
    method: 'get', 
  })
}
