import { getOsMO, osUpMonitor, monitorState, monitorResult, getOS, offline, queryZabbixHost } from '../../../services/osWizard'
import { getVerify, addMonitor } from '../../../services/wizard'
import { findAllApp } from '../../../services/appCategories'
import { Modal } from 'antd'

export default {

    namespace: 'oswizard',

    state: {
        q: '',
        fh_os_DrawerVisible: false,
        os_DrawerVisible: false,
        down_DrawerVisible: false,
        expand: false,
        loadingState: false,
        currentStep: 0,
        appCategorlist: [], // 网络域内容
        hasMOMess: '',
        resultState: '',
        resultMess: '',
        secondflag: false,       // 是否要跳过第二步
        monitorList: {},        // 保存监控结果 
        MOList: [],            //保存MO确认的信息
        monitoresult: {},        // 保存监控的结果
        findOSData: {},           // 导入MO后，确定mo情况，那些存在，那些不存在
        addMo: [],                // 导入Mho后 新增的MO
        validateMO: [],              // 合并后MO
        // 整机ip下线 startOffline
        downList: [],
        downpagination: {								//分页对象
            showSizeChanger: true,						//是否可以改变 pageSize
            showQuickJumper: true,                      //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,		//用于显示数据总量
            current: 1,									//当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '20', '50', '100', '200'],
        },
        down_os_uuids: [],                        // 记录下线mo的uuid
        down_os_ips: [],                         // 记录下线mo的ip
        offlineResult: {},                        // 下线返回结果对象
        oelModalVisible: false,                  // 是否显示告警展示modal
        // 整机ip下线 end
        loadingOState: false,
        visibleOelDetail: false,
        OelItem: {},
        fieldKeyword: '',
        loadingDownState: false,
        zabbixHostList: [],        // 存放同一个ip下设备信息
        loading_step: 0,         // 加载状态的时间估值
        loading_state: false,     // my_loading 的状态
        branchType: '',
        ///数据库
        db_DrawerVisible: false,
        loadingDBstate: false,
        MOData: [],     // Mo信息
        existMoint: [], //存在监控
        importItem: [],  //导入信息
        verifyRes: [], //验证结果信息
        thirdRes: false,//是否存在监控
        fourRes: false,//验证结果信息是否通过
        os_type: '',
        //中间件
        mw_DrawerVisible: false,
        Ping_DrawerVisible: false,
        needMO:[]
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/oswizard') { }
            })
        },
    },

    effects: {
        /* 
            操作系统自服务 -发现MO
        */
        * findOsMO({ payload }, { call, put }) {
            const data = yield call(getOsMO, payload)
            if (data.success) {
                if (data.os.appName && data.os.appName != '') {
                    yield put({
                        type: 'updateState',
                        payload: {
                            item: data.os,
                            hasMOMess: ':MO 信息存在,显示为合并后的最新信息',
                            currentStep: 1,
                        },
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            item: data.os,
                            currentStep: 1,
                        }
                    })
                }
            } else if (data) {
                Modal.warning({
                    title: 'MO不通',
                    content: data.message,
                })
            } else {
                throw data
            }
            yield put({
                type: 'updateState',
                payload: {
                    loadingState: false
                }
            })
        },
        /* 
            操作系统自服务 -上监控
        */
        * wizardPreview({ payload }, { call, put, select }) {
            const data = yield call(osUpMonitor, payload)
            if (data.success) {
                if (data.result) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            resultState: 'success',
                            hasMOMess: "",
                            currentStep: 2,
                            resultMess: data.message
                        }
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            resultState: 'failed',
                            hasMOMess: "",
                            currentStep: 2,
                            resultMess: data.message
                        }
                    })
                }

            } else {
                throw data
            }
        },
        /* 
            获取网络域选项内容
        */
        *appcategories({ payload }, { call, put }) {
            const data = yield call(findAllApp, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        appCategorlist: data.arr
                    }
                })
            }
        },

        /* 
            基于南天Zabbix监测是否已存在监控
         */
        *checkexistsmonitor({ payload }, { call, put, select }) {
            const data = yield call(monitorState, payload.validateMO)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                if (data.requestResult && data.requestResult.length > 0) {
                    let message = ''
                    data.requestResult.forEach(item => {
                        message += `${item.hostIP}--->host已存在,${item.msg};\n`
                    })
                    Modal.error({
                        title: '监控结果',
                        content: message,
                        onOk: payload.onFun,
                        width: 450
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            monitorList: data,
                            currentStep: currentStep + 1
                        }
                    })
                }
            } else {
                throw data
            }
        },
        /* 
            基于南天Zabbix操作系统批量上监控
        */
        *batch({ payload }, { call, put, select }) {
            const data = yield call(monitorResult, payload)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currentStep: currentStep + 1,
                        monitoresult: data,
                        loadingOState: false,
                    }
                })
            } else {
                throw data
            }
        },
        /* 
            查询操作系统os的信息
        */
        *getOS({ payload }, { call, put, select }) {
            const data = yield call(getOS, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        downList: data.content,
                        downpagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50', '100', '200'],
                        },
                        q: payload.q,
                    }
                })
            } else {
                throw data
            }
        },
        /* 
         */
        *Offline({ payload }, { call, put, select }) {
            const data = yield call(offline, payload)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currentStep: currentStep + 1,
                        offlineResult: data,
                        loadingDownState: false
                    }
                })
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        loadingDownState: false
                    }
                })
                throw data
            }
        },
        /**
         * getzabbixHost 获取同一个ip下的zabbix下的设备信息
         */
        *getzabbixHost({ payload }, { call, put, select }) {
            const data = yield call(queryZabbixHost, payload)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currentStep: currentStep + 1,
                        zabbixHostList: data.arr,
                        loadingDownState: false
                    }
                })
            } else {
                throw data
            }
        },
        /**
         * @funciong
         * @parame
         * 验证zabbix是否联通，获取最新数据
         */
        *verify({ payload }, { call, put, select }) {
            const os_type = yield select(({ oswizard }) => oswizard.os_type)
            payload.os_type = os_type
            const data = yield call(getVerify, payload)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currentStep: currentStep + 1,
                        verifyRes: data.requestResult,
                        loadingDownState: false,
                        fourRes: data.requestResult[0].length > 0 ? false : true
                    }
                })
            } else {
                throw data
            }
        },
        /**
         * @funciong
         * @parame item/ticket
         * 验证zabbix是否联通，获取最新数据
         */
        *addMonit({ payload }, { call, put, select }) {
            const data = yield call(addMonitor, payload)
            const currentStep = yield select(({ oswizard }) => oswizard.currentStep)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        currentStep: currentStep + 1,
                        monitoresult: data,
                        loadingDownState: false
                    }
                })
            } else {
                throw data
            }
        },
    },

    reducers: {
        //浏览列表
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
