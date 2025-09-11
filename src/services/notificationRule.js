import { request, config } from '../utils'
import download from '../utils/download'

const { notificationRules,  dlNotificationRule } = config.api

//获取规则集合
export async function query (params) {
	let newDate = {
		q: params.q ? params.q : '',
		page: params.page ? params.page : 0,
		pageSize: params.pageSize ? params.pageSize : 10,
	}
  return request({
    url: notificationRules,
    method: 'get',
    data: newDate,
  })
}

//批量删除规则
export async function remove (params) {
  return request({
    url: notificationRules,
    method: 'delete',
    data: params.uuid,
  })
}

//更新规则
export async function update (params) {
  return request({
    url: notificationRules + params.uuid,
    method: 'patch',
    data: params,
  })
}

//增加规则
export async function create (params) {
  return request({
    url: notificationRules,
    method: 'post',
    data: params,
  })
}

//通过uuid获取单个通知规则
export async function findById (params) {
  return request({
    url: notificationRules + params.uuid,
    method: 'get',
  })
}
//导出
export async function onDown(params) {
  let param = ''
  if (params && params.q) {
    param = '?q=' + encodeURIComponent(params.q)
  }
  return download({
    //url: notificationRulesIO + 'export' + param,
    url: dlNotificationRule+ param,
    method: 'get',
    data: params
  })
}
