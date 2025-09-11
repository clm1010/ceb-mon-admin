import { request, config } from '../utils'
const { api } = config
const { ticket } = api

export async function sendOuts (params) {
  return request({
    url: ticket,
    method: 'post',
    data: params,
  })
}
