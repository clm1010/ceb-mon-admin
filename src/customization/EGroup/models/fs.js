//@@@
import { findById, createfs, updatefs, deletefs, removeofs } from '../../../services/mo/os'
import { managed,query } from '../../../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from 'query-string';
import NProgress from 'nprogress'
export default {

    namespace: 'fs',				//@@@

    state: {
        q: '',																					//URL串上的q=查询条件
        list: [],																				//定义了当前页表格数据集合
        currentItem: {},																//被选中的行对象的集合
        modalVisible: false,														//弹出窗口是否可见
        modalType: 'create',														//弹出窗口的类型
        pagination: {																		//分页对象
            showSizeChanger: true,												//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
            current: 1,																		//当前页数
            total: 0,																			//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        batchDelete: false,															//批量删除按钮状态，默认禁用
        selectedRows: [],																//表格中勾选的对象，准备批量操作
        alertType: 'info',																//alert控件状态info,success,warning,error
        alertMessage: '请输入信息',										//alert控件内容
        managedData: [],
        osType: '',
        secondClass: '',
        pageChange: '',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                //初次访问
                if (location.pathname === '/fs' && location.search.length === 0) {
                    //制造一个浏览器地址栏看得见的跳转，仅仅是跳转，再次触发subscription监听进行query查询
                    const { pathname } = location
                    const query = {
                        q: 'firstClass==\'OS\';secondClass==\'OS_LINUX\';thirdClass==\'OS_FS\'',
                        page: 0
                    }
                    const stringified = queryString.stringify(query)
                    dispatch(routerRedux.push({
                        pathname,
                        search: stringified,
                        query: query,
                    }))
                } else if (location.pathname === '/fs' && location.search.length > 0) {
                    let query = location.query
                    if (query === undefined) {
                        query = queryString.parse(location.search);
                    }
                    if (query.firstClass != undefined && query.secondClass != undefined) {
                        dispatch({
                            type: 'setState',
                            payload: ({
                                q: `firstClass=='${query.firstClass}';secondClass=='${query.secondClass}'`,
                                secondClass: query.secondClass,
                            }),
                        })
                    }
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put }) {
            const data = yield call(query, payload)
            NProgress.done()//异步加载动画结束
            if (data.success) {
                yield put({
                    type: 'setState',
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
        * findById({ payload }, { call, put }) {
            const data = yield call(findById, payload.currentItem)				//@@@
            let info = []
            if (data.success) {
                if (data.appMode !== undefined && data.appMode !== '') {
                    info = data.appMode.split('/')
                }
                data.appMode = info
                yield put({
                    type: 'setState',
                    payload: {
                        currentItem: data,
                        modalVisible: true,
                        modalType: 'update',
                    },
                })
            }
        },
        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
        * update({ payload }, { select, call, put }) {
            //取currentItem是为了获取完整的对象来全量update后端的mo对象
            let currentItem = {}
            currentItem = yield select(({ fs }) => fs.currentItem)				//@@@

            currentItem = Object.assign(currentItem, payload.currentItem)

            let data = {}
            data = yield call(updatefs, currentItem)				//@@@
            let info = []
            if (data.success) {
                message.success('设备修改成功！')
                if (data.appMode !== undefined && data.appMode !== '') {
                    info = data.appMode.split('/')
                }
                data.appMode = info
                payload.currentItem = data
                payload.alertType = 'success'
                payload.alertMessage = '操作系统信息修改成功。'				//@@@

                yield put({
                    type: 'setState',
                    payload,
                })
                yield put({ type: 'requery' })
            } else {
                message.error('设备修改失败！')
                payload.alertType = 'error'
                payload.alertMessage = '操作系统信息修改失败。'				//@@@

                yield put({
                    type: 'setState',
                    payload,
                })
                throw data
            }
        },
        * create({ payload }, { select, call, put }) {
            payload.currentItem.firstClass = 'OS'				//@@@
            let currentItem = {}
            currentItem = yield select(({ fs }) => fs.currentItem)				//@@@
            currentItem = Object.assign(currentItem, payload.currentItem)
            currentItem.keyword = ''				//@@@
            const data = yield call(createfs, currentItem)				//@@@
            if (data.success) {
                message.success('设备保存成功！')
                payload.alertType = 'success'
                payload.alertMessage = '操作系统信息保存成功。'				//@@@
                payload.currentItem = {}
                payload.modalVisible = false

                yield put({
                    type: 'setState',
                    payload,
                })
                yield put({ type: 'requery' })
            } else {
                message.error('设备保存失败!')
                yield put({
                    type: 'setState',
                    payload: {
                        alertType: 'error',
                        alertMessage: '操作系统信息保存失败。',				//@@@
                    },
                })
                throw data
            }
        },
        * delete({ payload }, { select, call, put }) {
            const data = yield call(deletefs, payload)				//@@@
            if (data.success) {
                message.success('设备删除成功！')
                yield put({ type: 'requery' })
            } else {
                message.error('设备删除失败！')
                throw data
            }
        },
        * deleteAll({ payload }, { select, call, put }) {
            let data = {}
            data = yield call(removeofs, payload)				//@@@

            if (data.success) {
                message.success('设备删除成功！')
                yield put({ type: 'requery' })
                yield put({
                    type: 'setState',
                    payload: ({
                        batchDelete: false,
                    }),
                })
            } else {
                message.error('设备删除失败！')
                throw data
            }
        },
        * managed({ payload }, { call, put }) {
            const data = yield call(managed, payload)
            if (data.success) {
                delete data.message
                delete data.status
                delete data.success
                yield put({
                    type: 'setState',
                    payload: {
                        managedModalVisible: true,
                        managedData: data.mos,
                        manageState: false,
                    },
                })
            } else {
                yield put({
                    type: 'setState',
                    payload: {
                        managedModalVisible: false,
                    },
                })
                message.error('批量修改失败!')
            }
        },
    },
    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
