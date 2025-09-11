import { request, config } from '../utils'
import download from '../utils/download'

const { dataDict, dldataDict } = config.api

export async function queryAll () {
  return request({
    url: `${dataDict}list`,
    method: 'get',
  })
}

export async function query (params) {
  params.sort = 'sortOrder,desc'
  params.page = 0
  params.pageSize = 999

  return request({
    url: dataDict,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: dataDict,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: `${dataDict}${params.id}`,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: `${dataDict}${params.uuid}`,
    method: 'patch',
    data: params,
  })
}

export async function findById (params) {
  return request({
    url: dataDict + params.uuid,
    method: 'get',
  })
}

//导出
export async function onDown(params) {
  let param = ('' !== params.q) ? ('?q=' + encodeURIComponent(params.q)) : '';
  //let param = ('' !== params.q) ? ('?q=' + params.q) : ''
  
  return download({
    url: dldataDict + param,
    method: 'get',
    data: params
  })
}
