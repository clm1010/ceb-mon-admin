import { request, config } from '../utils'

const { channel } = config.api

export async function query (params) {
	return request({
	    url: `${channel}getMpoinStatus`,
	    method: 'get',
	})
}

export async function update (params) {
	return request({
	    url: `${channel}setMpoinStatus`,
	    method: 'post',
	    data: params,
	})
}
