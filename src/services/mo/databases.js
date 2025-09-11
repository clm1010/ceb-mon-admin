import { request, config } from '../../utils'

const { databases } = config.api

export async function querydbs(params) {
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
		url: databases,
		method: 'get',
		data: newdata,
	})
}

export async function createdbs(params) {
	return request({
		url: databases,
		method: 'post',
		data: params,
	})
}

export async function createDbInfos(params) {
	//深度拷贝 保证params原target obj属性的完整
	let db = JSON.stringify(params)
	db = JSON.parse(db)
	delete db.panes
	// delete db.infos
	let newdata = { "db": db, "savedInfos": db.infos }

	return request({
		url: databases + 'dbInfos',
		method: 'post',
		data: newdata,
	})
}
export async function removedbs(params) {
	return request({
		url: databases,
		method: 'delete',
		data: params,
	})
}

export async function updatedbs(params) {
	return request({
		url: databases + params.uuid,
		method: 'patch',
		data: params,
	})
}
export async function deletedbs(params) {
	return request({
		url: databases + params.uuid,
		method: 'delete',
		data: params,
	})
}
