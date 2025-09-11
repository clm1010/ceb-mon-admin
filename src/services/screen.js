import { request, config } from '../utils'

const { screen ,alarms, objectsMO, oelEventFilter,osts} = config.api

export async function query () {

  const newdata = {
    //target_uuid:'',
    ost_uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sqls: [
      'select N_OrgId, min(N_CustomerSeverity) as severity from alerts.status group by N_OrgId',
      'select N_OrgId, min(N_CustomerSeverity),max(N_CustomerSeverity) as severity from alerts.status group by N_OrgId',
      'fdadafdasfs'
    ]
  }

  return request({
    url: screen,
    method: 'post',
    data: newdata,
  })
}

export async function queryAlarms (params) {
  let ost_uuid = '51fbf869-b754-4ef8-8866-387a84966c8e'
  let whereSQL = ''
  let newdata = {
    page:(params.pagination ? params.pagination.current : 0),
    pageSize:(params.pagination && params.pagination.pageSize !== 0 ? params.pagination.pageSize : 100),
    detail:'yes',
    //uuid:params.uuid,
  }

  if (typeof(params.whereSQL)!='undefined'){
    whereSQL = 'q=' + params.whereSQL
  }

  let kk = alarms + '?uuid=' + params.uuid + '&' +whereSQL
  let aa = kk.replace(new RegExp(/\(/,"g"),"%28").replace(new RegExp(/\)/,"g"),"%29").replace(new RegExp(/\|/,"g"),"%7C")
  return request({
    url: aa,
    method: 'get',
    data: newdata,
  })


}

export async function queryAlarmsByfiltername (params) {
  let newdata = {
    page:(params.pagination ? params.pagination.current : 0),
    pageSize:(params.pagination && params.pagination.pageSize !== 0 ? params.pagination.pageSize : 100),
    filtername:params.filtername
  }
  return request({
    url: osts + 'byfiltername',
    method: 'get',
    data: newdata,
  })
}

export async function queryMoRoomInfo (params) {
  return request({
    url: objectsMO + 'roomcountinfo',
    method: 'get',
    data: params,
  })
}

export async function queryFiltersByUUID (params) {
  let data = {
    current: 0,
    page: 0,
    pageSize: 10,
    q: params.q,
    sort: 'name,desc',
  }

  return request({
    url: oelEventFilter,
    method: 'get',
    data,
  })
}

/**
 * 网络大屏_第三方线路专线监控数据配置
 * @param name
 * @returns {*}
 */
export function genDictJsonObjectByNames (name) {
  let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
  let jsonObject = []
  dictArr.forEach((opt) => {
    if(opt.status === 0) {
      jsonObject.push(JSON.parse(opt.value))
    }
  })
  return jsonObject
}

/**
 * 网络大屏_第三方线路专线监控数据data上半部分配置
 * @param name
 * @returns {*}
 */
export function getDedicatedLineHealthStatusTopDataByName (name) {
  let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
  let jsonArr = []
  dictArr.forEach((opt) => {
    if(opt.status === 0) {
      if(JSON.parse(opt.value).location[1] < 0) {
         jsonArr.push({
            name : JSON.parse(opt.value).value,
            value : JSON.parse(opt.value).location,
            label :{
              normal:{
                rotate: -45
              }
            }
        })
      } else{
         jsonArr.push({
          name : JSON.parse(opt.value).value,
          value : JSON.parse(opt.value).location
        })
      }

    }
  })
  return jsonArr
}

/**
 * 获取网络大屏_标题
 * @param name
 * @param value
 * @returns {[]}
 */

export function getScreenTitleByNameAndValue (name, key) {
  let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
  let result = []
  dictArr.forEach((opt) => {
    if(opt.key === key){
      result = opt.value
    }
  })
  return result
}

/**
 * 获取网络大屏_oel跳转,
 * 获取网络大屏_办公大楼及作息健康状态_线路配置信息
 * @param name
 * @param key
 * @returns {[]}
 */

export function getScreenJsonObject (name, key) {
  let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
  let result = []
  dictArr.forEach((opt) => {
    if(opt.key === key){
      result = JSON.parse(opt.value)
    }
  })
  return result
}


/**
 * 获取骨干网健康状况分行信息
 * @param name
 * @returns {[]}
 */

export function getScreenBarChar (name) {
  let dictArr = JSON.parse(localStorage.getItem('dict'))[name]
  let result = []
  dictArr.forEach((opt) => {
      result.push(JSON.parse(opt.value))
  })
  let results= []
  results = result.sort(sortByOrder)
  return results
}

/**
 * order 字段正序排列
 * @param a
 * @param b
 * @returns {number}
 */
export function sortByOrder (a, b) {
  return a.order-b.order
}



