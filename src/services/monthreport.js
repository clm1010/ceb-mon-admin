import { request, config } from '../utils'
import download from '../utils/download'

const { monthReportApi } = config.api

export async function query(params) {
    return request({
        url: monthReportApi + 'listFiles',
        method: 'get',
    })
}

export async function downLoad(params) {
    let q = `?filename=${params.filename}`
    return download({
        url: monthReportApi + 'download' + q,
        method: 'get',
        data: params,
    })
}

export async function delFile(params) {
    return request({
        url: monthReportApi + `${params.filename}`,
        method: 'delete',
    })
}