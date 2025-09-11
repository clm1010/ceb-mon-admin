import { request, config } from '../utils'

const { alarms, alarmProcess, alarmJourney, knowledge, alarmtree, alarmcompact,recommendAddress,outCallUsers,outCallapi, oelHint } = config.api

export async function alarmProcessServ (params) {
	return request({
    url: alarmProcess,
    method: 'post',
    data: params,
  })
}

export async function query (params) {
	let whereSQL = ''
	let newdata = {
		page: (params.pagination ? params.pagination.current : 0),
		pageSize: (params.pagination && params.pagination.pageSize !== 0 ? params.pagination.pageSize : 100),
		detail: 'yes',
		osUuid: params.osUuid,
	}

	if (typeof (params.whereSQL) !== 'undefined') {
		whereSQL = `q=${params.whereSQL}`
	}

  //(%28 ）%29  :%3A =%20
	let kk = `${alarms}?uuid=${params.oelDatasource}&${whereSQL}`
  let aa = kk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29').replace(new RegExp(/\|/, 'g'), '%7C').replace(new RegExp(/\[/, 'g'), '%5B').replace(new RegExp(/\]/, 'g'), '%5D')
  // let aa = encodeURI(kk)
  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function queryHint (params) {
	let whereSQL = ''
	let newdata = {
		page: (params.pagination ? params.pagination.current : 0),
		pageSize: (params.pagination && params.pagination.pageSize !== 0 ? params.pagination.pageSize : 100),
		detail: 'yes',
		osUuid: params.osUuid,
	}

	if (typeof (params.whereSQL) !== 'undefined') {
		whereSQL = `q=${params.whereSQL}`
	}

  //(%28 ）%29  :%3A =%20
	let kk = `${oelHint}?uuid=${params.oelDatasource}&${whereSQL}`
  let aa = kk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29').replace(new RegExp(/\|/, 'g'), '%7C').replace(new RegExp(/\[/, 'g'), '%5B').replace(new RegExp(/\]/, 'g'), '%5D')
  // let aa = encodeURI(kk)
  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function getAlarmTree (params) {
  let whereSQL = ''
	let newdata = {
		osUuid: params.osUuid,
	}

	if (typeof (params.treeSQL) !== 'undefined') {
		whereSQL = `q=${params.treeSQL}`
	}
  let lnk = `${alarmtree}?uuid=${params.oelDatasource}&${whereSQL}`
  let aa = lnk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29').replace(new RegExp(/\|/, 'g'), '%7C')
  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function getAlarmCompact (params) {
  let whereSQL = ''
	let newdata = {
    page: (params.pagination ? params.pagination.current : 0),
    pageSize: (params.pagination && params.pagination.pageSize !== 0 ? params.pagination.pageSize : 100),
		osUuid: params.osUuid,
	}

	if (typeof (params.whereSQL) !== 'undefined') {
		whereSQL = `q=${params.whereSQL}`
	}
  let lnk = `${alarmcompact}?uuid=${params.oelDatasource}&${whereSQL}`
  let aa = lnk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29').replace(new RegExp(/\|/, 'g'), '%7C')
  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function querySummary (params) {
	let whereSQL = ''
	let newdata = {
		page: (params.pagination ? params.pagination.current : 0),
		pageSize: (params.pagination ? params.pagination.pageSize : 150),
		detail: 'no',
	}

	if (typeof (params.whereSQL) !== 'undefined') {
		whereSQL = `q=${params.whereSQL}`
	}

  //(%28 ）%29  :%3A =%20
  whereSQL = whereSQL.replace(new RegExp(/\:/,'g'),'%3A')
	let kk = `${alarms}?uuid=${params.oelDatasource}&${whereSQL}`
	let aa = kk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29')

  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function sql (params) {
  return request({
    url: alarms,
    method: 'post',
    data: params,
  })
}

export async function getJournal (params) {
  return request({
    url: alarmJourney,
    method: 'get',
    data: params,
  })
}

export async function knowledges (params) {
  return request({
    url: knowledge,
    method: 'get',
    data: params
  })
}
export async function queryRecommend (params) {
  return request({
    url: recommendAddress + params.AlarmID,
    method: 'get'
  })
}

export async function outCall (params) {
  return request({
    url: outCallapi,
    method: 'get',
    data: params
  })
}

export async function outCalluser (params) {
  return request({
    url: outCallUsers,
    method: 'post',
    data: params
  })
}
