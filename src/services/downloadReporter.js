import { request, config } from '../utils'
const { downloadReporter } = config.api

export async function DownloadReporter (params) {
  return request({
    url: `${downloadReporter}?q=${params.q}`,
    method: 'get',
  })
}
