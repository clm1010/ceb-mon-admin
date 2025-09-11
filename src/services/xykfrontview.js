import { xykrequest, config } from '../utils'
const { xykosts , xykoelEventFilter, xykalarms, xykuserLogin ,xykeventviews, xyktoolset,xykalarmJourney } = config.api

export async function xykqueryAllosts (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
	}

  return xykrequest({
	url: xykosts,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/osts/',
    method: 'get',
    data,
  })
}

export async function xykqueryById (params) {
    return xykrequest({
  	url: xykoelEventFilter + params.oelFilter,
	//url: 'http://10.218.32.71/searchxykalarm/api/v1/ef/' + params.oelFilter,
    method: 'get',
    })
}

export async function xykqueryAllFilters (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
    sort: 'name,desc',
	}

  return xykrequest({
	url: xykoelEventFilter,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/ef/',
    method: 'get',
    data,
  })
}
export async function xykquerySummary (params) {
	let whereSQL = ''
	let newdata = {
		page: (params.pagination ? params.pagination.current : 0),
		pageSize: (params.pagination ? params.pagination.pageSize : 150),
		detail: 'no',
	}

	if (typeof (params.whereSQL) !== 'undefined') {
		whereSQL = `q=${params.whereSQL}`
	}

	//%28 %29
	let kk = `${xykalarms}?uuid=${params.oelDatasource}&${whereSQL}`
	//let kk = `http://10.218.32.71/searchxykalarm/api/v1/osts/alerts?uuid=${params.oelDatasource}&${whereSQL}`
	let aa = kk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29')

  return xykrequest({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function xyklogin (data) {
 	let newdata =  {
		password: "xyk@JK9966",
		username: "zhdata"
	} 
	return xykrequest({
		url: xykuserLogin,
		//url: 'http://10.218.32.71/searchxykalarm/api/v1/users/login',
		method: 'post',
		data: newdata,
	})
}

export async function xykqueryAllViews (params) {
	let data = {
		current: 0,
		page: 0,
    pageSize: 99999,
    q: params.q || '',
	}

  return xykrequest({
    url: xykeventviews,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/ev/',
    method: 'get',
    data,
  })
}

export async function xykqueryViewer (params) {
	return xykrequest({
		url: xykeventviews + params.oelViewer,
		//url: 'http://10.218.32.71/searchxykalarm/api/v1/ev/' + params.oelViewer,
		method: 'get',
	})
  }

  export async function xykqueryTool (params) {
	let data = {
		current: 0,
		page: 0,
		pageSize: 99999,
	}

  return xykrequest({
  		url: xyktoolset,
		//url:'http://10.218.32.71/searchxykalarm/api/v1/et/',
  		method: 'get',
  		data,
  })
}

export async function xykquery (params) {
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

	//%28 %29
	let kk = `${xykalarms}?uuid=${params.oelDatasource}&${whereSQL}`
	//let kk = `http://10.218.32.71/searchxykalarm/api/v1/osts/alerts?uuid=${params.oelDatasource}&${whereSQL}`
	let aa = kk.replace(new RegExp(/\(/, 'g'), '%28').replace(new RegExp(/\)/, 'g'), '%29').replace(new RegExp(/\|/, 'g'), '%7C')
  return xykrequest({
    url: aa,
    method: 'get',
    data: newdata,
  })
}

export async function xykgetJournal (params) {
	return xykrequest({
	  url: xykalarmJourney,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/osts/journals',
	  method: 'get',
	  data: params,
	})
  }