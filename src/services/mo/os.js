import { request, config } from '../../utils'

const { os } = config.api

export async function queryos (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10000),
			firstClass: params.firstClass,
			secondClass: params.secondClass,
			branchName: (params.branchName ? params.branchName : ''),
		}
	} else {
		newdata = { ...params }
		if(newdata.q && newdata.q.includes('discoveryIP---')){
			newdata.q = newdata.q.replace(/discoveryIP---/g, 'discoveryIP')
		}
	}
  	return request({
    		url: os,
    		method: 'get',
    		data: newdata,
  	})
}

export async function createos (params) {
  	return request({
    		url: os,
    		method: 'post',
    		data: params,
  	})
}
export async function createOsFsDisk(params) {
	console.log(6,params)
	//深度拷贝 保证params原target obj属性的完整
	// let os1 = JSON.stringify(params)
	// os1 = JSON.parse(os1)
	delete params.os.panes
	// let newdata = { "preIssueJobInfo": os1, }

	return request({
		url: os + "osAndFsAndDisk",
		method: 'post',
		data: params,
	})
}

export async function removeos (params) {
  	return request({
    		url: os,
    		method: 'delete',
    		data: params,
  	})
}

export async function updateos (params) {
  	return request({
    		url: os + params.uuid,
    		method: 'patch',
    		data: params,
  	})
}

export async function deleteos (params) {
  return request({
    url: os + params.uuid,
    method: 'delete',
    data: params,
  })
}


export async function createfs(params) {
	return request({
		url: `${os + params.belongsTo.uuid}/fses`,
		method: 'post',
		data: params,
	})
}


export async function osfsquery(params) {
	return request({
		url: os,
		method: 'get',
		data: params,
	})
}

export async function findById(params) {
	return request({
		url: `${os}fses/${params.uuid}`,
		method: 'get',
	})
}

export async function updatefs(params) {
	return request({
		url: `${os+params.belongsTo.uuid}/fses/${params.uuid}`,
		method: 'PATCH',
		data: params,
	})
}

export async function deletefs(params) {
	return request({
		url: `${os+params.belongsTo.uuid}/fses/${params.uuid}`,
		method: 'delete',
	})
}

export async function removeofs(params) {
	return request({
		url: `${os}fses/`,
		method: 'delete',
		data: params,
	})
}