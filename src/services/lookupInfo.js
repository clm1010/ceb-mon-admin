import { request, config } from '../utils'
import download from '../utils/download'

const { lookup } = config.api

export async function query (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
//			groupUUID:(params.groupUUID ? params.groupUUID : ''),
		}
	} else {
		newdata = { ...params }
	}

  	return request({
	    url: lookup,
	    method: 'get',
	    data: newdata,
  	})
}

export async function create (params) {
  	return request({
	    url: lookup,
	    method: 'post',
	    data: params,
  	})
}

export async function remove (params) {
  	return request({
	    url: lookup,
	    method: 'delete',
	    data: params,
  	})
}

export async function update (params) {
  	return request({
	    url: lookup + params.uuid,
	    method: 'patch',
	    data: params,
  	})
}

export async function downloadExcel (params) {
	return request({
		url: `${lookup}download/?q=${params.q}`,
		method: 'get',
	})
}

//导出
export async function onDown(params) {
	return download({
	  url: params,
	  method: 'get',
	  data:{
		filename: 'lookupdata.csv'
	  }
	})
  }
