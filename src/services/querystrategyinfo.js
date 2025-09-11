import { request, config } from '../utils'

const { strategyinfo } = config.api

export async function querystrategyinfo (params) {
    return request({
        url: strategyinfo + params.policyUUID,
        method: 'get',
    //    data : newdata,
    })
}
