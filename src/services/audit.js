
import { request, config } from '../utils'
const {
    api,
} = config
const {
    dashboard,
    performance,
    performanceproxy,
    npmLog,
} = api

export async function queryES(params) {
    return request({
        url: performanceproxy + params.paths,
        // url:performance,
        method: 'post',
        data: params.es
    })
}