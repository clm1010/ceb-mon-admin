import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import { Link } from 'dva/router'
import { genDictOptsByName } from "../../../utils/FunctionTool"
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const SHOW_ALL = TreeSelect.SHOW_ALL
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout1 = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 8,
	},
}
const formItemLayout2 = {
	labelCol: {
		span: 2,
	},
	wrapperCol: {
		span: 18,
	},
}
const formItemLayout3 = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 8,
	},
}
const formItemLayout4 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 12,
	},
}
const formItemLayout5 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	modalType,
	checkStatus,
	isClose,
	tabstate,
	typeValue,
	stdInfoVal,
	timeList,
	treeNodes,
	treeDataApp,
	fenhang,
	operationType,	//新增策略模板-操作详情部分功能代码
	see,
}) => {
	if (stdInfoVal.name !== undefined) {
		let k = resetFields(['kpi'])
	}

	let icon = '' //done,success,fail,checking


	if (checkStatus == 'done') {
		icon = 'reload'
	} else if (checkStatus == 'success') {
		icon = 'check'
	} else if (checkStatus == 'fail') {
		icon = 'close'
	} else if (checkStatus == 'checking') {
		icon = 'loading'
	}
	let appType = new Array()
	if (type !== 'create' && item.policyTemplate !== undefined) {
		let arr = item.policyTemplate
		appType[0] = `${arr.componentType}-${arr.componentTypeID}`
		appType[1] = `${arr.component}-${arr.componentID}`
		appType[2] = `${arr.subComponent}-${arr.subComponentID}`
	}
	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}

			let targetGroupUUIDs = []
			let groupData = data.group
			if (groupData && groupData.length > 0) {
				let arrs = []
				groupData.forEach((item) => {
					if (arrs.length > 0) {
						arrs = [...arrs, item.value]
					} else {
						arrs = [item.value]
					}
				})
				targetGroupUUIDs = arrs
			}
			let arr = data.applicationtype
			let arrComponentType = ''
			let arrComponent = ''
			let arrSubComponent = ''
			if (arr) {
				if (arr[0]) {
					arrComponentType = arr[0].split('-')
				}
				if (arr[1]) {
					arrComponent = arr[1].split('-')
				}
				if (arr[2]) {
					arrSubComponent = arr[2].split('-')
				}
			}
			const payload = {
				name: data.name,
				alias: data.alias,
				policyType: data.policyType,
				component: (arr && arrComponent[0] !== 'undefined') ? (arrComponent[0]) : (''),
				componentID: (arr && arrComponent[1] !== 'undefined') ? (arrComponent[1]) : (''),
				componentType: (arr && arrComponentType[0] !== 'undefined') ? (arrComponentType[0]) : (''),
				componentTypeID: (arr && arrComponentType[1] !== 'undefined') ? (arrComponentType[1]) : (''),
				stdAlarmFlag: data.stdAlarmFlag,	//转整型
				subComponent: (arr && arrSubComponent[0] !== 'undefined') ? (arrSubComponent[0]) : (''),
				subComponentID: (arr && arrSubComponent[1] !== 'undefined') ? (arrSubComponent[1]) : (''),
				branch: data.branch,
				collectParams: {
					collectInterval: (typeValue !== 'SYSLOG' ? data.collectInterval : 1),
					timeout: (typeValue !== 'SYSLOG' ? data.timeout : 1),
					retries: (data.retries ? data.retries : ''),
					pktSize: (data.pktSize ? data.pktSize : ''),
					pktNum: (data.pktNum ? data.pktNum : ''),
					srcDeviceIP: (data.srcDeviceIP ? data.srcDeviceIP : ''),

					srcDeviceTimeout: (data.srcDeviceTimeout ? data.srcDeviceTimeout : ''),
					srcDeviceRetries: (data.srcDeviceRetries ? data.srcDeviceRetries : ''),
					uuid: (item && item.policyTemplate && item.policyTemplate.collectParams ? (item.policyTemplate.collectParams.uuid ? item.policyTemplate.collectParams.uuid : '') : ''),
					pktInterval: (data.pktInterval ? data.pktInterval : ''),
					srcDeviceSnmpCommunity: (data.srcDeviceSnmpCommunity ? data.srcDeviceSnmpCommunity : ''),

				},
				targetGroupUUIDs,
				alarmSettings: [],
			}
			//新增策略模板-操作详情部分功能代码----start
			let validate = true
			tabstate.panes.forEach((item) => {
				if (!item.content.filterItems) {
					validate = false;
				} else if (validate) {
					item.content.filterItems.forEach((item) => {
						if (item.function == 'nodata_1') {
							item.function = 'nodata'
							item.exprRValue = '0'
						}
						if (item.function == 'regexp_1') {
							item.function = 'regexp'
							item.exprRValue = '0'
						}
					})
					let conditions = []
					if (item.content.exprForFrontend) {
						let aa = eval("(" + item.content.exprForFrontend + ")")
						aa.forEach((item) => {
							let kpi = {}
							kpi.indicator = {}
							if (item.uuid.includes('#{') && item.uuid.includes('-')) {
								let ap = item.uuid.indexOf('{')
								let bp = item.uuid.indexOf('}')
								let uuid = item.uuid.substr(ap + 1, bp - ap - 1)
								kpi.indicator.uuid = uuid
								conditions.push(kpi)
							}
						})
					}
					let op = {
						actions: {
							discardAction: {
								inPeriodDiscard: item.content.discard_innder,
								outPeriodDiscard: item.content.discard_outer,
								uuid: item.content.aDiscardActionuuid,
							},
							gradingAction: {
								oriSeverity: item.content.originalLevel,
								inPeriodSeverity: item.content.innderLevel,
								outPeriodSeverity: item.content.outerLevel,
								uuid: item.content.aGradingActionuuid,
							},
							namingAction: {
								naming: item.content.alarmName,
								uuid: item.content.aNamingActionuuid,
							},
							uuid: item.content.actionsuuid,
						},
						timePeriod: {
							uuid: item.content.period,
						},
						conditions: item.content.mode == '0' ? item.content.filterItems : conditions,
						//logicOp:item.content.mode=='0' ? item.content.logicOp : '',
						logicOp: item.content.logicOp ? item.content.logicOp : '',
						mode: item.content.mode,
						expr: item.content.mode == '1' ? item.content.expr : '',
						exprForFrontend: item.content.mode == '1' ? item.content.exprForFrontend : '',
						uuid: ((item.content.uuid !== '') ? item.content.uuid : ''),
						recoverType: item.content.recoverType,
					}
					payload.alarmSettings.push(op)
					console.log(item)
					console.log(payload)
				}
			})
			//新增策略模板-操作详情部分功能代码----end
			//策略模板操作详情验证---start
			//let validate = true
			let alarmSettingsData = payload.alarmSettings
			alarmSettingsData.forEach((items) => {
				if (items.timePeriod.uuid.length === 0) {
					validate = false
				}
				if (items.actions.namingAction.naming.length === 0) {
					validate = false
				}
			})
			//end
			if (validate) {
				resetFields()
				dispatch({
					type: `policyTemplet/${type}`, //抛一个事件给监听这个type的监听器
					payload,
				})
				dispatch({
					type: 'policyTemplet/updateState',
					payload: {
						filter: {
							filterItems: [{ indicator: { name: '', uuid: '' }, function: 'count', count: '', exprLValue: '', exprOperator: '', exprRValue: '', op: '', threshold: '', index: 0 }],
							filterIndex: [0],
						},
					}
				})
			} else {
				Modal.warning({
					title: '操作详情参数信息输入不完全，请检查！',
					okText: 'OK',
				})
			}
		})
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'policyTemplet/hideModal', //抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
				see: 'no',
			},
		})
		dispatch({
			type: 'strategylist/setState', //抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
				see: 'no',
			},
		})
		dispatch({
			type: 'totalnet/setState', // 抛一个事件给监听这个type的监听器
			payload: {
				moPleVisible: false,
				isClose: true,
				see: 'no'
			}
		})

		dispatch({
			type: 'branchnet/setState', //抛一个事件给监听这个type的监听器
			payload: {
				moPleVisible: false,
				isClose: true,
				see: 'no'
			}
		})

	}

	const modalOpts = {
		title: type === 'create' && see === 'no' ? '新增策略模板' : type === 'update' && see === 'no' ? '编辑策略模板' : type === 'update' && see === 'yes' ? '查看策略模板' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 100,
	}
	const typeChange = (value) => {
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				typeValue: value,
			},
		})
	}
	//新增策略模板-操作详情部分功能代码----start
	const onChange = (activeKey) => {
		updateTabs(tabstate.panes, activeKey, tabstate.newTabIndex)
	}
	const updateTabs = (panes, activeKey, newTabIndex) => {
		dispatch({
			type: 'policyTemplet/updateTabs', //抛一个事件给监听这个type的监听器
			payload: {
				tabstate: {
					activeKey,
					panes,
					newTabIndex,
				},
			},
		})
	}
	const onEdit = (targetKey, action) => {
		//this[action](targetKey);
		if (action == 'remove') {
			remove(targetKey)
		} else if (action == 'add') {
			add()
		}
	}
	let newContent = {
		uuid: '',
		period: '',
		originalLevel: '',
		innderLevel: '',
		outerLevel: '',
		discard_innder: '',
		discard_outer: '',
		alarmName: '',
		recoverType: '1',
		// actionsuuid: '',
		aDiscardActionuuid: '',
		aGradingActionuuid: '',
		aNamingActionuuid: '',
		// conditionuuid: '',
		expr: '',
		exprForFrontend: '',
		timePerioduuid: '',
		mode: '0',
		logicOp: 'AND'

	}
	const add = () => {
		const panes = tabstate.panes
		const newTabIndex = tabstate.newTabIndex + 1
		const activeKey = `n${newTabIndex}`
		panes.push({
			title: `新操作${newTabIndex}`,
			content: newContent,
			key: activeKey,
		})
		updateTabs(panes, activeKey, newTabIndex)
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				operationVisible: true,
				operationType: 'add',
				advancedItem: {},
			},
		})
	}
	const remove = (targetKey) => {
		let targetKeys = targetKey.key
		let activeKey = tabstate.activeKey
		let lastIndex
		tabstate.panes.forEach((pane, i) => {
			if (pane.key === targetKeys) {
				lastIndex = i - 1
			}
		})
		const panes = tabstate.panes.filter(pane => pane.key !== (targetKeys))
		if (lastIndex >= 0 && activeKey === targetKeys) {
			activeKey = panes[lastIndex].key
		} else {
			activeKey = panes[0].key
		}
		updateTabs(panes, activeKey, tabstate.newTabIndex)
	}
	//新增策略模板-操作详情部分功能代码----end
	const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, {
						value: item.uuid,
						label: item.name,
					}]
				} else {
					arrs = [{
						value: item.uuid,
						label: item.name,
					}]
				}
			})
		}
		return arrs
	}

	/*
		指标器
	*/
	const onstdIndicatorsInfo = () => {
		/*
			获取指标树节点的所有信息
		*/
		dispatch({
			type: 'stdIndicatorGroup/query',
			payload: {},
		})
		let groupUUID = '' //此处的 groupUUID 需要指标 所在的 分组
		if (item && item.stdIndicator && item.stdIndicator.group && item.stdIndicator.group.length > 0) {
			groupUUID = item.stdIndicator.group[0].uuid
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'policyTemplet/querystdInfo',
			payload: {
				groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				kpiVisible: true,
			},
		})
	}

	const treeProps = {
		//treeData,
		/*value: this.state.value,
		onChange: this.onChange,*/
		//defaultValue: ['0-0-0'],
		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
		// style: {
		// 	width: 300,
		// },
		dropdownStyle:{ maxHeight: 400, overflow: 'auto' }
	}

	const apptre = {
		treeData: treeDataApp,
	}

	{ /*新操作部分样式变更---start*/ }
	const newOperation = (record, e) => {
		let CheckboxSate = false
		if (record.content.useExt) {
			CheckboxSate = true
		}
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				operationVisible: true,
				newOperationItem: record,
				operationType: 'edit',
				CheckboxSate1: CheckboxSate,
				advancedItem: {
					expr: record.content.expr,
					exprForFrontend: record.content.exprForFrontend,
					logicOp: record.content.logicOp
				},
			},
		})
	}

	let mapsPeriod = new Map()
	timeList.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		mapsPeriod.set(keys, values)
	})
	let fowardValue = ''
	const fowardConst = (text) => {
		switch (text) {
			case '>':
				fowardValue = '高于'
				break
			case '>=':
				fowardValue = '高于等于'
				break
			case '<':
				fowardValue = '低于'
				break
			case '<=':
				fowardValue = '低于等于'
				break
			case '=':
				fowardValue = '等于'
				break
			default:
				fowardValue = text
		}
	}
	let recoverValue = '可恢复'
	const recoverConst = (record) => {
		if (record.content.recoverType === '1') {
			recoverValue = '可恢复'
		} else {
			recoverValue = '不可恢复'
		}
	}
	const columns = [
		{
			title: '告警名定义',
			dataIndex: 'content.alarmName',
			key: 'content.alarmName',
			width: 300,
		},
		{
			title: '恢复类型 ',
			dataIndex: 'recoverType',
			key: 'recoverType',
			render: (text, record) => (
				<div onLoad={recoverConst(record)}>{recoverValue}</div>
			),
		},
		{
			title: '监控周期',
			dataIndex: 'content.period',
			key: 'content.period',
			render: (text, record) => (
				<div>{mapsPeriod.get(text)}</div>
			),
		},
		{
			title: '原始级别',
			dataIndex: 'content.originalLevel',
			key: 'content.originalLevel',
		},
		{
			title: '周期内',
			dataIndex: 'content.innderLevel',
			key: 'content.innderLevel',
		},
		{
			title: '周期外',
			dataIndex: 'content.outerLevel',
			key: 'content.outerLevel',
		},
		{
			title: '操作',
			key: 'action',
			width: 105,
			fixed: 'right',
			render: (text, record) => (
				<div>
					<a onClick={add} style={{ marginRight: 5 }} href="#">增加</a>
					<a onClick={newOperation.bind(this, record)} style={{ marginRight: 5 }} href="#">编辑</a>
					{tabstate.panes.length === 1 ?
						<a onClick={remove.bind(this, record)} disabled href="#">删除</a> :
						<a onClick={remove.bind(this, record)} href="#">删除</a>
					}
				</div>
			),
		}]
	let data = []
	tabstate.panes.forEach((pane, i) => {
		data.push(pane)
		data[i].key = i
	})

	{ /*新操作部分样式变更---end*/ }

	//适用范围查询条件搜索---start
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	//end

	//数值验证
	const blurFunctions = (rulr, value, callback) => {
		let regx = /^\+?[1-9][0-9]*$/
		if (!regx.test(value)) {
			callback('Please enter a positive integer！')
		} else {
			callback()
		}
	}

	const dictArr = JSON.parse(localStorage.getItem('dict'))['applicationtype']
	let depentTree = []
	let options = []
	const AppTypeStreeData = (dictArr) => {
		dictArr.forEach((opt) => {
			let name = opt.name.split('-')   //
			let key = opt.key.split('-')
			let i = 0
			const fun = (options, name, key) => {
				let object = {}
				if (options.length == 0 || options.find(o => o.value == `${name[i]}-${key[i]}`) == null) {
					object.label = name[i]
					object.key = key[i]
					object.value = `${name[i]}-${key[i]}`
					options.push(object)
				} else if (i < name.length) {
					options.map(item => {
						if (item.key == key[i]) {
							i++
							fun(item.children, name, key)
						}
					})
				}
				i++
				if (i < name.length) {
					object.children = []
					fun(object.children, name, key)
				}
				return options
			}
			depentTree = fun(options, name, key)
		})
	}
	AppTypeStreeData(dictArr)

	const labelParamInterval = (typeValue === 'PROMETHEUS') ? "持续时间" : "采集间隔";

	return (

		<Modal {...modalOpts}
			width="700px"
			footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
			<Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			<Form layout="horizontal">
				<Tabs defaultActiveKey="templet_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="templet_1">
						<FormItem label="模板名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: item.policyTemplate ? item.policyTemplate.name : "",
								rules: [
									{
										required: true,
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="别名" hasFeedback {...formItemLayout}>
							{getFieldDecorator('alias', {
								initialValue: item.policyTemplate.alias,
								rules: [
								],
							})(<Input />)}
						</FormItem>
						<div style={{ position: 'relative' }} id="area1" />
						<FormItem label="策略类型" hasFeedback {...formItemLayout}>
							{getFieldDecorator('policyType', {
								initialValue: item.policyTemplate ? item.policyTemplate.policyType : "",
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								onChange={typeChange}
							//            getPopupContainer={() => document.getElementById('area1')}
							>
								{genDictOptsByName('aleatspolicyType')}
								{/*<Select.Option value="NORMAL">普通</Select.Option>*/}
								{/*<Select.Option value="PING">PING</Select.Option>*/}
								{/*<Select.Option value="RPING">RPING</Select.Option>*/}
								{/*<Select.Option value="SYSLOG">SYSLOG</Select.Option>*/}
								{/* <Select.Option value="ITM">ITM</Select.Option> */}
							</Select>)}
						</FormItem>
						<div style={{ position: 'relative' }} id="area2" />
						<FormItem label="分组" {...formItemLayout}>
							{getFieldDecorator('group', {
								initialValue: showGroupName(item.policyTemplate ? item.policyTemplate.group : ""), /*此处为字段的值，可以把 item对象 的值放进来*/
								rules: [
									{
										//									required: true,
										type: 'array',
									},
								],
							})(<TreeSelect
								{...treeProps}
							>{treeNodes}
							</TreeSelect>)}
						</FormItem>
						<FormItem label="分支机构" hasFeedback {...formItemLayout}>
							{getFieldDecorator('branch', {
								initialValue: item.policyTemplate ? item.policyTemplate.branch : "",
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								filterOption={mySearchInfo}
							>
								{fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
							</Select>)}
						</FormItem>

						<FormItem label="策略应用类型" {...formItemLayout}>
							{getFieldDecorator('applicationtype', {
								initialValue: ((type !== 'create') ? appType : null), /*此处为字段的值，可以把 item对象 的值放进来*/
								rules: [
									{
										//									required: true,
										type: 'array',
									},
								],
							})(<Cascader options={depentTree} changeOnSelect={true} />)}
						</FormItem>
						<FormItem label="标准策略" hasFeedback {...formItemLayout}>
							{getFieldDecorator('stdAlarmFlag', {
								initialValue: item.policyTemplate ? item.policyTemplate.stdAlarmFlag : "",
								rules: [
									{
										required: true,
									},
								],
							})(<Select>
								<Select.Option value={0}>否</Select.Option>
								<Select.Option value={1}>是</Select.Option>
							</Select>)}
						</FormItem>
					</TabPane>
				</Tabs>
				{
					((typeValue !== 'SYSLOG')) ?
						<div>
							<Tabs defaultActiveKey="templet_2">
								<TabPane tab={<span><Icon type="setting" />监控参数</span>} key="templet_2">
									{
										(typeValue == 'PROMETHEUS' || typeValue == 'SKYWALKING') ?
											//<FormItem label="持续时间" hasFeedback {...formItemLayout4}>
											<FormItem label={labelParamInterval} hasFeedback {...formItemLayout4}>
												{getFieldDecorator('collectInterval', {
													initialValue: item.policyTemplate ? item.policyTemplate.collectParams.collectInterval : "",
													rules: [
														{
															required: true,
														},
														// {
														// 	validator: blurFunctions,
														// },
													],
												})(<InputNumber min={0} step={1} precision={1} />)}秒
											</FormItem>
											:
											<div>
												<FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
													{getFieldDecorator('collectInterval', {
														initialValue: item.policyTemplate ? item.policyTemplate.collectParams.collectInterval : "",
														rules: [
															{
																required: true,
															},
															{
																validator: blurFunctions,
															},
														],
													})(<InputNumber min={1} step={1} precision={1} />)}秒
												</FormItem>
												<FormItem label="超时时间" hasFeedback {...formItemLayout4}>
													{getFieldDecorator('timeout', {
														initialValue: item.policyTemplate ? item.policyTemplate.collectParams.timeout : "",
														rules: [
															{
																required: true,
															},
															{
																validator: blurFunctions,
															},
														],
													})(<InputNumber min={1} step={1} precision={1} />)}秒
												</FormItem>
											</div>
									}
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="包大小" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktSize', {
													initialValue: item.policyTemplate ? item.policyTemplate.collectParams.pktSize : "",
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber min={1} step={1} precision={1} />)}字节
											</FormItem>
											:
											null
									}
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="包个数" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktNum', {
													initialValue: item.policyTemplate ? item.policyTemplate.collectParams.pktNum : "",
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber min={1} step={1} precision={1} />)}
											</FormItem>
											:
											null
									}

									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="发包间隔" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktInterval', {
													initialValue: (item.policyTemplate ? item.policyTemplate.collectParams.pktInterval ? item.policyTemplate.collectParams.pktInterval : 0 : 0),
													rules: [
														{
															required: true,
														},
														// {
														// 	validator: blurFunctions,
														// },
													],
												})(<InputNumber min={0} step={1} precision={2} />)}
											</FormItem>
											:
											null
									}

									{
										((typeValue == 'RPING')) ?
											<FormItem label="源设备超时时间" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('srcDeviceTimeout', {
													initialValue: item.policyTemplate ? item.policyTemplate.collectParams.srcDeviceTimeout : 0,
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber min={1} step={1} precision={1} />)}
											</FormItem>
											:
											null
									}
									{
										((typeValue == 'RPING')) ?
											<FormItem label="源设备失败重试次数" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('srcDeviceRetries', {
													initialValue: item.policyTemplate ? item.policyTemplate.collectParams.srcDeviceRetries : 0,
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber min={1} step={1} precision={1} />)}
											</FormItem>
											:
											null
									}
								</TabPane>
							</Tabs>

						</div>
						:
						null
				}
				{/*
	  			<FormItem label="监控操作uuid" style={{ display : 'none' }} {...formItemLayout4}>
          			{getFieldDecorator('monitorUUID', {
            				initialValue: (item && item.policyTemplate && item.policyTemplate.monitorParams ? item.policyTemplate.monitorParams.uuid : ''),
          			})(<Input disabled/>)}
	 			</FormItem>
	  			*/}

				{/*新操作部分样式变更---start*/}
				<Tabs defaultActiveKey="templet_3" style={{ marginBottom: 10 }}>
					<TabPane tab={<span><Icon type="exception" />告警设置</span>} key="templet_3">
						<Table
							scroll={{ x: 700 }}
							columns={columns}
							dataSource={data}
							size="small"
							bordered
							pagination={false}
						/>
					</TabPane>
				</Tabs>
				{/*新操作部分样式变更---end*/}

				{
					(type !== 'create') ?

						<Row gutter={24}>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="创建人" {...formItemLayout4} >
									{getFieldDecorator('Creater', {
										initialValue: item.policyTemplate ? item.policyTemplate.createdBy : "",
									})(<Input style={{ width: 100 }} disabled />)}
								</FormItem>
							</Col>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="创建时间" {...formItemLayout4}>
									{getFieldDecorator('CreaterTime', {
										initialValue: item.policyTemplate ? item.policyTemplate.createdTime1 : "",
									})(<Input disabled />)}
								</FormItem>
							</Col>
						</Row>

						: null
				}

				{
					(type !== 'create') ?
						<Row gutter={24}>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="最后更新人" {...formItemLayout4}>
									{getFieldDecorator('LastCreater', {
										initialValue: item.policyTemplate ? item.policyTemplate.updatedBy : "",
									})(<Input style={{ width: 100 }} disabled />)}
								</FormItem>
							</Col>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="最后更新时间" {...formItemLayout4}>
									{getFieldDecorator('LastCreaterTime', {
										initialValue: item.policyTemplate ? item.policyTemplate.updatedTime1 : "",
									})(<Input disabled />)}
								</FormItem>
							</Col>
						</Row>
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
