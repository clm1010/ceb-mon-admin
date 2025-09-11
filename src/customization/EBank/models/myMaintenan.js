import { query, create, remove, update, findById } from '../../../services/mainRuleInstanceGroup'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
 * 维护期管理/我的维护期
 * @namespace myMaintenan
 * @requires module:维护期管理/我的维护期
 */
export default {

    namespace: 'myMaintenan',

	state: {
		oldImportSource: [],
		oldVisible: false,
		buttonState: true,
		list: [],									//定义了当前页表格数据集合
		currentItem: {},							//被选中的行对象的集合
		modalVisible: false,						//弹出窗口是否可见
		modalVisibleCopyOrMove: false,				//第二个弹出窗口是否可见
		modalType: 'create',						//弹出窗口的类型
		itemType: '',
		pagination: {								//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		isSynching: false,
		isClose: false,
		batchDelete: false,
		choosedRows: [],							//选择的行
		filterSchema: [],							//过滤条件
		groupUUID: [], //Item分组的信息
		resetCalInput: false,				//这是
		mtFilterKey: '', //过滤条件弹出框的key
		mtFilterExpand: false,
		isLevels: '0',						//是否高级搜索
		cycles: 'NON_PERIODIC',							//维护类型（周期、非周期）
		checkedWeek: [],						//维护时间选定天数
		timeType: 'BY_WEEK',						//维护期时间定义（按天，按周）
		isenabled: true,						//是否启用
		checked: [],
		tempList: [							//时间段数组
			{
				index: 1,
				tempid: '',
				end: [],
			},
		],
		tempDayList: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListMon: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListTue: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListWed: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListThu: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListFri: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListSat: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListSun: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],

		listHost1: [],
		listHost2: [],
		selectHostuuid: '',
		host2portMap: new Map(), //选择的网络设备和端口关联关系
		listPort1: [],
		listPort2: [],
		listApp1: [],
		listApp2: [],
		listQita1: [],
		listQita2: [],
		selectedKeysHost1: [],
		selectedKeysPort1: [],
		selectedKeysApp1: [],
		selectedKeysQita1: [],
		selectedKeysHost2: [],
		selectedKeysPort2: [],
		selectedKeysApp2: [],
		selectedKeysQita2: [],
		paginationHost: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationPort: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationApp: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationQita: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		alarmType: 'BASIC',
		moFilterValue: {
			filterMode: 'ADVANCED',
		},
		Filters: {},							//模板管理实例化
		//查询分页----searchHost
		hostname: '',
		hostkeyword: '',
		//查询分页----searchPort
		portname: '',
		//查询分页----searchApp
		appName: '',
		bizDesc: '',
		//查询分页----searchQita
		nameQita: '',
		keywordQita: '',
		appQita: '',

		ruleInstanceKey: '',
		isExpert: false,														//是否是在专家模式界面点击+、-按钮的行为
		hostOtherValue: '',	//控制维护期告警定义高级模式提示
		appOtherValue: '',	//控制维护期告警定义高级模式提示
		gjtzOtherValue: '',	//控制维护期告警定义高级模式提示
		fetchingIP: false,
		fetchingApp: false,
		alertGroupValue: '',
		componentValue: [],
		targetGroupUUIDs: [],
		branchipOptions: [],					//网点
		options: [],							//网络域四霸
		serversOptions: [], //主机
		osOptions: [],							//操作系统
		dbOptions: [],							//数据库
		mwsOptions: [],							//中间件
		appOptions: [],							//应用
		keysTime: '',
		pageChange: 0,
		q: '',
		filterInfo: [],
		applicantInfo: '',
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		expand: true,
		nameKey: 0,
		optionAppNameEditing: [],
		optionCluster: [],
		optionNamespace: [],
		optionIndicator: [],
		appNameAuto: [],
		appNameEditing: [],
		AdvancedFilterValue: '',
		AdvancedFilterAppNameValue: '',
		optionSelectAppName: [],
		timeOut:false,             //时间是否超过24小时的判断
		nameChange:'请再次确认',	//确认超过24小时的按钮名字
		timeValue:'',			//显示超24小时的具体时间长短
		startValue: 0,			//记录开始时间、及做判断
		endValue: 9999999999999, //记录结束时间、及做判断
		outTimeChange:false,		//当点击延时时，禁止编辑结束时间的判断
		showEndTime:0,				//当选择延时时间后，要显示的结束时间
		nowDate:0,				//服务器时间
		arrGroupValue:[],      //高级模式的组
		showGroupValue:{},		//显示的数据
		forbind:false,
	},

    subscriptions: { //添加一个链接的监听
        setup({ dispatch, history }) {
            history.listen((location) => {
                let newdata = queryString.parse(location.search);
                if (location.pathname.includes('/myMaintenan')) {
                    dispatch({
                        type: 'query',
                        payload: newdata,
                    })
                }
            })
        },
    },

    effects: {
		/** 
		 * 获取资源
		 * 与后台交互, 调用接口/api/v1/mts/groups，获取数据
		 * @function mainRuleInstanceGroup.query
		 */
		* query({ payload }, { select, call, put }) { //查询数据
			const groupuuids = yield select(({ myMaintenan }) => myMaintenan.groupUUID)
			const user = JSON.parse(sessionStorage.getItem('user'))
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}
			let q = ''
			let sql = ''
			let branchInfo = []
			let branchValues = []
			if (user.roles) {
				if (user.roles[0].name === '超级管理员') {

				} else {
					//维护期新增的分行权限
					if (user.roles[0].permissions) {
						if (user.roles[0].permissions.length === 0) {
							q = ''
						} else if (user.roles[0].permissions.length > 0) {
							for (let roles of user.roles[0].permissions) {
								if (roles.resource === '/api/v1/mts') {
									if (roles.action === 'read' && roles.has) { //维护期实例新增的权利
										let infofh = []
										for (let item of roles.permissionFilter.filterItems) {
											if (item.field === 'branch' && item.op === '=') {
												infofh.push(item.value)//拿到分行的属性，需要去重
											}
										}
										//去重
										if (infofh.length === 0) {
											q = ''
										} else {
											for (let info of infofh) {
												if (branchValues.indexOf(info) === -1) {
													branchValues.push(info)
												}
											}
											for (let i = 0; i < branchValues.length; i++) {
												q = `${q}branch == ${branchValues[i]} or `
											}
											q = `(${q.substring(0, q.length - 3)});`
										}
									} else if (roles.action === 'create' && !roles.has) {
										q = ''
									}
								}
							}
						}
					}
				}
			}
			console.log('q : ', q)
			const newdata = { ...payload, groupUUID }
			newdata.q = (q === '' ? '' : q) + (payload.q === undefined ? '' : payload.q)
			if (payload.q === undefined || payload.q === '') {
				newdata.q = newdata.q.substring(0, q.length - 1)
			}
			const data = yield call(query, newdata) //与后台交互，获取数据
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
						groupUUID: [groupUUID],
						q: newdata.q,
						tempList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempDayList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListMon: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListTue: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListWed: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListThu: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListFri: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSat: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSun: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
					},
				})
			}
		},

        /** 
         * 新增资源
         * 与后台交互, 调用接口/api/v1/mts/groups，新增数据
         * @function mainRuleInstanceGroup.create
         */
        * create({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({
                    type: 'controllerState',
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

        /** 
         * 删除资源
         * 与后台交互, 调用接口/api/v1/mts/groups，删除数据
         * @function mainRuleInstanceGroup.delete
         */
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({
                    type: 'controllerState',
                    payload: {
                        selectTreeNode: [],
                        selectKeys: [],
                    },
                })
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },

        /** 
         * 修改资源
         * 与后台交互, 调用接口/api/v1/mts/groups，修改数据
         * @function mainRuleInstanceGroup.update
         */
        * update({ payload }, { call, put }) {
            const data = yield call(update, payload)
            if (data.success) {
                yield put({
                    type: 'controllerState',
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

        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            const { treeDatas } = action.payload
            return { //修改
                ...state,
                treeDatas,
            }
        },

        //这里控制state内容的变化
        controllerState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}
