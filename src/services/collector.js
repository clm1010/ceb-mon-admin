import { request, config } from '../utils'

const { epp_status } = config.api

export async function query(params) {
	return request({
		url: epp_status,
		method: 'get',
		data: params,
	})
}
/**
 * 更新
 */
export async function update(params) {
	return request({
		url: epp_status + `${params.uuid}`,
		method: 'patch',
		data: params,
	})
}
/**
 * 删除
 */
export async function move(params) {
	return request({
		url: epp_status,
		method: 'delete',
		data:params
	})
}