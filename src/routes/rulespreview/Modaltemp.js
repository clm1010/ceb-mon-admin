import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import { Link } from 'dva/router'
import { genDictOptsByName } from "../../utils/FunctionTool"
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

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form: {
		getFieldDecorator,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	checkStatus,
	tabstate,
	typeValue,
	stdInfoVal,
	timeList,
	treeNodes,
	treeDataApp,
	fenhang,
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
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'rulesPreview/updateState',		 //抛一个事件给监听这个type的监听器
			payload: {
				modalTempVisible: false,
			},
		})
	}

	const modalOpts = {
		title: '查看策略模板',
		visible,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 100,
	}
	const typeChange = (value) => {
		dispatch({
			type: 'rulesPreview/updateState',
			payload: {
				typeValue: value,
			},
		})
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

	const treeProps = {
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
			type: 'rulesPreview/updateState',
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
					<a onClick={newOperation.bind(this, record)} style={{ marginRight: 5 }}>查看</a>
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

	return (

		<Modal {...modalOpts}
			width="700px"
			footer={<Button key="cancel" onClick={onCancel}>关闭</Button>}
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
