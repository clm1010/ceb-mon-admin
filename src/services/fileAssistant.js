import { config, request_t } from '../utils'
import qs from 'qs'
const { fileApi, fileApiDown,fileApiDel } = config.api
import download from '../utils/download'

export async function query(params) {
    return request_t({
        url: `${fileApi}`,
        method: 'get'
    })
}

export async function dwn(params) {
    return download({
        url: fileApiDown + `?${qs.stringify(params)}`,
        method: 'post',
        data: { filename: params.path },
    })
}

export async function remove(params) {
    return request_t({
        url: fileApiDel + `?${qs.stringify(params)}`,
        method: 'post'
    })
}