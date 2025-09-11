import { request, config } from '../utils'
import moment from 'moment'
import download from '../utils/download'

const {
	historyview, severity, details, journal, changeMt, historyQuery, historyCloums, grafanaAdress
} = config.api

export async function updateMt(params) {
	return request({
		url: changeMt,
		method: 'post',
		data: params,
	})
}

export async function query(params) {
	const yesterdayTime = moment().format('YYYY-MM-DD')
	const todayTime = moment().add(1, 'days').format('YYYY-MM-DD')

	params.sort = 'firstOccurrence,desc'
	params.q = params.q || ''
	if ((params.q !== '' || params.q) && params.q !== undefined) {
		if (params.q.includes('firstOccurrence <=')) {	// 包含这种类型条件，就干掉，重新赋值（因为考虑跨天操作
			params.q = params.q.replace(`firstOccurrence <= ${todayTime};`, '')
			params.q = params.q.replace(`firstOccurrence <= ${yesterdayTime};`, '')
		}
	}

	params.q = `firstOccurrence <= ${todayTime};${params.q}`

	if (params.q.includes('isClear==\'0\'')) {
		params.q = params.q.replace('isClear==\'0\'', '')	// 先干掉，然后在q的头部追加，特殊情况 告警恢复状态是指告警的可恢复状态 即 n_RecoverType==1
		params.q = `severity==0;n_RecoverType==1;${params.q}`
	} else if (params.q.includes('isClear==\'1\'')) {
		params.q = params.q.replace('isClear==\'1\'', '')	// 先干掉，然后在q的头部追加，特殊情况 告警恢复状态是指告警的可恢复状态 即 n_RecoverType==1
		params.q = `severity!=0;n_RecoverType==1;${params.q}`
	}
	if (params.q.includes("deleteDat=='0'")) {
		params.q = params.q.replace("deleteDat=='0'", 'deleteDat==null')
	}
	if (params.q.includes("deleteDat=='1'")) {
		params.q = params.q.replace("deleteDat=='1'", 'deleteDat!=null')
	}
	if (params.q.includes("n_OrgID==FH")) {
		params.q = params.q.replace("n_OrgID==FH", 'n_OrgID!=ZH')
	}
	if (params.q.includes("(n_OrgID==QH);")) {
		params.q = params.q.replace("(n_OrgID==QH);", '')
	} else if (params.q.includes("or n_OrgID==QH")) {
		params.q = params.q.replace("or n_OrgID==QH", '')
	} else if (params.q.includes("n_OrgID==QH or")) {
		params.q = params.q.replace("n_OrgID==QH or", '')
	}

	if (params.q.includes("n_MgtOrgID==FH")) {
		params.q = params.q.replace("n_MgtOrgID==FH", 'n_MgtOrgID!=ZH')
	}
	// if (params.q.includes("n_MgtOrgID==QH")) {
	// 	params.q = params.q.replace("n_MgtOrgID==QH", 'n_MgtOrgID==ZH or n_MgtOrgID!=ZH')
	// }
	if (params.q.includes("(n_MgtOrgID==QH);")) {
		params.q = params.q.replace("(n_MgtOrgID==QH);", '')
	} else if (params.q.includes("or n_MgtOrgID==QH")) {
		params.q = params.q.replace("or n_MgtOrgID==QH", '')
	} else if (params.q.includes("n_MgtOrgID==QH or")) {
		params.q = params.q.replace("n_MgtOrgID==QH or", '')
	}
	// 备注判断
	if (params.q.includes("n_Note==0")) {
		params.q = params.q.replace("n_Note==0", '')
	} else if (params.q.includes("n_Note==1")) {
		params.q = params.q.replace("n_Note==1", "n_Note==''")
	} else if (params.q.includes("n_Note==2")) {
		params.q = params.q.replace("n_Note==2", "n_Note!=''")
	}

	// 由于特殊情况，可能会产生;;，需要替换
	params.q = params.q.replace(/;;/g, ';')

	if (params.q.endsWith(';')) {
		params.q = params.q.substring(0, params.q.length - 1)
	}

	params.q = params.q.replace(new RegExp(/\[/, 'g'), '%5B').replace(new RegExp(/\]/, 'g'), '%5D')
	return request({
		url: historyview,
		method: 'get',
		data: params,
	})
}

export async function queryFault(params) {
	return request({
		url: historyview,
		method: 'get',
		data: params,
	})
}

export async function querySeverity(params) {
	//let newDate = {
	//	q: params.q ? params.q : '',
	//	page: params.page ? params.page : 0,
	//	pageSize: params.pageSize ? params.pageSize : 10,
	//}
	return request({
		url: severity,
		method: 'get',
		data: params,
	})
}

export async function queryDetails(params) {
	//let newDate = {
	//	q: params.q ? params.q : '',
	//	page: params.page ? params.page : 0,
	//	pageSize: params.pageSize ? params.pageSize : 10,
	//}
	return request({
		url: details,
		method: 'get',
		data: params,
	})
}

export async function queryJournal(params) {
	//let newDate = {
	//	q: params.q ? params.q : '',
	//	page: params.page ? params.page : 0,
	//	pageSize: params.pageSize ? params.pageSize : 10,
	//}
	return request({
		url: journal,
		method: 'get',
		data: params,
	})
}

export async function queryBySql(params) {
	return request({
		url: historyQuery,
		method: 'get',
		data: params,
	})
}

//导出
export async function onDown(params) {
	return download({
		url: params,
		method: 'get',
		data: {
			filename: '历史告警'
		}
	})
}

export async function saveHistoryColums(params) {
	return request({
		url: historyCloums + params.uuid,
		method: 'patch',
		data: params,
	})
}
export async function findHistoryColums(params) {
	return request({
		url: historyCloums,
		method: 'get',
		data: params,
	})
}
export async function createHistoryColums(params) {
	return request({
		url: historyCloums,
		method: 'post',
		data: params,
	})
}

export async function delDefindColums(params) {
	return request({
		url: historyCloums + params.uuid,
		method: 'delete',
	})
}

export async function querGrafana(params) {
	return request({
		url: grafanaAdress,
		method: 'get',
		data: params,
	})
}