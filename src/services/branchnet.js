import { request, config, download } from '../utils'
const { branchnet, branchData, kpiPolicyList, kpiPolicyExport, scoreLineData } = config.api

export async function query (params) {
  params.p = params.q
  let parm = '(monitoringTree.parentCode == 100 and monitoringTree.branch != 总行*)'
  if (params && params.q !== '' && params.q !== undefined) {
    if (params.q.indexOf(';') < 0 && params.q.indexOf('branch') > 0) {
      params.q = params.q + ' and ' + parm
    }
  } else {
    params.q = parm
  }
  params.sort = 'monitoringScore,aceNumber,desc'
  return request({
    url: branchnet,
    method: 'get',
    data: params,
  })
}

export async function branch (params) {
  params.page = 0
  params.pageSize = 50
  return request({
    url: branchData,
    method: 'get',
    data: params,
  })
}

export async function kpiPolicy (params) {
  return request({
    url: kpiPolicyList,
    method: 'get',
    data: params,
  })
}

export async function scoreLine (params) {
  return request({
    url: scoreLineData,
    method: 'get',
    data: params,
  })
}

export async function kpiPolicyDownload (params) {
  let url = ''
  if (params.kpiUUID == null) {
    url = kpiPolicyExport + '?parentUUID=' + params.parentUUID + '&shouldMonitor=' + params.shouldMonitor + '&isMonitoring=' + params.isMonitoring + '&pageSize=2000'
  } else {
    url = kpiPolicyExport + '?parentUUID=' + params.parentUUID + '&shouldMonitor=' + params.shouldMonitor + '&uuid=' + params.uuid + '&pageSize=2000'
  }
  return download({
    url: url,
    method: 'get',
  })
}
