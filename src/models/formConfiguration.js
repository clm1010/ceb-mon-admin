
import { update, query, findById } from '../services/reportFunctions'
import { message } from 'antd'
export default {
	namespace: 'formConfiguration',

	state: {
		type: '',
		q: '',
		batchDelete: false,
		selectedRows: [],
		pagination: {									//分页对象
	      showSizeChanger: true,						//是否可以改变 pageSize
	      showQuickJumper: true, //是否可以快速跳转至某页
	      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
	      current: 1,									//当前页数
	      total: 0,										//数据总数？
	      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	    },
	    dataSource: [],
	    modalVisible: false,
	    day: false,
	    week: false,
	    mon: false,
	    fix: false,
	    checkboxState: false,
	    dayInfo: '',
		weekInfo: '',
		monInfo: '',
		fixInfo: '',
	    itme: {},
	    alertType: 'info',
		alertMessage: '请输入配置信息',
		expand: true,
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
		      	if (location.pathname.includes('/formConfigurationGroup/')) {
					let query = location.query
					if (query === undefined) {
						query = {q:''}
						if  (location.search.length > 0){
							query = queryString.parse(location.search)
						}
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
		* query ({ payload }, { put, call }) {
			const data = yield call(query, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						dataSource: data.content,
						pagination: {
			              	current: data.page.number + 1 || 1,
			              	pageSize: data.page.pageSize || 10,
			              	total: data.page.totalElements,
			              	showSizeChanger: true,
				      		showQuickJumper: true,
				      		showTotal: total => `共 ${total} 条`,
				      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            			},
            			q: payload.q,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
		* findById ({ payload }, { put, call }) {
			const data = yield call(findById, payload)
			if (data.success) {
				//开始分解字符串，文本框的问题
				let forms = ''
				let forInfo = []
				let inputText = []
				let info = ''
				let dayInfo = ''
				let weekInfo = ''
				let monInfo = ''
				let fixInfo = ''
				let day = false
			    let week = false
			    let mon = false
			    let fix = false
			    let checkboxState = false
				if (data.cycle) {
					forms = data.cycle.trim()
					if (!forms.includes('@') && !forms.includes('week')) { //如果没有@说明只有一种报表
						info = forms.substring(0, forms.length - 1)
						inputText = info.split('&')
						if (info.includes('day')) {
							dayInfo = inputText[1]
							day = true
						} else if (info.includes('month')) {
							monInfo = inputText[1]
							mon = true
						} else if (info.includes('fix')) {
							fixInfo = inputText[1]
							fix = true
						}
					} else if (forms.includes('@')) { //如果有@说明只有多种报表
						info = forms.substring(0, forms.length - 1)
						inputText = info.split('?@')
						for (let i of inputText) {
							forInfo = i.split('&')
							if (i.includes('day')) {
								dayInfo = forInfo[1]
								day = true
							} else if (i.includes('week')) {
								weekInfo = forInfo[1]
								week = true
							} else if (i.includes('month')) {
								monInfo = forInfo[1]
								mon = true
							} else if (i.includes('fix')) {
								fixInfo = forInfo[1]
								fix = true
							}
						}
					} else if (!forms.includes('@') && forms.includes('week')) {
						if (forms.substring(forms.length - 1, forms.length) === '?') {
							inputText = forms.substring(0, forms.length - 1).split('&')
							weekInfo = inputText[1]
							week = true
						} else if (forms.substring(forms.length - 1, forms.length) != '?') {
							inputText = forms.split('&')
							weekInfo = inputText[1]
							week = true
						}
					}
				} else {
					checkboxState = true
				}
				yield put({
					type: 'setState',
					payload: {
						itme: data,
						modalVisible: true,
						day,
					    week,
					    mon,
					    fix,
					    dayInfo,
						weekInfo,
						monInfo,
						fixInfo,
						checkboxState,
						alertType: 'info',
						alertMessage: '请输入配置信息',
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
		* update ({ payload }, { put, call }) {
			const data = yield call(update, payload.info)
			if (data.success) {
				//开始分解字符串，文本框的问题
				let forms = ''
				let forInfo = []
				let inputText = []
				let info = ''
				let dayInfo = ''
				let weekInfo = ''
				let monInfo = ''
				let fixInfo = ''
				let day = false
			    let week = false
			    let mon = false
			    let fix = false
			    let checkboxState = false
				if (data.cycle) {
					forms = data.cycle.trim()
					if (!forms.includes('@') && !forms.includes('week')) { //如果没有@说明只有一种报表
						info = forms.substring(0, forms.length - 1)
						inputText = info.split('&')
						if (info.includes('day')) {
							dayInfo = inputText[1]
							day = true
						} else if (info.includes('month')) {
							monInfo = inputText[1]
							mon = true
						} else if (info.includes('fix')) {
							fixInfo = inputText[1]
							fix = true
						}
					} else if (forms.includes('@')) { //如果有@说明只有多种报表
						info = forms.substring(0, forms.length - 1)
						inputText = info.split('?@')
						for (let i of inputText) {
							forInfo = i.split('&')
							if (i.includes('day')) {
								dayInfo = forInfo[1]
								day = true
							} else if (i.includes('week')) {
								weekInfo = forInfo[1]
								week = true
							} else if (i.includes('month')) {
								monInfo = forInfo[1]
								mon = true
							} else if (i.includes('fix')) {
								fixInfo = forInfo[1]
								fix = true
							}
						}
					} else if (!forms.includes('@') && forms.includes('week')) {
						if (forms.substring(forms.length - 1, forms.length) === '?') {
							inputText = forms.substring(0, forms.length - 1).split('&')
							weekInfo = inputText[1]
							week = true
						} else if (forms.substring(forms.length - 1, forms.length) != '?') {
							inputText = forms.split('&')
							weekInfo = inputText[1]
							week = true
						}
					}
				} else {
					checkboxState = true
				}
				yield put({
					type: 'setState',
					payload: {
						itme: data,
						day,
					    week,
					    mon,
					    fix,
					    dayInfo,
						weekInfo,
						monInfo,
						fixInfo,
						checkboxState,
						alertType: 'success',
						alertMessage: '修改成功',
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
