import { request, config } from '../utils'
import download from '../utils/download'
const { objectsMO, moDown } = config.api

export async function zabbixAdd (params) {
  return request({
    url: `${objectsMO}zabbix-add`,
    method: 'post',
    data: params,
  })
}

export async function queryAllTypeOfMO (params) {
  let newdata = {}
  if (params && params.q === undefined) {
		newdata = {
			page: (params.page ? params.page : 0),
      pageSize: (params.pageSize ? params.pageSize : 10),
      q: '(firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP) and (thirdClass==null or thirdClass!=NET_INTF )',
		}
	} else {
    if (params.q.includes('level==false')) {
      params.q = params.q.replace('level==false', '(thirdClass==NET_INTF)')
    } else if (params.q.includes('level==true')) {
      params.q = params.q.replace('level==true', '(thirdClass==null or thirdClass!=NET_INTF)')
    }
    newdata = { ...params }
    newdata.q += ' and (firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP)'
  }
  newdata.sort = 'discoveryIP,asc'
  return request({
    url: objectsMO + 'getMo',
    method: 'get',
    data: newdata,
  })
}
export async function query (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			firstClass: (params.firstClass ? params.firstClass : ''),
			secondClass: (params.secondClass ? params.secondClass : ''),
			thirdClass: (params.thirdClass ? params.thirdClass : ''),
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
	}
  newdata.sort = 'name,asc'
  if (newdata.q === undefined || newdata.q === '') {
    newdata.q = 'firstClass==NETWORK or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP'
  }
  return request({
    url: objectsMO,
    method: 'get',
    data: newdata,
  })
}

export async function queryInterfaces (params) {
  let newdata = { ...params }
  if (params.sort == undefined || params.sort == 'undefined,asc') {
    newdata.sort = 'name,asc'
  }
  return request({
    url: objectsMO,
    method: 'get',
    data: newdata,
  })
}

export async function queryInfo (params) {
	let newdata = { ...params }
	newdata.sort = 'name,asc'
	if (newdata.q === undefined || newdata.q === '') {
			newdata.q = 'firstClass==NETWORK;thirdClass==null;( secondClass== ROUTER or secondClass== SWITCH or secondClass== FIREWALL or secondClass== F5 )'
	} else if (newdata.q != '' && !newdata.q.includes('secondClass==')) {
		newdata.q += ';( secondClass== ROUTER or secondClass== SWITCH or secondClass== FIREWALL or secondClass== F5 )'
	}
  return request({
    url: objectsMO,
    method: 'get',
    data: newdata,
  })
}

export async function queryFields (params) {
  return request({
    url: `${objectsMO}fields`,
    method: 'get',
    data: params,
  })
}

export async function policyCounts (params) {
  return request({
    url: `${objectsMO + params.uuids}/policy-status`,
    method: 'get',
    data: params,
  })
}

export async function queryPolicyInfo (params) {
  return request({
    url: `${objectsMO + params.uuid}/policies`,
    method: 'get',
    data: params,
  })
}

/*
	1. POLICY :策略实例相关的MO信息
	2. POLICY_TEMPLATE :策略模板相关的MO信息
	3. KPI   ：指标相关的MO信息
	4. TOOL_INST :工具实例相关的MO信息
*/
export async function queryRelatedMOsInfo (params) {
  return request({
    url: `${objectsMO}related-mos/${params.uuid}`,
    method: 'get',
    data: params,
  })
}


export async function create (params) {
  return request({
    url: objectsMO,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: objectsMO,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: objectsMO + params.uuid,
    method: 'patch',
    data: params,
  })
}

export async function mosInfts (params) {
  return request({
    url: `${objectsMO}all/?q=uuid==${params.neUUID}`,
    method: 'get',
    data: params,
  })
}

export async function findById (params) {
	return request({
		url: objectsMO + params.uuid,
		method: 'get',
	})
}

export async function oneMoSync (params) {
	const reqParam = params
	return request({
		url: `${objectsMO}sync`,
		method: 'post',
		data: reqParam,
	})
}

export async function batchSync (params) {
	const postParam = {
		uuids: params,
	}
  return request({
    url: `${objectsMO}sync/`,
    method: 'post',
    data: postParam,
  })
}

export async function managed (params) {
	return request({
		url: `${objectsMO}managed-status`,
		method: 'post',
		data: params,
	})
}
export async function modetailDown(params) {
	let param = ''
 if(params && params.q){
		param ='?q='+ encodeURIComponent(params.q)
	}
  return download({
    url:moDown +param,
    method: 'get',
    data: params
  })
}
