import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import { Link } from 'dva/router'
import { genDictOptsByName } from "../../utils/FunctionTool"
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
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
	type,
	dispatch,
	loading,
	visible,
	visible2,
	ruleUUIDs,
	item = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	tabstate,
	typeValue,
	stdInfoVal,
	timeList,
	obInfoVal,
	treeDataApp,
	fenhang,
	branchs,
	operationType,	//新增策略模板-操作详情部分功能代码
	see,
}) => {
	let appType = new Array()
	if (type !== 'create') {
		appType[0] = `${item.componentType}-${item.componentTypeID}`
		appType[1] = `${item.component}-${item.componentID}`
		appType[2] = `${item.subComponent}-${item.subComponentID}`
	}
	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			let collectParams = {
				collectInterval: (data.collectInterval ? data.collectInterval : ''),
				timeout: (data.timeout ? data.timeout : ''),
				retries: (data.retries ? data.retries : ''),
				pktSize: (data.pktSize ? data.pktSize : ''),
				pktNum: (data.pktNum ? data.pktNum : ''),
				srcDeviceIP: (data.srcDeviceIP ? data.pktNum : ''),
				srcDeviceTimeout: (data.srcDeviceTimeout ? data.srcDeviceTimeout : ''),
				srcDeviceRetries: (data.srcDeviceRetries ? data.srcDeviceRetries : ''),
				uuid: (item.collectParams.uuid ? item.collectParams.uuid : ''),
				pktInterval: (data.pktInterval ? data.pktInterval : ''),
				srcDeviceSnmpCommunity: (data.srcDeviceSnmpCommunity ? data.srcDeviceSnmpCommunity : ''),
			}


			let saveitem = {}
			saveitem.moUUID = obInfoVal.uuid
			saveitem.name = (data.name ? data.name : '')
			saveitem.branch = (data.branch ? data.branch : '')
			saveitem.policy = {}
			saveitem.policy.collectParams = collectParams
			saveitem.policy.alarmSettings=[]
			// let indicator = {
			// 	uuid: stdInfoVal.uuid,
			// }
			let monitorParams = {}
			saveitem.policy.monitorParams = monitorParams
			saveitem.policy.uuid = (item.policyuuid ? item.policyuuid : '')
			//
			saveitem.policy.createdFrom = (item.createdFrom ? item.createdFrom : null)
			saveitem.policy.isStd = false
			saveitem.policy.group = (item.group ? item.group : null)
			saveitem.policy.issueStatus = (item.issueStatus ? item.issueStatus : null)
			saveitem.policy.name = item.name //item.policyname
			saveitem.policy.policyType = data.policyType
			let template = {}
			saveitem.policy.template = template
			//
			saveitem.policy.template.uuid = (item.templateuuid ? item.templateuuid : '')
			//策略应用类型
			let arr = data.applicationtype
			if (arr !== null) {
				let arrComponentType = arr[0].split('-')
				let arrComponent = arr[1].split('-')
				let arrSubComponent = arr[2].split('-')
				saveitem.policy.component = arrComponent[0]
				saveitem.policy.componentID = arrComponent[1]
				saveitem.policy.componentType = arrComponentType[0]
				saveitem.policy.componentTypeID = arrComponentType[1]
				saveitem.policy.subComponent = arrSubComponent[0]
				saveitem.policy.subComponentID = arrSubComponent[1]
			} else if (arr === null) {
				saveitem.policy.component = ''
				saveitem.policy.componentID = ''
				saveitem.policy.componentType = ''
				saveitem.policy.componentTypeID = ''
				saveitem.policy.subComponent = ''
				saveitem.policy.subComponentID = ''
			}


			let tool = {}
			tool.toolType = data.tool
			saveitem.tool = tool
			//新增策略模板-操作详情部分功能代码----start
			tabstate.panes.forEach((item) => {
				item.content.filterItems.forEach((item)=>{
					if(item.function=='nodata_1'){
						item.function='nodata'
						item.exprRValue = '0'
					}
					if(item.function=='regexp_1'){
						item.function='regexp'
						item.exprRValue = '0'
					}
				})
				let conditions =[]
				if(item.content.exprForFrontend){
					let aa = eval("("+item.content.exprForFrontend+")")
					aa.forEach((item)=>{
						let kpi={}
						kpi.indicator={}
						if(item.uuid.includes('#{') && item.uuid.includes('-')){
							let ap = item.uuid.indexOf('{')
							let bp = item.uuid.indexOf('}')
							let uuid = item.uuid.substr(ap+1,bp-ap-1)
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
					conditions:item.content.mode=='0' ? item.content.filterItems : conditions,
					logicOp:item.content.mode=='0' ? item.content.logicOp : '',
					mode:item.content.mode,
					expr:item.content.expr,
					exprForFrontend:item.content.exprForFrontend,
					uuid: ((item.content.uuid !== '') ? item.content.uuid : ''),
					recoverType: item.content.recoverType,
				}
				saveitem.policy.alarmSettings.push(op)
			})
			//新增策略模板-操作详情部分功能代码----end
			saveitem.ruleUUID = (item.ruleUUID ? item.ruleUUID : '')
			if (type === 'create') {
				dispatch({
					type: 'notNetDown/createMonitorInstance',											//抛一个事件给监听这个type的监听器
					payload: saveitem,
				})
				dispatch({
					type: 'notNetDown/updateState',
					payload:{
						filter:{
							filterItems : [{indicator: {name:'',uuid:''}, function: 'count', count:'', exprLValue: '', exprOperator:'', exprRValue:'', op: '', threshold: '',index:0}],
							filterIndex : [0],
						},
					}
				})
			} else {
				dispatch({
					type: 'notNetDown/updateMonitorInstance',											//抛一个事件给监听这个type的监听器
					payload: saveitem,
				})
			}
			resetFields()
		})
	}

	const onCancel = () => {
		//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				monitorInstanceVisible: false,
				see: 'no',
			},
		})
	}


	const modalOpts = {
		title: type === 'create' && see === 'no' ? '新增监控实例' : type === 'update' && see === 'no' ? '编辑监控实例' : type === 'update' && see === 'yes' ? '查看监控实例' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 100,
	}
	const typeChange = (value) => {
		dispatch({
			type: 'notNetDown/updateState',
			payload: {
				typeValue: value,
			},
		})
	}
	const onChange = (activeKey) => {
		updateTabs(tabstate.panes, activeKey, tabstate.newTabIndex)
	}
	const updateTabs = (panes, activeKey, newTabIndex) => {
		dispatch({
			type: 'notNetDown/updateState',											//抛一个事件给监听这个type的监听器
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
		mode:'0',
		logicOp:'AND'
	}
	const add = () => {
		const panes = tabstate.panes
		const newTabIndex = tabstate.newTabIndex + 1
		const activeKey = `n${newTabIndex}`
		panes.push({ title: `新操作${newTabIndex}`, content: newContent, key: activeKey })
		updateTabs(panes, activeKey, newTabIndex)
		dispatch({
			type: 'notNetDown/updateState',
			payload: {
				operationVisible: true,
				operationType: 'add',
			},
		})
	}
	const remove = (targetKey) => {
		let activeKey = tabstate.activeKey
		let lastIndex
		tabstate.panes.forEach((pane, i) => {
			if (pane.key === targetKey.key) {
				lastIndex = i - 1
			}
		})
		const panes = tabstate.panes.filter(pane => pane.key !== (targetKey.key))
		if (lastIndex >= 0 && activeKey === targetKey.key) {
			activeKey = panes[lastIndex].key
		} else {
			activeKey = panes[0].key
		}
		updateTabs(panes, activeKey, tabstate.newTabIndex)
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
			type: 'notNetDown/querystdInfo',
			payload: {
				groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'notNetDown/updateState',
			payload: {
				kpiVisible: true,
			},
		})
	}

	/*
		选择监控对象
	*/
	const onobjectInfo = () => {
		dispatch({
			type: 'objectMOsModal/query',
			payload: {},
		})
		dispatch({
			type: 'objectMOsModal/controllerModal',
			payload: {
				modalVisible: true,
				showModalKey: `${new Date().getTime()}`,
				openModalKey: `${new Date().getTime()}`,
			},
		})

		dispatch({
			type: 'notNetDown/showModal', //抛一个事件给监听这个type的监听器
			payload: {
				selectObjectVisible: true,
			},
		})
	}

	//插入字段
	const insertAtCursor = (buttonID, myValue) => {
		let ids = buttonID
		let myField = document.getElementById(buttonID)
		if (document.selection) {
			myField.focus()
			sel = document.selection.createRange()
			sel.text = myValue
			sel.select()
		} else if (myField.selectionStart || myField.selectionStart == '0') {
			let startPos = myField.selectionStart
			let endPos = myField.selectionEnd
			let restoreTop = myField.scrollTop
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
			if (restoreTop > 0) {
				myField.scrollTop = restoreTop
			}
			myField.focus()
			myField.selectionStart = startPos + myValue.length
			myField.selectionEnd = startPos + myValue.length
		} else {
			myField.value += myValue
			myField.focus()
		}
	}

	//数值验证
	const blurFunctions = (rulr, value, callback) => {
		let regx = /^\+?[1-9][0-9]*$/
		if (!regx.test(value)) {
			callback('Please enter a positive integer！')
		} else {
			callback()
		}
	}

	{ /*新操作部分样式变更---start*/ }
	const newOperation = (record, e) => {
		dispatch({
			type: 'notNetDown/updateState',
			payload: {
				operationVisible: true,
				newOperationItem: record,
				operationType: 'edit',
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
	return (

		<Modal {...modalOpts}
			width="600px"
			footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
			<Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			<Form layout="horizontal">
				<Tabs defaultActiveKey="notNetDown_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="notNetDown_1">
						<FormItem label="实例名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: item.name,
								rules: [
									{
										required: true,
									},
								],
							})(<Input />)}
						</FormItem>

						<div style={{ position: 'relative' }} id="area1" />
						<FormItem label="策略类型" hasFeedback {...formItemLayout}>
							{getFieldDecorator('policyType', {
								initialValue: item.policyType,
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								onChange={typeChange}
								getPopupContainer={() => document.getElementById('area1')}
							>
								{genDictOptsByName('aleatspolicyType')}
							</Select>)}
						</FormItem>

						<FormItem label="策略应用类型" {...formItemLayout}>
							{getFieldDecorator('applicationtype', {
								initialValue: ((type !== 'create') ? appType : null), /*此处为字段的值，可以把 item对象 的值放进来*/
								rules: [
									{
										//required: true,
										type: 'array',
									},
								],
							})(<Cascader options={treeDataApp} />)}
						</FormItem>

						<div style={{ position: 'relative' }} id="area2" />
						<FormItem label="分支机构" hasFeedback {...formItemLayout}>
							{getFieldDecorator('branch', {
								initialValue: branchs,
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								getPopupContainer={() => document.getElementById('area2')}
							>
								{fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
							</Select>)}
						</FormItem>
					</TabPane>
				</Tabs>

				<Tabs defaultActiveKey="notNetDown_2">
					<TabPane tab={<span><Icon type="appstore" />监控工具</span>} key="notNetDown_2">
						<FormItem label="监控工具" hasFeedback {...formItemLayout} >
							{getFieldDecorator('tool', {
								initialValue: item.tool,
							})(<Select >
								<Select.Option value="ZABBIX">ZABBIX</Select.Option>
								<Select.Option value="ITM">ITM</Select.Option>
								<Select.Option value="OVO">OVO</Select.Option>
								{/*<Select.Option value="SYSLOG_EPP">SYSLOG_EPP</Select.Option>*/}
							</Select>)}
						</FormItem>
					</TabPane>
				</Tabs>

				<Tabs defaultActiveKey="notNetDown_3">
					<TabPane tab={<span><Icon type="global" />监控对象</span>} key="notNetDown_3">
						<FormItem label="监控对象" hasFeedback {...formItemLayout}>
							{getFieldDecorator('object', {
								initialValue: obInfoVal.name,
							})(<Input readOnly onClick={onobjectInfo} />)}
						</FormItem>
					</TabPane>
				</Tabs>
				{
					((typeValue !== 'SYSLOG')) ?
						<div>
							<Tabs defaultActiveKey="notNetDown_4">
								<TabPane tab={<span><Icon type="setting" />监控参数</span>} key="notNetDown_4">
									<FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
										{getFieldDecorator('collectInterval', {
											initialValue: item.collectParams.collectInterval,
											rules: [
												{
													required: true,
												},
												{
													validator: blurFunctions,
												},
											],
										})(<InputNumber />)}秒
        								</FormItem>
									<FormItem label="超时时间" hasFeedback {...formItemLayout4}>
										{getFieldDecorator('timeout', {
											initialValue: item.collectParams.timeout,
											rules: [
												{
													required: true,
												},
												{
													validator: blurFunctions,
												},
											],
										})(<InputNumber />)}秒
        							</FormItem>
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="包大小" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktSize', {
													initialValue: item.collectParams.pktSize,
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber />)}字节
  										</FormItem>
											:
											null
									}
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="包个数" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktNum', {
													initialValue: item.collectParams.pktNum,
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber />)}
											</FormItem>
											:
											null
									}
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="发包间隔" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktInterval', {
													initialValue: (item.collectParams.pktInterval ? item.collectParams.pktInterval : 0),
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber max={60} min={1} />)}
											</FormItem>
											:
											null
									}
									{
										((typeValue == 'RPING')) ?
											<FormItem label="源设备超时时间" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('srcDeviceTimeout', {
													initialValue: item.collectParams.srcDeviceTimeout,
													rules: [
														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber />)}
											</FormItem>
											:
											null
									}
									{
										((typeValue == 'RPING')) ?
											<FormItem label="源设备失败重试次数" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('srcDeviceRetries', {
													initialValue: item.collectParams.srcDeviceRetries,
													rules: [

														{
															required: true,
														},
														{
															validator: blurFunctions,
														},
													],
												})(<InputNumber />)}
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
										initialValue: item.createdBy,
									})(<Input style={{ width: 100 }} disabled />)}
								</FormItem>
							</Col>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="创建时间" {...formItemLayout4}>
									{getFieldDecorator('CreaterTime', {
										initialValue: item.createdTime,
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
										initialValue: item.updatedBy,
									})(<Input style={{ width: 100 }} disabled />)}
								</FormItem>
							</Col>
							<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
								<FormItem label="最后更新时间" {...formItemLayout4}>
									{getFieldDecorator('LastCreaterTime', {
										initialValue: item.updatedTime,
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
	visible2: PropTypes.bool,
	ruleUUIDs: PropTypes.string,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
