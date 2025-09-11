import { request, config } from '../utils'
import download from '../utils/download'

const {
 mtsinfo, mtsGroups, mtreviewer, objectsMO, nes, appCategories,trackAlarm,savereviewer, performanceproxy,mtExport, appSearchFromCmdb
} = config.api

export async function query (params) {
	let newdata = {}
	
	if (params && params.q === '') {
		newdata = {
			q: '((overdue == false and enabled == true) or state == \'ACTIVE\');tpe==\'NON_PERIODIC\'',
			//q: 'overdue == false;enabled == true',
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			groupUUID: (params.groupUUID ? params.groupUUID : ''),
			branch: (params.branch ? params.branch : ''),
			sort: params.sort ? params.sort : 'createdTime,desc',
		}
	} else {
		newdata = { ...params }
		newdata.sort = params.sort ? params.sort : 'createdTime,desc'
	}
  	return request({
	    url: mtsinfo + 'query_short',
	    method: 'get',
	    data: newdata,
  	})
}

export async function create (params) {
  	return request({
	    url: mtsinfo,
	    method: 'post',
	    data: params,
  	})
}

export async function remove (params) {
  	return request({
	    url: mtsinfo,
	    method: 'delete',
	    data: params.payload,
  	})
}

export async function update (params) {
  	return request({
	    url: mtsinfo + params.uuid,
	    method: 'patch',
	    data: params,
  	})
}

export async function MoveTo (params) {
  	return request({
	    url: `${mtsGroups}move-to`,
	    method: 'post',
	    data: params,
  	})
}

export async function CopyTo (params) {
  	return request({
	    url: `${mtsGroups}copy-to`,
	    method: 'post',
	    data: params,
  	})
}

//维护期告警定义
export async function queryPorts (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
	let uuid = params.uuid
	if (uuid === undefined) {
		uuid = params.selectHostuuid
	}
  	return request({
    		url: `${nes + uuid}/intfs`,
    		method: 'get',
    		data: newdata,
  	})
}

export async function queryQita (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
  	return request({
    		url: objectsMO,
    		method: 'get',
    		data: newdata,
  	})
}

export async function queryApp (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
  	return request({
    		url: appCategories,
    		method: 'get',
    		data: newdata,
  	})
}

export async function queryAppInCmdb (params) {
	params.pageSize = 100
  	return request({
    		url: appCategories,
    		method: 'get',
    		data: params,
  	})
}

export async function queryClustersByApp (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 50),
		}
	} else {
		newdata = { ...params }
	}

	return request({
		url: appSearchFromCmdb,
		method: 'get',
		data: newdata,
  })
}

export async function queryNamespacesByCluster (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 50),
		}
	} else {
		newdata = { ...params }
	}

	return request({
		url: appSearchFromCmdb,
		method: 'get',
		data: newdata,
  })
}

export async function findById (params) {
	return request({
		url: mtsinfo + params.uuid,
		method: 'get',
	})
}

export async function countAppName (params) {
	return request({
		url: `${objectsMO}appname-by-ips?${params}`,
		method: 'get',
	})
}
export async function queryData (params) {
	return request({
	  url: trackAlarm + 'currentTime',
	  method: 'get',
	})
  }

  export async function queryReviewer (params) {
	return request({
	  url: mtreviewer,
	  method: 'get',
	  data: params,
	})
  }

  export async function saveReviewer (params) {
	return request({
	  url: savereviewer,
	  method: 'post',
	  data: params,
	})
  }

  export async function myQuery (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			q: 'state!=\'OVERDUE\';tpe==\'NON_PERIODIC\'',
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
			groupUUID: (params.groupUUID ? params.groupUUID : ''),
			branch: (params.branch ? params.branch : ''),
			sort: params.sort ? params.sort : 'createdTime,desc',
			pageType:params.pageType
		}
	} else {
		if (params.q.includes('(branch == ') && !params.q.includes('state') && !params.q.includes('tpe')) {
			params.q += ';state!=\'OVERDUE\';tpe==\'NON_PERIODIC\''
		}
		newdata = { ...params }
		newdata.sort = params.sort ? params.sort : 'createdTime,desc'
	}
	return request({
	  url: mtsinfo + 'my-page',
	  method: 'get',
	  data: newdata,
	})
  }

  export async function updReviewer (params) {
	return request({
	  url: mtsinfo + 'review/' +params.mtId,
	  method: 'patch',
	  data: params,
	})
  }

  export async function adjust (params) {
	return request({
	  url: mtsinfo + 'adjust/' + params.uuid,
	  method: 'patch',
	  data: params,
	})
  }

  export async function operateRecord (params) {
	return request({
		url: performanceproxy + params.paths,
		method: 'post',
		data: params.es
	})
  }
  
  export async function disable (params) {
	return request({
		url: mtsinfo + `disable/${params}`,
		method: 'post'
	})
  }

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
	  url: mtExport + param,
	  method: 'get',
	  data: params,
	})
  }

  export async function patchDisable (params) {
	return request({
		url: mtsinfo + `disable1min`,
		method: 'post',
		data: params
	})
  }