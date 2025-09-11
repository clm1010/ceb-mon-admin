import { request, config } from '../utils'

const { dataDictItem } = config.api

export async function query (params) {
  let newdata = {}

  let q = ''
  if (params.searchDict && params.searchDict !== undefined) {
    q += `dict.uuid=='${params.searchDict.uuid}'`
  }
  if (params.searchDictItemName && params.searchDictItemName !== '') {
    if (q.length > 0) {
      q += ` and name=='*${params.searchDictItemName}*'`
    } else {
      q += `name=='*${params.searchDictItemName}*'`
    }
  }

  newdata = {
    page: (params.page ? params.page : 0),
    pageSize: (params.pageSize ? params.pageSize : 10),
    q,
    sort: 'sortOrder,asc',
  }

  return request({
    url: dataDictItem,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: dataDictItem,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: `${dataDictItem}${params.payload}`,
    method: 'delete',
  })
}

export async function batchRemove (params) {
  return request({
    url: dataDictItem,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: dataDictItem + params.id,
    method: 'patch',
    data: params,
  })
}

export async function findById (params) {
  return request({
    url: dataDictItem + params,
    method: 'get',
  })
}
