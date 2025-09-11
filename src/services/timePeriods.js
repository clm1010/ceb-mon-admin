import { request, config } from '../utils'

const { timePeriods } = config.api

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
    url: timePeriods + id,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: timePeriods,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: timePeriods,
    method: 'delete',
    data: params.payload,
  })
}

export async function update (params) {
  return request({
    url: timePeriods + params.id,
    method: 'patch',
    data: params,
  })
}

export async function findById (params) {
	return request({
		url: timePeriods + params.uuid,
		method: 'get',
	})
}
