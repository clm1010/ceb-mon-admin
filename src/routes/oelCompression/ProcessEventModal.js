import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, DatePicker, Table, Alert, message, Select } from 'antd'
import './List.css'

const FormItem = Form.Item
const TextArea = Input.TextArea
const { Option } = Select
const formItemLayout = {
	labelCol: {
		span: 2,
	},
	wrapperCol: {
		span: 22,
	},
}

const formItemLayout1 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 20,
	},
}

const formItemLayout2 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 16,
	},
}
const modal = ({
	dispatch,
	visible,
	selectedRows,
	form,
	oelDatasource,
	contextType,
	contextMessage,
	callUsers,
}) => {
	//循环选中的行 抽取一个简单的OZ_AlarmID数组做判断
	let selectedRowKeys = selectedRows.map(v => v.OZ_AlarmID)

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

	let formObj
	const columns = [{
		title: '告警ID',
		dataIndex: 'OZ_AlarmID',
		key: 'OZ_AlarmID',
		width: 60,
	}, {
		title: 'IP',
		dataIndex: 'NodeAlias',
		key: 'NodeAlias',
		width: 100,
	}, {
		title: '备注',
		dataIndex: 'N_Note',
		key: 'N_Note',
	}, {
		title: '告警详情',
		dataIndex: 'N_SummaryCN',
		key: 'N_SummaryCN',
		width: 400,
	},{
		title: '延迟状态',
		dataIndex: 'oz_temporary_process',
		key: 'oz_temporary_process',
		render: (text, record) => {
			let res = ''
			switch(text){
				case 0 : res = ''
				break
				case 1 : res = '延迟处理'
				break
				case 2 : res = '延迟处理超时'
				break
			}
			return res
		}
	},{
		title: '延迟处理结束时间',
		dataIndex: 'oz_temporary_process_time',
		key: 'oz_temporary_process_time',
		render: (text, record)=>{
			if(text != 0){
				return new Date(text*1000).format('yyyy-MM-dd hh:mm:ss')
			}
			return 
		}
	}]
	const columns1 = [{
		title: '告警ID',
		dataIndex: 'OZ_AlarmID',
		key: 'OZ_AlarmID',
		width: 60,
	}, {
		title: 'IP',
		dataIndex: 'NodeAlias',
		key: 'NodeAlias',
		width: 100,
	}, {
		title: '备注',
		dataIndex: 'N_Note',
		key: 'N_Note',
	}, {
		title: '告警详情',
		dataIndex: 'N_SummaryCN',
		key: 'N_SummaryCN',
		width: 450,
	}, {
		title: '呼叫人',
		dataIndex: 'userNames',
		key: 'userNames',
		width: 100,
	}]

	let aa = columns
	if (contextType === '初始通报' || contextType === '未恢复通报') {
		aa = columns1
	}

	let onOk = () => {
		const user = JSON.parse(sessionStorage.getItem('user'))

		dispatch({
			type: 'oelcompression/alarmProcess',
			payload: {
				alarms: selectedRows,
				typ: contextType,	//@@@
				user,
				content: '',
				source: oelDatasource,
			},
		})

		dispatch({
			type: 'oelcompression/updateState',
			payload: {
				selectedRows: [],
				processEventVisible: false,
				processEventVisibleSub:false,
				typ: '',
			},
		})
	}//弹出窗口点击确定按钮触发的函数

	if (contextType === '添加备注') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="时间" key="alertDetail" {...formItemLayout}>
					{getFieldDecorator('currentTime', {
						rules: [
							{
								required: true,
							},
						],
					})(<DatePicker
						showTime
						format="YYYY-MM-DD HH:mm:ss"
						style={{ width: 200 }}
					/>)}
				</FormItem>
			</div>
			<div>
				<FormItem label="备注" key="alertDetail" hasFeedback {...formItemLayout}>
					{getFieldDecorator('note', {
						rules: [
							{
								required: true,
							},
						],
					})(<TextArea autosize={{ minRows: 3, maxRows: 6 }} />)}
				</FormItem>
			</div>
		</Form>)

		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				//日期格式转换
				data.currentTime = data.currentTime.format('YYYY-MM-DD HH:mm:ss')
				//内容拼接成 日期 空格 备注内容的形式
				let n_note = `${data.currentTime} ${data.note}`

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '添加备注',
						user,
						content: n_note,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
						processEventVisibleSub:false,
					},
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	}
	 else if (contextType === '已知问题') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="问题单号" key="alreadyKnown" {...formItemLayout1}>
					{getFieldDecorator('orderID', {
						rules: [
							{
								required: true,
							},
						],
					})(<Input style={{ width: 200 }} />)}
				</FormItem>
			</div>
		</Form>)

		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '已知问题',
						user,
						content: data.orderID,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
						processEventVisibleSub:false,
					},
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '关联告警') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="关联的主告警ID" key="relatedAlarm" {...formItemLayout1}>
					{getFieldDecorator('rootAlarmID', {
						rules: [
							{
								required: true,
							},
						],
					})(<Input style={{ width: 200 }} />)}
				</FormItem>
			</div>
		</Form>)

		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '关联告警',
						user,
						content: data.rootAlarmID,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
						processEventVisibleSub:false,
					},
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '自动恢复') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="自动恢复" key="autoBack" hasFeedback {...formItemLayout1}>
					{getFieldDecorator('autoBack', {
					})(<TextArea autosize={{ minRows: 3, maxRows: 6 }} />)}
				</FormItem>
			</div>
		</Form>)

		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '自动恢复',
						user,
						content: data.autoBack,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
						processEventVisibleSub:false,
					},
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '初始通报' || contextType === '未恢复通报') {
		let existList = []
		let notexistList = []
		selectedRows.forEach(item => {
			let callName = ''
			for (let element of callUsers) {
				if (element.alarmId === item.OZ_AlarmID) {
					callName = element.userNames
					break
				}
			}
			if (item.oz_callresult === '' || !item.oz_callresult) {
				item.userNames = callName
				existList.push(item)
			} else {
				item.userNames = callName
				notexistList.push(item)
			}
		})
		selectedRows = existList
		formObj = (
			<div className="content-inner4">
				<h4>已外呼</h4>
				<Table
					dataSource={notexistList}
					columns={aa}
					size="small"
					pagination={false}
					scroll={{ y: 300 }}
					bordered
					rowKey={record => record.OZ_AlarmID}

					rowClassName={(record, index) => {
						let bgcolor = 'black test'
						if (record.Severity == 0) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_green test'
							} else {
								bgcolor = 'green test'
							}
						} else if (record.N_CustomerSeverity == 100) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_purple test'
							} else {
								bgcolor = 'purple test'
							}
						} else if (record.N_CustomerSeverity == 4) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_blue test'
							} else {
								bgcolor = 'blue test'
							}
						} else if (record.N_CustomerSeverity == 3) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_yellow test'
							} else {
								bgcolor = 'yellow test'
							}
						} else if (record.N_CustomerSeverity == 2) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_orange test'
							} else {
								bgcolor = 'orange test'
							}
						} else if (record.N_CustomerSeverity == 1) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_red test'
							} else {
								bgcolor = 'red test'
							}
						}
						return bgcolor
					}}
				/>
			</div>)

		onOk = () => {
			const user = JSON.parse(sessionStorage.getItem('user'))
			dispatch({
				type: 'oelcompression/alarmProcess',
				payload: {
					alarms: [...selectedRows, ...notexistList],
					typ: '外呼',
					user,
					content: contextType,
					source: oelDatasource,
				},
			})

			dispatch({
				type: 'oelcompression/updateState',
				payload: {
					selectedRows: [],
					processEventVisible: false,
				},
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '其它') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="其它" key="other" hasFeedback {...formItemLayout1}>
					{getFieldDecorator('other', {
						rules: [
							{
								required: true,
							},
						],
					})(<TextArea autosize={{ minRows: 3, maxRows: 6 }} />)}
				</FormItem>
			</div>
		</Form>)

		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '其它',
						user,
						content: data.other,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
						processEventVisibleSub:false,
					},
				})

				dispatch({
					type: 'oelcompression/query',
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '延迟处理') {
		formObj = (<Form layout="horizontal">
			<div>
				<FormItem label="选择时间" key="timeSelect" {...formItemLayout2}>
					{getFieldDecorator('timeSelect', {
						rules: [
							{
								required: true,
							},
						],
					})(<Select>
						<Option value="12">延迟12小时</Option>
						<Option value="24">延迟24小时</Option>
						<Option value="48">延迟48小时</Option>
					</Select>)}
				</FormItem>
			</div>
		</Form>)
		onOk = () => {
			validateFieldsAndScroll((errors, value) => {
				if (errors) {
					return
				}
				let data = {
					...getFieldsValue(),
				}

				const user = JSON.parse(sessionStorage.getItem('user'))

				let n_note = data.timeSelect

				dispatch({
					type: 'oelcompression/alarmProcess',
					payload: {
						alarms: selectedRows,
						typ: '延迟处理',
						user,
						content: n_note,
						source: oelDatasource,
					},
				})

				dispatch({
					type: 'oelcompression/updateState',
					payload: {
						selectedRows: [],
						processEventVisible: false,
					},
				})

				resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'oelcompression/updateState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				processEventVisible: false,
				processEventVisibleSub:false,
				typ: '',
			},
		})
	}

	const modalOpts = {
		title: contextType,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	//end
	return (
		<Modal {...modalOpts} width={850} key="noteModal" height="600px">
			<div>
				<Alert message={contextMessage} type="info" showIcon /><br />
			</div>
			<div className="content-inner4">
				{contextType == '外呼' ? <h4>未外呼</h4> : ''}
				<Table
					dataSource={selectedRows}
					columns={aa}
					size="small"
					pagination={false}
					scroll={{ y: 300 }}
					bordered
					rowKey={record => record.OZ_AlarmID}

					rowClassName={(record, index) => {
						let bgcolor = 'black test'
						if (record.Severity == 0) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_green test'
							} else {
								bgcolor = 'green test'
							}
						} else if (record.N_CustomerSeverity == 100) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_purple test'
							} else {
								bgcolor = 'purple test'
							}
						} else if (record.N_CustomerSeverity == 4) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_blue test'
							} else {
								bgcolor = 'blue test'
							}
						} else if (record.N_CustomerSeverity == 3) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_yellow test'
							} else {
								bgcolor = 'yellow test'
							}
						} else if (record.N_CustomerSeverity == 2) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_orange test'
							} else {
								bgcolor = 'orange test'
							}
						} else if (record.N_CustomerSeverity == 1) {
							if (record.Acknowledged === 1) {
								bgcolor = 'ack_red test'
							} else {
								bgcolor = 'red test'
							}
						}
						return bgcolor
					}}
				/>
			</div>
			<br />
			{formObj}
		</Modal>
	)
}

modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
