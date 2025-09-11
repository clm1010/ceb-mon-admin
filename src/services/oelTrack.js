import { request, config } from '../utils'

const { trackAlarm, trackAction } = config.api

export async function query (params) {
  if (params.q && params.q.includes("n_CustomerSeverity=='*故障*'")) {
    params.q = params.q.replace("n_CustomerSeverity=='*故障*'", 'n_CustomerSeverity==1')
  }
  if (params.q && params.q.includes("n_CustomerSeverity=='*告警*'")) {
    params.q = params.q.replace("n_CustomerSeverity=='*告警*'", 'n_CustomerSeverity==2')
  }
  if (params.q && params.q.includes("n_CustomerSeverity=='*预警*'")) {
    params.q = params.q.replace("n_CustomerSeverity=='*预警*'", 'n_CustomerSeverity==3')
  }
  if (params.q && params.q.includes("n_CustomerSeverity=='*提示*'")) {
    params.q = params.q.replace("n_CustomerSeverity=='*提示*'", 'n_CustomerSeverity==4')
  }
    if (params.q && params.q.includes("n_CustomerSeverity=='*信息*'")) {
    params.q = params.q.replace("n_CustomerSeverity=='*信息*'", 'n_CustomerSeverity==100')
  }
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
  newdata.sort = 'updatedTime,desc'
  return request({
    url: trackAlarm + id,
    method: 'get',
    data: newdata,
  })
}

export async function create (params) {
  return request({
    url: trackAlarm,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: trackAlarm,
    method: 'delete',
    data: params,
  })
}
export async function findById (params) {
  return request({
    url: trackAlarm + params.uuid,
    method: 'get',
  })
}
export async function update (params) {
  return request({
    url: trackAlarm + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function updateAction (params) {
  let action = params.obj
  return request({
    url: trackAction + action.uuid,
    method: 'patch',
    data: action,
  })
}

export async function datequery (params) {
  return request({
    url: trackAlarm + 'currentTime',
    method: 'get',
  })
}
