import { request, config } from '../utils'

const { moDiscovery, wizardPreview, mosOffline, dbDiscovery, mosChange, ruleInstance, mosIssueOffline } = config.api




// MO offline
export async function postMosIssueOffline(params) {

	return request({
		url: mosIssueOffline,
		method: 'post',
		data: params,
	})
}

export async function getDbDiscovery(params) {
	return request({
		url: `${dbDiscovery}?branch=${params.branch}`,
		method: 'post',
		data: params,
	})
}




//查询数据库设备ip是否存在
export async function postDbWizardPreview(params) {
	//深度拷贝 保证params原target obj属性的完整
	let db = JSON.stringify(params)
	let	db2 = JSON.parse(db)
	delete db2.panes
	// delete db.infos
	let newdata = { "db": db2, "savedInfos": db2.infos }
	return request({
		url: wizardPreview + '/db',
		method: 'post',
		data: newdata
	})
}

//数据库实例下线
export async function postDbOffline(params) {
	return request({
		url: mosOffline,
		method: 'post',
		data: params,
	})
}



//保存预览实例
export async function savePreview(params) {
	return request({
		url: ruleInstance + 'save-preview',
		method: 'post',
		data: params
	})
}

//实例下线下发
export async function ruleInstanceIssue(params) {
	return request({
		url: ruleInstance + 'issue',
		method: 'post',
		data: params
	})

}

export async function findById(params) {
	return request({
		url: `${mosChange}/db/${params.uuid}`,
		method: 'get'
	})
}