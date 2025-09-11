import { request, config } from '../../utils'

const { lines } = config.api

export async function querylines (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			firstClass: (params.firstClass ? params.firstClass : ''),
			secondClass: (params.secondClass ? params.secondClass : ''),
			thirdClass: (params.thirdClass ? params.thirdClass : ''),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  return request({
    url: lines,
    method: 'get',
    data: newdata,
  })
}


export async function createlines (params) {
  return request({
    url: lines,
    method: 'post',
    data: params,
  })
}

export async function removelines (params) {
  return request({
    url: lines,
    method: 'delete',
    data: params,
  })
}

export async function updatelines (params) {
  return request({
    url: lines + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function deletelines (params) {
  return request({
    url: lines + params.uuid,
    method: 'delete',
    data: params,
  })
}
