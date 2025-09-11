import { request, config } from '../utils'
import download from '../utils/download'

const { journalingApi, reporterApi } = config.api

export async function querymenu(params) {
    return request({
        url: journalingApi + 'menu',
        method: 'get',
    })
}

export async function downLoad(params) {
    return request({
        url: journalingApi + 'create_reporter_ex',
        method: 'post',
        data: params,
    })
}

export async function getMes(params) {
    return request({
        url: reporterApi,
        method: 'get',
        data: params,
    })
}