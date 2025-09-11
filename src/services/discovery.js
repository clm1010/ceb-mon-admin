import { request, config } from '../utils'

const { discovery } = config.api

export async function query (params) {
	let id = ''

	if (typeof (params.uuid) !== 'undefined') {
		id = params.uuid
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
	newdata.sort = 'branch,asc'

  return request({
    url: discovery + "info/show/",
    method: 'get',
    data: newdata,
  })
}

export async function queryDiscoveryInfo (params) {
  let id = ''

  if (typeof (params.uuid) !== 'undefined') {
    id = params.uuid
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
  newdata.sort = 'branch,asc'

  return request({
    url: discovery + "info/",
    method: 'get',
    data: newdata,
  })
}

export async function queryOnInfo (params) {
  let id = ''

  if (typeof (params.uuid) !== 'undefined') {
    id = params.uuid
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
  newdata.sort = 'branch,asc'

  return request({
    url: discovery + "info/online/",
    method: 'get',
    data: newdata,
  })
}

export async function queryInInfo (params) {
  let id = ''

  if (typeof (params.uuid) !== 'undefined') {
    id = params.uuid
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
  newdata.sort = 'branch,asc'

  return request({
    url: discovery + "info/invalid/",
    method: 'get',
    data: newdata,
  })
}

export async function queryTask (params) {
  let id = ''

  if (typeof (params.uuid) !== 'undefined') {
    id = params.uuid
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
  newdata.sort = 'updatedTime,asc'

  return request({
    url: discovery,
    method: 'get',
    data: newdata,
  })
}

export async function queryTaskList (params) {
  return request({
    url: discovery + 'list',
    method: 'get',
    data: params,
  })
}

export async function getTaskById (params) {
  return request({
    url: discovery + params.uuid,
    method: 'get',
  })
}

export async function create (params) {
  return request({
    url: discovery ,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: discovery,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: discovery + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function check (params) {
  return request({
    url: discovery,
    method: 'get',
    data: params,
  })
}

export async function queryAllInfoByTaskId (params) {
  let newdata = {}
  if (params && params.q === '') {
    newdata = {
      page: (params.page ? params.page : 0),
      pageSize: (params.pageSize ? params.pageSize : 10),
    }
  } else {
    newdata = { ...params }
  }
  newdata.sort = 'uuid,asc'
  	return request({
	    url: discovery + "info/",
	    method: 'get',
	    data: newdata,
  	})
}

export async function getTop10ByTotal (params) {
  return request({
    url: discovery + "info/top10",
    method: 'get',
  })
}

export async function getTop10ByNo (params) {
  return request({
    url: discovery + "info/ntop10",
    method: 'get',
  })
}

export async function changeInvalidInfo (params) {
  return request({
    url: discovery + "info/invalid/change/" +params.uuid + "?state=" + params.state,
    method: 'patch',
    data: params.record,
  })
}
export async function removeInvalidInfo (params) {
  return request({
    url: discovery + "info/invalid/",
    method: 'delete',
    data: params,
  })
}

export async function changeInfo (params) {
  return request({
    url: discovery + "info/change/" + params.uuid + "?state=" + params.state,
    method: 'patch',
    data:params.record,
  })
}


