
import { query } from '../services/APPinfor'
import queryString from "query-string";
export default {

  namespace: 'APPinfor',
  state: {
    q: '', //URL串上的q=查询条件
    list: [], //定义了当前页表格数据集合
    currentItem: {}, //被选中的行对象的集合
    modalVisible: false, //弹出窗口是否可见
    modalType: 'create', //弹出窗口的类型
    pagination: { //分页对象
        showSizeChanger: true, //是否可以改变 pageSize
        showQuickJumper: true, //是否可以快速跳转至某页
        showTotal: total => `共 ${total} 条`, //用于显示数据总量
        current: 1, //当前页数
        total: 0,										//数据总数？
        pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },

    rowDoubleVisible: false, //弹出Modal的参数 star
    defaultKey: 0,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
        history.listen((location) => {
            if (location.pathname == '/APPinfor') {
                let query = location.query
					      if (query === undefined) {
                    query = {}
                    if  (location.search.length > 0){
                      query = queryString.parse(location.search)
                    }
                }
                console.dir(query)
                dispatch({
                    type: 'query',
                    payload: query,
                })
            }
        })
    },
  },
  effects: {
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
              q: payload.q,
            },
          })
        }
    },
  },
  reducers: {
    querySuccess (state, action) {
        return { ...state, ...action.payload }
      },
  },
}
