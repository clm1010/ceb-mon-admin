import { request, config } from '../utils'
import download from '../utils/download'

const { registServe, registServeExport, tools, cpaas_project_clust, cpass_service_pod, cpaas_name } = config.api
export async function create(params) {

    return request({
        url: registServe,
        method: 'post',
        data: params,
    })
}

export async function remove(params) {
    return request({
        url: registServe,
        method: 'delete',
        data: params,
    })
}
export async function update(params) {
    return request({
        // url: registServe + params.uuid,
        url: registServe + 'updateRegister',
        method: 'patch',
        data: params,
    })
}
export async function query(params) {
    params.sort = 'createdTime,registerStatus,desc'
    return request({
        url: registServe,
        method: 'get',
        data: params,
    })
}
export async function findById(params) {
    return request({
        url: registServe + params.uuid,
        method: 'get',
    })
}

export async function register(params) {
    return request({
        url: registServe + "register",
        method: 'post',
        data: params,
    })
}

export async function onDown(params) {
    let param = ''
    if (params && params.q) {
        param = '?q=' + encodeURIComponent(params.q)
    }
    return download({
        url: registServeExport + param,
        method: 'get',
        data: params
    })
}

export async function deregister(params) {
    return request({
        url: registServe + "deregister",
        method: 'post',
        data: params,
    })
}
export async function syncStatus(params) {
    return request({
        url: registServe + "syncStatus",
        method: 'post',
    })
}

export async function findRegion(params) {
    params.pageSize = 500
    return request({
        url: tools + 'tradition-service-area',
        method: 'get',
    })
}

export async function getProjectsAndCluster(params) {
    return request({
        url: cpaas_project_clust,
        method: 'get',
    })
}

export async function getNamespace(params) {
    return request({
        url: cpaas_name + `/project/${params.project}/cluster/${params.cluster}/namespaces`,
        method: 'get',
    })
}
export async function getServer(params) {
    return request({
        url: cpass_service_pod + `/${params.cluster}/api/v1/namespaces/${params.namespace}/services`,
        method: 'get',
    })
}

export async function getPod(params) {
    return request({
        url: cpass_service_pod + `/${params.cluster}/api/v1/namespaces/${params.namespace}/pods?limit=50&field=status.podIP%2Cmetadata.name`,
        method: 'get',
    })
}

export async function syncSystem(params) {
    return request({
        url: registServe + "syncSystem",
        method: 'get',
    })
}