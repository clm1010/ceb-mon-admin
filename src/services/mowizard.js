import { request, config } from '../utils'

const { ruleInstance, moDiscovery, wizardPreview, neAndIntfs, mosChange, wizardPreviewLine, nesOffline,
        lineOffline, wizardPreviewBrIP, mosOffline, mosIssueOffline } = config.api

export async function getMoDiscover (params) {

  return request({
    url: moDiscovery,
    method: 'get',
    data: params,
  })
}

export async function postWizardPreview (params) {
  return request({
    url: wizardPreview,
    method: 'post',
    data: params,
  })
}

export async function postNewNeAndIfs (params) {

  return request({
    url: neAndIntfs,
    method: 'post',
    data: params,
  })
}

export async function getMOWizardById (params) {

    return request({
      url: mosChange+'/'+params,
      method: 'get',
      //data: params,
    })
  }

  export async function postLineWizardPreview (params) {

    return request({
      url: wizardPreviewLine,
      method: 'post',
      data: params,
    })
  }

  export async function postNesOffline (params) {

    return request({
      url: nesOffline,
      method: 'post',
      data: params,
    })
  }

  export async function postLineOffline (params) {

    return request({
      url: lineOffline,
      method: 'post',
      data: params,
    })
  }
  //保存预览实例
  export async function savePreview(params) {
    return request({
      url: ruleInstance + 'save-preview',
      method: 'post',
      data: params
    })
  }
  //基于预览数据的下发
  export async function issuePreview(param) {
    return request({
      url: ruleInstance + 'issue-preview',
      method: 'post',
      data: param
    })
  }

  export async function ruleInstanceIssue(params) {
    return request({
      url: ruleInstance + 'issue',
      method: 'post',
      data: params
    })
  }

  // Branch IP preview
  export async function postBrIPWizardPreview (params) {
    return request({
      url: wizardPreviewBrIP,
      method: 'post',
      data: params,
    })
  }

  // MO offline
  export async function postMosOffline (params) {

    return request({
      url: mosOffline,
      method: 'post',
      data: params,
    })
  }

    // MO offline
  export async function postMosIssueOffline (params) {

      return request({
        url: mosIssueOffline,
        method: 'post',
        data: params,
      })
  }
  