import { request, config } from '../utils'

const { wizardPreview, mosOffline, osDiscovery, mosChange, ruleInstance, mosIssueOffline,findOsMO,OSSelfService,os,checkexists,batchOnmonitor,
	objectsMO,OS_offline ,zabbixHsot} = config.api
// MO offline
export async function postMosIssueOffline(params) {

	return request({
		url: mosIssueOffline,
		method: 'post',
		data: params,
	})
}
//操作系统信息发现
export async function getOsDiscovery(params) {
	return request({
		url: `${osDiscovery}?ip=${params.ip}&branch=${params.branch}`,
		method: 'post',
		data: params,
	})
}

//查询操作系统设备ip是否存在
export async function postOsWizardPreview(params) {
	//深度拷贝 保证params原target obj属性的完整
	let os = JSON.stringify(params)
	let os2 = JSON.parse(os)
	delete os2.panes
	let newdata = { "os": os2, "fss": os2.fss, "dss": os2.disks }
	return request({
		url: wizardPreview + '/os',
		method: 'post',
		data: newdata
	})
}

//操作系统实例下线
export async function postOsOffline(params) {
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
		url: `${mosChange}OS/${params.uuid}`,
		method: 'get'
	})
}
/* 
	银行-操作系统自服务 发现MO
*/
export async function getOsMO(params) {
	return request({
		url: findOsMO,
		method: 'post',
		data: params
	})
}
/* 
	银行-操作系统自服务 上监控
*/
export async function osUpMonitor(params) {
	return request({
		url: OSSelfService,
		method: 'post',
		data: params
	})
}
/* 
	基于南天Zabbix监测是否已存在监控
*/
export async function monitorState(params) {
	return request({
		url: checkexists,
		method: 'post',
		data: params
	})
}
/* 
	基于南天Zabbix操作系统批量上监控
*/
export async function monitorResult(params) {
	return request({
		url: batchOnmonitor,
		method: 'post',
		data: params
	})
}

export async function getOS(params) {
	return request({
		url: objectsMO,
		method: 'get',
		data: params,
	})
}

export async function offline(params) {
	return request({
		url: OS_offline,
		method: 'post',
		data: params,
	})
}

export async function queryZabbixHost(params) {
	return request({
		url: zabbixHsot,
		method: 'post',
		data: params,
	})
}