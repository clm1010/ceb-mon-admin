import { getTop10ByTotal,getTop10ByNo } from '../services/discovery'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {
  namespace: 'discoveryInfoShow',

  state: {
    list: [], //定义了当前页表格数据集合
    currentItem: {},											 //被选中的单个行对象
    modalVisible: false, //弹出窗口是否可见
    modalType: 'create', //弹出窗口的类型
    pagination: { //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,									 //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    checkStatus: 'done',
    choosedRows: [],
    filterSchema: [],			//查询配置文件，自动加载生成查询界面

    infoList: [], //关联的对象对象
    mosVisible: false,
    infoVisible: false,
    paginationInfos: { //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,									 //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    q: '',
    pageChange: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/discovery/info') {
          dispatch({
            type: 'queryTotal',
          }),dispatch({
              type: 'queryNo',
            })
        }
      })
    },
  },

  effects: {
    * queryTotal({payload}, {call, put}) {
      const data = yield call(getTop10ByTotal, payload)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            list: data.arr
          },
        })
      }
    },

    * queryNo({payload}, {call, put}) {
      const data = yield call(getTop10ByNo, payload)
      if (data.success)
        yield put({
          type: 'showInfoModal',
          payload: {
            infoList: data.arr
          },
        })
      }
  },

  reducers: {
      //浏览列表
      querySuccess(state, action) {
        const {list, pagination} = action.payload
        return {
          ...state,
          list,
          pagination: {
            ...state.pagination,
            ...pagination,
          },
        }
      },

      //浏览列表
      querySuccessInfos(state, action) {
        const {infoList, paginationInfos} = action.payload
        return {
          ...state,
          infoList,
          paginationInfos: {
            ...state.paginationInfos,
            ...paginationInfos,
          },
        }
      },

      //这里控制弹出窗口显示
      showModal(state, action) {
        return {...state, ...action.payload}
      },
      showInfoModal(state, action) {
        return {...state, ...action.payload}
      },
      //这里控制弹出窗口隐藏
      hideModal(state, action) {
        return {...state, ...action.payload}
      },

      showCheckStatus(state, action) {
        return {...state, ...action.payload}
      },

      switchBatchDelete(state, action) {
        return {...state, ...action.payload}
      },
      showToolsUrl(state, action) {
        return {...state, ...action.payload}
      },
    }
}
