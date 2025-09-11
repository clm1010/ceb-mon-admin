import { query } from '../services/distribution'
import { query as queryAllFilters } from '../services/oel/oelEventFilter'
import { conf } from '../utils/distribution'
import { config } from '../utils'
import { message } from 'antd'
import queryString from "query-string";

export default {
  namespace: 'distribution',

  state: {
    list: [],
    appName: '',
    acknowledged: 'all',
    countState: true,
    initValue: config.countDown,
    FirstOccurrence:undefined
  },

  effects: {
    * query({ payload }, { call, put }) {
      let acknowledged = payload.acknowledged
      let appName = payload.appName
      let FirstOccurrence = payload.FirstOccurrence
      // 1.从过滤器中取出所有名字包含 【告警分布图-】字样的过滤器集合
      const filters = yield call(
        queryAllFilters,
        {
          q: {
            page: 0,
            pageSize: 9999,
            q: 'name==\'*告警分布图-*\'',
          },
        }
      )
      if (filters.content !== undefined) {
        let p = {
          ost_uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
          sqls: [],
        }
        // 2.组装具体某一个app或者接管状态参数的where条件
        let w = ' and N_CustomerSeverity != 0' // 默认忽略 N_CustomerSeverity 等于0 类型的告警

        if (payload !== undefined) {
          if (payload.acknowledged === 'all') {

          } else if (payload.acknowledged !== undefined && payload.acknowledged !== '') {
            w += ` and Acknowledged = ${payload.acknowledged}`
          }

          if (payload.appName !== undefined && payload.appName !== '') {
            w += ` and N_AppName = '${payload.appName}'`
          }
          if(payload.FirstOccurrence !== undefined && payload.FirstOccurrence !==''){
            w += ` and FirstOccurrence >= ${payload.FirstOccurrence}`
          }
        }

        // 3.拼装成一个从后台取告警分布数据的请求参数参数
        for (const item of conf) {
          let flag = false
          for (const filter of filters.content) {
            if (item.uuid === filter.uuid) {
              // 构建各个模块的查询sql
              const sql = `select min(N_CustomerSeverity) as customerseverity, count(*) as total from alerts.status where ${filter.filter.filterItems[0].value} ${w}`
              // push到请求sql数组中，准备到后端发起查询
              p.sqls.push(sql)
              flag = true
              break
            }
          }
          // 如果某区域没有从结果中匹配到过滤器，设置为空。
          if (flag === false) {
            p.sqls.push('')
          }
        }

        // 4.请求告警分布数据
        const data = yield call(query, p)
        if (data.success) {
          // 5.根据返回的数值判断各个区块的最严重的告警等级。
          let res = []
          for (const item of data.data) {
            if (item.success) {
              if (item.resultset.length === 0) {
                res.push([8, 0]) // 如果查不到告警，返回数字8，显示呈现灰色提示用户
              } else if (item.resultset.length > 1) {
                res.push([9, 0]) // 如果查到多条记录，返回数字9，代表过滤器SQL定义有问题。因为sql只能查到一条
              } else if (item.resultset[0].customerseverity == undefined || item.resultset[0].customerseverity === 0) {
                res.push([8, 0]) // 如果查不到告警，返回数字8，显示呈现灰色提示用户. 如果有0的情况，其实没有任何告警。因为过滤器默认过滤了customerSeverity等于0的情况（omnibus的bug),umdb默认不返回customerseverity
              } else {
                res.push([item.resultset[0].customerseverity, item.resultset[0].total])
              }
            } else { // 如果查询失败，返回数字9，代表查询失败，显示呈现黑色提示用户
              res.push([9, 0])
            }
          }
          // 6.数据转换成ECHART图表可识别的格式
          let params = []
          for (let c of conf) {
            const t = [...c.postion]
            t.push(c.name)
            t.push(c.uuid)
            params.push(t)
          }
          for (let i = 0; i < res.length; i++) {
            params[i].push(res[i][0])
            params[i].push(payload.appName || '')
            params[i].push(payload.acknowledged || '')
            params[i].push(res[i][1])
            params[i].push(payload.FirstOccurrence || '')
          }
          yield put({
            type: 'querySuccess',
            payload: {
              list: params,
              acknowledged,
              appName,
              FirstOccurrence,
            },
          })
        } else {
          message.error('分布图各个模块告警请求失败。')
        }
      } else {
        message.error('分布图各个模块告警过滤器请求失败。')
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/alarmdiagram') {
          dispatch({
            type: 'query',
            payload: query,
          })
        }
      })
    },
  },

  reducers: {
    querySuccess(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
