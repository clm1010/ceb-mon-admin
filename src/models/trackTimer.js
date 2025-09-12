import { query, create, remove, update } from '../services/trackTimer'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
* 监控配置/告警跟踪规则 
* @namespace tool
* @requires module:监控配置/告警跟踪规则 
*/
export default {
    namespace: 'trackTimer',

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
        q: '',
        pageChange: '',
        timeFileinfo: {},
        timertype: '',
        typeValue: '',
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
              const query = queryString.parse(location.search);
                if (location.pathname === '/trackTimer') {
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        /**
         * 获取资源
         * 与后台交互 调用接口  /api/v1/trace-conf/ (查看列表数据)
         * @function trackTimer.query
         */
        * query ({ payload }, { call, put }) {
            const data = yield call(query, payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.content,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                        },
                    },
                })
            }
        },

        /**
         * 新增资源 
         * 与后台交互 调用接口  /api/v1/trace-conf/ (新增按钮)
         * @function trackTimer.create
         */
        * create ({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        modalVisible: false,
                    },
                })
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        * requery ({ payload }, { put, select }) {
            /* yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            })) */
            let pageItem = yield select(({ trackTimer }) => trackTimer.pagination)
			// 获取URL中的所有查询参数，不仅仅是 q 参数
			let urlParams = parse(window.location.search.substr(1))

			yield put({
				type: 'query',
				payload: {
					page: pageItem.current - 1,
					pageSize: pageItem.pageSize,
					...urlParams  // 展开所有URL参数，包括 q, enabled 等
				},
			})
        },
         /**
         * 删除资源 (删除按钮)(批量删除按钮)
         * 与后台交互 调用接口  /api/v1/trace-conf/ (新增按钮)         
         * @function trackTimer.delete
         */
        * delete ({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
         /**
         * 编辑资源 
         * 与后台交互 调用接口  /api/v1/trace-conf/ (编辑按钮)     
         * @function trackTimer.update
         */
        * update ({ payload }, { select, call, put }) {
            const uuid = yield select(({ trackTimer }) => trackTimer.currentItem.uuid)
            const newtrackTimer = { ...payload, uuid }
            const data = yield call(update, newtrackTimer)
            if (data.success) {
                yield put({
                    type: 'showModal',
                    payload: {
                      modalVisible: false,
                      isClose: true,
                  },
                })
              yield put({ type: 'requery' })
            } else {
              throw data
            }
      },
    },

    reducers: {
        //浏览列表
        querySuccess (state, action) {
            const { list, pagination } = action.payload
            return {
                ...state,
                list,
                pagination: {
                    ...state.pagination,
                    ...pagination,
                },
            }
        },
        //这里控制弹出窗口显示
        showModal (state, action) {
            return { ...state, ...action.payload }
        },
        //这里控制弹出窗口显示
        setState (state, action) {
            return { ...state, ...action.payload }
        },
        updateState (state, action) {
            return { ...state, ...action.payload }
        },
    },

}
