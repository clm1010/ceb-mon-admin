import { request, config } from '../../utils'

const { urlDns } = config.api

export async function queryurlDns(params) {
    let newdata = {}
    if (params && params.q == '') {
        newdata = {
            page: (params.page ? params.page : 0),
            pageSize: (params.pageSize ? params.pageSize : 10000),
            branchName: (params.branchName ? params.branchName : ''),
        }
    } else {
        newdata = { ...params }
    }
    return request({
        url: urlDns,
        method: 'get',
        data: newdata,
    })
}

export async function createurlDns(params) {
    return request({
        url: urlDns,
        method: 'post',
        data: params,
    })
}

export async function removeurlDns(params) {
    return request({
        url: urlDns,
        method: 'delete',
        data: params,
    })
}

export async function updateurlDns(params) {
    return request({
        url: urlDns + params.uuid,
        method: 'patch',
        data: params,
    })
}

export async function deleteurlDns(params) {
    return request({
        url: urlDns + params.uuid,
        method: 'delete',
        data: params,
    })
}
