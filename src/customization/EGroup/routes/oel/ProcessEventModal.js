import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, DatePicker, Table, Alert } from 'antd'
import './List.css'

const FormItem = Form.Item
const TextArea = Input.TextArea

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

const modal = ({
	dispatch,
  visible,
  selectedRows,
  form,
  oelDatasource,
  contextType,
  contextMessage,
}) => {
	//循环选中的行 抽取一个简单的OZ_AlarmID数组做判断
	let selectedRowKeys = selectedRows.map(v => v.OZ_AlarmID)

	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form

	let formObj

	let onOk = () => {
		const user = JSON.parse(sessionStorage.getItem('user'))

		dispatch({
		  type: 'oel/alarmProcess',
		  payload: {
		  	alarms: selectedRows,
		  	typ: contextType,	//@@@
		  	user,
		  	content: '',
		  	source: oelDatasource,
		  },
		})

		dispatch({
		  type: 'oel/updateState',
		  payload: {
		  	selectedRows: [],
		  	processEventVisible: false,
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
				  type: 'oel/alarmProcess',
				  payload: {
				  	alarms: selectedRows,
				  	typ: '添加备注',
				  	user,
				  	content: n_note,
				  	source: oelDatasource,
				  },
				})

				dispatch({
				  type: 'oel/updateState',
				  payload: {
				  	selectedRows: [],
				  	processEventVisible: false,
				  },
				})

			  resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	} else if (contextType === '已知问题') {
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
				  type: 'oel/alarmProcess',
				  payload: {
				  	alarms: selectedRows,
				  	typ: '已知问题',
				  	user,
				  	content: data.orderID,
				  	source: oelDatasource,
				  },
				})

				dispatch({
				  type: 'oel/updateState',
				  payload: {
				  	selectedRows: [],
				  	processEventVisible: false,
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
				  type: 'oel/alarmProcess',
				  payload: {
				  	alarms: selectedRows,
				  	typ: '关联告警',
				  	user,
				  	content: data.rootAlarmID,
				  	source: oelDatasource,
				  },
				})

				dispatch({
				  type: 'oel/updateState',
				  payload: {
				  	selectedRows: [],
				  	processEventVisible: false,
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
				  type: 'oel/alarmProcess',
				  payload: {
				  	alarms: selectedRows,
				  	typ: '自动恢复',
				  	user,
				  	content: data.autoBack,
				  	source: oelDatasource,
				  },
				})

				dispatch({
				  type: 'oel/updateState',
				  payload: {
				  	selectedRows: [],
				  	processEventVisible: false,
				  },
				})

			  resetFields()
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
				  type: 'oel/alarmProcess',
				  payload: {
				  	alarms: selectedRows,
				  	typ: '其它',
				  	user,
				  	content: data.other,
				  	source: oelDatasource,
				  },
				})

				dispatch({
				  type: 'oel/updateState',
				  payload: {
				  	selectedRows: [],
				  	processEventVisible: false,
				  },
				})

				dispatch({
					type: 'oel/query',
				})

			  resetFields()
			})
		}//弹出窗口点击确定按钮触发的函数
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'oel/updateState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				processEventVisible: false,
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
	  width: 450,
	}]

  //end
  return (
    <Modal {...modalOpts} width={850} key="noteModal" height="600px">
      <div>
        <Alert message={contextMessage} type="info" showIcon /><br />
      </div>
      <div className="content-inner4">
        <Table
          dataSource={selectedRows}
          columns={columns}
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
