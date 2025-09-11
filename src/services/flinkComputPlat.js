import { request, config, request_t } from '../utils'
import download from '../utils/download'
import qs from 'qs'
const { flinkPolicy,flinkDict,flinkDevice,flinkPolicyGroup ,flinkTemplate, flinkCondition} = config.api

export async function query(params) {
    params.page = params.page ? params.page : 1
    params.size = params.size ? params.size : 10

    return request_t({
        url: flinkPolicy + "find",
        method: 'post',
        data: params,
    })
}

export async function remove(params) {
    return request_t({
        url: flinkPolicy + "deleteByIds",
        method: 'post',
        data: params,
    })
}

export async function create_update(params) {
    return request_t({
        url: flinkPolicy + "update",
        method: 'post',
        data: params,
    })
}

export async function queryDevice(params) {
    params.page = params.page ? params.page : 1
    params.size = params.size ? params.size : 10
    return request_t({
        url: flinkDevice + '/get',
        method: 'post',
        data: params,
    })
}

export async function removeDevice(params) {
    return request_t({
        url: flinkPolicy + "deleteByIps",
        method: 'post',
        data: params,
    })
}
//`?${qs.stringify(params.contions)}`
export async function dwn(params) {
    // params.contions = qs.stringify(params.contions)
    return download({
        url: flinkPolicy + "downloadDoc" + `?${qs.stringify(params.contions)}` ,
        method: 'get',
        data: params,
    })
}

export async function run(params) {
    return request_t({
        url: flinkPolicy + "run",
        method: 'post',
    })
}

export async function runStatus(params) {
    return request_t({
        url: flinkPolicy + "getStatus",
        method: 'get',
    })
}

export async function getDictF(params) {
    return request_t({
        url: flinkDict + '/get',
        method: 'post',
        data: params,
    })
}

export async function getDictChild(params) {
    return request_t({
        url: flinkDict + '/getChild',
        method: 'post',
        data: params,
    })
}

export async function addDict(params) {
    return request_t({
        url: flinkDict + '/save',
        method: 'post',
        data: params,
    })
}

export async function deviceSave(params) {
    return request_t({
        url: flinkDevice + '/save',
        method: 'post',
        data: params,
    })
}

export async function deviceOffline(params) {
    return request_t({
        url: flinkDevice + '/offLine',
        method: 'post',
        data: params,
    })
}

export async function onDownDevice(params) {
    return download({
        url: flinkDevice + '/download' + `?${qs.stringify(params.contions)}` ,
        method: 'get',
        data: params,
    })
}

export async function addPolicyGroup(params) {
    return request_t({
        url: flinkPolicyGroup + 'save',
        method: 'post',
        data: params,
    })
}
export async function queryGroup(params) {
    params.page = params.page ? params.page : 1
    params.size = params.size ? params.size : 10

    return request_t({
        url: flinkPolicyGroup + 'get',
        method: 'post',
        data: params,
    })
}

export async function deleGroup(params) {
    return request_t({
        url: flinkPolicyGroup + 'delete',
        method: 'post',
        data: params,
    })
}

export async function querytemplate(params) {
    params.page = params.page ? params.page : 1
    params.size = params.size ? params.size : 10

    return request_t({
        url: flinkTemplate + 'get',
        method: 'post',
        data: params,
    })
}

export async function addTemplate(params) {
    return request_t({
        url: flinkTemplate + 'save',
        method: 'post',
        data: params,
    })
}

export async function deleTemplete(params) {
    return request_t({
        url: flinkTemplate + 'delete',
        method: 'post',
        data: params,
    })
}

export async function querycondition(params) {
    params.page = params.page ? params.page : 1
    params.size = params.size ? params.size : 10
    return request_t({
        url: flinkCondition + 'get',
        method: 'post',
        data: params,
    })
}

export async function addCondition(params) {
    return request_t({
        url: flinkCondition + 'save',
        method: 'post',
        data: params,
    })
}

export async function deleCondition(params) {
    return request_t({
        url: flinkCondition + 'delete',
        method: 'post',
        data: params,
    })
}

export async function addTempToaGroup(params) {
    return request_t({
        url: flinkPolicyGroup + 'bindTemplate',
        method: 'post',
        data: params,
    })
}

export async function addCondiTiontoTemp(params) {
    return request_t({
        url: flinkTemplate + 'bindCondition',
        method: 'post',
        data: params,
    })
}
export async function queryconditionbytemplet(params) {
    return request_t({
        url: flinkTemplate + 'getBindCondition',
        method: 'post',
        data: params,
    })
}

export async function querytemplatebyGroup(params) {
    return request_t({
        url: flinkPolicyGroup + 'getBindTemplate',
        method: 'post',
        data: params,
    })
}

export async function binDev(params) {
    return request_t({
        url: flinkPolicyGroup + 'instantiate',
        method: 'post',
        data: params,
    })
}

export async function unbinDev(params) {
    return request_t({
        url: flinkPolicyGroup + 'unBindDevice',
        method: 'post',
        data: params,
    })
}

export async function queryDevGroup(params) {
    return request_t({
        url: flinkDevice + '/getTemplateRelation',
        method: 'post',
        data: params,
    })
}

export async function replaceTemp(params) {
    return request_t({
        url: flinkPolicyGroup + 'replaceTemplateGroup',
        method: 'post',
        data: params,
    })
}

export async function getPolicyGDevG(params) {
    return request_t({
        url: flinkPolicyGroup + 'getDeviceGroupByTemplateGroup',
        method: 'post',
        data: params,
    })
}

export async function getAllDeviceGroup(params) {
    return request_t({
        url: flinkDevice + '/getAllDeviceGroup',
        method: 'post',
        data: params,
    })
}

export async function saveRelationDeviceGroup(params) {
    return request_t({
        url: flinkPolicyGroup + 'saveRelationDeviceGroup',
        method: 'post',
        data: params,
    })
}