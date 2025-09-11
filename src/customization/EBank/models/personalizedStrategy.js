import { query } from '../../../services/personalizedStrategy'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";

export default {

    namespace: 'personalizedStrategy',

    state: {
        list: [],										//定义了当前页表格数据集合
        currentItem: {},									//被选中的单个行对象
        pagination: {									//分页对象
            showSizeChanger: true,						//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,		//用于显示数据总量
            total: null,									//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            defaultPageSize: 10
        },
        modalVisible:false,
        type: '',
        orgID: ''
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                let query = location.query
				if (query === undefined) {query = queryString.parse(location.search)}
                if (location.pathname === '/personalizedStrategy') {
                    dispatch({
                        type: 'query',
                        payload:query
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put }) { //查询数据
            const data = yield call(query, payload) //与后台交互，获取数据
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.content,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
                        },
                        q: payload.q,	//把查询条件放到state中
                    },
                })
            }
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
