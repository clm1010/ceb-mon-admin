import { request, config } from '../utils'
const { syslist } = config.api

export async function query (params) {
   return request({
       url: syslist,
       method: 'get',
       data: params,
   })
}
