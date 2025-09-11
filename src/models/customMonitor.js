import { queryMO, queryAlarms, issuIPs } from '../services/customMonitor'

export default {
  namespace: 'customMonitor',

  state:{
    Type: '',
    q: '',
    sql: '',
    tableSql: '(firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP) and (thirdClass==null or thirdClass!=NET_INTF )',
    batchDelete: true,
    selectedRows: [],
    selectedRowsAlarms: [],
    pagination: {									//分页对象
      showSizeChanger: true,						//是否可以改变 pageSize
      showQuickJumper: true,                        //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
      current: 1,									//当前页数
      total: 0,										//数据总数？
      pageSizeOptions: ['10','20','30','40','100','200']
    },
    paginationAlarms: {									//分页对象
      showSizeChanger: true,						//是否可以改变 pageSize
      showQuickJumper: true,                        //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
      current: 1,									//当前页数
      total: 0,										//数据总数？
      pageSizeOptions: ['10','20','30','40','100','200']
    },
    dataSourceAlarms: [],
    dataSource:[],
    modalVisible: false,
  },

  subscriptions:{
    setup ({ dispatch, history }) {
      history.listen(location => {
        //初次访问
        if(location.pathname === '/dashboard/customMonitor'){
          dispatch({
            type: 'query',
            payload:{
              page: 0,
              pageSize: 10,
              q: `(firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP) and (thirdClass==null or thirdClass!=NET_INTF )`,
              sort: `name,asc`
            }
          })
          dispatch({
            type: 'queryAlarm',
            payload:{

            }
          })
        }
      })
    }
  },

  effects:{
    *query ({payload},{put,call, select}){
      let tableSql = yield select(({ customMonitor }) => customMonitor.tableSql)
      if((!payload.q.includes('discoveryIP') || !payload.q.includes('hostname')) && payload.sql &&  payload.sql !==''){
        payload.q = tableSql + payload.sql
      }else if(payload.page){

      }else{
        payload.q = tableSql
      }
      const data = yield call ( queryMO, payload )
      yield put({
        type: 'setState',
        payload:{
          pagination: {
            current: data.page.number + 1 || 1,
            pageSize: data.page.pageSize || 10,
            total: data.page.totalElements,
            showTotal: total => `共 ${total} 条`,
            size: 'small'
          },
          dataSource: data.content,
          q:payload.q,
        }
      })
    },
    *queryAlarm ({payload},{put,call}) {
      const data = yield call ( queryAlarms, payload )
      if(data.success){
        yield put({
          type: 'setState',
          payload:{
            dataSourceAlarms: data.alertsResponse.alertList,
            paginationAlarms:{
              current: data.alertsResponse.page.number + 1 || 1,
              pageSize: data.alertsResponse.page.pageSize || 10,
              total: data.alertsResponse.page.totalElements,
              showTotal: total => `共 ${total} 条`,
              size: 'small'
            }
          }
        })
      }else {
        throw data
      }
    },

    *issue ( { payload },{ put, call } ) {
      const data = yield call (issuIPs, payload )
    }
  },

  reducers:{
    setState (state, action) {
      return { ...state, ...action.payload }
    }
  }
}
