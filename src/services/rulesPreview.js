import { request, config } from '../utils'

const { rulePreview ,ruleInstance} = config.api

export async function rulesPreview (params) {
  return request({
    url: rulePreview,
    method: 'post',
    data: params,
  })
}

export async function seave (params) {
  return request({
    url: ruleInstance + 'save-preview',
    method: 'post',
    data: params,
  })
}

export async function issue (params) {
  return request({
    url: ruleInstance + 'issue-preview',
    method: 'post',
    data: params,
  })
}

