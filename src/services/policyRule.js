import { request, config } from '../utils'
import download from '../utils/download'
const { ruleInstance, policyRule, policyTemplet, dlRule } = config.api

export async function query(params) {
  let id = ''
  if (typeof (params.id) !== 'undefined') {
    id = params.id
    params = ''
  }

  let newdata = {}
  if (params && params.q === '') {
    newdata = {
      page: (params.page ? params.page : 0),
      pageSize: (params.pageSize ? params.pageSize : 10),
      groupUUID: (params.groupUUID ? params.groupUUID : ''),
    }
  } else {
    newdata = { ...params }
  }
  newdata.sort = 'name,asc'
  return request({
    url: policyRule + id,
    method: 'get',
    data: newdata,
  })
}
export async function queryTemplets(params) {
  let id = ''
  if (params === undefined) {
    id = ''
  } else {
    let current = 0
    let pageSize = 10
    let q = ''
    if (params.current !== undefined) {
      current = params.current - 1
    }
    if (params.pageSize !== undefined) {
      pageSize = params.pageSize - 1
    }
    id = `?page=${current}&pageSize=${pageSize}`
  }
  return request({
    url: policyTemplet + id,
    method: 'get',
    data: params,
  })
}
export async function create(params) {
  return request({
    url: policyRule,
    method: 'post',
    data: params,
  })
}
export async function queryRuleById(params) {
  return request({
    url: policyRule + params.uuid,
    method: 'get',
  })
}
export async function queryMonitorInstanceById(params) {
  return request({
    url: ruleInstance + params.uuid,
    method: 'get',
  })
}
export async function remove(params) {
  return request({
    url: policyRule,
    method: 'delete',
    data: params,
  })
}

export async function update(params) {
  return request({
    url: policyRule + params.id,
    method: 'patch',
    data: params,
  })
}
export async function updateMonitorInstance(params) {
  return request({
    url: ruleInstance + params.id,
    method: 'patch',
    data: params,
  })
}

export async function calc(params) {
  return request({
    url: `${policyRule}calc`,
    method: 'post',
    data: params,
  })
}

//下发接口
export async function issue(params) {
  return request({
    url: `${policyRule}issue`,
    method: 'post',
    data: params,
  })
}
//下发接口状态查询----start
export async function status(params) {
  let newdata = { branch: params.criteriaArr }
  return request({
    url: `${policyRule}issue/status/?q=branch=in=%28${newdata.branch}%29`,
    method: 'get',
    data: '',
  })
}
//end

//策略分组树---start
export async function queryGroup(params) {
  return request({
    url: `${policyRule}groups/`,
    method: 'get',
    data: params,
  })
}
export async function createGroup(params) {
  return request({
    url: `${policyRule}groups/?parentUUID=${params.parentUUID}`,
    method: 'post',
    data: params,
  })
}

export async function removeGroup(params) {
  return request({
    url: `${policyRule}groups/${params}`,
    method: 'delete',
    data: params,
  })
}

export async function updateGroup(params) {
  return request({
    url: `${policyRule}groups/` + `{uuid}?uuid=${params.uuid}`,
    method: 'post',
    data: params,
  })
}
export async function MoveTo(params) {
  return request({
    url: `${policyRule}groups/move-to`,
    method: 'post',
    data: params,
  })
}

export async function CopyTo(params) {
  return request({
    url: `${policyRule}groups/copy-to`,
    method: 'post',
    data: params,
  })
}

export async function preview(params) {
  return request({
    url: `${policyRule}preview`,
    method: 'post',
    data: params,
  })
}
//end
export async function onDown(params) {
  let param = ''
  if (params && params.q && params.groupUUID) {
    param = '?q=' + encodeURIComponent(params.q) + '&groupUUID=' + params.groupUUID
  } else if (params && params.q) {
    param = '?q=' + encodeURIComponent(params.q)
  } else if (params && params.groupUUID != '') {
    param = '?groupUUID=' + params.groupUUID
  }
  return download({
    //url:policyRuleIO+ 'export' +param,
    url: dlRule + param,
    method: 'get',
    data: params
  })
}

export async function offline(params) {
  return request({
    url: policyRule + 'offline/' + params.id,
    method: 'patch',
    data: params,
  })
}