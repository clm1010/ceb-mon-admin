import { request, config } from '../utils'

const { configuration } = config.api

export async function query(params) {
    return request({
        url: configuration + 'listConfig',
        method: 'get',
        data: params,
    })
}


export async function create(params) {
    return request({
        url: configuration + 'createConfig',
        method: 'post',
        data: params,
    })
}

export async function remove(params) {
    return request({
        url: configuration + 'deleteConfig',
        method: 'delete', 
        data: params,
    })
}

export async function update(params) {
    return request({
        url: configuration + 'updateConfig',
        method: 'patch',
        data: params,
    })
}

export async function register(params) {
    return request({
        url: configuration + 'registerConfig',
        method: 'post',
        data: params,
    })
}

export async function deregister(params) {
    return request({
        url: configuration + 'deregisterConfig',
        method: 'post',
        data: params,
    })
}
