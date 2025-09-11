import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import './List.css'
import {genDictOptsByName} from "../../../../../utils/FunctionTool"
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
	modalName,
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
			if (arr[0]) {
				arrComponentType = arr[0].split('-')
			}
			if (arr[1]) {
				arrComponent = arr[1].split('-')
			}
			if (arr[2]) {
				arrSubComponent = arr[2].split('-')
			}
			const payload = {
				name: data.name,
				alias: data.alias,
				policyType: data.policyType,
				component: (arrComponent[0] !== undefined) ? (arrComponent[0]) : (''),
				componentID: (arrComponent[1] !== undefined) ? (arrComponent[1]) : (''),
				componentType: (arrComponentType[0] !== undefined) ? (arrComponentType[0]) : (''),
				componentTypeID: (arrComponentType[1] !== undefined) ? (arrComponentType[1]) : (''),
				subComponent: (arrSubComponent[0] !== undefined) ? (arrSubComponent[0]) : (''),
				subComponentID: (arrSubComponent[1] !== undefined) ? (arrSubComponent[1]) : (''),
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
				monitorParams: {
					indicator: {
						uuid: stdInfoVal.uuid,
					},
					ops: [],
					uuid: (item && item.policyTemplate && item.policyTemplate.monitorParams ? item.policyTemplate.monitorParams.uuid : ''),
				},
			}
			//新增策略模板-操作详情部分功能代码----start
			tabstate.panes.forEach((item) => {
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
					condition: {
						count: item.content.times,
						op: item.content.foward,
						threshold: item.content.filterMode == 'ADVANCED' ? item.content.fields.formula : item.content.value,
						extOp: item.content.filterMode == 'ADVANCED' ? 'ADV' : item.content.extOp,
						extThreshold: item.content.filterMode == 'ADVANCED' ? item.content.fields.formulaForFrontend : item.content.extThreshold,
						useExt: item.content.filterMode == 'ADVANCED' ? false : item.content.useExt,
						uuid: item.content.conditionuuid,
					},
					uuid: ((item.content.uuid !== '') ? item.content.uuid : ''),
					recoverType: item.content.recoverType,
				}
				payload.monitorParams.ops.push(op)
			})
			//新增策略模板-操作详情部分功能代码----end
			//策略模板操作详情验证---start
			let validate = true
			let monitorParamsData = payload.monitorParams

			monitorParamsData.ops.forEach((items) => {
				if (items.timePeriod.uuid.length === 0) {
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
			//type: 'policyTemplet/hideModal', //抛一个事件给监听这个type的监听器
			type: `${modalName}/hideModal`, //抛一个事件给监听这个type的监听器
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
		//zIndex: 100,
	}
	const typeChange = (value) => {
		if(value=='PROMETHEUS'){
			tabstate.panes[0].content.foward=''
		}else{
			tabstate.panes[0].content.foward='>'
		}
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				typeValue: value,
				tabstate:tabstate,
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
		times: '',
		foward: '>',
		value: '',
		originalLevel: '',
		innderLevel: '',
		outerLevel: '',
		discard_innder: '',
		discard_outer: '',
		alarmName: '',
		recoverType: '1',
		actionsuuid: '',
		aDiscardActionuuid: '',
		aGradingActionuuid: '',
		aNamingActionuuid: '',
		conditionuuid: '',
		timePerioduuid: '',
		useExt: false, //是否使用扩展条件
		extOp: '<', //扩展条件
		extThreshold: '', //扩展阈值
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
				filterMode:typeValue=='PROMETHEUS' ? 'ADVANCED' : 'BASIC',
				typeValue:typeValue,
				fields:{},
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
		style: {
			width: 300,
		},
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
			type: `${modalName}/updateState`,
			payload: {
				operationVisible: true,
				newOperationItem: record,
				fields:record.content.fields || {},
				filterMode:record.content.filterMode || (typeValue=='PROMETHEUS' ? 'ADVANCED' : 'BASIC'),
				operationType: 'edit',
				CheckboxSate1: CheckboxSate,
				typeValue:typeValue,
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
			title: '连续次数',
			dataIndex: 'content.times',
			key: 'content.times',
			className:(typeValue == 'PROMETHEUS') ?'noShow':null,
		},
		{
			title: '运算符',
			dataIndex: 'content.foward',
			key: 'content.foward',
			//className:(typeValue == 'PROMETHEUS') ?'noShow':null,
			render: (text, record) => (
				<div onLoad={fowardConst(text)}>{fowardValue}</div>
			),
		},
		{
			title: '数值',
			dataIndex: 'content.value',
			key: 'content.value',
			render: (text, record) =>{
				let texts = ''
				if(record.content.useExt == false && record.content.extOp == 'ADV'){
					let objectArray = JSON.parse(record.content.extThreshold)
					objectArray.forEach((i)=>{
						texts+=i.name
					})
					return (
						<div >{texts}</div>
					)
				}
				return (
					<div onLoad={fowardConst(text)}>{fowardValue}</div>
				)
			} 
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
			width: 150,
			fixed: 'right',
			render: (text, record) => (
				<div>
					<a onClick={add} style={{ marginRight: 5 }}>增加</a>
					<a onClick={newOperation.bind(this, record)} style={{ marginRight: 5 }}>编辑</a>
					{tabstate.panes.length === 1 ?
						<a onClick={remove.bind(this, record)} disabled>删除</a> :
						<a onClick={remove.bind(this, record)}>删除</a>
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
	const AppTypeStreeData = (dictArr)=>{
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

						<FormItem label="告警类型" {...formItemLayout}>
							{getFieldDecorator('applicationtype', {
								initialValue: ((type !== 'create') ? appType : null), /*此处为字段的值，可以把 item对象 的值放进来*/
								rules: [
									{
										//									required: true,
										type: 'array',
									},
								],
							})(<Cascader options={depentTree} changeOnSelect={true}/>)}
						</FormItem>
						{/*
						<div style={{position: 'relative'  }} id="area4"/>
        					<FormItem label="告警恢复类型" hasFeedback {...formItemLayout}>
          					{getFieldDecorator('recoverType', {
            						initialValue: item.policyTemplate.recoverType,
            						rules: [
              					{
                						required: true,
              					},
            						],
          					})(
	          					<Select
	    								showSearch
	  								getPopupContainer={() => document.getElementById('area4')}
	  							>
					   				<Select.Option value="0">不可恢复</Select.Option>
					    				<Select.Option value="1">可恢复</Select.Option>
	  							</Select>
          					)}
        					</FormItem>
        					*/}
					</TabPane>
				</Tabs>
				{
					((typeValue !== 'SYSLOG')) ?
						<div>
							<Tabs defaultActiveKey="templet_2">
								<TabPane tab={<span><Icon type="setting" />监控参数</span>} key="templet_2">
									{
										(typeValue == 'PROMETHEUS') ?
										<FormItem label="持续时间" hasFeedback {...formItemLayout4}>
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
							<FormItem label="指&nbsp;&nbsp;&nbsp;&nbsp;标" hasFeedback {...formItemLayout4}>
								{getFieldDecorator('kpi', {
									initialValue: stdInfoVal.name,
									rules: [
										{
											required: true,
										},
									],
								})(<Input readOnly onClick={onstdIndicatorsInfo} />)}
							</FormItem>
						</div>
						:
						<FormItem label="指&nbsp;&nbsp;&nbsp;&nbsp;标" hasFeedback {...formItemLayout5}>
							{getFieldDecorator('kpi', {
								initialValue: stdInfoVal.name,
								rules: [
									{
										required: true,
									},
								],
							})(<Input readOnly onClick={onstdIndicatorsInfo} />)}
						</FormItem>
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
					<TabPane tab={<span><Icon type="exception" />操作详情</span>} key="templet_3">
						<Table
							scroll={{ x: 950 }}
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
