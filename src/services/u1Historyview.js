import { request, config } from '../utils'
import moment from 'moment'

const {
 u1ReporterStatus, u1ReportSeveritys, u1ReportJournals, u1ReportDetails,
} = config.api

export async function query (params) {
	const yesterdayTime = moment().format('YYYY-MM-DD')
	const todayTime = moment().add(1, 'days').format('YYYY-MM-DD')

	params.sort = 'firstOccurrence,desc'
	params.q = params.q || ''
	if ((params.q !== '' || params.q) && params.q !== undefined) {
		if (params.q.includes('firstOccurrence <=')) {	//包含这种类型条件，就干掉，重新赋值（因为考虑跨天操作
			params.q = params.q.replace(`firstOccurrence <= ${todayTime};`, '')
			params.q = params.q.replace(`firstOccurrence <= ${yesterdayTime};`, '')
		}
	}
	params.q = `firstOccurrence <= ${todayTime};${params.q}`

	if (params.q.endsWith(';')) {
		params.q = params.q.substring(0, params.q.length - 1)
	}

  return request({
    url: u1ReporterStatus,
    method: 'get',
    data: params,
  })
}

export async function querySeverity (params) {
  return request({
    url: u1ReportSeveritys,
    method: 'get',
    data: params,
  })
}

export async function queryDetails (params) {
  return request({
    url: u1ReportDetails,
    method: 'get',
    data: params,
  })
}

export async function queryJournal (params) {
  return request({
    url: u1ReportJournals,
    method: 'get',
    data: params,
  })
}
