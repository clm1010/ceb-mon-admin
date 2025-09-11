import { request, config } from '../utils'

const { label } = config.api

export async function query (params) {
	let id = ''
	if (typeof (params.id) !== 'undefined') {
		id = params.id
		params = ''
	}
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			groupUUID: (params.groupUUID ? params.groupUUID : ''),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
  return request({
    url: label + id,
    method: 'get',
    data: newdata,
  })
}
export async function create(params) {
    return request({
        url: label,
        method: 'post',
        data: params,
    })
}
export async function update(params) {
    let uuid = params.id
    return request({
        url: label + uuid,
        method: 'patch',
        data: params,
    })
}
export async function remove(params) {
    return request({
        url: label,
        method: 'delete',
        data: params,
    })
}

export async function queryGroup (params) {
    return request({
      url: `${label}groups`,
      method: 'get',
      data: params,
    })
  }
  
  export async function createGroup (params) {
    return request({
      url: `${label}groups/` + `?parentUUID=${params.parentUUID}`,
      method: 'post',
      data: params,
    })
  }
  
  export async function removeGroup (params) {
    return request({
      url: `${label}groups/${params}`,
      method: 'delete',
      data: params,
    })
  }

  export async function updateGroup (params) {
    return request({
      url: `${label}groups/` + `{uuid}?uuid=${params.uuid}`,
      method: 'post',
      data: params,
    })
  }

  export async function enable (params) {
    return request({
      url:  `${label}enable`,
      method: 'post',
      data: params,
    })
  }

  export async function disable (params) {
    return request({
      url: `${label}disable`,
      method: 'post',
      data: params,
    })
  }
  