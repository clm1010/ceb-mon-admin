import React, { useState } from 'react'
import PropTypes from 'prop-types'
import mystyle from './DataModal.less'
import { Form, Input, Radio, Modal, Select, TreeSelect, Row, Col, Tabs, DatePicker, TimePicker, Icon, Alert, Checkbox, Button, Tooltip, Switch, message } from 'antd'
import ConditionBasicMode from './../../components/maintenance/eventFilter/ConditionBasicMode' //基础模式
import ConditionAdvancedMode from './../../components/maintenance/eventFilter/ConditionAdvancedMode' //专家模式
import ConditionOtherMode from './../../components/maintenance/eventFilter/ConditionOtherMode'
import { validateRangeLessThanHalfYear } from './../../utils/FormValTool'
import UserSelectComp from './../../components/userSelectComp'
import { genDictOptsByName, getSourceByKey } from './../../utils/FunctionTool'
import debounce from 'throttle-debounce/debounce'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './DataModal.less'
import CheckboxDescribe from './CheckboxDescribe'
moment.locale('zh-cn')
const FormItem = Form.Item
const RadioGroup = Radio.Group
const SHOW_ALL = TreeSelect.SHOW_ALL
const TabPane = Tabs.TabPane
const Option = Select.Option
const InputGroup = Input.Group
const TextArea = Input.TextArea
const {
	RangePicker,
} = DatePicker
const confirm = Modal.confirm
const FormItemProps = {
	style: {
		margin: 0,
	},
}

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayoutAppName = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
}
const formItemLayoutAppNameEditing = {
	wrapperCol: {
		span: 24,
	},
}
const formItemLayout1 = {
	labelCol: {
		span: 9,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout2 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 15,
	},
}
const formItemLayout3 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}
const formItemLayout4 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}
const formItemLayout5 = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}
const formItemLayout8 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 17,
	},
}
const modal = ({
	loading,
	dispatch,
	visible,
	type,
	item = {},
	form,
	treeNodes,
	cycles,
	checkedWeek,
	timeType,
	tempList,
	tempDayList,
	tempWeekListMon,
	tempWeekListTue,
	tempWeekListWed,
	tempWeekListThu,
	tempWeekListFri,
	tempWeekListSat,
	tempWeekListSun,
	fenhang,
	listHost1,
	listHost2,
	selectHostuuid,
	host2portMap,
	listPort1,
	listPort2,
	listApp1,
	optionAppNameEditing,
	listApp2,
	listQita1,
	listQita2,
	listDistributed2,
	selectedKeysHost1,
	selectedKeysHost2,
	selectedKeysPort1,
	selectedKeysPort2,
	selectedKeysApp1,
	selectedKeysApp2,
	selectedKeysQita1,
	selectedKeysQita2,

	paginationHost,
	paginationPort,
	paginationApp,
	paginationQita,
	alarmType, //区分是基础模式还是专家模式,
	moFilterValue,
	checked,
	list,
	user,
	buttonState, //端口查询按钮的状态
	hostOtherValue,
	appOtherValue,
	gjtzOtherValue,
	fetchingIP,
	fetchingApp,
	alertGroupValue,
	componentValue,
	targetGroupUUIDs,
	branchipOptions,
	options,
	serversOptions,
	osOptions,
	dbOptions,
	mwsOptions,
	appOptions,
	alarmApplyFilter,
	filterInfo,
	userSelect,
	applicantInfo,
	appSelect,
	nameKey,
	optionCluster,
	optionNamespace,
	optionIndicator,
	appNameAuto,
	appNameEditing,
	appDistributed,		//分布式维护期被选中的应用
	clusterDistributed,	//分布式维护期被选中的一个应用下的集群
	namespaceDistributed, //分布式维护期被选中的命名空间
	indicatorDistributed,	//分布式维护期被选中的指标
	appDistributedFlag,
	clusterDistributedFlag,
	namespaceDistributedFlag,
	indicatorDistributedFlag,

	timeOut,          //改开始
	nameChange,
	timeValue,
	startValue,
	endValue,
	outTimeChange,
	showEndTime,     //结束
	nowDate,
	arrGroupValue,
	showGroupValue,
	forbind,
	forbindQita,
	restrict, //权限
	selectedReviewer, //授权人
	reviewers,
	transaStatus,
	batchStatus,
	operateRecordList,
	recalculate, //维护期重计算
	range,	//生效时段
	oploading, // 操作记录加载状态
	appNameSelect = [],
	checkedValue,
	alertLevel,
	AgentValue,
}) => {
	const [adjustRange,setAjustRange] = useState(false) // 微调时间是否正确范围内
	//对机构进行排序 start
	const branchs = genDictOptsByName('branch')
	let branch3 = branchs.filter(x => x.key == 'ZH')
	let branchs1 = branchs.filter(x => { if (x.key == 'ZH' || x.key == 'QH') { return x } })
	const branchs2 = branchs.filter(x => { if (x.key != 'ZH' && x.key != 'QH') { return x } }).sort((a, b) => a.key.localeCompare(b.key))
	let branchsort

	if (user.name == 'admin' && user.roles[0].name === '超级管理员') {
		branchsort = branchs1.concat(branchs2)
	} else {
		branchsort = branch3.concat(branchs2)
	}
	// 对机构进行排序 end
	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		setFieldsValue,
	} = form
	let flag = false
	//维护期结束时间和服务器时间做比较，小于服务器时间（出维护期）就不能进行编辑
	let disflag = false
	if (tempList) {
		let endtime = Date.parse(tempList[0].end)
		if (endtime < nowDate && type == 'update') {
			type = 'see'
			disflag = true
		}
	}
	if (appNameAuto != '' && appNameEditing.length > 0) {
		resetFields(['appNameEditing'])
	}
	if (type === 'see') {
		flag = true
	}
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})
	let branchInfo = []
	let branchValues = []
	if (user.roles) {
		if (user.roles[0].name === '超级管理员') {
			branchInfo = branchsort
			restrict[0] = 'create'
		} else {
			//维护期新增的分行权限
			console.log('user.roles[0] : ', user.roles[0])
			if (user.roles[0].permissions) {
				if (user.roles[0].permissions.length === 0) {
					branchInfo = branchsort
				} else if (user.roles[0].permissions.length > 0) {
					for (let roles of user.roles[0].permissions) {
						if (roles.resource === '/api/v1/mts') {
							if (roles.action === 'create' && roles.has && type === 'create') { //维护期实例新增的权利
								let infofh = []
								for (let item of roles.permissionFilter.filterItems) {
									if (item.field === 'branch' && item.op === '=') {
										infofh.push(item.value)//拿到分行的属性，需要去重
									}
								}
								//去重
								if (infofh.length === 0) {
									branchInfo = branchsort
								} else {
									for (let info of infofh) {
										if (branchValues.indexOf(info) === -1) {
											branchValues.push(info)
										}
									}
									for (let i = 0; i < branchValues.length; i++) {
										branchInfo.push(<Option key={branchValues[i]} value={branchValues[i]} name={maps.get(branchValues[i])}>{maps.get(branchValues[i])}</Option>)
									}
								}
								restrict[0] = 'create'
								console.log('branchValues:', branchValues)
							} else if (roles.action === 'create' && !roles.has) {
								branchInfo = branchsort
							}
							if (roles.action === 'update' && roles.has && type === 'update') { //维护期实例修改的权利
								let infofh = []
								for (let item of roles.permissionFilter.filterItems) {
									if (item.field === 'branch' && item.op === '=') {
										infofh.push(item.value)
									}
								}
								if (infofh.length === 0) {
									branchInfo = branchsort
								} else {
									for (let info of infofh) {
										if (branchValues.indexOf(info) === -1) {
											branchValues.push(info)
										}
									}
									for (let i = 0; i < branchValues.length; i++) {
										branchInfo.push(<Option key={branchValues[i]} value={branchValues[i]} name={maps.get(branchValues[i])}>{maps.get(branchValues[i])}</Option>)
									}
								}
								console.log('branchValues:', branchValues)
							} else if (roles.action === 'update' && !roles.has && type === 'update') { //如果没有开启功能开关，则只能控制自己分行的维护期
								branchInfo = branchsort
							}
							if (roles.action === 'create_short_time_mt' && roles.has) {  //短时维护期
								restrict[1] = 'create_short_time_mt'
							}
							if (roles.action === 'pre_creation' && roles.has) { //预维护期
								restrict[2] = 'pre_creation'
							}
						}
					}
				}
			}
		}
	}
	//查询是否有专家模式权限--start
	let isExpertRoles = true
	if (type === 'see' || type === 'adjust') {
		isExpertRoles = false
	}
	//end
	if (type !== 'create') {
		if (tempWeekListMon.length === 0) {
			tempWeekListMon = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListTue.length === 0) {
			tempWeekListTue = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListWed.length === 0) {
			tempWeekListWed = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListThu.length === 0) {
			tempWeekListThu = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListFri.length === 0) {
			tempWeekListFri = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListSat.length === 0) {
			tempWeekListSat = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
		if (tempWeekListSun.length === 0) {
			tempWeekListSun = [{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			}]
		}
	}

	// 克隆时候，重置授权信息
	if (type == 'kelong') {
		delete item.state
	}

	let cyclesType = ''
	let dateType = ''

	const rangeSelect = (arr) => {
		cyclesType = arr
		//		console.log('cyclesType : ',cyclesType)
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				cycles: cyclesType,
			},
		})
	}

	const timeTypeSelect = (arr) => {
		dateType = arr.target.value
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				timeType: dateType,
			},
		})
	}
	const weekCheckbox = (arr) => {
		let checkedWeek = arr.target.value
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				checkedWeek,
			},
		})
	}

	//超级管理员信息验证
	function showConfirm(type, data, timequer) {
		let texts = ''
		if (data.filterModeWai === 'SENIOR' && (data.hostOther.length === 0 || data.hostOther === undefined)) {
			texts = '该维护期未配置告警IP！'
		}
		let title = (timequer - 24 * 60 * 60 * 1000) > 0 ? <span>维护期设置时间大于<b style={{ color: 'red' }}>24小时</b>,确定要设置吗？当前维护期需要大约一分钟生效.<b>{texts}</b></span> : <span>请验证对应适用范围与维护期告警定义所属分行是否一致!当前维护期需要大约一分钟生效.<b>{texts}</b></span>
		confirm({
			//title: `请验证对应适用范围与维护期告警定义所属分行是否一致！当前维护期需要大约一分钟生效。${texts}`,
			title: title,
			onOk() {
				console.log('type: ', type, 'data: ', data)
				data.froms = 'UMP'
				if (type === 'kelong') {
					dispatch({
						type: 'mainRuleInstanceInfo/create',
						payload: data,
					})
					dispatch({
						type: 'mainRuleInstanceInfo/updateState',
						payload: {
							timeOut: false,
							nameChange: '请再次确认',
							startValue: 0,
							endValue: 9999999999999,
							outTimeChange: false,
							showEndTime: 0,
							timeValue: '',
							transaStatus: false,
							batchStatus: false,
							recalculate: false
						}
					})
				} else {
					dispatch({
						type: `mainRuleInstanceInfo/${type}`,
						payload: data,
					})
					dispatch({
						type: 'mainRuleInstanceInfo/updateState',
						payload: {
							timeOut: false,
							nameChange: '请再次确认',
							startValue: 0,
							endValue: 9999999999999,
							outTimeChange: false,
							showEndTime: 0,
							timeValue: '',
							transaStatus: false,
							batchStatus: false,
							recalculate: false
						}
					})
				}
			},
			onCancel() {
				console.log('Cancel')
			},
		})
	}

	function showConfirmBranch(type, data, timequer) {
		let texts = ''
		if (data.filterModeWai === 'SENIOR' && (data.hostOther.length === 0 || data.hostOther === undefined)) {
			texts = '该维护期未配置告警IP！'
		}
		let title = (timequer - 24 * 60 * 60 * 1000) > 0 ? <span>维护期设置时间大于<b style={{ color: 'red' }}>24小时</b>,确定要设置吗？当前维护期需要大约一分钟生效.<b>{texts}</b></span> : <span>请验证对应适用范围与维护期告警定义所属分行是否一致!当前维护期需要大约一分钟生效.<b>{texts}</b></span>
		confirm({
			//title: `当前维护期需要大约一分钟生效!${texts}`,
			title: title,
			onOk() {
				console.log('type: ', type, 'data: ', data)
				data.froms = 'UMP'
				if (type === 'kelong') {
					dispatch({
						type: 'mainRuleInstanceInfo/create',
						payload: data,
					})
				} else {
					dispatch({
						type: `mainRuleInstanceInfo/${type}`,
						payload: data,
					})
				}
				dispatch({
					type: 'mainRuleInstanceInfo/updateState',
					payload: {
						timeOut: false,
						nameChange: '请再次确认',
						startValue: 0,
						endValue: 9999999999999,
						outTimeChange: false,
						showEndTime: 0,
						timeValue: '',
						transaStatus: false,
						batchStatus: false,
						recalculate: false
					}
				})
			},
			onCancel() {
				console.log('Cancel')
			},
		})
	}

	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			if (nameChange == '请再次确认' && timeOut) {
				Modal.warning({
					title: '维护期设置时间大于24小时,请点击再次确认',
					okText: 'OK',
				})
				return
			}
			if(adjustRange){
				Modal.warning({
					title: '微调规则为提前4小时或者延迟2小时,请正确微调',
					okText: 'OK',
				})
				return
			}
			const data = {
				...getFieldsValue(), //获取弹出框所有字段的值
			}
			data.appNameAuto = ''
			data.appNameEditing = data.appNameEditing.length === 0 ? '' : data.appNameEditing.join(',')
			if (!data.name) {
				data.name = item.name
			}
			if (targetGroupUUIDs.length > 0) {
				data.targetGroupUUIDs = targetGroupUUIDs
			}
			let applicant = ''
			if (data.applicant && data.applicant.length > 0) {
				applicant = data.applicant.split('/')[0]
			}
			data.applicant = applicant

			let dateType = data.repeatType
			let cyclesType = data.tpe
			//维护期时间定义
			let timeDef = {}
			// 24小时确定
			let timequer
			if (cyclesType === 'NON_PERIODIC') {
				//非周期时间数组
				let defs = []
				let numbers = ''
				tempList.forEach((templet) => {
					numbers = templet.index
					let beginStr = ''
					let endStr = ''
					//					let end0 = `end_${templet.index}`;
					let begin = data.beginTimeList
					let end = data.endTimeList
					//console.log('end : ',end)
					if (end !== undefined && end !== null && end.length !== 0) {
						beginStr = begin.format('YYYY-MM-DD HH:mm:ss')
						endStr = end.format('YYYY-MM-DD HH:mm:ss')
					}
					//改
					timequer = (Date.parse(endStr) - Date.parse(beginStr))
					let def = {
						begin: beginStr,
						end: endStr,
						uuid: templet.uuid,
					}
					defs.push(def)
				})
				timeDef.repeatType = 'OTHER'
				timeDef.range = defs
				data.timeDef = timeDef
			} else if (dateType === 'BY_DAY') {
				//周期时间按天选择数组
				let defs = []
				let numbers = ''
				tempDayList.forEach((templet) => {
					numbers = templet.index
					let begin0 = `begin_${templet.index}`
					let begin = data[begin0]
					let end0 = `end_${templet.index}`
					let end = data[end0]
					let beginStr = ''
					let endStr = ''
					if (begin !== undefined && begin !== null && begin.length !== 0) {
						beginStr = begin.format('HH:mm:ss')
					}
					if (end !== undefined && end !== null && end.length !== 0) {
						endStr = end.format('HH:mm:ss')
					}
					//验证起始时间---start
					if (Date.parse(begin) < Date.parse(end)) {
						let def = {
							begin: beginStr,
							end: endStr,
						}
						defs.push(def)
					} else {
						Modal.warning({
							title: '起始时间错误请重新输入！',
							okText: 'OK',
						})
						exit
					}
					//end
				})
				timeDef.repeatType = 'BY_DAY'
				timeDef.range = defs
				data.timeDef = timeDef
			} else if (dateType === 'BY_WEEK') {
				//周期时间按周选择数组

				let arr = checkedWeek
				let weekRange = new Array()
				//周一
				if (arr === 'MON') {
					let Mon = []
					let numbers = ''
					tempWeekListMon.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Mon`
						let begin = data[begin0]
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Mon`
						let end = data[end0]
						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Mon.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'MON',
						range: Mon,
						selected: true,
					})
				}
				//周二
				if (arr === 'TUE') {
					let Tue = []
					let numbers = ''
					tempWeekListTue.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Tue`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Tue`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Tue.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'TUE',
						range: Tue,
						selected: true,
					})
				}

				//周三
				if (arr === 'WED') {
					let Wed = []
					let numbers = ''
					tempWeekListWed.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Wed`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Wed`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Wed.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'WED',
						range: Wed,
						selected: true,
					})
				}

				//周四
				if (arr === 'THU') {
					let Thu = []
					let numbers = ''
					tempWeekListThu.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Thu`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Thu`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Thu.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'THU',
						range: Thu,
						selected: true,
					})
				}

				//周五
				if (arr === 'FRI') {
					let Fri = []
					let numbers = ''
					tempWeekListFri.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Fri`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Fri`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Fri.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'FRI',
						range: Fri,
						selected: true,
					})
				}

				//周六
				if (arr === 'SAT') {
					let Sat = []
					let numbers = ''
					tempWeekListSat.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Sat`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Sat`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Sat.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'SAT',
						range: Sat,
						selected: true,
					})
				}

				//周日
				if (arr === 'SUN') {
					let Sun = []
					let numbers = ''
					tempWeekListSun.forEach((templet) => {
						numbers = templet.index
						let begin0 = `begin_${templet.index}_Sun`
						let begin = data[begin0]

						//							console.log('begin0', begin0)
						let beginStr = ''
						let endStr = ''
						if (begin !== undefined && begin !== null && begin.length !== 0) {
							beginStr = begin.format('HH:mm:ss')
						}
						let end0 = `end_${templet.index}_Sun`
						let end = data[end0]

						if (end !== undefined && end !== null && end.length !== 0) {
							endStr = end.format('HH:mm:ss')
						}
						//验证起始时间---start
						if (Date.parse(begin) < Date.parse(end)) {
							let def = {
								begin: beginStr,
								end: endStr,
							}
							Sun.push(def)
						} else {
							Modal.warning({
								title: '起始时间错误请重新输入！',
								okText: 'OK',
							})
							exit
						}
						//end
					})
					weekRange.push({
						weekday: 'SUN',
						range: Sun,
						selected: true,
					})
				}

				timeDef.repeatType = 'BY_WEEK'
				timeDef.weekRange = weekRange
				data.timeDef = timeDef
			}
			//时间验证---start
			let valiTime = true
			let timeDefValue = data.timeDef.repeatType
			switch (timeDefValue) {
				case 'OTHER':
					let rangeOther = data.timeDef.range
					rangeOther.forEach((item, index) => {
						if (item.begin === '' || item.end === '') {
							valiTime = false
						}
					})
					break
				case 'BY_DAY':
					let rangeByday = data.timeDef.range
					rangeByday.forEach((item, index) => {
						if (item.begin === '' || item.end === '') {
							valiTime = false
						}
					})
					break
				case 'BY_WEEK':
					let rangeByweek = data.timeDef.weekRange
					if (rangeByweek.length === 0) {
						valiTime = false
					} else {
						rangeByweek.forEach((item, index) => {
							let ranges = item.range
							ranges.forEach((items, index) => {
								if (items.begin === '' || items.end === '') {
									valiTime = false
								}
							})
						})
					}
					break
			}
			//end

			//告警过滤条件获取--------start
			let mofilterval = {}
			let fields = ['basicLogicOp', 'filterMode']
			let filterIndex = [0]
			if (moFilterValue && moFilterValue.filterIndex && moFilterValue.filterIndex.length > 0) {
				filterIndex = moFilterValue.filterIndex
			}
			if (moFilterValue && moFilterValue.filterItems && moFilterValue.filterItems.length > 0 && moFilterValue.filterItems.length != filterIndex.length) {
				let indexs = []
				moFilterValue.filterItems.forEach((item, index) => {
					indexs.push(index)
				})
				filterIndex = indexs
			}
			filterIndex.forEach((num) => {
				fields.push(`leftBrackets_${num}`)
				fields.push(`field_${num}`)
				fields.push(`op_${num}`)
				fields.push(`value_${num}`)
				fields.push(`rightBrackets_${num}`)
				fields.push(`logicOp_${num}`)
			})

			const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
			let arrs = []
			filterIndex.forEach((num, index) => {
				let bean = {}
				bean.leftBrackets = valObj[`leftBrackets_${num}`]
				bean.field = valObj[`field_${num}`]
				bean.op = valObj[`op_${num}`]
				bean.value = valObj[`value_${num}`]
				bean.rightBrackets = valObj[`rightBrackets_${num}`]
				bean.logicOp = valObj[`logicOp_${num}`]
				//bean.idx = index
				if (bean.field && bean.field !== '') {
					arrs.push(bean)
				}
			})

			mofilterval.basicLogicOp = valObj.basicLogicOp
			mofilterval.filterMode = valObj.filterMode
			mofilterval.filterItems = arrs
			//告警过滤条件获取--------end
			/*if(user.branch && user.branch !== '' && user.branch != 'QH') {
				data.branch = user.branch;
			}*/

			let filter = {}

			let basicFilter = {}
			basicFilter.appFilterItems = []
			basicFilter.neFilterItems = []
			basicFilter.otherFilterItems = []
			basicFilter.distributedFilterItems = []
			listApp2.forEach((app, index) => {
				let appitem = {}
				appitem.description = app.businessIntroduction
				appitem.name = app.affectSystem
				appitem.objectUUID = app.uuid
				appitem.componetType = app.componentType
				basicFilter.appFilterItems.push(appitem)
			})

			listQita2.forEach((qita, index) => {
				let qitaitem = {}
				qitaitem.appName = qita.appName
				qitaitem.name = qita.keyword
				qitaitem.alias = qita.name
				qitaitem.objectUUID = qita.uuid
				basicFilter.otherFilterItems.push(qitaitem)
			})
			listHost2.forEach((host, index) => {
				let mo = host.mo
				let hostitem = {}
				hostitem.keyword = mo.discoveryIP ? mo.discoveryIP : mo.keyword
				hostitem.hostname = mo.name
				let moports = host2portMap.get(mo.uuid)
				if (moports && moports.length > 0) {
					let ports = []
					moports.forEach((portEntity, index) => {
						let port = {}
						port.description = portEntity.description
						port.name = portEntity.portName
						port.objectUUID = portEntity.uuid
						ports.push(port)
					})
					hostitem.ports = ports
				}
				hostitem.objectUUID = mo.uuid
				basicFilter.neFilterItems.push(hostitem)
			})
			// 分布式维护期新增功能
			if (appDistributed !== '' && appDistributed !== null && appDistributed !== undefined) {
				const clusterArray = clusterDistributed.map(item => {
					return { name: item };
				});
				const namespaceArray = namespaceDistributed.map(item => {
					return { name: item };
				});
				const indicatorArray = indicatorDistributed.map(item => {
					return { name: item };
				});

				const tempApp = {
					application: {
						clusters: clusterArray,
						namespaces: namespaceArray,
						indicators: indicatorArray,
						name: appDistributed
					}
				}
				basicFilter.distributedFilterItems.push(tempApp)//fox
			}

			//高级模式---start
			let arrsOther = []
			if (arrGroupValue.length === 1) {
				let dataValue = arrGroupValue[0]
				if (dataValue.appOther && dataValue.appOther !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'N_AppName'
					bean.op = '='
					bean.value = dataValue.appOther
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}

				if (dataValue.hostOther && dataValue.hostOther.length !== 0) {
					let hostArray = []
					if (dataValue.hostOther.length === 1) {
						dataValue.hostOther.forEach((item) => {
							let arrIP = item.split('/')
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'NodeAlias'
							bean.op = '='
							bean.value = arrIP[0]
							bean.rightBrackets = ')'
							if (dataValue.ipScopeValue && dataValue.ipScopeValue !== '') {
								bean.rightBrackets = '))'
							}
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})

					} else {
						dataValue.hostOther.forEach((item) => {
							let arrIP = item.split('/')
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'NodeAlias'
							bean.op = '='
							bean.value = arrIP[0]
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								hostArray.push(bean)
							}
						})
						let i = hostArray.length
						hostArray[0].leftBrackets = '(('
						hostArray[i - 1].rightBrackets = '))'
						hostArray[i - 1].logicOp = 'AND'
						if (dataValue.ipScopeValue && dataValue.ipScopeValue !== '') {
							hostArray[0].leftBrackets = '('
							hostArray[i - 1].rightBrackets = '))'
						}
						Array.prototype.push.apply(arrsOther, hostArray)
					}
				}
				if (dataValue.gjtzOther && dataValue.gjtzOther !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'N_SummaryCN'
					bean.op = 'like'
					bean.value = dataValue.gjtzOther
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}
				if (dataValue.alertGroup && dataValue.alertGroup !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'AlertGroup'
					bean.op = 'like'
					bean.value = dataValue.alertGroup
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}
				if (dataValue.component && dataValue.component !== '') {
					let componentTypeList = []
					if (dataValue.component.length === 1) {
						dataValue.component.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'N_ComponentType'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})
					} else if (dataValue.component.length > 1) {
						dataValue.component.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'N_ComponentType'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								componentTypeList.push(bean)
							}
						})
						let i = componentTypeList.length
						componentTypeList[0].leftBrackets = '(('
						componentTypeList[i - 1].rightBrackets = '))'
						componentTypeList[i - 1].logicOp = 'AND'
						Array.prototype.push.apply(arrsOther, componentTypeList)
					}
				}

				if (dataValue.alertLevel && dataValue.alertLevel !== '') {
					let alertLevelTypeList = []
					if (dataValue.alertLevel.length === 1) {
						dataValue.alertLevel.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'N_CustomerSeverity'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})
					} else if (dataValue.alertLevel.length > 1) {
						dataValue.alertLevel.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'N_CustomerSeverity'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								alertLevelTypeList.push(bean)
							}
						})
						let i = alertLevelTypeList.length
						alertLevelTypeList[0].leftBrackets = '(('
						alertLevelTypeList[i - 1].rightBrackets = '))'
						alertLevelTypeList[i - 1].logicOp = 'AND'
						Array.prototype.push.apply(arrsOther, alertLevelTypeList)
					}
				}

				if (dataValue.Agent && dataValue.Agent !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'Agent'
					bean.op = 'like'
					bean.value = dataValue.Agent
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}

				let len = arrsOther.length
				arrsOther[0].leftBrackets = arrsOther[0].leftBrackets + '('
				arrsOther[len - 1].rightBrackets = arrsOther[len - 1].rightBrackets + ')'

			} else if (arrGroupValue.length > 1) {
				arrGroupValue.forEach((item => {
					let data = item
					let oneGroupValues = []
					if (data.appOther && data.appOther !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'N_AppName'
						bean.op = '='
						bean.value = data.appOther
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.hostOther && data.hostOther.length !== 0) {
						let hostArray = []
						if (data.hostOther.length === 1) {
							data.hostOther.forEach((item) => {
								let arrIP = item.split('/')
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'NodeAlias'
								bean.op = '='
								bean.value = arrIP[0]
								bean.rightBrackets = ')'
								if (data.ipScopeValue && data.ipScopeValue !== '') {
									bean.rightBrackets = '))'
								}
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else {
							data.hostOther.forEach((item) => {
								let arrIP = item.split('/')
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'NodeAlias'
								bean.op = '='
								bean.value = arrIP[0]
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									hostArray.push(bean)
								}
							})
							let i = hostArray.length
							hostArray[0].leftBrackets = '(('
							hostArray[i - 1].rightBrackets = '))'
							hostArray[i - 1].logicOp = 'AND'
							if (data.ipScopeValue && data.ipScopeValue !== '') {
								hostArray[0].leftBrackets = '('
								hostArray[i - 1].rightBrackets = '))'
							}
							Array.prototype.push.apply(oneGroupValues, hostArray)
						}
					}
					if (data.gjtzOther && data.gjtzOther !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'N_SummaryCN'
						bean.op = 'like'
						bean.value = data.gjtzOther
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.alertGroup && data.alertGroup !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'AlertGroup'
						bean.op = 'like'
						bean.value = data.alertGroup
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.component && data.component !== '') {
						let componentTypeList = []
						if (data.component.length === 1) {
							data.component.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'N_ComponentType'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else if (data.component.length > 1) {
							data.component.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'N_ComponentType'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									componentTypeList.push(bean)
								}
							})
							let i = componentTypeList.length
							componentTypeList[0].leftBrackets = '(('
							componentTypeList[i - 1].rightBrackets = '))'
							componentTypeList[i - 1].logicOp = 'AND'
							Array.prototype.push.apply(oneGroupValues, componentTypeList)
						}
					}

					if (data.alertLevel && data.alertLevel !== '') {
						let alertLevelTypeList = []
						if (data.alertLevel.length === 1) {
							data.alertLevel.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'N_CustomerSeverity'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else if (data.alertLevel.length > 1) {
							data.alertLevel.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'N_CustomerSeverity'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									alertLevelTypeList.push(bean)
								}
							})
							let i = alertLevelTypeList.length
							alertLevelTypeList[0].leftBrackets = '(('
							alertLevelTypeList[i - 1].rightBrackets = '))'
							alertLevelTypeList[i - 1].logicOp = 'AND'
							Array.prototype.push.apply(oneGroupValues, alertLevelTypeList)
						}
					}
					if (data.Agent && data.Agent !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'Agent'
						bean.op = 'like'
						bean.value = data.Agent
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					let len = oneGroupValues.length
					oneGroupValues[0].leftBrackets = oneGroupValues[0].leftBrackets + '('
					oneGroupValues[len - 1].rightBrackets = oneGroupValues[len - 1].rightBrackets + ')'
					oneGroupValues[len - 1].logicOp = 'OR'
					Array.prototype.push.apply(arrsOther, oneGroupValues)
				}))
			}
			//end
			filter.filterMode = data.filterModeWai
			if (data.filterModeWai === 'BASIC') {
				filter.basicFilter = basicFilter
			} else if (data.filterModeWai === 'ADVANCED') {
				filter.advFilterItems = mofilterval.filterItems
			} else if (data.filterModeWai === 'SENIOR') {
				if (arrsOther.length !== 0) {
					arrsOther[arrsOther.length - 1].logicOp = ''
				}
				filter.advFilterItems = arrsOther
			}
			data.filter = filter
			//维护期告警定义验证--start
			let valiFilter = true
			let valiFilterAppName = true
			let filterModeValue = data.filter.filterMode
			if (filterModeValue === 'ADVANCED') {
				if (data.filter.advFilterItems && data.filter.advFilterItems.length !== 0) {
					if (data.filter.advFilterItems.length === 1) {
						data.filter.advFilterItems.forEach((item, index) => {
							if (item.field === '' || item.op === '' || item.value === '') {
								valiFilter = false
							}
						})
					} else {
						let advFilterItemsArray = []
						data.filter.advFilterItems.forEach((items) => {
							if (items.logicOp !== '') {
								advFilterItemsArray.push(items)
							}
						})

						advFilterItemsArray.forEach((item, index) => {
							if (item.field === '' || item.leftBrackets === '' || item.op === '' || item.rightBrackets === '' || item.value === '' || item.logicOp === '') {
								valiFilter = false
							}
						})
					}
				} else {
					valiFilter = false
				}
			} else if (filterModeValue === 'BASIC') {
				if (data.filter.basicFilter) {
					if (data.filter.basicFilter.neFilterItems.length === 0 && data.filter.basicFilter.appFilterItems.length === 0 && data.filter.basicFilter.otherFilterItems.length === 0 && data.filter.basicFilter.distributedFilterItems.length === 0) {
						valiFilter = false
					}
					for (let info of data.filter.basicFilter.otherFilterItems) {
						if (info.appName === undefined) {
							valiFilterAppName = false
						}
					}
				}
			} else if (filterModeValue === 'SENIOR') {
				if (data.filter.advFilterItems && data.filter.advFilterItems.length !== 0) {
					data.filter.advFilterItems.forEach((item, index) => {
						if (item.field === '' || item.op === '' || item.value === '') {
							valiFilter = false
						}
					})
				} else {
					valiFilter = false
				}
			}
			//end
			console.log('data : ', data)
			//验证重名---start
			let vailName = false
			if (list && list.length !== 0) {
				if (type === 'create') {
					list.forEach((item) => {
						if (item.name === data.name) {
							vailName = true
						}
					})
				}
			}
			//验证维护期告警定义IP
			let regex = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
				'(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
				'(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
				'(1\\d{2}|2[0-4]\\d|25[0-5][1-9]\\d|\\d)$'
			let IPState = false
			// let IPfilter = data.filter.advFilterItems
			// if (IPfilter && filterModeValue === 'ADVANCED') {
			// 	for (let i = 0; i < IPfilter.length; i++) {
			// 		if ((IPfilter[i].field === 'NodeAlias' && !IPfilter[i].value.match(regex) && IPfilter[i].op === '=') || (IPfilter[i].field === 'NodeAlias' && !IPfilter[i].value.match(regex) && IPfilter[i].op === '!=')) {
			// 			IPState = true
			// 		}
			// 	}
			// }
			//end
			//为分行管理员指定默认分组--start
			if (user.branch !== undefined && type === 'create') {
				treeNodes.forEach((item) => {
					if (item.props.title === maps.get(data.branch)) {
						data.groupUUIDs = item.props.value
					}
				})
			}
			//end
			//维护期状态的判断
			if (type != 'create') {
				if (restrict[0] == 'create') {
					data.state = 'ACTIVE'
				} else {
					if (restrict[1] == 'create_short_time_mt') {
						if (restrict[2] == undefined) {
							data.state = 'ACTIVE'
						} else {
							if (timequer <= 24 * 60 * 60 * 1000) {
								data.state = 'ACTIVE'
							}
							if (timequer > 24 * 60 * 60 * 1000) {
								data.state = 'TO_REVIEW'
							}
						}
					} else {
						if (restrict[2] == 'pre_creation') {
							data.state = 'TO_REVIEW'
						}
					}
				}
			}
			//复核人员
			let reviewerId = data.reviewers
			data.reviewers = []
			let obj = {}
			if (item.reviewers && item.reviewers.length > 0 && data.state != "ACTIVE") {
				data.reviewers = item.reviewers
				data.reviewers[0].reviewerId = reviewerId
				delete data.reviewers[0].reviewed
				delete data.reviewers[0].reviewTime
			} else {
				if (reviewerId && reviewerId != '') {
					obj.reviewerId = reviewerId
					data.reviewers.push(obj)
				}
			}
			//end
			if (item.relatedMtId) {
				data.relatedMtId = item.relatedMtId
			}

			/* 
				白名单
			*/
			data.whitelistEnabled = checkedValue ? checkedValue.join(",") : ''
			// if (data.transaction === true) {
			// 	data.whitelistEnabled += 't'
			// }
			// if (data.batch === true) {
			// 	data.whitelistEnabled += 'b'
			// }
			// if (data.whitelistEnabled.length == 2) {
			// 	data.whitelistEnabled = 't,b'
			// }
			data.timeDef.restDays = data.range	//生效时段
			delete data.range

			if (type === 'see') {
				dispatch({
					type: 'mainRuleInstanceInfo/updateState',
					payload: {
						modalVisible: false,
						isClose: true,
						timeOut: false,
						nameChange: '请再次确认',
						startValue: 0,
						endValue: 9999999999999,
						timeValue: '',
					},
				})
			} else if (!valiFilter) {
				Modal.warning({
					title: '告警定义不能为空！',
					okText: 'OK',
				})
			} else if (!valiFilterAppName) {
				Modal.warning({
					title: '其他域的应用分类名称为空！',
					okText: 'OK',
				})
			} else if (!valiTime) {
				Modal.warning({
					title: '告警定义时间不能为空！',
					okText: 'OK',
				})
			} else if (vailName) {
				Modal.warning({
					title: '维护期名称不能重复，请重新输入！',
					okText: 'OK',
				})
			} else if (IPState) {
				Modal.warning({
					title: '维护期告警定义，告警IP格式错误！',
					okText: 'OK',
				})
			} else if (timequer < 0) {
				Modal.warning({
					title: '维护期时间设置错误，开始时间大于结束时间！',
					okText: 'OK',
				})
			} else if (user.branch) {
				showConfirmBranch(type, data, timequer)
			} else {
				showConfirm(type, data, timequer)
			}
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'appSelect/clearState',
		})
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				applicantInfo: '',
				nameKey: 0,
				alertGroupValue: '',
				componentValue: [],
				alertLevel: [],
				buttonState: true,
				modalVisible: false,
				isClose: true,
				cycles: 'NON_PERIODIC',
				//				isLevels: '0',
				timeType: 'BY_WEEK',
				checkedWeek: [],
				listHost1: [],
				listHost2: [],
				selectHostuuid: '',
				host2portMap: new Map(),
				listPort1: [],
				listPort2: [],
				listApp1: [],
				listApp2: [],
				listQita1: [],
				listQita2: [],
				listDistributed2: [],
				selectedKeysHost1: [],
				selectedKeysPort1: [],
				selectedKeysApp1: [],
				selectedKeysQita1: [],
				selectedKeysHost2: [],
				selectedKeysPort2: [],
				selectedKeysApp2: [],
				selectedKeysQita2: [],
				tempList: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempDayList: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListMon: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListTue: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListWed: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListThu: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListFri: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListSat: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				tempWeekListSun: [{
					index: 1,
					tempid: '',
					begin: '',
					end: '',
				}],
				hostname: '',
				hostkeyword: '',
				portname: '',
				appName: '',
				bizDesc: '',
				nameQita: '',
				keywordQita: '',
				appQita: '',
				optionAppNameEditing: [],
				optionCluster: [],
				optionNamespace: [],
				optionIndicator: [],
				appNameAuto: '',
				appNameEditing: [],
				appDistributed: '',
				clusterDistributed: [],
				namespaceDistributed: [],
				indicatorDistributed: [],
				appDistributedFlag: false,
				clusterDistributedFlag: false,
				namespaceDistributedFlag: false,
				indicatorDistributedFlag: false,
				AdvancedFilterValue: '',
				AdvancedFilterAppNameValue: '',
				timeOut: false,
				nameChange: '请再次确认',
				startValue: 0,
				endValue: 9999999999999,
				outTimeChange: false,
				showEndTime: 0,
				timeValue: '',
				arrGroupValue: [],
				showGroupValue: {},
				selectedReviewer: false,
				transaStatus: false,
				batchStatus: false,
				recalculate: false,
				range: 'DEFAULT'
			},
		})
	}

	const onReviewed = (parmer) => {
		let obj = {}
		obj = item.reviewers[0]
		delete obj.reviewerId
		if (parmer == 'yes') {
			obj.reviewed = 'PASS'
			confirm({
				title: '是否同意该条申请?',
				okText: '同意',
				onOk() {
					dispatch({
						type: 'mainRuleInstanceInfo/updReviewer',				//@@@
						payload: obj,
					})
				},
			})
		}
		if (parmer == 'no') {
			obj.reviewed = 'REJECTED'
			confirm({
				title: '是否同意该条申请?',
				okText: '不同意',
				onOk() {
					dispatch({
						type: 'mainRuleInstanceInfo/updReviewer',				//@@@
						payload: obj,
					})
				},
			})
		}
	}
	const modalOpts = {
		title: `${type === 'create' ? '新增维护期实例' : type === 'see' ? '查看维护期实例' : type === 'kelong' ? '克隆维护期实例' : '编辑维护期实例'}`,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 990,
	}

	const moFilterBasicProps = {
		loading,
		dispatch,
		filter: moFilterValue,
		localPath: 'mainRuleInstanceInfo',
		queryPath: 'mainRuleInstanceInfo/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
		listHost1,
		listHost2,
		selectHostuuid,
		host2portMap,
		listPort1,
		listPort2,
		listApp1,
		optionAppNameEditing,
		listApp2,
		listQita1,
		listQita2,
		listDistributed2,
		selectedKeysHost1,
		selectedKeysHost2,
		selectedKeysPort1,
		selectedKeysPort2,
		selectedKeysApp1,
		selectedKeysApp2,
		selectedKeysQita1,
		selectedKeysQita2,
		paginationHost,
		paginationPort,
		paginationApp,
		paginationQita,
		buttonState,
		appSelect,
		forbind,
		forbindQita,
		appNameSelect,
		optionCluster,
		optionNamespace,
		optionIndicator,
		appDistributed,
		clusterDistributed,
		namespaceDistributed,
		indicatorDistributed,
		appDistributedFlag,
		clusterDistributedFlag,
		namespaceDistributedFlag,
		indicatorDistributedFlag,
	}
	const moFilterProps = {
		dispatch,
		filter: moFilterValue,
		localPath: 'mainRuleInstanceInfo',
		queryPath: 'mainRuleInstanceInfo/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
	}
	const moFilterOtherProps = {
		currentItem: item,
		dispatch,
		filter: moFilterValue,
		localPath: 'mainRuleInstanceInfo',
		queryPath: 'mainRuleInstanceInfo/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
		listHost1,
		listApp1,
		listQita1,
		hostOtherValue,
		appOtherValue,
		gjtzOtherValue,
		fetchingIP,
		fetchingApp,
		componentValue,
		alertGroupValue,
		branchipOptions,
		options,
		serversOptions,
		osOptions,
		dbOptions,
		mwsOptions,
		appOptions,
		arrGroupValue,
		showGroupValue,
		alertLevel,
		AgentValue,
	}
	const typeChange = (value) => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				alarmType: value,
				appName: '',
				bizDesc: '',
				moFilterValue: {
					filterMode: value,
				},
				optionAppNameEditing: [],
				optionCluster: [],
				optionNamespace: [],
				optionIndicator: [],
				appNameAuto: '',
				appNameEditing: [],
				listQita2: [], //BASIC
				listApp2: [], // BASIC
				listHost2: [], // BASIC
				listDistributed2: [],	// BASIC
			},
		})
	}

	const appNameEditingFind = (value) => {
		if (value != '') {
			let q = `systemName=='*${value}*'`
			dispatch({
				type: 'mainRuleInstanceInfo/queryAppNameEditing',
				payload: {
					q,
				},
			})
		}
	}

	//查询维护期名称是否存在
	const queryName = (value) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let q = `name=='${data.name}'`
		dispatch({
			type: 'mainRuleInstanceInfo/query',
			payload: {
				q,
			},
		})
	}

	const validateName = (rule, value, callback) => {
		if (value === undefined) {
			callback()
		} else {
			let info = value.trim()
			if (info === '') {
				callback('Input only space!')
			} else {
				callback()
			}
		}
	}

	function getOelName(key) {
		const values = getSourceByKey('OelColumns')
		for (let obj of values) {
			if (obj.key == key) {
				return obj.name
			}
		}
		return ''
	}
	let infos = ''
	let infoMess = ''
	for (let filter of alarmApplyFilter) {
		let message = []
		if (filter.resource === '/api/v1/mts') { //维护期
			for (let info of filter.filterItems) {
				info.field = getOelName(info.field)
				message.push(`${info.leftBrackets === undefined ? '' : info.leftBrackets} ${info.field} ${info.op} ${info.value} ${info.rightBrackets === undefined ? '' : info.rightBrackets}  ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
		if (message.length > 0) infoMess = infoMess != '' ? ` ${infoMess}  or ( ${message.join(' ')} )` : `( ${message.join(' ')} )`
	}

	if (infoMess != '') {
		infos = `当前用户维护期处理告警范围: ${infoMess}`
	} else {
		infos = '当前用户维护期处理告警范围: 全部告警'
	}


	const operations = (<FormItem {...FormItemProps} key="modeswitchWai">
		{getFieldDecorator('filterModeWai', {
			initialValue: alarmType,
		})(<Select disabled={type === 'see' || type === 'adjust'} size="small" onChange={typeChange} style={{ width: '120px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="SENIOR">高级模式</Select.Option>
			{user.roles[0].name === '超级管理员' ? <Select.Option value="ADVANCED" >专家模式</Select.Option> : null}
		</Select>)
		}
	</FormItem>)

	const cycletypeSelect = (<FormItem {...FormItemProps} key="modeswitchWai">
		{getFieldDecorator('tpe', {
			initialValue: item.tpe ? item.tpe : cycles,
		})(<Select disabled={type === 'see'} size="small" onChange={rangeSelect} style={{ width: '120px' }}>
			<Select.Option value="PERIODIC">周期</Select.Option>
			<Select.Option value="NON_PERIODIC">非周期</Select.Option>
		</Select>)
		}
	</FormItem>)

	function disabledDate(current) {
		//时间跨度 起始时间不能是今天以前，结束时间也不能是一年半以后(365 + 366/2) * 24 * 3600 * 1000 =
		//时间间隔不能超过一个月30*24*3600*1000= 2592000000, 31*24*3600*1000=2678400000
		// 7天时间戳 7*24*60*60*1000 = 604800000
		let mothslimt = 0
		if (endValue != 9999999999999) {
			mothslimt = endValue - 2592000000
		}
		if (user.roles[0].name === '超级管理员' && recalculate) {
			return current && (current.valueOf() > endValue || current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000)
		}
		return current && (
			current.valueOf() < new Date(new Date().toLocaleDateString()).getTime() || current.valueOf() > endValue ||
			current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000 || current.valueOf() < mothslimt)
	}
	function disabledEndDate(current) {
		//时间跨度 起始时间不能是今天以前，结束时间也不能是一年半以后(365 + 366/2) * 24 * 3600 * 1000 =
		//时间间隔不能超过一个月（30*24*3600*1000）
		let mothslimt = 9999999999999
		if (type == 'update' && tempList[0].begin < new Date().getTime()) {
			mothslimt = new Date().getTime() + 2592000000
		} else if (type == 'update' && tempList[0].begin > new Date().getTime()) {
			mothslimt = startValue + 2592000000
		} else if (startValue != 0) {
			mothslimt = startValue + 2592000000
		}
		return current && (
			current.valueOf() + 86400000 < startValue || current.valueOf() < new Date(new Date().toLocaleDateString()).getTime() ||
			current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000 || current.valueOf() > mothslimt)
	}
	function range(start, end) {
		const result = []
		for (let i = start; i < end; i++) {
			result.push(i)
		}
		return result
	}
	const getData = (begin, end) => {
		if (typeof (begin) === 'object') {
			begin = Date.parse(begin)
		}
		if (typeof (end) === 'object') {
			end = Date.parse(end)
		}
		if (begin && end) {
			let value = type === 'adjust' ? Math.abs((tempList[0].end - tempList[0].begin) - (end - begin)) : (end - begin)
			let day = parseInt(value / (1000 * 3600 * 24))
			let day1 = parseInt(value % (1000 * 3600 * 24))
			let hour = parseInt(day1 / (1000 * 3600))
			let hour1 = parseInt(day1 % (1000 * 3600))
			let minu = parseInt(hour1 / (1000 * 60))
			if (value < 0) {
				timeValue = '时间设置错误,开始时间大于结束时间,请重新设置'
			} else if (type === 'adjust') {
				let tempTime = Math.abs(tempList[0].end - end)
				let tempHour = parseInt(tempTime / (1000 * 3600))
				let tempHour1 = parseInt(tempTime % (1000 * 3600))
				let m = parseInt(tempHour1 / (1000 * 60))
				if (Date.parse(tempList[0].end) - end > 0) {
					// 提前结束
					if (tempList[0].end - end > 4 * 60 * 60 * 1000) {
						message.error('微调提前时间不能超过4小时')
						// 提前超过4小时
						setAjustRange(true)
					} else {
						setAjustRange(false)
					}
					timeValue = (tempHour != 0 ? `微调提前时间量为：${tempHour}小时${m}分` : `微调时间量为：${m}分`)
				} else {
					// 延迟结束
					if (end - Date.parse(tempList[0].end) > 2 * 60 * 60 * 1000) {
						message.error('微调延迟时间不能超过2小时')
						// 延迟超过2小时
						setAjustRange(true)
					} else {
						setAjustRange(false)
					}
					timeValue = (tempHour != 0 ? `微调延迟时间量为：${tempHour}小时${m}分` : `微调时间量为：${m}分`)
				}
				// timeValue = (day != 0 ? `微调时间量为：${day}天${hour}小时${minu}分` : hour != 0 ? `微调时间量为：${hour}小时${minu}分` : `微调时间量为：${minu}分`)
			} else {
				timeValue = (day == 0 ? `维护期时长为：${hour}小时${minu}分` : `维护期时长为：${day}天${hour}小时${minu}分`)
			}
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					timeValue: timeValue,
					startValue: begin ? begin : 0,
					endValue: end ? end : 9999999999999,
				}
			})
		} else {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					timeValue: '',
					startValue: begin ? begin : 0,
					endValue: end ? end : 9999999999999,
				}
			})
		}
	}
	const getinfoTime = (begin, end) => {
		if (end - begin > 24 * 60 * 60 * 1000) {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					timeOut: true,
					nameChange: '请再次确认'
				}
			})
		} else {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					timeOut: false,
					nameChange: '请再次确认'
				}
			})
		}

		if ((restrict[0] == undefined && restrict[1] == undefined && restrict[2] === 'pre_creation') ||
			(restrict[0] == undefined && restrict[1] == 'create_short_time_mt' && restrict[2] === 'pre_creation' && (end - begin > 24 * 60 * 60 * 1000))) {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					selectedReviewer: true
				}
			})
		} else {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					selectedReviewer: false
				}
			})
		}
	}
	const onOkbegin = (date, dataString) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let end = data.endTimeList
		let begin = Date.parse(date)
		getData(begin, end)
		if (end && end != '') {
			getinfoTime(begin, end)
		}
	}
	const onOkend = (date, dataString) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let begin = data.beginTimeList
		let end = Date.parse(date)
		getData(begin, end)
		if (begin && begin != '') {
			getinfoTime(begin, end)
		}
	}
	const onButton = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				nameChange: '已确认'
			}
		})
	}
	const outTime = (value, option) => {
		resetFields(['endTimeList'])
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let begin = data.beginTimeList
		let outtimevalue = parseFloat(value, 10)
		let endtimevalue = Date.parse(tempList[0].end)
		if (!value) {
			outtimevalue = 0
		}
		getinfoTime(begin, endtimevalue + outtimevalue * 3600 * 1000)
		getData(begin, endtimevalue + outtimevalue * 3600 * 1000)
		if (value) {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					outTimeChange: true,
					showEndTime: endtimevalue + outtimevalue * 3600 * 1000
				}
			})
		} else {
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					outTimeChange: false,
					showEndTime: endtimevalue
				}
			})
		}
	}

	const validatend = (rule, value, callback) => {
		if (value === undefined || value === '' || startValue == 0) {
			callback()
		} else {
			let bagin = startValue
			let end = Date.parse(value)
			if ((end - bagin > 24 * 60 * 60 * 1000) && (restrict[1] == 'create_short_time_mt' && restrict[0] == undefined && restrict[2] == undefined)) {
				callback('您的权限只能设置为24小时之内')
			} else {
				callback()
			}
		}
	}

	const validatbegin = (rule, value, callback) => {
		if (value === undefined || value === '' || endValue == 9999999999999) {
			callback()
		} else {
			let end = endValue
			let bagin = Date.parse(value)
			if ((end - bagin > 24 * 60 * 60 * 1000) && (restrict[1] == 'create_short_time_mt' && restrict[0] == undefined && restrict[2] == undefined)) {
				callback('您的权限只能设置为24小时之内')
			} else {
				callback()
			}
		}
	}

	const reviewersOption = []
	reviewers.forEach((option) => {
		reviewersOption.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
	})

	const Optionreviews = []
	if (item.reviewers && item.reviewers.length > 0) {
		item.reviewers.forEach((item) => {
			Optionreviews.push(item.reviewerId)
		})
	}
	const onRecalculate = (checked) => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				recalculate: checked
			}
		})
	}
	const onRange = (value) => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				range: value
			}
		})
	}
	const noPeriodics = () => {
		return (
			<div >
				<div className={mystyle.timebox_right}>
					{tempList.map(templet =>
					(<Row key={`row_${templet.index}`} >
						<Row key={`row_${templet.index}_0`} >
							<Col lg={24} md={24} sm={24} xs={24} key={`col_${templet.index}_0`}>
								{
									timeOut ?
										<div><Alert message="请注意设置时间大于24小时!请点击再次确认按钮,进行再次确认." type="warning" showIcon /></div>
										:
										''
								}
							</Col>
						</Row>
						<Row key={`row_${templet.index}_1`}>
							<Col xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} key={`col_${templet.index}_0`} >
								{
									user.roles[0].name === '超级管理员' ?
										<div style={{ textAlign: 'center', marginLeft: 10, marginTop: 4 }}>
											<span style={{ color: '#000000d9' }}>维护期重计算:</span>&nbsp;&nbsp;<Switch
												checkedChildren={<Icon type="check" />}
												unCheckedChildren={<Icon type="close" />}
												onChange={onRecalculate}
											/>
										</div>
										:
										null
								}
							</Col>
						</Row>
						<Row key={`row_${templet.index}_2`} style={{ paddingTop: 10 }}>
							<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} key={`col_${templet.index}_1`}>
								<FormItem label="开始时间" hasFeedback {...formItemLayout3} key={`begin_${templet.index}`}>
									{getFieldDecorator('beginTimeList', {
										initialValue: templet.begin,
										rules: [
											{
												required: true,
											},
											{
												validator: validatbegin,
											},
										],
									})(
										<DatePicker
											disabledDate={disabledDate}
											showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
											placeholder="请选择开始时间"
											format="YYYY-MM-DD HH:mm:ss"
											style={{ width: '100%' }} onChange={onOkbegin}
											disabled={(type != 'create' && type != 'kelong' && !recalculate && templet.begin < new Date().getTime()) || type === 'see'}
										/>
									)}
								</FormItem>
							</Col>
							<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} key={`col_${templet.index}_2`}>
								<FormItem label="结束时间" hasFeedback {...formItemLayout3} key={`end_${templet.index}`}>
									{getFieldDecorator('endTimeList', {
										initialValue: showEndTime > 0 ? moment(showEndTime) : templet.end,
										rules: [
											{
												required: true,
											},
											{
												validator: validatend,
											},
										],
									})(
										<DatePicker
											disabledDate={disabledEndDate}
											showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
											placeholder="请选择结束时间"
											format="YYYY-MM-DD HH:mm:ss"
											style={{ width: '100%' }} onChange={onOkend}
											disabled={outTimeChange || type === 'see'} />
									)}
								</FormItem>
							</Col>
							<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} key={`col_${templet.index}_3`} style={{ paddingLeft: 10 }}>
								{
									timeOut ? <span className={mystyle.outTime}> <Button style={{ marginLeft: 2, backgroundColor: nameChange == '已确认' ? '#008B00' : '#eb2f96', color: '#ffffff' }} onClick={onButton} > {nameChange}</Button>{timeValue}</span> : <span className={mystyle.inTime}>{timeValue}</span>
								}
							</Col>
						</Row>
						<Row key={`row_${templet.index}_3`}>
							<Col lg={8} md={8} sm={6} xs={8} key={`col_${templet.index}_4`} >
								{
									selectedReviewer ?
										<FormItem label="授权人" hasFeedback {...formItemLayout3} key={`reviewers_${templet.index}`}>
											{getFieldDecorator('reviewers', {
												initialValue: (item.reviewers && item.reviewers.length > 0 && type != 'kelong') ? item.reviewers[0].reviewerId : '',
												rules: [
													{
														required: true,
													},
												],
											})(<Select width='100%' allowClear
												showSearch filterOption={mySearchInfo}
												disabled={(item.reviewers && item.reviewers.length > 0 && item.state == 'REVIEW_REJECTED')}>
												{reviewersOption}
											</Select>)}
										</FormItem>
										:
										null
								}
							</Col>
							<Col lg={8} md={8} sm={8} xs={8} key={`col_${templet.index}_5`} >
								{
									type == 'update' ?
										<FormItem label="延长时间" hasFeedback {...formItemLayout3} key={`extend_${templet.index}`}>
											{getFieldDecorator('extendtime', {
												initialValue: '请选择结束时间',
												rules: [],
											})(<Select width='100%' allowClear placeholder="请选择结束时间" onChange={outTime}>
												<Select.Option value="0.5">0.5小时</Select.Option>
												<Select.Option value="1">1小时</Select.Option>
												<Select.Option value="2">2小时</Select.Option>
												<Select.Option value="3">3小时</Select.Option>
												<Select.Option value="4">4小时</Select.Option>
												<Select.Option value="5">5小时</Select.Option>
												<Select.Option value="6">6小时</Select.Option>
												<Select.Option value="7">7小时</Select.Option>
												<Select.Option value="8">8小时</Select.Option>
												<Select.Option value="9">9小时</Select.Option>
												<Select.Option value="10">10小时</Select.Option>
												<Select.Option value="11">11小时</Select.Option>
												<Select.Option value="12">12小时</Select.Option>
												<Select.Option value="15">15小时</Select.Option>
												<Select.Option value="18">18小时</Select.Option>
												<Select.Option value="21">21小时</Select.Option>
												<Select.Option value="24">24小时</Select.Option>
											</Select>)}
										</FormItem>
										:
										null
								}
							</Col>
						</Row>
						{/* <Row key={`row_${templet.index}_4`}>
							<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} key={`col_${templet.index}_6`} >
								{
									<FormItem label="生效时段" hasFeedback {...formItemLayout3} key={`extend_${templet.index}`}>
										{getFieldDecorator('range', {
											initialValue: (item.timeDef === undefined || item.timeDef.restDays === undefined) ? 'DEFAULT' : item.timeDef.restDays,
											rules: [],
										})(<Select width='100%' placeholder="" onChange={onRange}>
											<Select.Option value="DEFAULT" checked>全部</Select.Option>
											<Select.Option value="WORK_DAYS">工作日生效</Select.Option>
											<Select.Option value="ALL_REST_DAYS">非工作日生效</Select.Option>
											<Select.Option value="HOLIDAYS">节假日</Select.Option>
											<Select.Option value="WEEKENDS">周末</Select.Option>
										</Select>)}
									</FormItem>
								}
							</Col>
						</Row> */}
					</Row>))}

				</div>
			</div>
		)
	}
	const PeriodicsDay = () => {
		return (
			<div style={{ paddingLeft: 32 }}>
				{tempDayList.map(templet =>
				(<Row key={`row_${templet.index}`}>
					<Col span={12} key={`col_${templet.index}_0`}>
						<FormItem label="从" hasFeedback {...formItemLayout8} key={`begin_${templet.index}`}>
							{getFieldDecorator(`begin_${templet.index}`, {
								initialValue: templet.begin,
							})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
						</FormItem>
					</Col>
					<Col span={12} key={`col_${templet.index}_1`}>
						<FormItem label="到" hasFeedback {...formItemLayout8} key={`end_${templet.index}`}>
							{getFieldDecorator(`end_${templet.index}`, {
								initialValue: templet.end,
							})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
						</FormItem>
					</Col>
					{/*
    					<Col span={6} key={`col_${templet.index}_2`} className={mystyle.buttonPart}>
    	    					<Button  disabled={tempDayList.length===1?true:false}  onClick={jianhaoDay.bind(this,templet.index)}>-</Button>
    	    					&nbsp;&nbsp;&nbsp;
    	    					<Button onClick={jiahaoDay}>+</Button>
    					</Col>
    					*/}
				</Row>))}
			</div>
		)
	}

	const PeriodicsWeek = () => {
		return (
			<div style={{ paddingLeft: 32 }}>
				<div style={{ width: 500 }}>
					<RadioGroup style={{ width: 500 }} onChange={weekCheckbox} defaultValue={checked} disabled={type === 'see'}>
						<Row span={24}>
							<Col span={24}><Radio value="MON">周一</Radio></Col>
							{tempWeekListMon.map(templet =>
							(<Row key={`row_${templet.index}_Mon`} span={24}>
								<Col span={12} key={`col_${templet.index}_Mon_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Mon`}>
										{getFieldDecorator(`begin_${templet.index}_Mon`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Mon_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Mon`}>
										{getFieldDecorator(`end_${templet.index}_Mon`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Mon_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListMon.length===1?true:false}  onClick={jianhaoWeekMon.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekMon}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}

							<Col span={24}><Radio value="TUE">周二</Radio></Col>
							{tempWeekListTue.map(templet =>
							(<Row key={`row_${templet.index}_Tue`} span={24}>
								<Col span={12} key={`col_${templet.index}_Tue_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Tue`}>
										{getFieldDecorator(`begin_${templet.index}_Tue`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Tue_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Tue`}>
										{getFieldDecorator(`end_${templet.index}_Tue`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Tue_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListTue.length===1?true:false}  onClick={jianhaoWeekTue.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekTue}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
							<Col span={24}><Radio value="WED">周三</Radio></Col>
							{tempWeekListWed.map(templet =>
							(<Row key={`row_${templet.index}_Wed`} span={24}>
								<Col span={12} key={`col_${templet.index}_Wed_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Wed`}>
										{getFieldDecorator(`begin_${templet.index}_Wed`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Wed_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Wed`}>
										{getFieldDecorator(`end_${templet.index}_Wed`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Wed_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListWed.length===1?true:false}  onClick={jianhaoWeekWed.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekWed}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
							<Col span={24}><Radio value="THU">周四</Radio></Col>
							{tempWeekListThu.map(templet =>
							(<Row key={`row_${templet.index}_Thu`} span={24}>
								<Col span={12} key={`col_${templet.index}_Thu_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Thu`}>
										{getFieldDecorator(`begin_${templet.index}_Thu`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Thu_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Thu`}>
										{getFieldDecorator(`end_${templet.index}_Thu`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Thu_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListThu.length===1?true:false}  onClick={jianhaoWeekThu.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekThu}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
							<Col span={24}><Radio value="FRI">周五</Radio></Col>
							{tempWeekListFri.map(templet =>
							(<Row key={`row_${templet.index}_Fri`} span={24}>
								<Col span={12} key={`col_${templet.index}_Fri_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Fri`}>
										{getFieldDecorator(`begin_${templet.index}_Fri`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Fri_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Fri`}>
										{getFieldDecorator(`end_${templet.index}_Fri`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Fri_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListFri.length===1?true:false}  onClick={jianhaoWeekFri.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekFri}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
							<Col span={24}><Radio value="SAT">周六</Radio></Col>
							{tempWeekListSat.map(templet =>
							(<Row key={`row_${templet.index}_Sat`} span={24}>
								<Col span={12} key={`col_${templet.index}_Sat_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Sat`}>
										{getFieldDecorator(`begin_${templet.index}_Sat`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Sat_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Sat`}>
										{getFieldDecorator(`end_${templet.index}_Sat`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Sat_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListSat.length===1?true:false}  onClick={jianhaoWeekSat.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekSat}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
							<Col span={24}><Radio value="SUN">周日</Radio></Col>
							{tempWeekListSun.map(templet =>
							(<Row key={`row_${templet.index}_Sun`} span={24}>
								<Col span={12} key={`col_${templet.index}_Sun_0`}>
									<FormItem label="从" hasFeedback {...formItemLayout3} key={`begin_${templet.index}_Sun`}>
										{getFieldDecorator(`begin_${templet.index}_Sun`, {
											initialValue: templet.begin,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								<Col span={12} key={`col_${templet.index}_Sun_1`}>
									<FormItem label="到" hasFeedback {...formItemLayout3} key={`end_${templet.index}_Sun`}>
										{getFieldDecorator(`end_${templet.index}_Sun`, {
											initialValue: templet.end,
										})(<TimePicker style={{ width: '100%' }} disabled={type === 'see'} />)}
									</FormItem>
								</Col>
								{/*
		        					<Col span={6} key={`col_${templet.index}_Sun_2`} className={mystyle.buttonPart}>
		        	    					<Button  disabled={tempWeekListSun.length===1?true:false}  onClick={jianhaoWeekSun.bind(this,templet.index)}>-</Button>
		        	    					&nbsp;&nbsp;&nbsp;
		        	    					<Button onClick={jiahaoWeekSun}>+</Button>
		        					</Col>
		        					*/}
							</Row>))}
						</Row>
					</RadioGroup>
				</div>
			</div>
		)
	}

	//适用范围查询条件搜索
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	//	console.log('cycles : ',cycles)
	/*
	*控制分行多选弹窗部分
	const branchClick = () =>{
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				branchVisible: true,
			}
		})
	}
	*/
	const onAppNameEditingChange = (value) => {
		let hostStr = ''
		if (value.length !== 0) {
			let arrays = []
			value.forEach((item) => {
				let arrs = item.split('/')
				arrays.push(arrs[0])
			})
			if (arrays.length === 0) {
				hostStr = []
			} else if (arrays.length === 1) {
				hostStr = [arrays[0]]
			} else {
				hostStr = arrays
			}
		}
		dispatch({
			type: '' + 'mainRuleInstanceInfo/updateState',
			payload: {
				appNameEditing: hostStr,
			},
		})
	}
	const userSelectProps = Object.assign({}, userSelect, {
		placeholders: '申请人工号、姓名检索',
		name: '申请人',
		modeType: false,
		required: true,
		dispatch, form, item,
		disabled: (type === 'see' || type === 'adjust'), compName: 'applicant', cDefaultName: applicantInfo,
	})
	const onChangeBatch = (value) => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				batchStatus: value.target.checked,
			},
		})
	}
	const onChangeTransa = (value) => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				transaStatus: value.target.checked,
			},
		})
	}

	const onShowOperate = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				oploading: true,
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/queryOperateRecord',
			payload: {
				record: item,
			},
		})
	}

	const checkboxOption = []
	const defaultCheckbox = []
	getSourceByKey("whileList_Maintain").forEach(item => {
		if (item.description.includes("default-true") && type === 'create') {
			defaultCheckbox.push(item.key)
		}
		checkboxOption.push({ label: item.name, value: item.key, description: item.description })
	})

	return (
		<Modal {...modalOpts} width="1250px"
			footer={
				type === 'see' ?
					[<Button key="operate" onClick={onShowOperate} loading={oploading}>查看操作记录</Button>, <Button key="cancel" onClick={onCancel}>关闭</Button>] :
					type === 'review' ?
						[<Button key="yes" type="primary" onClick={() => onReviewed('yes')}>同意</Button>, <Button key="no" onClick={() => onReviewed('no')}>不同意</Button>, <Button key="cancel" onClick={onCancel}>关闭</Button>] :
						type === 'create' ?
							[<Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>] :
							[<Button key="operate" onClick={onShowOperate} loading={oploading}>查看操作记录</Button>, <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}>
			{disflag ? <Alert message="维护期时间已经结束，不可再进行编辑。" type="info" showIcon /> : null}

			<Tabs defaultActiveKey="1">
				<TabPane tab={<span><Icon type="file-markdown" />基本信息</span>} key="1" />
			</Tabs>
			<Form layout="horizontal">
				<FormItem label="维护期名称" hasFeedback {...formItemLayout}>
					{getFieldDecorator('name', {
						initialValue: type === 'kelong' ? `${item.name}_cope_${nameKey}` : item.name,
						rules: [
							{
								required: true,
							},
							{
								validator: validateName,
							},
						],
					})(<Input onBlur={queryName} disabled={type === 'see' || type === 'adjust'} />)}
				</FormItem>

				<FormItem label="描述" hasFeedback {...formItemLayout}>
					{getFieldDecorator('description', {
						initialValue: item.description,
					})(<Input disabled={type === 'see' || type === 'adjust'} />)}
				</FormItem>

				<FormItem label="维护期状态" hasFeedback {...formItemLayout} >
					{getFieldDecorator('state', {
						initialValue: item.state,
					})(<Select disabled>
						<Select.Option value="ACTIVE">生效</Select.Option>
						<Select.Option value="TO_REVIEW">待复核</Select.Option>
						<Select.Option value="REVIEW_REJECTED">复核未通过</Select.Option>
						<Select.Option value="OVERDUE">已过期</Select.Option>
						<Select.Option value="INACTIVE">禁用</Select.Option>
					</Select>)}
				</FormItem>

				<FormItem label="维护期关联特征" hasFeedback {...formItemLayout}>
					{getFieldDecorator('correlationFeature', {
						initialValue: item.correlationFeature,
					})(<Input disabled={type === 'see' || type === 'adjust'} />)}
				</FormItem>

				<FormItem label="变更号" hasFeedback {...formItemLayout}>
					{getFieldDecorator('ticket', {
						initialValue: item.ticket,
						rules: [
							{
								required: true,
								message: '变更号必填'
							}
						],
					})(<Input disabled={type === 'see' || type === 'adjust'} />)}
				</FormItem>


				<FormItem label="适用范围" hasFeedback {...formItemLayout}>
					{getFieldDecorator('branch', {
						initialValue: item.branch,
						rules: [
							{
								required: true,
							},
						],
					})((<Select
						disabled={type === 'see' || type === 'adjust'}
						showSearch
						filterOption={mySearchInfo}
					>
						{branchInfo}
					</Select>))}
				</FormItem>

				<UserSelectComp {...userSelectProps} />
				<Row span={20}>
					<Col span={12}>
						<FormItem label="应用系统名称" hasFeedback {...formItemLayoutAppName}>
							{getFieldDecorator('appNameAuto', {
								initialValue: appNameAuto,
								rules: [
									{
										required: false,
									},
								],
							})(<TextArea
								disabled
								autoSize={{
									minRows: 1
								}}
							/>)
							}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem hasFeedback {...formItemLayoutAppNameEditing}>
							{getFieldDecorator('appNameEditing', {
								initialValue: appNameEditing.length > 0 ? appNameEditing : [],
								rules: [
									{
										required: false,
									},
								],
							})(<Select
								mode="multiple"
								//showSearch
								showArrow={false}
								disabled={flag}
								onSearch={debounce(800, appNameEditingFind)}
								onChange={onAppNameEditingChange}
								getPopupContainer={() => document.body}
							>
								{optionAppNameEditing}
							</Select>)
							}
						</FormItem>
					</Col>
				</Row>
				<Row span={24}>
					{/* <Col span={20}>
						<FormItem label="不进维护期告警" hasFeedback {...formItemLayout5}>
							{getFieldDecorator('whitelistEnabled', {
								initialValue: item.whitelistEnabled ? item.whitelistEnabled.split(",") : defaultCheckbox,
							})((<Checkbox.Group
								className={mystyle.checkboxGroup}
								options={checkboxOption}
							/>))}
						</FormItem>
					</Col>
					<Col span={4} >
						<Tooltip title={"选中后,该类型告警将不进维护期"} overlayClassName='bmd'>
							<Icon type="question" style={{ color: '#eb2f96', fontSize: "16px", marginTop: "7px", fontWeight: "900" }} />
						</Tooltip>
					</Col> */}

					<Col span={20}>
						<FormItem label="不进维护期告警" hasFeedback {...formItemLayout5}>
							{getFieldDecorator('whitelistEnabled', {
								initialValue: item.whitelistEnabled ? item.whitelistEnabled.split(",") : defaultCheckbox,
							})((<CheckboxDescribe
								disabled={type === 'see' || type === 'adjust'}
								className={mystyle.checkboxGroup}
								options={checkboxOption}
								dispatch={dispatch}
							/>))}
						</FormItem>
					</Col>
				</Row>

				<Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
					<TabPane tab={<span><Icon type="exception" />维护期告警定义</span>} key="1">

						{
							(user.branch != undefined) ?
								<div><Alert message={infos} type="info" showIcon /><br /></div>
								: null
						}
						{/*基本模式--start*/}
						{
							((alarmType === 'BASIC')) ?
								<ConditionBasicMode {...moFilterBasicProps} />
								:
								null
						}
						{/*end*/}

						{/*专家模式--start*/}
						{
							((alarmType === 'ADVANCED')) ?
								<div><Alert message="请注意单引号为保留字!" type="warning" showIcon /><br />
									<ConditionAdvancedMode {...moFilterProps} />
								</div>
								:
								null
						}
						{/*end*/}

						{/*高级模式--start*/}
						{
							((alarmType === 'SENIOR')) ?
								<div><Alert message="请注意单引号为保留字!" type="warning" showIcon /><br />
									<ConditionOtherMode {...moFilterOtherProps} />
								</div>
								:
								null
						}
						{/*end*/}
					</TabPane>
				</Tabs>
				<div className={mystyle.cycle}>
					<div className={mystyle.cycleLine}>
						<Tabs defaultActiveKey="1">
							<TabPane tab={<span><Icon type="clock-circle-o" />时间定义</span>} key="1" />
						</Tabs>
					</div>
					<div className={mystyle.cycleSelect}>
						{cycletypeSelect}
					</div>
				</div>

				<div className={mystyle.timebox}>
					{type === 'create' ?
						<div>
							{cycles === 'NON_PERIODIC' ?
								<div>{noPeriodics()}</div> :
								<div>
									<Col span={24} className={mystyle.radioPart}>
										<FormItem label="" hasFeedback >
											{getFieldDecorator('repeatType', {
												initialValue: timeType,
											})(<RadioGroup onChange={timeTypeSelect} disabled={type === 'see'}>
												<Radio value="BY_DAY">按天</Radio>
												<Radio value="BY_WEEK">按周</Radio>
											</RadioGroup>)}
										</FormItem>
									</Col>
									{timeType === 'BY_DAY' ?
										<div>{PeriodicsDay()}</div> :
										<div>{PeriodicsWeek()}</div>
									}
								</div>
							}
						</div> :
						<div>
							{cycles === 'NON_PERIODIC' ?
								<div>{noPeriodics()}</div> :
								<div>
									<Col span={24} className={mystyle.radioPart}>
										<FormItem label="" hasFeedback >
											{getFieldDecorator('repeatType', {
												initialValue: (item.timeDef.repeatType === 'OTHER' ? 'BY_WEEK' : `${item.timeDef.repeatType}`),
											})(<RadioGroup onChange={timeTypeSelect} disabled={type === 'see'}>
												<Radio value="BY_DAY">按天</Radio>
												<Radio value="BY_WEEK">按周</Radio>
											</RadioGroup>)}
										</FormItem>
									</Col>
									{timeType === 'BY_DAY' ?
										<div>{PeriodicsDay()}</div> :
										<div>{PeriodicsWeek()}</div>
									}
								</div>
							}
						</div>
					}
				</div>

				{
					(type !== 'create') ?
						<div>
							<div style={{ float: 'left', marginLeft: 10, width: '100%' }} >
								<span style={{ float: 'left', position: 'relative', left: 8 }}>
									<FormItem label="创建人" hasFeedback {...formItemLayout2}>
										{getFieldDecorator('createdBy', {
											initialValue: item.createdBy,
										})(<Input disabled />)}
									</FormItem>
								</span>
								<span style={{ float: 'left', marginLeft: 15, width: '245px' }}>
									<FormItem label="创建时间" hasFeedback {...formItemLayout4}>
										{getFieldDecorator('createdTime', {
											initialValue: new Date(item.createdTime).format('yyyy-MM-dd hh:mm:ss'),
										})(<Input disabled style={{ width: '180px' }} />)}
									</FormItem>
								</span>
							</div>
							<div style={{ float: 'left', width: '100%' }}>
								<span style={{ float: 'left' }}>
									<FormItem label="最后更新人" hasFeedback {...formItemLayout1}>
										{getFieldDecorator('updatedBy', {
											initialValue: item.updatedBy,
										})(<Input disabled />)}
									</FormItem>
								</span>
								<span style={{ float: 'left', width: '245px' }}>
									<FormItem label="更新时间" hasFeedback {...formItemLayout4}>
										{getFieldDecorator('updatedTime', {
											initialValue: new Date(item.updatedTime).format('yyyy-MM-dd hh:mm:ss'),
										})(<Input disabled style={{ width: '180px' }} />)}
									</FormItem>
								</span>
							</div>
						</div>
						: null
				}
			</Form>
		</Modal>
	)
}

modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
