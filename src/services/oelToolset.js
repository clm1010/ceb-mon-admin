import { request, config } from '../utils'

const { toolset } = config.api

//工具配置start
export async function queryTool (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
	}

  return request({
  		url: toolset,
  		method: 'get',
  		data,
  })
}
//end

//工具配置-新建功能 start
export async function creates (params) {
  	return request({
    		url: toolset,
    		method: 'post',
    		data: params,
  	})
}
//end

//工具配置-删除功能 start
export async function remove (params) {
	let ids = ''
	ids = params
  	return request({
    		url: toolset + params,
    		method: 'delete',
    		data: params,
  	})
}
//end

//工具配置-克隆功能 start
export async function copy (params) {
	let newdata = []
  	return request({
    		url: toolset + params,
    		method: 'get',
    		data: newdata,
  	})
}
//end

//工具配置-编辑功能 start
export async function tooledit (params) {
	let ids = params.uuid
  	return request({
    		url: toolset + ids,
    		method: 'patch',
    		data: params,
  	})
}
//end

//通过uuid查询单个工具信息
export async function findById (params) {
	return request({
			url: toolset + params.uuid,
			method: 'get',
	})
}
//end
