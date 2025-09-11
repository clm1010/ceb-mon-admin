import React from 'react'
import {
    query, create_update, remove, queryDevice, removeDevice, dwn, run, runStatus, getDictF, getDictChild, addDict, deviceSave, deviceOffline, onDownDevice,
    addPolicyGroup, queryGroup, deleGroup, querytemplate, addTemplate, deleTemplete, querycondition, addCondition, deleCondition, addTempToaGroup, addCondiTiontoTemp,
    queryconditionbytemplet, querytemplatebyGroup, binDev, unbinDev, queryDevGroup, replaceTemp, getPolicyGDevG, getAllDeviceGroup,saveRelationDeviceGroup
} from '../../../services/flinkComputPlat'
import { Modal, message } from 'antd'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

export default {

    namespace: 'flinkComputPlat',

    state: {
        currentItem: {},
        modalVisible: false,							//弹出窗口是否可见
        modalType: 'create',							//弹出窗口的类型
        pagination: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '20', '50'],
        },
        choosedRows: [],
        batchDelete: false,

        listDevice: [],
        currentItemDevice: {},
        paginationDevice: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '50', '200', '500'],
        },
        contions: {},

        searchMoalVisible: false,
        searchValues: '',
        deviceModalVisible: false,
        dictModalVisible: false,
        addDictVisible: false,
        DictList1: [],
        DictList2: [],
        DictList3: [],
        level: 0,
        parentId: null,
        parentId1: null,
        parentId2: null,

        showpolicyGropuVisible: false,
        showConditionVisible: false,
        groupItem: {},
        tempModalVisible: false,

        polickList: [],
        groupList: [],
        tempList: [],
        contionList: [],
        addconditonVisible: false,
        bindgoupVisible: false,
        tempItem: {},
        tempCondition: [],
        groupTemp: [],
        pagination1: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '20', '50'],
        },
        bindGroupTyep: '',
        replaceTempModalVisible: false,
        bindDevGroupModalVisible: false,
        devGroupList: [],
        devGroupAllList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                let query = location.query
                if (query === undefined) { query = queryString.parse(location.search) }

                if (location.pathname === '/flinkComputPlat') {
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put, select }) { //查询数据
            const data = yield call(query, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        polickList: data.data.result,
                        pagination: {
                            current: data.data.page || 1,
                            pageSize: data.data.size || 10,
                            total: data.data.count,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                        contions: payload,
                    },
                })
            } else {
                throw data
            }
        },
        // 查询设备
        * queryDevice({ payload }, { call, put, select }) { //查询数据
            const data = yield call(queryDevice, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        listDevice: data.data.result,
                        paginationDevice: {
                            current: data.data.page || 1,
                            pageSize: data.data.size || 10,
                            total: data.data.count,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '50', '200', '500'],
                        },
                        contions: payload,
                    },
                })
            } else {
                throw data
            }
        },

        * requery({ payload }, { put, select }) {
            let contions = yield select(({ flinkComputPlat }) => flinkComputPlat.contions)
            const stringified = queryString.stringify(contions)
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: contions,
                search: stringified,
            }))
        },
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                message.success(data.data)
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        * create_updata({ payload }, { call, put }) {
            const data = yield call(create_update, payload)
            if (data.success) {
                yield put({ type: 'requery', payload: {} })
                yield put({
                    type: "setState",
                    payload: {
                        modalVisible: false,
                    }
                })
            } else {
                throw data
            }
        },
        * deleteDevice({ payload }, { call, put }) {
            const data = yield call(removeDevice, payload)
            if (data.success) {
                message.success(data.data)
                yield put({ type: 'queryDevice', payload: {} })
            } else {
                throw data
            }
        },
        * onDown({ payload }, { call, put }) {
            const data = yield call(dwn, payload)
        },
        * Run({ payload }, { call, put }) {
            const data = yield call(run, payload)
            if (data.success) {
                message.success(data.data)
            } else {
                throw data
            }
        },
        * RunStatus({ payload }, { call, put }) {
            const data = yield call(runStatus, payload)
            if (data.success) {
                Modal.confirm({
                    title: '下发状态',
                    width: 500,
                    content: JSON.stringify(data.data)
                })
            } else {
                throw data
            }
        },
        * getDict({ payload }, { call, put }) {
            const data = yield call(getDictF, payload)
            if (data.success) {
                yield put({
                    type: "setState",
                    payload: {
                        DictList1: data.data.result,
                    }
                })
            } else {
                throw data
            }
        },

        * getDictChild({ payload }, { call, put }) {
            const data = yield call(getDictChild, payload)
            if (data.success) {
                if (payload.level == 1) {
                    yield put({
                        type: "setState",
                        payload: {
                            DictList2: data.data,
                        }
                    })
                } else {
                    yield put({
                        type: "setState",
                        payload: {
                            DictList3: data.data,
                        }
                    })
                }
            } else {
                throw data
            }
        },

        * addDict({ payload }, { call, put }) {
            const data = yield call(addDict, payload)
            if (data.success) {
                yield put({ type: 'getDict', payload: { page: 1, level: 1 } })
            } else {
                throw data
            }
        },

        // 保存设备
        * deviceSave({ payload }, { call, put, select }) { //查询数据
            const data = yield call(deviceSave, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("保存成功")
                yield put({ type: 'queryDevice', payload: {} })
            } else {
                throw data
            }
        },
        // 设备下线
        * deviceOffline({ payload }, { call, put, select }) { //查询数据
            const data = yield call(deviceOffline, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("下线成功")
                yield put({ type: 'queryDevice', payload: {} })
            } else {
                throw data
            }
        },

        // 设备下线
        * onDownDevice({ payload }, { call, put, select }) { //查询数据
            const data = yield call(onDownDevice, payload)  //与后台交互，获取数
            message.info("导出成功")
        },
        //
        * queryGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(queryGroup, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        groupList: data.data.result,
                        pagination1: {
                            current: data.data.page || 1,
                            pageSize: data.data.size || 10,
                            total: data.data.count,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                        contions: payload,
                    },
                })
            } else {
                throw data
            }
        },
        // 策略组新增
        * addPolicyGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(addPolicyGroup, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("新增成功")
                yield put({ type: 'queryGroup', payload: {} })
            } else {
                throw data
            }
        },
        * deleGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(deleGroup, payload)  //与后台交互，获取数
            if (data.success) {
                if (data.status == "200") {
                    message.info("删除成功")
                    yield put({ type: 'queryGroup', payload: {} })
                } else {
                    message.error(data.data)
                }
            } else {
                throw data
            }
        },

        * querytemplate({ payload }, { call, put, select }) { //查询数据
            const data = yield call(querytemplate, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        tempList: data.data.result,
                        pagination1: {
                            current: data.data.page || 1,
                            pageSize: data.data.size || 10,
                            total: data.data.count,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                        contions: payload,
                    },
                })
            } else {
                throw data
            }
        },

        // 策略组新增
        * addTemplate({ payload }, { call, put, select }) { //查询数据
            const data = yield call(addTemplate, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("新增成功")
                yield put({ type: 'querytemplate', payload: {} })
            } else {
                throw data
            }
        },

        // 策略组删除
        * deleTemplete({ payload }, { call, put, select }) { //查询数据
            const data = yield call(deleTemplete, payload)  //与后台交互，获取数
            if (data.success) {
                if (data.status == "200") {
                    message.info("删除成功")
                    yield put({ type: 'querytemplate', payload: {} })
                } else {
                    message.error(data.data)
                }
            } else {
                throw data
            }
        },
        // 策略组新增
        * querycondition({ payload }, { call, put, select }) { //查询数据
            const data = yield call(querycondition, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        contionList: data.data.result,
                        pagination1: {
                            current: data.data.page || 1,
                            pageSize: data.data.size || 10,
                            total: data.data.count,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                        contions: payload,
                    }
                })

            } else {
                throw data
            }
        },

        // 策略组新增
        * addCondition({ payload }, { call, put, select }) { //查询数据
            const data = yield call(addCondition, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("新增成功")
                yield put({ type: 'querycondition', payload: {} })
            } else {
                throw data
            }
        },

        // 策略组新增
        * deleCondition({ payload }, { call, put, select }) { //查询数据
            const data = yield call(deleCondition, payload)  //与后台交互，获取数
            if (data.success) {
                if (data.status == "200") {
                    message.info("删除成功")
                    yield put({ type: 'querycondition', payload: {} })
                } else {
                    message.error(data.data)
                }
            } else {
                throw data
            }
        },

        // 策略组新增
        * addTempToaGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(addTempToaGroup, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("新增成功")
                yield put({ type: 'queryGroup', payload: {} })
            } else {
                throw data
            }
        },

        // 增加公式到模板
        * addCondiTiontoTemp({ payload }, { call, put, select }) { //查询数据
            const data = yield call(addCondiTiontoTemp, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("新增成功")
                yield put({ type: 'querytemplate', payload: {} })
            } else {
                throw data
            }
        },
        // 查询模板绑定的公式
        * queryconditionbytemplet({ payload }, { call, put, select }) { //查询数据
            const data = yield call(queryconditionbytemplet, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        tempCondition: data.data.relations,
                    }
                })
            } else {
                throw data
            }
        },
        // 查询模板绑定的公式
        * querytemplatebyGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(querytemplatebyGroup, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        groupTemp: data.data.templates,
                    }
                })
            } else {
                throw data
            }
        },
        // 查询模板绑定的公式
        * binDev({ payload }, { call, put, select }) { //查询数据
            const data = yield call(binDev, payload)  //与后台交互，获取数
            yield put({
                type: 'querySuccess',
                payload: {
                    choosedRows: [],
                }
            })
            if (data.success) {
                message.info("绑定成功")
            } else {
                throw data
            }
        },

        * unbinDev({ payload }, { call, put, select }) { //查询数据
            const data = yield call(unbinDev, payload)  //与后台交互，获取数
            yield put({
                type: 'querySuccess',
                payload: {
                    choosedRows: [],
                }
            })
            if (data.success) {
                message.info("绑定成功")
            } else {
                throw data
            }
        },
        * query_Dev_Group({ payload }, { call, put, select }) { //查询数据
            const data = yield call(queryDevGroup, payload)  //与后台交互，获取数
            if (data.success) {
                if (data.status == "200") {
                    yield put({
                        type: 'querySuccess',
                        payload: {
                            groupList: data.data.templateGroupList,
                        }
                    })
                } else {
                    message.error(data.data)
                }
            } else {
                throw data
            }
        },
        // 策略模板组替换
        * replaceTemp({ payload }, { call, put, select }) { //查询数据
            const data = yield call(replaceTemp, payload)  //与后台交互，获取数
            if (data.success) {
                message.info("替换成功")
            } else {
                throw data
            }
        },
        // 获取模板组中的设备组
        * getPolicyG_DevG({ payload }, { call, put, select }) { //查询数据
            const data = yield call(getPolicyGDevG, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        devGroupList: data.data,
                    }
                })
            } else {
                throw data
            }
        },
        // 获取模板组中的设备组
        * getAllDeviceGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(getAllDeviceGroup, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        devGroupAllList: data.data,
                    }
                })
            } else {
                throw data
            }
        },
        // 获取模板组中的设备组
        * saveRelationDeviceGroup({ payload }, { call, put, select }) { //查询数据
            const data = yield call(saveRelationDeviceGroup, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({ type: 'queryGroup', payload: {} })
                message.info("绑定成功")
            } else {
                throw data
            }
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    }
}
