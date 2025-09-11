import { request, config } from '../utils'

const {
 roles, userinfo, objectsMO, permission, nes,
} = config.api

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
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'

  return request({
    url: roles + id,
    method: 'get',
    data: newdata,
  })
}
export async function getRole (params) {
	let newdata = { uuid: params.uuid }

  return request({
    url: roles + params.uuid,
    method: 'get',
    data: newdata,
  })
}
export async function queryMO (uuids) {
	 let q = ''
	 if (uuids.length === 1) {
	 	 q = `uuid==${uuids[0]}`
	 } else {
	 	 q = `uuid==${uuids[0]}`
	 	 uuids.forEach((item, index) => {
	 		  if (index !== 0) {
	 			   q = `${q} or uuid==${item}`
	 		  }
	   })
	 }

	 let newdata = {
			page: 0,
			pageSize: 100,
			q,
		}
  return request({
    url: `${objectsMO}all`,
    method: 'get',
    data: newdata,
  })
}
export async function queryUser (params) {
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
		}
	} else {
		newdata = { ...params }
	}

  return request({
    url: userinfo + id,
    method: 'get',
    data: newdata,
  })
}
export async function create (params) {
  return request({
    url: roles,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: roles,
    method: 'delete',
    data: params.payload,
  })
}

export async function update (params) {
  return request({
    url: roles + params.id,
    method: 'patch',
    data: params,
  })
}

export async function currentUserPermissions (params) {
  return request({
    url: `${permission}current-user`,
    method: 'get',
    data: params,
  })
}

export async function allPermissions (params) {
	let newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 100),
		}
  return request({
    url: permission,
    method: 'get',
    data: newdata,
  })
}

export async function findById (params) {
	return request({
		url: roles + params.uuid,
		method: 'get',
	})
}

export async function findMOS (params) {
	return request({
		url: nes + params.value,
		method: 'get',
	})
}
