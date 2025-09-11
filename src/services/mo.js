import { request, config } from '../utils'

const { objectsMO } = config.api

export async function query (params) {
	let	 id = ''
	if (typeof (params.id) !== 'undefined') {
		id = params.id
		params = ''
	}

	let newdata = {}
	if (params && params.q === '') {
		newdata = {
			page: (params.page ? params.page : 0),
			pageSize: (params.pageSize ? params.pageSize : 10),
		}
	} else {
		newdata = { ...params }
	}
	newdata.sort = 'name,asc'
  return request({
    url: objectsMO + id,
    method: 'get',
    data: newdata,
  })
}
