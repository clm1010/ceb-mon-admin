import { request, config } from '../utils'
import qs from 'qs'
const {
	api,
  } = config
  const {
	performance,
	performanceproxy,
	dsl,
  } = api

export async function queryES (params) {
	return request({
		url: performance,  
		method: 'post',
		data: params.es
	})	
}
export async function queryDSL (params) {
	return request({
		url: dsl,  
		method: 'post',
		data: params
	})	
}