import { request, config } from '../utils'

const { screen } = config.api

export async function query (params) {
  return request({
    url: screen,
    method: 'post',
    data: params,
  })
}
