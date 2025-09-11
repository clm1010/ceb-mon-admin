import { request, config } from '../utils'
const { logModal } = config.api

// 新增
export async function queryADD(params) {
    return request({
        url: logModal,
        method: 'post',
        data: params,
    })
}

// 查询
export async function queryList(params) {
    return request({
        url: logModal + 'list',
        method: 'get',
    })
}

// 查询模块详情
export async function queryID(params) {
    return request({
        url: logModal + params.uuid,
        method: 'get',
    })
}

// 查询模块详情
export async function apiAdd(params) {
    return request({
        url: logModal + params.uuid,
        method: 'patch',
        data: params,
    })
}

// 查询模块详情
export async function removeModal(params) {
    return request({
        url: logModal + params.uuid,
        method: 'delete',
    })
}