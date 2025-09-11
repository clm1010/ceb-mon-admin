import { request, config } from '../utils'

const { userinfo, roles, authadd, authdelete } = config.api

export async function query (params) {
	let id = ''

	if (params != undefined) {
		if (typeof (params.id) !== 'undefined') {
			id = params.id
			params = ''
		}
	}

	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
  return request({
    url: userinfo + id,
    method: 'get',
    data: newdata,
  })
}

export async function queryALL (params) {
  let id = ''

  if (params != undefined) {
    if (typeof (params.id) !== 'undefined') {
      id = params.id
      params = ''
    }
  }

  let newdata = {}
  if (params && params.q === '') {
    newdata = {
      page: (params.page ? params.page : 0),
      pageSize: (params.pageSize ? params.pageSize : 10),
    }
  } else {
    newdata = { ...params }
  }
  newdata.sort = 'name,asc'
  return request({
    url: `${userinfo}all`,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: userinfo,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: userinfo,
    method: 'delete',
    data: params.payload,
  })
}

export async function update (params) {
  return request({
    url: userinfo + params.id,
    method: 'patch',
    data: params,
  })
}
//角色查询
export async function rolequery (params) {
//return request({
//  url: roles,
//  method: 'get',
//  data: params,
//})
	let newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 500),
		}
//	if(params && params.q === ''){
//		newdata = {
//			page:(params.page ? params.page : 0),
//			pageSize:(params.pageSize ? params.pageSize : 10000000),
//		}
//	} else {
//		newdata = {...params}
//	}

  return request({
    url: roles,
    method: 'get',
    data: newdata,
  })
}
export async function findById (params) {
	return request({
		url: userinfo + params.uuid,
		method: 'get',
	})
}
export async function authAdd (params) {
  return request({
    url: authadd,
    method: 'post',
    data: params.payload,
  })
}
export async function authDelete (params) {
  return request({
    url: authdelete,
    method: 'post',
    data: params.payload,
  })
}