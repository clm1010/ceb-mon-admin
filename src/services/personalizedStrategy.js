import { request, config } from '../utils'

const { personStrategy } = config.api


export async function query(params) {
    return request({
        url: personStrategy,
        method: 'get',
        data: params,
    })
}