import { request, config } from '../utils'

const { getAllOrg, ExceptOrg, FromOrg, addUserToOrg, delUserFromOrg } = config.api

export async function query(params) {
    return request({
        url: getAllOrg,
        method: 'get',
        data: params,
    })
}

export async function getOrgAllUser(params) {
    return request({
        url: ExceptOrg,
        method: 'get',
        data: params,
    })
}

export async function getOrgUser(params) {
    return request({
        url: FromOrg,
        method: 'get',
        data: params,
    })
}

export async function addOrgUser(params) {
    return request({
        url: addUserToOrg,
        method: 'get',
        data: params,
    })
}

export async function remove(params) {
    return request({
        url: delUserFromOrg,
        method: 'get',
        data: params,
    })
}