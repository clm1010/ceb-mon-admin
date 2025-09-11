import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay, queryES } from '../services/dashboard'
import { ESFindIndex } from '../utils/FunctionTool'
import { message } from 'antd'
import queryString from "query-string";

export default {

    namespace: 'singleSSL',

    state: {
        q: "",
        buttonState: true,
        dataSource: [],
        ipSource: [],
        monameSource: [],
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: null,
            showTotal: total => `共 ${total} 条`,
        },
        queryTerms: ""
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                let query = location.query
                if (query === undefined) {
                    query = queryString.parse(location.search);
                }
                if (location.pathname === '/dashboard/singleSSL') {  //获取下拉选择内容
                    dispatch({ type: 'query', payload: {} })
                }
            })
        }
    },

    effects: {
        *query({ payload }, { select, call, put }) {
            let singleSSL_D = []
            let monameSource = []
            let ipSource = []
			let integer = []
            let should = []
            let singleSSLParams = peformanceCfg.firewallTable//获取配置的查询语句
            const user = JSON.parse(sessionStorage.getItem('user'))//登录的当前用户
            let queryTerms = yield select(({ singleSSL }) => singleSSL.queryTerms)
            let branch //分行属性   用于后面拼接查询语句
            if (user.branch) { branch = user.branch } else { branch = 'ZH' }
            let ranges = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } } //时间限制
            let branchs = { term: { branchname: branch } } //分行条件

            let vendor = { term: { vendor: "INFOSEC" } }

            singleSSLParams.query.bool.must = []
            should = [{ "term": { "kpiname": "SSL每秒连接" } }, { "term": { "kpiname": "SSL-VS并发" } },
            { "term": { "kpiname": "CPU利用率" } }, { "term": { "kpiname": "内存利用率" } },{ "term": {"kpiname": "设备启动时间" }}]
            let bool = { bool: { should: should } }
            singleSSLParams.query.bool.must.push(bool)
            singleSSLParams.query.bool.must.push(vendor)
            singleSSLParams.query.bool.must.push(ranges)
            if (payload && payload.queryTerms) {
                singleSSLParams.query.bool.must = [...singleSSLParams.query.bool.must, ...payload.queryTerms]
            }
            if (queryTerms && queryTerms != '') {
                singleSSLParams.query.bool.must = [...singleSSLParams.query.bool.must, ...queryTerms]
            } else {
                singleSSLParams.query.bool.must.push(branchs)
            }

            let queryParams = { es: {}, paths: '' }
            let paths = ESFindIndex(Date.parse(new Date()) - 7200000, Date.parse(new Date()), 'u2performance-', 'day', '')

            queryParams.es = singleSSLParams
            queryParams.paths = paths

            const data = yield call(queryES, queryParams)
            let info = data.aggregations.group_appname.buckets
            console.log('聚合结果：', data.aggregations.group_appname.buckets)
            if (info) {
                for (let item of info) {//根据域来循环
                    item.group_mo.buckets.forEach((info, index) => {
                        let obj = {}
                        obj.bizarea = item.key//设备区域信息
                        obj.moname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.moname//设备名
                        obj.hostip = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostip//设备IP
                        obj.appname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.appname//网络域
                        obj.keyword = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.keyword//对象关键字
                        obj.branchname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.branchname//所属分行名
                        obj.hostname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostname//主机名
                        ipSource.push(obj.hostip)
                        monameSource.push(obj.moname)
                        for (let kpi of info.group_kpiname.buckets) {//获取同级指标
                            switch (kpi.key) {
                                case 'SSL-VS并发':
                                    obj.vs = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case 'SSL每秒连接':
                                    obj.conn = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case 'CPU利用率':
                                    obj.cpu = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case '内存利用率':
                                    obj.memory = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case '设备启动时间' :
                                    integer = ((kpi.top_info.hits.hits[0]._source.value/8640000).toFixed(2)).split(".")
                                    obj.beginTime = integer[0] +'天' + Math.round((integer[1]/100)*24) +'小时' 
                                    obj.beginTimeNum = kpi.top_info.hits.hits[0]._source.value
                                    break;
                            }
                        }
                        singleSSL_D.push(obj)
                    })//设备循环   获取基本信息
                }

                yield put({
                    type: 'setState',
                    payload: {
                        dataSource: singleSSL_D,
                        ipSource: ipSource,
                        monameSource: monameSource,
                        pagination: {
                            pageSize: 200,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            total: singleSSL_D.length,
                            showTotal: total => `共 ${total} 条`,
                        },
                    }
                })
            } else {
                message.error("code:500 响应结果异常!")
                yield put({
                    type: 'setState',
                    payload: {
                        buttonState: false
                    }
                })
            }
        }
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        }
    }
}
