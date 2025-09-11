import { request, config } from '../utils'

const {
  applications, objectsMO, nes, maintenanceTemplet, appCategories, mtreviewer,mt_instances
} = config.api

export async function query(params) {
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
    url: maintenanceTemplet + id,
    method: 'get',
    data: newdata,
  })
}

export async function create(params) {
  return request({
    url: maintenanceTemplet,
    method: 'post',
    data: params,
  })
}

export async function remove(params) {
  return request({
    url: maintenanceTemplet,
    method: 'delete',
    data: params.payload,
  })
}

export async function update(params) {
  return request({
    url: maintenanceTemplet + params.id,
    method: 'patch',
    data: params,
  })
}


export async function queryGroup(params) {
  return request({
    url: `${maintenanceTemplet}groups/`,
    method: 'get',
    data: params,
  })
}

export async function createGroup(params) {
  return request({
    url: `${maintenanceTemplet}groups/` + `?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function removeGroup(params) {
  return request({
    url: `${maintenanceTemplet}groups/${params}`,
    method: 'delete',
    data: params,
  })
}

export async function updateGroup(params) {
  return request({
    url: `${maintenanceTemplet}groups/` + `{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}


export async function queryPorts(params) {
  let newdata = {}
  if (params && params.q === '') {
    newdata = {
      page: (params.page ? params.page : 0),
      pageSize: (params.pageSize ? params.pageSize : 10),
    }
  } else {
    newdata = { ...params }
  }

  let uuid = params.uuid
  if (uuid === undefined) {
    uuid = params.selectHostuuid
  }
  return request({
    url: `${nes + uuid}/intfs`,
    method: 'get',
    data: newdata,
  })
}

export async function queryQita(params) {
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
    url: objectsMO,
    method: 'get',
    data: newdata,
  })
}

export async function queryAppInCmdb (params) {
	params.pageSize = 100
  	return request({
    		url: appCategories,
    		method: 'get',
    		data: params,
  	})
}

export async function queryApp(params) {
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
    url: appCategories,
    method: 'get',
    data: newdata,
  })
}

export async function MoveTo(params) {
  return request({
    url: `${maintenanceTemplet}groups/move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo(params) {
  return request({
    url: `${maintenanceTemplet}groups/copy-to`,
    method: 'post',
    data: params,
  })
}

export async function findById(params) {
  return request({
    url: maintenanceTemplet + params.uuid,
    method: 'get',
  })
}

export async function queryReviewer(params) {
  return request({
    url: mtreviewer,
    method: 'get',
    data: params,
  })
}

export async function batchInstance(params) {
  return request({
    url: mt_instances,
    method: 'post',
    data: params,
  })
}