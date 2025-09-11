//@@@
import React from 'react'
import { getTOLCdata } from '../services/tolc'
import { queryADD, queryList, queryID, apiAdd, removeModal } from '../services/auditLog'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'

export default {

    namespace: 'auditLog',				//@@@

    state: {
        q: '',												//URL串上的q=查询条件
        list: [],											//定义了当前页表格数据集合
        currentItem: {},									//被选中的行对象的集合
        pagination: {										//分页对象
            showSizeChanger: true,							//是否可以改变 pageSize
            showQuickJumper: true,                          //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,			  //用于显示数据总量
            current: 1,										//当前页数
            total: 0,										//数据总数？
            pageSizeOptions: ['10', '20', '50', '100'],
        },
        condition: {
            indexs: '_tolc-app-ump-auditlog-%{YYYY.MM}',
            q: null,
            time: {},
            page: {}
        },
        auditLogVisiable: false,
        modalVisiable: false,
        ModalList: [],
        apiList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                //初次访问
                if (location.pathname === '/auditLog') {				//@@@
                    const condition = {
                        time: {}
                    }
                    condition.time.start = new Date().getTime() - 1000 * 60 * 60
                    condition.time.end = new Date().getTime()
                    dispatch({
                        type: 'query',
                        payload: condition,
                    })
                    dispatch({
                        type: 'modalQuery'
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put, select }) {
            let condition = yield select(({ auditLog }) => auditLog.condition)
            condition = Object.assign({}, condition, payload)

            const data = yield call(getTOLCdata, condition)				//@@@
            NProgress.done()//异步加载动画结束
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
                        obj.date = item.values[objKeysIndex.date]
                        obj.ipaddress = item.values[objKeysIndex.ipaddress]
                        obj.action = item.values[objKeysIndex.action]
                        obj.api = item.values[objKeysIndex.api]
                        obj.module = item.values[objKeysIndex.module]
                        obj.clientIp = item.values[objKeysIndex.clientIp]
                        obj.time = item.values[objKeysIndex.time]
                        obj.user = item.values[objKeysIndex.user]
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
        // 查看modal
        * modalQuery({ payload }, { call, put, select }) {
            const data = yield call(queryList, payload)				//@@@
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        ModalList: data.arr
                    },
                })
            }
        },
        // 增加modal
        * modalAdd({ payload }, { call, put, select }) {
            const data = yield call(queryADD, payload)				//@@@
            if (data.success) {
                message.success('添加成功')
                yield put({ type: 'modalQuery' })
                yield put({
                    type: 'setState',
                    payload: {
                        modalVisiable: false,
                    },
                })
            }
        },
        // 查询模块详情
        * modalMess({ payload }, { call, put, select }) {
            const data = yield call(queryID, payload)				//@@@
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        apiList: data.apis
                    },
                })
            }
        },
        // 保存api
        * apiSave({ payload }, { call, put, select }) {
            const data = yield call(apiAdd, payload)				//@@@
            if (data.success) {
                message.success("保存成功")
                yield put({
                    type: 'setState',
                    payload: {
                        auditLogVisiable: false,
                    },
                })
            }
        },
        // 删除moal
        * delModal({ payload }, { call, put, select }) {
            const data = yield call(removeModal, payload)				//@@@
            if (data.success) {
                message.success("删除成功")
                yield put({ type: 'modalQuery' })
            }
        },
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}
