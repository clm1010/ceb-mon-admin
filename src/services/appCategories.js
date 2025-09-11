import { request, config } from '../utils'

const { appCategories } = config.api

//获取应用系统
export async function query (params) {
  if(params.q && params.q.includes('ID==')){
    let arr = params.q.split(';')
    let val
    for(let i of arr){
      if(i.includes('ID')){
        val = i.split('==')[1]
        if(i.split('==')[0] == 'ID'){
          params.q = params.q.replace(`ID==${val}`,`(applicateManagerAID==${val} or applicateManagerBID==${val} or businessManagerID==${val} or dbaID==${val} or dbaBID==${val} or middlewareManagerID==${val} or middlewareManagerBID==${val} or operateManagerID==${val} or storeManagerID==${val} or systemManagerAID==${val} or systemManagerBID==${val} or systemManagerAID==${val})`)
        }
      }
    }
  }
  
	let newDate = {
		q: params.q ? params.q : '',
		page: params.page ? params.page : 0,
		pageSize: params.pageSize ? params.pageSize : 10,
	}
  return request({
    url: appCategories,
    method: 'get',
    data: newDate,
  })
}

//批量删除应用系统
export async function remove (params) {
  return request({
    url: appCategories,
    method: 'delete',
    data: params.uuid,
  })
}

//更新应用系统
export async function update (params) {
  return request({
    url: appCategories + params.uuid,
    method: 'patch',
    data: params,
  })
}

//增加应用系统
export async function create (params) {
  return request({
    url: appCategories,
    method: 'post',
    data: params,
  })
}

//通过uuid获取单个应用系统
export async function findById (params) {
  return request({
    url: appCategories + params.uuid,
    method: 'get',
    data: params,
  })
}

//获取所有应用系统
export async function findAllApp (params) {
  return request({
    url: appCategories + 'list',
    method: 'get',
    data: params,
  })
}