import { request, config } from '../utils'
const { dbWizard } = config.api

export async function getVerify(params) {
    return request({
        url: dbWizard + 'dbmid/verify',
        method: 'post',
        data: params,
    })
}

export async function addMonitor(params) {
    return request({
        url: dbWizard + 'dbmid/addmonitor',
        method: 'post',
        data: params,
    })
}

