import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Row, Select, Form, Tabs, Input, Alert, Button, Table, message, Collapse, Popconfirm, Radio } from 'antd'
import debounce from 'throttle-debounce/debounce'
import { genDictOptsByName } from '../../../utils/FunctionTool'
import './style.css'

const { Panel } = Collapse;
const Option = Select.Option
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}

const tailFormItemLayout = {
	wrapperCol: {
		span: 16,
		offset: 6,
	},
}
const FormItem = Form.Item
const ConditionOtherMode = ({
	dispatch,
	filter,
	localPath,
	myform,
	type,
	isExpert,
	listHost1,
	listApp1,
	hostOtherValue,
	appOtherValue,
	gjtzOtherValue,
	fetchingIP,
	fetchingApp,
	alertGroupValue,
	componentValue,
	options,
	alertLevel,
	arrGroupValue,
	showGroupValue,
	AgentValue,
}) => {
	let seniorHost = [],
		seniorApp = '',
		seniorOther = '',
		alertGroup = '',
		componentTypeInfo = [],
		alertLevelInitialValue = [],
		AgentInitialValue = ''

	if (showGroupValue && showGroupValue.flag && showGroupValue.flag == true) {
		if (showGroupValue.appOther != '') {
			seniorApp = showGroupValue.appOther
		}
		if (showGroupValue.hostOther != '') {
			seniorHost = Array.from(new Set(showGroupValue.hostOther))
		}
		if (showGroupValue.gjtzOther != '') {
			seniorOther = showGroupValue.gjtzOther
		}
		if (showGroupValue.alertGroup != '') {
			alertGroup = showGroupValue.alertGroup
		}
		if (showGroupValue.component != '') {
			componentTypeInfo = showGroupValue.component
		}
		if (showGroupValue.forbind) {
			forbind = showGroupValue.forbind
		}
		if (showGroupValue.alertLevel != '') {
			alertLevelInitialValue = showGroupValue.alertLevel
		}
		if (showGroupValue.Agent != '') {
			AgentInitialValue = showGroupValue.Agent
		}
	}

	console.log(listHost1, listApp1)
	//如果是新建维护期模板，切换高级模式的时候，都要清掉历史记录
	if (type === 'create' && filter.filterMode === 'SENIOR' && isExpert === false) {
		delete filter.filterItems
		delete filter.filterIndex
	}

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = myform
	let optionApp = []
	//设备IP分组----start
	const queryAllTypeOfMO = (value) => {
		if (value != '') { //当查IP的文本框被清空，不发起查询
			//先改变当前状态为正在查询中
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					fetchingIP: true,	//修改下拉列表状态为查询中
					options: [], //每次查询都清空上一次查到的集合
				},
			})

			const data = {
				...getFieldsValue(),
			}

			//再发起查询
			dispatch({
				type: `${localPath}/queryAllTypeOfMO`,
				payload: {
					inputInfo: value,
					pageSize: 20,
					searchMethod: data.searchMethod,
				},
			})
		}
	}
	let optionsInfo = []
	if (options.length > 0) {
		options.forEach((item, index) => {
			let values = `${item.discoveryIP}`
			let keys = item.uuid
			optionsInfo.push(<Option key={keys} value={values}>{values}</Option>)
		})
	}
	//end
	//应用系统分组----start
	const queryApp = (value) => {
		//先改变当前状态为正在查询中
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				fetchingApp: true,	//修改下拉列表状态为查询中
				listApp1: [], //每次查询都清空上一次查到的集合
			},
		})

		dispatch({
			type: `${localPath}/queryApp`,
			payload: {
				appName: value,
				pageSize: 100,
			},
		})
	}
	listApp1.forEach((item, index) => {
		let values = item.affectSystem
		let keys = Date.parse(new Date()) + index
		optionApp.push(<Option key={keys} value={values}>{values}{item.branch ? `/ ${item.branch}` : ''}</Option>)
	})
	console.log('optionApp : ', optionApp)
	//end
	const onchangeHost = (value) => {
		let hostStr = ''
		let hostStrs = ''
		if (value.length !== 0) {
			let arrays = []
			value.forEach((item) => {
				let arrs = item.split('/')
				arrays.push(arrs[0])
			})
			if (arrays.length === 0) {
				hostStr = ''
				hostStrs = ''
			} else if (arrays.length === 1) {
				hostStr = arrays[0]
				hostStrs = arrays[0]
			} else {
				hostStr = arrays.join('、')
				hostStrs = arrays.join(',')
			}
		}
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				hostOtherValue: hostStr,
				options: []
			},
		})
	}

	const onchangeApp = (value) => {
		let appStr = ''
		if (value) {
			if (value.length === 0) {
				appStr = ''
			} else {
				appStr = value
			}
		}

		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				appOtherValue: appStr,
			},
		})
	}

	const onchangeOther = (value) => {
		let inputValue = document.getElementById('gjtzOther').value
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				gjtzOtherValue: inputValue,
			},
		})
	}

	const onchangeAgent = (value) => {
		let inputValue = document.getElementById('Agent').value
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				AgentValue: inputValue,
			},
		})
	}

	const alertGroupOnChange = (value) => {
		let inputValue = document.getElementById('alertGroup').value
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				alertGroupValue: inputValue,
			},
		})
	}

	const componentOnChange = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				componentValue: value.join('、'),
			},
		})
	}
	const onalertLevel = (value) => {
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				alertLevel: value.join('、'),
			},
		})
	}

	const resetFieldsName = ['hostOther', 'appOther', 'gjtzOther', 'alertGroup', 'componentType', 'alertLevel', 'Agent']
	const onAddClick = () => {
		if (hostOtherValue.length == 0 && appOtherValue == '' && gjtzOtherValue == '' && alertGroupValue == '' && componentValue.length == 0 && alertLevel.length == 0 && AgentValue == '') {
			message.warning("告警条件不能为空")
		} else {
			let obj = {}
			obj.hostOther = hostOtherValue.length > 0 ? hostOtherValue.split('、') : ''  //ip
			obj.appOther = appOtherValue ? appOtherValue : '' //应用系统
			obj.gjtzOther = gjtzOtherValue ? gjtzOtherValue : ''//告警详情
			obj.alertGroup = alertGroupValue ? alertGroupValue : ''//告警组
			obj.component = componentValue.length > 0 ? componentValue.split('、') : ''//世界来源
			obj.alertLevel = alertLevel.length > 0 ? alertLevel.split('、') : ''
			obj.Agent = AgentValue.length > 0 ? AgentValue : ''
			let sum = obj.hostOther.length
			arrGroupValue.forEach((item) => {
				if (item.hostOther) {
					sum += item.hostOther.length
				}
			})
			if (sum > 100) {
				message.warning('IP个数超出了100个，请再设置一个维护期，或者使用其它模式定义维护期')
			} else {
				let i = 0
				arrGroupValue.push(obj)
				arrGroupValue.forEach((item) => {
					item.key = `组合${++i}`
				})
				resetFields(resetFieldsName)
				dispatch({
					type: `${localPath}/updateState`,
					payload: {
						arrGroupValue: arrGroupValue,
						hostOtherValue: [],
						appOtherValue: '',
						gjtzOtherValue: '',
						AgentValue: '',
						alertGroupValue: '',
						componentValue: [],
						showGroupValue: {},
						alertLevel: [],
					}
				})
			}
		}
	}
	const onSavedClick = () => {
		if (showGroupValue && showGroupValue.key) {
			let obj = {}
			obj.hostOther = hostOtherValue.length > 0 ? hostOtherValue.split('、') : ''  //ip
			obj.appOther = appOtherValue ? appOtherValue : '' //应用系统
			obj.gjtzOther = gjtzOtherValue ? gjtzOtherValue : ''//告警详情
			obj.alertGroup = alertGroupValue ? alertGroupValue : ''//告警组
			obj.component = componentValue.length > 0 ? componentValue.split('、') : ''//世界来源
			let post = arrGroupValue.findIndex((item) => {
				return item.key == showGroupValue.key
			})
			arrGroupValue.splice(post, 1, obj)
			resetFields(resetFieldsName)
			dispatch({
				type: `${localPath}/updateState`,
				payload: {
					arrGroupValue: arrGroupValue,
					hostOtherValue: [],
					appOtherValue: '',
					gjtzOtherValue: '',
					alertGroupValue: '',
					componentValue: [],
					showGroupValue: {},
				}
			})
		} else {
			message.warning("不符合编辑要求")
		}
	}
	const onClean = () => {

		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				hostOtherValue: [],
				appOtherValue: '',
				gjtzOtherValue: '',
				AgentValue: '',
				alertGroupValue: '',
				componentValue: [],
				showGroupValue: {},
				alertLevel: [],
			}
		})
		resetFields(resetFieldsName)
	}
	const onClose = (key) => {
		let rovevalue = arrGroupValue.filter(item => item.key !== key)
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				arrGroupValue: rovevalue,
				showGroupValue: {},
				hostOtherValue: [],
				appOtherValue: '',
				gjtzOtherValue: '',
				alertGroupValue: '',
				componentValue: [],
				alertLevel: [],
				AgentValue: '',
			}
		})
	}
	const onRowClick = (item) => {
		let showGroupValue = item
		showGroupValue.flag = true
		resetFields(resetFieldsName)
		dispatch({
			type: `${localPath}/updateState`,
			payload: {
				showGroupValue: item,
				hostOtherValue: item.hostOther ? item.hostOther.join('、') : '',
				appOtherValue: item.appOther ? item.appOther : '',
				gjtzOtherValue: item.gjtzOther ? item.gjtzOther : '',
				alertGroupValue: item.alertGroup ? item.alertGroup : '',
				componentValue: item.component ? item.component.join('、') : '',
				alertLevel: item.alertLevel ? item.alertLevel.join('、') : '',
				AgentValue: item.Agent ? item.Agent : '',
			}
		})
	}

	const tagStyle = {
		height: '30px',
		fontSize: '15px',
		lineHeight: '25px',
	}

	const columns = [
		{
			title: '告警IP',
			dataIndex: 'hostOther',
			key: 'hostOther',
			width: 75,
			render: (text, record) => {
				let mess = ''
				if (text) {
					mess = text.join('、')
				}
				return mess
			}
		},
		{
			title: '应用系统',
			dataIndex: 'appOther',
			key: 'appOther',
			width: 75,
			className: 'aaaaa',
		},
		{
			title: '告警描述',
			dataIndex: 'gjtzOther',
			key: 'gjtzOther',
			width: 75,
		},
		{
			title: '告警组',
			dataIndex: 'alertGroup',
			key: 'alertGroup',
			width: 75,
		},
		{
			title: '告警大类',
			dataIndex: 'component',
			key: 'component',
			width: 75,
			render: (text, record) => {
				let mess = ''
				if (text) {
					mess = text.join(',')
				}
				return mess
			}
		},
		{
			title: '告警级别',
			dataIndex: 'alertLevel',
			key: 'alertLevel',
			width: 75,
			render: (text, record) => {
				let mess = ''
				if (text) {
					mess = text.join(',')
				}
				return mess
			}
		},
		{
			title: '告警代理',
			dataIndex: 'Agent',
			key: 'Agent',
			width: 75,
		},
		{
			title: '操作',
			key: 'operation',
			width: 50,
			render: (text, record) => {
				return (
					<Popconfirm title="确定要删除?" onConfirm={() => onClose(record.key)}>
						<a>删除</a>
					</Popconfirm>
				)
			}
		}
	]

	const otherStyle = () => {
		return (
			<div id="maintanceModal">
				<Row>
					{
						<Collapse defaultActiveKey='1'>
							<Panel header="告警定义的所有信息" key="1">
								<Table
									bordered
									columns={columns}
									dataSource={arrGroupValue}
									simple
									rowKey={record => record.key}
									size="small"
									onRowClick={onRowClick}
									pagination={false}
								/>
							</Panel>
						</Collapse>
					}
					<div style={{ width: '100%', height: 10, float: 'left' }} />
				</Row>
				<Row><Alert message={((hostOtherValue === '' ? '' : `屏蔽IP是:${hostOtherValue},`) +
					(appOtherValue === '' ? '' : `并且应用系统是:${appOtherValue},`) +
					(gjtzOtherValue === '' ? '' : `并且告警描述是:${gjtzOtherValue},`) +
					(alertGroupValue === '' ? '' : `并且告警组是${alertGroupValue},`) +
					(componentValue.length === 0 ? '' : `并且告警大类是:${componentValue}的告警`) +
					(alertLevel.length === 0 ? '' : `并且告警级别是:${alertLevel}的告警`) +
					(AgentValue === '' ? '' : `并且告代理别是:${AgentValue}的告警`)) === '' ? '暂无条件' :

					(hostOtherValue === '' ? '' : `屏蔽IP是:${hostOtherValue},`) +
					(appOtherValue === '' ? '' : `并且应用系统是:${appOtherValue},`) +
					(gjtzOtherValue === '' ? '' : `并且告警描述是:${gjtzOtherValue},`) +
					(alertGroupValue === '' ? '' : `并且告警组是${alertGroupValue},`) +
					(componentValue.length === 0 ? '' : `并且告警大类是:${componentValue}的告警`) +
					(alertLevel.length === 0 ? '' : `并且告警级别是:${alertLevel}的告警`) +
					(AgentValue === '' ? '' : `并且告代理别是:${AgentValue}的告警`)
				}
					type="info"
					showIcon
				/>
				</Row>
				<div style={{ width: '100%', height: 20, float: 'left' }} />
				<Row>
					<div>
						<FormItem label="告警IP" hasFeedback {...formItemLayout} style={{ height:20, }}>
							{getFieldDecorator('hostOther', {
								initialValue: seniorHost,
							})(<Select
								allowClear
								mode="multiple"
								notFoundContent={fetchingIP ? <Spin size="small" /> : null}
								style={{ width: '100%' }}
								placeholder="Please select"
								onSearch={debounce(800, queryAllTypeOfMO)}
								onChange={onchangeHost}
								disabled={type === 'see' || type === 'adjust'}
								getPopupContainer={() => document.body}
								filterOption={false}
							>
								{optionsInfo}
							</Select>)}
						</FormItem>
						<FormItem {...tailFormItemLayout}>
							{getFieldDecorator('searchMethod', {
								initialValue: "1",
								rules: []
							})(
								<Radio.Group>
									<Radio value="1">精确查询</Radio>
									<Radio value="2">模糊查询</Radio>
								</Radio.Group>
							)}
						</FormItem>
						<div style={{
							position: 'relative', width: '100%', height: 'auto', float: 'left',
						}}
							id="area1"
						/>
					</div>
					<div>
						<FormItem label="应用系统" hasFeedback {...formItemLayout}>
							{getFieldDecorator('appOther', {
								initialValue: seniorApp,
							})(<Select
								notFoundContent={fetchingApp ? <Spin size="small" /> : null}
								allowClear
								showSearch
								placeholder="Please select"
								onSearch={debounce(800, queryApp)}
								onChange={onchangeApp}
								disabled={type === 'see' || type === 'adjust'}
								getPopupContainer={() => document.body}
								filterOption={false}
							>
								{optionApp}
							</Select>)}
						</FormItem>
						<div style={{
							position: 'relative', width: '100%', height: 'auto', float: 'left',
						}}
							id="area2"
						/>
					</div>
					<FormItem label="告警描述" hasFeedback {...formItemLayout}>
						{getFieldDecorator('gjtzOther', {
							initialValue: seniorOther,
						})(<Input placeholder="模糊匹配" id="gjtzOther" onChange={onchangeOther} disabled={type === 'see' || type === 'adjust'} />)}
					</FormItem>
					<FormItem label="告警组" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alertGroup', {
							initialValue: alertGroup,
						})(<Input placeholder="模糊匹配" id="alertGroup" onChange={alertGroupOnChange} disabled={type === 'see' || type === 'adjust'} />)}
					</FormItem>
					<FormItem label="告警大类" hasFeedback {...formItemLayout}>
						{getFieldDecorator('componentType', {
							initialValue: componentTypeInfo,
						})(<Select id="componentType" mode="multiple" onChange={componentOnChange} disabled={type === 'see' || type === 'adjust'} key="componentType">
							{genDictOptsByName('appType')}
						</Select>)}
					</FormItem>
					<FormItem label="告警级别" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alertLevel', {
							initialValue: alertLevelInitialValue,
						})(<Select id="alertLevel" mode="multiple" onChange={onalertLevel} disabled={type === 'see' || type === 'adjust'} key="alertLevel">
							{/* {genDictOptsByName('alertLevel')} */}
							<Option value='1'>一级故障</Option>
							<Option value='2'>二级告警</Option>
							<Option value='3'>三级预警</Option>
							<Option value='4'>四级提示</Option>
							<Option value='100'>五级信息</Option>
						</Select>)}
					</FormItem>
					{/* <FormItem label="告警描述" hasFeedback {...formItemLayout}>
						{getFieldDecorator('gjtzOther', {
							initialValue: seniorOther,
						})(<Input placeholder="模糊匹配" id="gjtzOther" onChange={onchangeOther} disabled={type === 'see' || type === 'adjust'} />)}
					</FormItem> */}
					<FormItem label="监控代理" hasFeedback {...formItemLayout}>
						{getFieldDecorator('Agent', {
							initialValue: AgentInitialValue,
						})(<Input placeholder="模糊匹配" id="Agent" onChange={onchangeAgent} disabled={type === 'see' || type === 'adjust'} />)}
					</FormItem>
				</Row>
				<Row>
					<div style={{ textAlign: 'center' }}>
						<Button onClick={onAddClick} style={{ margin: 8 }}> 添加</Button>
						{/* <Button onClick={onSavedClick} style={{ margin: 8 }}> 保存</Button> */}
						<Button onClick={onClean} style={{ margin: 8 }} > 清空</Button>
					</div>
				</Row>
			</div>
		)
	}
	return (
		<div>
			{otherStyle()}
		</div>
	)
}

ConditionOtherMode.propTypes = {
	filter: PropTypes.object,
	queryPath: PropTypes.string,
	moFilterName: PropTypes.string,
	myform: PropTypes.object.isRequired,
}

export default ConditionOtherMode
