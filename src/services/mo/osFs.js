import { request, config } from '../../utils'

const { objectsMO, os, deleteAllOsFs } = config.api


//查询文件系统  需要 firstClass secondClass thirdClass
export async function queryOsFs(params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10000),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
	return request({
		url: objectsMO,
		method: 'get',
		data: newdata,
	})
}


export async function queryOs(params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10000),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
	return request({
		url: os,
		method: 'get',
		data: newdata,
	})
}



export async function createOsFs(params) {
	let tempUrl = params.parentUUID + "/fses"
	return request({
		url: `${os}${tempUrl}`,
		method: 'post',
		data: params,
	})
}

export async function updateOsFs(params) {
	let tempUrl = params.belongsTo.uuid + "/fses/" + params.uuid
	return request({
		url: `${os}${tempUrl}`,
		method: 'patch',
		data: params,
	})
}

export async function deleteOsFs(params) {
	let tempUrl = params.belongsTo.uuid + "/fses/" + params.uuid
	return request({
		url: `${os}${tempUrl}`,
		method: 'delete',
		data: params,
	})
}

// /api/v1/oses/fses/
export async function removeOsFs(params) {
	return request({
		url: deleteAllOsFs,
		method: 'delete',
		data: params,
	})
}


