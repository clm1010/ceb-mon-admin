import { request, config } from '../utils'
const { APPinfor } = config.api

export async function query (params) {
    if (params.q && params.q.includes("status=='*已接受*'")) {
        params.q = params.q.replace("status=='*已接受*'", 'status== 1')
    } if (params.q && params.q.includes("status=='*已送达*'")) {
        params.q = params.q.replace("status=='*已送达*'", 'status== 2')
    } if (params.q && params.q.includes("status=='*已读*'")) {
        params.q = params.q.replace("status=='*已读*'", 'status== 3')
    }
    return request({
        url: APPinfor,
        method: 'get',
        data: params,
    })
}
