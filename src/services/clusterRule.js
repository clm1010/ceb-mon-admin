import { request, config } from '../utils'
import download from '../utils/download'

const { getClusterRule, clusterRuleIssue, clusterRuleupDate, clusterRuleNormal, clusterRuleBasics, promTree, clusterRuleCheck, clusterbyname } = config.api
/**
 * 查询
 */
export async function query(params) {
	let q
	if (params.q && params.q != '') {
		q = params.q.substring(15, params.q.length - 2)
		console.log('params.q', params.q)
	}
	const newdata = {
		page: (params.page ? params.page : 0),
		pageSize: (params.pageSize ? params.pageSize : 10),
		q: q ? q : ''
	}
	return request({
		url: getClusterRule,
		method: 'get',
		data: newdata,
	})
}
/**
 * 删除
 */
export async function remove(params) {
	return request({
		url: getClusterRule,
		method: 'delete',
		data: params,
	})
}
/**
 * 更新
 */
export async function update(params) {
	return request({
		url: clusterRuleupDate,
		method: 'post',
		data: params,
	})
}
/**
 * 下发
 */
export async function issue(params) {
	return request({
		url: clusterRuleIssue,
		method: 'post',
		data: params,
	})
}
/**
 * 普通规则
 */
export async function getNormal(params) {
	return request({
		url: clusterRuleNormal,
		// url: promTree,
		method: 'get',
	})
}
/**
 * 基础规则
 */
export async function getBasics(params) {
	return request({
		url: clusterRuleBasics,
		// url: promTree,
		method: 'get',
	})
}

/**
 * 校验
 */
export async function check(params) {
	let param = ''
	if (params && params.q) {
		param = '?q=' + encodeURIComponent(params.q)
	}
	return download({
		url: clusterRuleCheck + param,
		method: 'get',
		data: params,
	},params.callback)
}

/**
 * 通过集群名字获取整个集群信息
 */
export async function getbyname(params) {
	return request({
		url: clusterbyname,
		method: 'get',
		data: params,
	})
}

