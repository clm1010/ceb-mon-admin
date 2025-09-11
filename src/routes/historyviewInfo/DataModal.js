import React from 'react'
import PropTypes from 'prop-types'
import mystyle from './DataModal.less'
import { Form, Input, Radio, Modal, Select, Row, Col, Tabs, DatePicker, TimePicker, Icon, Button,Alert } from 'antd'
import ConditionBasicMode from '../../components/maintenance/eventFilter/ConditionBasicMode' //基础模式
import ConditionAdvancedMode from '../../components/maintenance/eventFilter/ConditionAdvancedMode' //专家模式
import ConditionOtherMode from '../../components/maintenance/eventFilter/ConditionOtherMode'
import { validateRangeLessThanHalfYear } from '../../utils/FormValTool'
import UserSelectComp from '../../components/userSelectComp'
import { genDictOptsByName } from '../../utils/FunctionTool'
import debounce from 'throttle-debounce/debounce'
import moment from 'moment';
const FormItem = Form.Item
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
const Option = Select.Option
const {
	RangePicker,
} = DatePicker
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
	cycles,
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
	checkedWeek,
	listHost1,
	listHost2,
	selectHostuuid,
	host2portMap,
	listPort1,
	listPort2,
	listApp1,
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
	isenabled,
	checked,
	user,
	buttonState, //端口查询按钮的状态
	hostOtherValue,
	appOtherValue,
	gjtzOtherValue,
	fetchingIP,
	fetchingApp,
	alertGroupValue,
	componentValue,
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
	optionAppNameEditing,
	optionCluster,
	optionNamespace,
	optionIndicator,
	appNameAuto,
	appNameEditing,
}) => {
	//对机构进行排序 start
	const branchs = genDictOptsByName('branch')
	let branchs1 = branchs.filter(x => { if (x.key == 'ZH' || x.key == 'QH') { return x } })
	const branchs2 = branchs.filter(x => { if (x.key != 'ZH' && x.key != 'QH') { return x } }).sort((a, b) => a.key.localeCompare(b.key))
	const branchsort = branchs1.concat(branchs2)
	// 对机构进行排序 end
	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	} = form
	let flag = false

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
								console.log('branchValues:', branchValues)
							} else if (roles.action === 'create' && !roles.has && type === 'create') {
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
						}
					}
				}
			}
		}
	}

	//查询是否有专家模式权限--start
	let isExpertRoles = true
	if (type === 'see') {
		isExpertRoles = false
	}
	if (item.timeDef && item.timeDef.repeatType == 'OTHER') {
		let tempLists = item.timeDef.range
		tempLists.forEach((item, index) => {
			let newObj = {}
			newObj.index = index + 1
			newObj.tempid = item.uuid
			let timeArray = new Array();
			timeArray[0] = moment(item.begin, 'YYYY-MM-DD HH:mm:ss')
			timeArray[1] = moment(item.end, 'YYYY-MM-DD HH:mm:ss')
			newObj.end = timeArray
			tempList[index] = newObj
		})
		tempDayList = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListMon = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListTue = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListWed = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListThu = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListFri = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListSat = [{ index: 1, tempid: '', begin: '', end: '' },]
		tempWeekListSun = [{ index: 1, tempid: '', begin: '', end: '' },]

	} else if (item.timeDef && item.timeDef.repeatType == 'BY_DAY') {
		let tempLists = item.timeDef.range
		tempLists.forEach((item, index) => {
			let newObj = {}
			newObj.index = index + 1
			newObj.tempid = item.uuid
			newObj.begin = moment(item.begin, 'HH:mm:ss')
			newObj.end = moment(item.end, 'HH:mm:ss')
			tempDayList[index] = newObj
		})
		tempList = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListMon = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListTue = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListWed = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListThu = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListFri = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListSat = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempWeekListSun = [{ index: 1, tempid: '', begin: '', end: '' },]

	} else if (item.timeDef && item.timeDef.repeatType == 'BY_WEEK') {
		let tempLists = item.timeDef.weekRange
		tempLists.forEach((item, index) => {
			let newObj = {}
			let objs = item.range
			switch (item.weekday) {
				case 'MON':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListMon[index] = newObj
					})
					//						checked.push('MON')
					checked = 'MON'
					break;
				case 'TUE':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListTue[index] = newObj
					})
					//						checked.push('TUE')
					checked = 'TUE'
					break;
				case 'WED':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListWed[index] = newObj
					})
					//						checked.push('WED')
					checked = 'WED'
					break;
				case 'THU':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListThu[index] = newObj
					})
					//						checked.push('THU')
					checked = 'THU'
					break;
				case 'FRI':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListFri[index] = newObj
					})
					//						checked.push('FRI')
					checked = 'FRI'
					break;
				case 'SAT':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListSat[index] = newObj
					})
					//						checked.push('SAT')
					checked = 'SAT'
					break;
				case 'SUN':
					objs.forEach((items, indexs) => {
						newObj.index = indexs + 1
						newObj.tempid = items.uuid
						newObj.begin = moment(items.begin, 'HH:mm:ss')
						newObj.end = moment(items.end, 'HH:mm:ss')
						tempWeekListSun[index] = newObj
					})
					//						checked.push('SUN')
					checked = 'SUN'
					break;
			}
		})
		checkedWeek = checked,
			tempList = [{ index: 1, tempid: '', begin: '', end: '' },],
			tempDayList = [{ index: 1, tempid: '', begin: '', end: '' },]
	}
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


	let cyclesType = ''
	let dateType = ''

	const rangeSelect = (arr) => {
		cyclesType = arr
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
				buttonState: true,
				modalVisible: false,
				isClose: true,
				cycles: 'NON_PERIODIC',
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
				listDistributed2: [],
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
				AdvancedFilterValue: '',
				AdvancedFilterAppNameValue: '',
			},
		})
	}

	const modalOpts = {
		title: '查看维护期实例',
		visible,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 950,
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
				listDistributed2: []
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
		let q = `name=='*${data.name}*'`
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

	let texts = []
	let infos = ''
	for (let filter of alarmApplyFilter) {
		if (filter.resource === '/api/v1/mts') { //维护期
			for (let info of filter.filterItems) {
				texts.push(`${info.field} ${info.op} ${info.value} ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
	}

	let texts2 = []
	for (let filter2 of filterInfo) {
		if (filter2.resource === '/api/v1/mts') { //维护期
			for (let info of filter2.filterItems) {
				texts2.push(`${info.field} ${info.op} ${info.value} ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
	}
	if (type === 'update' || type === 'kelong') {
		if (texts.length > 0) {
			infos = `当前用户新建的维护期处理告警范围: ${texts.join(' ')}`
		} else {
			infos = '当前用户新建的维护期处理告警范围: 全部告警'
		}
	} else if (texts2.length > 0) {
		infos = `当前用户新建的维护期处理告警范围: ${texts2.join(' ')}`
	} else {
		infos = '当前用户新建的维护期处理告警范围: 全部告警'
	}


	const operations = (<FormItem {...FormItemProps} key="modeswitchWai">
		{getFieldDecorator('filterModeWai', {
			initialValue: alarmType,
		})(<Select disabled={type === 'see'} size="small" onChange={typeChange} style={{ width: '120px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="SENIOR">高级模式</Select.Option>
			<Select.Option value="ADVANCED">专家模式</Select.Option>
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
		return current && (
			current.valueOf() < new Date(new Date().toLocaleDateString()).getTime() ||
			current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000)
	}

	const noPeriodics = () => {
		return (
			<div style={{ paddingLeft: 32 }}>
				<div className={mystyle.timebox_left}>时间段:</div>
				<div className={mystyle.timebox_right}>
					{tempList.map(templet =>
						(<Row key={`row_${templet.index}`}>
							<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} key={`col_${templet.index}_0`}>
								<FormItem label="" hasFeedback {...formItemLayout3} key={`end_${templet.index}`}>
									{getFieldDecorator('endTimeList', {
										initialValue: templet.end,
										rules: [
											{
												required: true,
											},
											{
												validator: validateRangeLessThanHalfYear,
											},
										],
									})(<RangePicker
										disabledDate={disabledDate}
										showTime={{ format: 'HH:mm:ss' }}
										format="YYYY-MM-DD HH:mm:ss"
										placeholder={['从', '到']}
										style={{ width: '100%', marginLeft: 10 }}
										disabled={type === 'see'}
									/>)}
								</FormItem>
							</Col>
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
		placeholders: '申请人工号、姓名检索', name: '申请人', modeType: 'combobox', required: true, dispatch, form, item, disabled: type === 'see', compName: 'applicant', cDefaultName: applicantInfo,
	})
	return (
		<Modal {...modalOpts} width="1250px" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}>
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
					})(<Input onBlur={queryName} disabled={type === 'see'} />)}
				</FormItem>

				<FormItem label="描述" hasFeedback {...formItemLayout}>
					{getFieldDecorator('description', {
						initialValue: item.description,
					})(<Input disabled={type === 'see'} />)}
				</FormItem>

				<FormItem label="是否启用" hasFeedback {...formItemLayout} >
					{getFieldDecorator('enabled', {
						initialValue: `${isenabled}`,
					})(<RadioGroup disabled={type === 'see'}>
						<Radio value="true">是</Radio>
						<Radio value="false">否</Radio>
					</RadioGroup>)}
				</FormItem>

				<FormItem label="维护期关联特征" hasFeedback {...formItemLayout}>
					{getFieldDecorator('correlationFeature', {
						initialValue: item.correlationFeature,
					})(<Input disabled={type === 'see'} />)}
				</FormItem>

				<FormItem label="变更号" hasFeedback {...formItemLayout}>
					{getFieldDecorator('ticket', {
						initialValue: item.ticket,
					})(<Input disabled={type === 'see'} />)}
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
						disabled={type === 'see'}
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
							})(<Input
								disabled
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
