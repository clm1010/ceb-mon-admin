import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, TreeSelect, Tabs, Button, Checkbox, Collapse, Row, Col, message, InputNumber, Switch } from 'antd'
import FormulaZone from './formula/FormulaZone'
import placeholder from './placeholderTOvalue'

const FormItem = Form.Item
const SHOW_ALL = TreeSelect.SHOW_ALL
const TabPane = Tabs.TabPane
const { Option, OptGroup } = Select;
const Panel = Collapse.Panel

const FormItemProps = {
	style: {
		margin: 0,
	},
}
const customPanelStyle = {
	background: '#fff',
	borderRadius: 4,
	overflow: 'hidden',
	border: 0,
}
const formItemLayout2 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}
const formItemLayout3 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 20,
	},
}
const ColProps = {
	style: {
		marginBottom: 8,
		textAlign: 'right',
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

const formItemLayout1 = {
	labelCol: {
		span: 0,
	},
	wrapperCol: {
		span: 24,
	},
}

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form,
	modalType,
	checkStatus,
	isClose,
	treeNodes,
	tempList,
	hasPreParams,
	flag,
	stdInfoVal,
	moFilterValue,
	itemType,
	resetCalInput,
	see,
	chooseWay,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = form

	/*
	if ( JSON.stringify(item) === "{}" ) { //如果是新建弹出窗（不能用type=create）
		//resetFields()
		item.itemType = 'ZABBIX_SNMP'
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				currentItem: item,
				itemType: 'ZABBIX_SNMP',
			},
		})
	}
	*/

	//分布式无监控对象特征 因此需要禁用
	const isUsed = (itemType === 'PROMETHEUS' || itemType === 'PROMETHEUS_RECORD' || itemType === 'SKYWALKING_OAL') ? false : true
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(), //获取弹出框所有字段的值
			}

			let preprocessing = []
			tempList.forEach((item) => {
				let params = ''
				if (item.flag == '1') {
					params = data[`params1_${item.index}`]

				} else if (item.flag == '2') {
					let p1 = data[`params1_${item.index}`]
					let p2 = data[`params2_${item.index}`]
					params = `${p1}\n${p2}`

				} else if (item.flag == '3') {
					let p1 = data[`params1_${item.index}`]
					let p2 = data[`params2_${item.index}`]
					let p3 = data[`params3_${item.index}`] ? 1 : 0
					params = `${p1}\n${p2}\n${p3}`

				}
				let pitem = {
					type: data[`tool${item.index}`],
					params: params,

				}
				if (pitem.type !== "") {
					preprocessing.push(pitem)
				}
			})
			if (hasPreParams && preprocessing.length > 0) {
				data.preprocessing = preprocessing
			}

			if (data.targetGroupUUIDs && data.targetGroupUUIDs.length > 0) {
				let arrs = []
				data.targetGroupUUIDs.forEach((item) => {
					arrs.push(item.value)
				})
				data.targetGroupUUIDs = arrs
			}
			data.stdIndicator = { uuid: stdInfoVal.uuid || '' }
			let filters = []

			if (moFilterValue) { //对象特征保存到后台数据库的数据
				moFilterValue.uuid = ''
				filters.push(moFilterValue)
				data.filters = filters
			} else {
				data.filters = filters
			}
			data.filter = ''
			//如果item类型是ZABBIX_CALCULATED，存储state里的formula字符串
			if (typeof (data.formulaForFrontend) === 'object') {
				data.formula = item.formula
				data.formulaForFrontend = item.formulaForFrontend
			} else if (data.itemType === 'SYSLOG_EPP') { //如果item类型是SYSLOG_EPP
				//抽取父文本域的值，转换成字符串
				const parentString = JSON.stringify({ kpi_parent: data.kpi_parent, log_parent: data.log_parent, op_parent: data.op_parent })

				//抽取RuleEditor里文本域的值，转换成字符串
				let obj = {}
				const keys = data.keys
				for (let value of keys) {
					obj[`kpi_children${keys[value]}`] = data[`kpi_children${keys[value]}`]
					delete data[`kpi_children${keys[value]}`]

					obj[`log_children${keys[value]}`] = data[`log_children${keys[value]}`]
					delete data[`log_children${keys[value]}`]

					obj[`op_children${keys[value]}`] = data[`op_children${keys[value]}`]
					delete data[`op_children${keys[value]}`]
				}
				obj.keys = data.keys
				const childrenString = JSON.stringify(obj)

				data.formula = `${parentString}|*^_^*|${childrenString}`
			} if (typeof (data.formula) === 'object') {
				data.formula = item.formula
				data.formulaForFrontend = item.formulaForFrontend
			}
			let formula = ''
			formula = data.formula.replace(/\\/g, '\\\\')
			data.formula = formula
			data.filters[0].filterItems && data.filters[0].filterItems.length !== 0 ? data.filters[0].filterItems[data.filters[0].filterItems.length - 1].logicOp = '' : ''
			if (data.filters[0].thirdClass && (data.filters[0].thirdClass === '' || data.filters[0].thirdClass == undefined)) {
				delete data.filters[0].thirdClass
			}
			dispatch({
				type: `zabbixItemsInfo/${type}`,
				payload: data
			})
			onCancel()
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalVisible: false,
				isClose: true,
				itemType: '',
				tempList: [
					{
						index: 1,
						flag: '0',
						"params": "",
						"type": "",
					},
				],
				hasPreParams: false,
				resetCalInput: false,
				see: 'no',
			},
		})
	}
	const onCheck = (index, val) => {
		for (let i = 0; i < tempList.length; i++) {
			// if (val == '1') {
			// 	if (tempList[i].index == index) {
			// 		tempList[i].flag = false
			// 	}
			// } else if (val == '10') {
			// 	if (tempList[i].index == index) {
			// 		tempList[i].flag = true
			// 	}
			// }
			if (val == '6' || val == '7' || val == '8' || val == '9' || val == '10' || val == '19') {
				if (tempList[i].index == index) {
					tempList[i].flag = '0'
					tempList[i].type = val
				}
			} else if (val == '1' || val == '2' || val == '3' || val == '4'  || val == '11' || val == '12'
				|| val == '14' || val == '15' || val == '16' || val == '17' || val == '20' || val == '21' || val == '23') {
				if (tempList[i].index == index) {
					tempList[i].flag = '1'
					tempList[i].type = val
				}
			} else if (val == '5' || val == '13' || val == '18' || val == '22') {
				if (tempList[i].index == index) {
					tempList[i].flag = '2'
					tempList[i].type = val
				}
			} else if (val == '24') {
				if (tempList[i].index == index) {
					tempList[i].flag = '3'
					tempList[i].type = val
				}
			}
		}

		dispatch({
			type: 'zabbixItemsInfo/setState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempList
			},
		})

	}
	const jiahao = () => {
		let temp = tempList[tempList.length - 1]
		let index = temp.index
		// tempList[tempList.length - 1].flag =  false
		index++
		tempList.push({
			index,
			flag: '0',
			"params": "",
			"type": "",
		})
		dispatch({
			type: 'zabbixItemsInfo/setState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempList,
			},
		})
	}
	const jianhao = (index) => {
		const tempListNew = tempList.filter(temp => temp.index !== index)
		dispatch({
			type: 'zabbixItemsInfo/setState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempList: tempListNew,
			},
		})
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
			type: 'zabbixItemsInfo/querystdInfo',
			payload: {
				groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectUnitVisible: true,
				isClose: false,
			},
		})
		resetFields(['stdIndicator'])
	}

	const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, { value: item.uuid, label: item.name }]
				} else {
					arrs = [{ value: item.uuid, label: item.name }]
				}
			})
		}
		return arrs
	}

	const showStdIndicatorName = (data) => {
		if (data) {
			return data.name
		}
		return ''
	}

	const showMoFilterName = (data) => {
		if (data && data.filterItems && data.filterItems.length > 0) {
			return '已配置对象特征'
		}
		return '未配置对象特征'
	}

	/*
		公式格式的选择
	*/
	const onChange = (value) => { //select 选择 触发事件,来指定公式的格式
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				itemType: value,
			},
		})
	}


	/*
		对象特征
	*/
	const addMoFilter = () => {
		//获取节点数请求
		dispatch({
			type: 'objectGroup/query',
			payload: {},
		})

		//查询应用系统
		dispatch({
			type: 'appSelect/queryAll',
			payload: {},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectMoFilter: true,
				isClose: false,
			},
		})
	}

	// Preprocessing
	const toggle = () => {
		dispatch({
			type: `zabbixItemsInfo/controllerModal`,
			payload: {
				hasPreParams: !hasPreParams
			}
		});
	};

	const modalOpts = {
		title: type === 'create' && see === 'no' ? '新增Item模板' : type === 'update' && see === 'no' ? '编辑Item模板' : type === 'update' && see === 'yes' ? '查看Item模板' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const treeProps = {
		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		treeDefaultExpandAll: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
	}

	/*
		公式模板参数
	*/
	const formulaProps = {
		type,
		form,
		item,
		resetCalInput,
		itemType: (type !== 'create' && itemType === '') ? item.itemType : itemType,
		dispatch,
		chooseWay,
	}

	const operations = (<div><Switch checkedChildren="开" unCheckedChildren="关" onClick={toggle} checked={hasPreParams} />
	</div>)

	return (
		<Modal {...modalOpts}
			width="750px"
			// height="600px"
			footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
			<Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			<Form layout="horizontal">
				<Tabs size="small" type="line">
					<TabPane tab="基本信息" key="1">
						<FormItem label="Item名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: item.name,
								rules: [
									{
										required: true,
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="Item描述" hasFeedback {...formItemLayout}>
							{getFieldDecorator('description', {
								initialValue: item.description,
								rules: [
									{
										required: true,
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="指标" hasFeedback {...formItemLayout}>
							{getFieldDecorator('stdIndicator', {
								initialValue: showStdIndicatorName(stdInfoVal),
								rules: [
									{
										required: true,

									},
								],
							})(<Input readOnly onClick={onstdIndicatorsInfo} />)}
						</FormItem>
						<FormItem label="监控对象特征" hasFeedback {...formItemLayout}>
							{getFieldDecorator('filter', {
								initialValue: showMoFilterName(moFilterValue),
								rules: [
									{
										required: isUsed,
									},
								],
							})(<Input readOnly onClick={addMoFilter} disabled={!isUsed} />)}
						</FormItem>
						<div style={{ position: 'relative' }} id="itemTypeAreaId">
							<FormItem label="Item类型" hasFeedback {...formItemLayout}>
								{getFieldDecorator('itemType', {
									initialValue: typeof (item.itemType) === 'undefined' ? 'ZABBIX_SNMP' : item.itemType,
									rules: [
										{
											required: true,
										},
									],
								})(<Select onChange={onChange} placeholder="Please Select Item Type" getPopupContainer={() => document.getElementById('itemTypeAreaId')}>
									<Option value="ZABBIX_SNMP" /* select */>Zabbix SNMP</Option>
									{/*<Option value="SYSLOG_EPP">Syslog Epp</Option>*/}
									<Option value="ZABBIX_AGENT">Zabbix Agent</Option>
									<Option value="ZABBIX_CALCULATED">Zabbix Calculated</Option>
									<Option value="ZABBIX_AGENT_ACTIVE">ZABBIX AGENT ACTIVE</Option>
									<Option value="ZABBIX_TRAPPER">ZABBIX TRAPPER</Option>
									<Option value="ZABBIX_JMX">ZABBIX JMX</Option>
									<Option value="ZABBIX_IPMI">ZABBIX IPMI</Option>
									<Option value="PROMETHEUS">PROMETHEUS</Option>
									<Option value="PROMETHEUS_RECORD">Prometheus Record Rule</Option>
									<Option value="SKYWALKING_OAL">Skywalking OAL</Option>
								</Select >)}
							</FormItem>
						</div>
						{stdInfoVal.dataType == 'Log' ?
							<FormItem label="日志时间格式" hasFeedback {...formItemLayout}>
								{getFieldDecorator('logTimeFormat', {
									initialValue: item.logTimeFormat,
								})(<Input />)}
							</FormItem>
							:
							null
						}
						<div style={{ position: 'relative' }} id="itemGroupAreaId">
							<FormItem label="分组" {...formItemLayout}>
								{getFieldDecorator('targetGroupUUIDs', {
									initialValue: showGroupName(item.group), /*此处为字段的值，可以把 item对象 的值放进来*/
									rules: [
										{
											//required: true,
											type: 'array',
										},
									],
								})(<TreeSelect {...treeProps} getPopupContainer={() => document.getElementById('itemGroupAreaId')}>
									{treeNodes}
								</TreeSelect>)}
							</FormItem>
						</div>
					</TabPane>
				</Tabs>
				<Tabs size="small" type="line" >
					<TabPane tab="公式" key="2" forceRender={true}>
						<FormulaZone {...formulaProps} />
					</TabPane>
				</Tabs>

				<Tabs size="small" type="line" activeKey={hasPreParams ? "PreProcessing" : ""} tabBarExtraContent={operations}>
					<TabPane tab="预处理" /* forceRender="false" */ key="PreProcessing">
						{/* <Collapse defaultActiveKey='' bordered={false}>
				  <Panel header="" key="1" style={customPanelStyle}>*/}

						{tempList.map(templet => {
							let aa = placeholder[parseInt(templet.type) - 1] || []
							let pl = aa.placeholder || []
							return (<Row key={`row_${templet.index}`}>
								{/* <Col span={10} key={`col_${templet.index}_0`}>
								<FormItem label="模板" hasFeedback {...formItemLayout2} key={`muban_${templet.index}`}>
									{getFieldDecorator(`muban${templet.index}`, {
										initialValue: templet.tempname,
										rules: [
											{
												required: true,
											},
										],
									})(<Input readOnly onClick={selectTemplet.bind(this, templet.index)} title={templet.tempname} />)}
								</FormItem>
							</Col> */}
								<Col lg={8} md={8} sm={8} xs={12} key={`col_${templet.index}_1`}>
									<FormItem label="类型" hasFeedback {...formItemLayout3} key={`tool_${templet.index}`}>
										{getFieldDecorator(`tool${templet.index}`, {
											initialValue: `${templet.type}` ? `${templet.type}` : '',
											rules: [
												{
													required: false,
												},
											],
										})(<Select onChange={onCheck.bind(this, templet.index)}>
											{/* <Option title="Custom multiplier" value="1">Custom multiplier</Option>
										<Option title="Change per second" value="10">Change per second</Option> */}

											<OptGroup label="Text">
												<Option value="5">Regular expression</Option>
												<Option value="4">Trim</Option>
												<Option value="2">Right trim</Option>
												<Option value="3">Left trim</Option>
											</OptGroup>
											<OptGroup label="Structured data">
												<Option value="11">XML XPath</Option>
												<Option value="12">JSONPath</Option>
												<Option value="24">CSV to JSON</Option>
											</OptGroup>
											<OptGroup label="Arithmetic">
												<Option value="1">Custom multiplier</Option>
											</OptGroup>
											<OptGroup label="Change">
												<Option value="9">Simple change</Option>
												<Option value="10">Change per second</Option>
											</OptGroup>
											<OptGroup label="Numeral systems">
												<Option value="6">Boolean to decimal</Option>
												<Option value="7">Octal to decimal</Option>
												<Option value="8">Hexadecimal to decimal</Option>
											</OptGroup>
											<OptGroup label="Custom scripts">
												<Option value="21">JavaScript</Option>
											</OptGroup>
											<OptGroup label="Validation">
												<Option value="13">In range</Option>
												<Option value="14">Matches regular expression</Option>
												<Option value="15">Does not match regular expression</Option>
												<Option value="16">Check for error in JSON</Option>
												<Option value="17">Check for error in XML</Option>
												<Option value="18">Check for error using regular expression</Option>
											</OptGroup>
											<OptGroup label="Throttling">
												<Option value="19">Discard unchanged</Option>
												<Option value="20">Discard unchanged</Option>
											</OptGroup>
											<OptGroup label="Prometheus">
												<Option value="22">Prometheus pattern</Option>
												<Option value="23">Prometheus to JSON</Option>
											</OptGroup>
										</Select>)}
									</FormItem>
								</Col>
								{/* {templet.flag ? '' : <Col lg={10} md={10} sm={10} xs={12} key={`col_${templet.index}_3`}>
								<FormItem label="参数" hasFeedback {...formItemLayout3} key={`params_${templet.index}`}>
									{getFieldDecorator(`params${templet.index}`, {
										initialValue: `${templet.params}` ? `${templet.params}` : '',
										rules: [
											{
												required: true,
											},
										],
									})(<Input />)}
								</FormItem>
							</Col>} */}
								{
									templet.flag == '0' ? '' :
										templet.flag == '1' ?
											<Col lg={12} md={12} sm={12} xs={12} key={`col_${templet.index}_3`}>
												<FormItem label="参数" hasFeedback {...formItemLayout2} key={`params1_${templet.index}`}>
													{getFieldDecorator(`params1_${templet.index}`, {
														initialValue: `${templet.params}` ? `${templet.params}` : '',
														rules: [
															{
																required: true,
															},
														],
													})(<Input placeholder={pl[0]} />)}
												</FormItem>
											</Col>
											: templet.flag == '2' ?
												<>
													<Col lg={6} md={6} sm={6} xs={12} key={`col_${templet.index}_3`}>
														<FormItem hasFeedback {...formItemLayout1} key={`params2_${templet.index}`}>
															{getFieldDecorator(`params1_${templet.index}`, {
																initialValue: `${templet.params}` ? `${templet.params.split('\n')[0]}` : '',
																rules: [
																	{
																		required: true,
																	},
																],
															})(<Input placeholder={pl[0]} />)}
														</FormItem>
													</Col>
													<Col lg={6} md={6} sm={6} xs={12} key={`col_${templet.index}_4`}>
														<FormItem hasFeedback {...formItemLayout1} key={`params2_${templet.index}`}>
															{getFieldDecorator(`params2_${templet.index}`, {
																initialValue: `${templet.params}` ? `${templet.params.split('\n')[1]}` : '',
																rules: [
																	{
																		required: true,
																	},
																],
															})(<Input placeholder={pl[1]} />)}
														</FormItem>
													</Col>
												</>
												:
												<>
													<Col lg={4} md={4} sm={4} xs={6} key={`col_${templet.index}_3`}>
														<FormItem hasFeedback {...formItemLayout1} key={`params1_${templet.index}`}>
															{getFieldDecorator(`params1_${templet.index}`, {
																initialValue: `${templet.params}` ? `${templet.params.split('\n')[0]}` : '',
																rules: [
																	{
																		required: true,
																	},
																],
															})(<Input placeholder={pl[0]} />)}
														</FormItem>
													</Col>
													<Col lg={4} md={4} sm={4} xs={6} key={`col_${templet.index}_4`}>
														<FormItem hasFeedback {...formItemLayout1} key={`params2_${templet.index}`}>
															{getFieldDecorator(`params2_${templet.index}`, {
																initialValue: `${templet.params}` ? `${templet.params.split('\n')[1]}` : '',
																rules: [
																	{
																		required: true,
																	},
																],
															})(<Input placeholder={pl[1]} />)}
														</FormItem>
													</Col>
													<Col lg={4} md={4} sm={4} xs={6} key={`col_${templet.index}_5`}>
														<FormItem hasFeedback {...formItemLayout1} key={`params3_${templet.index}`}>
															{getFieldDecorator(`params3_${templet.index}`, {
																initialValue: `${templet.params}` ? Boolean(parseInt(`${templet.params.split('\n')[2]}`)) : '',
																valuePropName: 'checked',
																rules: [
																	{
																		required: true,
																	},
																],
															})(<Checkbox style={{ overflow: 'hidden', whiteSpace: "nowrap" }}>With header row</Checkbox>)}
														</FormItem>
													</Col>
												</>
								}
								<Col lg={4} md={4} sm={4} xs={4} key={`col_${templet.index}_2`}>
									<Button disabled={tempList.length === 1} onClick={jianhao.bind(this, templet.index)} style={{ float: 'right' }}>-</Button>
									<Button onClick={jiahao} style={{ marginRight: 5, float: 'right' }}>+</Button>
								</Col>
							</Row>)
						}
						)}
						{/*	</Panel>
				   </Collapse> */}
					</TabPane>
				</Tabs>
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
