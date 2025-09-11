import { xykrequest, config } from '../utils'
import moment from 'moment'
const { xykuserLogin, xykhistoryview, xykseverity, xykjournal, xyknotificationInfo,xykappCategories} = config.api

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

export async function xykquery (params) {
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
		params.q = params.q.replace('isClear==\'0\'', '')	// 先干掉，然后在q的头部追加，特殊情况
		params.q = `severity==0;${params.q}`
	} else if (params.q.includes('isClear==\'1\'')) {
		params.q = params.q.replace('isClear==\'1\'', '')	// 先干掉，然后在q的头部追加，特殊情况
		params.q = `severity!=0;${params.q}`
	}
	if (params.q.includes("deleteDat=='0'")) {
		params.q = params.q.replace("deleteDat=='0'", 'deleteDat==null')	
	}
	if (params.q.includes("deleteDat=='1'")) {
		params.q = params.q.replace("deleteDat=='1'", 'deleteDat!=null')	
	}
	// 由于特殊情况，可能会产生;;，需要替换
	params.q = params.q.replace(/;;/g, ';')

	if (params.q.endsWith(';')) {
		params.q = params.q.substring(0, params.q.length - 1)
	}

  return xykrequest({
    url: xykhistoryview,
    //url:'http://10.218.32.71/searchxykalarm/api/v1/reporter_status/',
    method: 'get',
    data: params,
  })
}

export async function xykquerySeverity (params) {
  return xykrequest({
    url: xykseverity,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/rep_audit_severity/',
    method: 'get',
    data: params,
  })
}
export async function xykqueryJournal (params) {
  return xykrequest({
    url: xykjournal,
	//url:'http://10.218.32.71/searchxykalarm/api/v1/reporter_journal/',
    method: 'get',
    data: params,
  })
}
export async function xykMSMQuery (params) {
	return xykrequest({
	  url: xyknotificationInfo,
	  //url:'http://10.218.32.71/searchxykalarm/api/v1/notification/',
	  method: 'get',
	  data: params,
	})
  }
export async function xykqueryApp (params) {
	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
  	return xykrequest({
		url: xykappCategories,
		//url: 'http://10.218.32.71/searchxykalarm/api/v1/app-categories/',
		method: 'get',
		data: newdata,
  	})
}
