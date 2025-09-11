import { getTOLCdata } from '../services/tolc'
import { parse } from 'qs'
import { getSourceByKey} from './../utils/FunctionTool'
const user = JSON.parse(sessionStorage.getItem('user'))
let onPower = user.roles
let disPower = false
for (let a = 0; a < onPower.length; a++) {
    if (onPower[a].name == '超级管理员') {
        disPower = true
    }
}

export default {

    namespace: 'qhNetLog',				//@@@

    state: {
        list: [],																				//定义了当前页表格数据集合
        pagination: {																		//分页对象
            showSizeChanger: true,												//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
            current: 1,																		//当前页数
            total: 0,																			//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        condition: {
            indexs: '_tolc-app-ump-ncolog-%{YYYY.MM},tolc-app-ump-ncolog-%{YYYY.MM}',
            q: null,
            time: {},
            page: {
                size:10
            }
        },
        branch_ips:[]
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                //初次访问
                if (location.pathname === '/qhNetLog') {				//@@@
                    let branch_ips = []
                    if(!disPower){
                        const userBranch = getSourceByKey('SYSLOG_LOG')
                        userBranch.forEach(item =>{
                            if(user.branch == item.key){
                                let ips = item.value.split(',')
                                ips.forEach(e => {
                                    branch_ips.push(`ipaddress == \"${e}\"`)
                                })
                            }
                        })
                    }
                    const condition = {
                        time:{},
                        q:disPower ? '' : `| where (${branch_ips.join(' || ')})`
                    }
                    condition.time.start = new Date().getTime() - 1000 * 60 * 60
                    condition.time.end = new Date().getTime()
                    dispatch({
                        type: 'query',
                        payload: condition,
                    })
                    dispatch({
                        type:'setState',
                        payload:{
                            branch_ips
                        }
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put, select }) {
            let condition = yield select(({ qhNetLog }) => qhNetLog.condition)
            condition = Object.assign({}, condition, payload)

            const data = yield call(getTOLCdata, condition)				//@@@
            if (data.success) {
                const opList = []
                const objKeysIndex = {}
                data.content.columns.forEach((item, index) => {
                    objKeysIndex[item.name] = index
                })
                const result = data.content.data
                if (result.length > 0) {
                    result.forEach(item => {
                        const obj = {}
                        obj.source_ip = item.values[objKeysIndex.source_ip]
                        obj.systime = item.values[objKeysIndex.systime]
                        obj.message = item.values[objKeysIndex.message]
                        opList.push(obj)
                    })
                }
                yield put({
                    type: 'setState',
                    payload: {
                        list: opList,
                        pagination: {
                            current: condition.page.current + 1 || 1,
                            pageSize: condition.page.size || 10,
                            total: data.content.totalSize,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50', '100'],
                        },
                        condition: condition
                    },
                })
            }
        },
        * requery({ payload }, { select, put }) {
            let pageItem = yield select(({ qhNetLog }) => qhNetLog.pagination)
            let q = parse(window.location.search.substr(1)).q

            yield put({
                type: 'query',
                payload: {
                    page: pageItem.current - 1,
                    pageSize: pageItem.pageSize,
                    q: q
                },
            })
        },
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}
