import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import { Link } from 'dva/router'
import {genDictOptsByName} from "../../../../utils/FunctionTool"
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

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form: {
		getFieldDecorator,
		resetFields,
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
	if (item.policyTemplate && item.policyTemplate.componentType) {
		let arr = item.policyTemplate
		appType[0] = `${arr.componentType}-${arr.componentTypeID}`
		appType[1] = `${arr.component}-${arr.componentID}`
		appType[2] = `${arr.subComponent}-${arr.subComponentID}`
	}
	const onOk = () => {
		resetFields()
		dispatch({
			type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalTempVisible: false,
			},
		})
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalTempVisible: false,
			},
		})
	}

	const modalOpts = {
		title: '查看策略模板',
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
	//新增策略模板-操作详情部分功能代码----start
	const onChange = (activeKey) => {
		updateTabs(tabstate.panes, activeKey, tabstate.newTabIndex)
	}
	const updateTabs = (panes, activeKey, newTabIndex) => {
		dispatch({
			type: 'notNetDown/updateTabs', //抛一个事件给监听这个type的监听器
			payload: {
				tabstate: {
					activeKey,
					panes,
					newTabIndex,
				},
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

	let mapsPeriod = new Map()
/* 	timeList.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		mapsPeriod.set(keys, values)
	}) */
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
			title: '连续次数',
			dataIndex: 'content.times',
			key: 'content.times',
		},
		{
			title: '运算符',
			dataIndex: 'content.foward',
			key: 'content.foward',
			render: (text, record) => (
				<div onLoad={fowardConst(text)}>{fowardValue}</div>
			),
		},
		{
			title: '数值',
			dataIndex: 'content.value',
			key: 'content.value',
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
	return (
		<Modal {...modalOpts}
			width="600px"
			footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			{
				item.policyTemplate ?

				<Form layout="horizontal">
				<Tabs defaultActiveKey="templet_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="templet_1">
						<FormItem label="模板名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: item.policyTemplate.name,
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
								initialValue: item.policyTemplate.policyType,
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								onChange={typeChange}
							//								getPopupContainer={() => document.getElementById('area1')}
							>
                {genDictOptsByName('aleatspolicyType')}
								{/*<Select.Option value="NORMAL">普通</Select.Option>*/}
								{/*<Select.Option value="PING">PING</Select.Option>*/}
								{/*<Select.Option value="RPING">RPING</Select.Option>*/}
								{/*<Select.Option value="SYSLOG">SYSLOG</Select.Option>*/}
								{/*<Select.Option value="ITM">ITM</Select.Option>*/}
							</Select>)}
						</FormItem>
						<div style={{ position: 'relative' }} id="area2" />
						<FormItem label="分组" {...formItemLayout}>
							{getFieldDecorator('group', {
								initialValue: showGroupName(item.policyTemplate.group), /*此处为字段的值，可以把 item对象 的值放进来*/
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
								initialValue: item.policyTemplate.branch,
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
							})(<Cascader options={treeDataApp} />)}
						</FormItem>
					</TabPane>
				</Tabs>
				{
					((typeValue !== 'SYSLOG')) ?
						<div>
							<Tabs defaultActiveKey="templet_2">
								<TabPane tab={<span><Icon type="setting" />监控参数</span>} key="templet_2">
									<FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
										{getFieldDecorator('collectInterval', {
											initialValue: item.policyTemplate.collectParams.collectInterval,
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
											initialValue: item.policyTemplate.collectParams.timeout,
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
									{
										((typeValue == 'PING') || (typeValue == 'RPING')) ?
											<FormItem label="包大小" hasFeedback {...formItemLayout4}>
												{getFieldDecorator('pktSize', {
													initialValue: item.policyTemplate.collectParams.pktSize,
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
													initialValue: item.policyTemplate.collectParams.pktNum,
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
													initialValue: (item.policyTemplate.collectParams.pktInterval ? item.policyTemplate.collectParams.pktInterval : 0),
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
													initialValue: item.policyTemplate.collectParams.srcDeviceTimeout,
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
													initialValue: item.policyTemplate.collectParams.srcDeviceRetries,
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

			</Form>
			:
			null
			}


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
