import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, DatePicker, Alert } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
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
  item,
  form,
  modalType,
  modalName,
  alertType,
  alertMessage,
  oelDatasource,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form

	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create') {
		item.branchName = user.branch
	}

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  }
		  let data = {
				...getFieldsValue(),
		  }
		  let info = []
		  info.push(item)
		  //保存MO信息，跳转到抓取设备信息流程

			dispatch({
				type: 'oel/sendOuts',				//@@@
				payload: {
					alarms: info,
					typ: '生成工单',
					user,
					content: data.suggestion,
					source: oelDatasource,
				},
			})
		  resetFields()
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'oel/updateState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				workOrderVisible: false,
				alertMessage: '工单信息',
				alertType: '',
			},
		})
	}

 	const modalOpts = {
    title: '生成工单',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
	  maskClosable: false,
  }

  //end
  return (
    <Modal {...modalOpts} width={850} key="workOrderModal" height="600px">
      <Form layout="horizontal">
        <div>
          <Alert message={alertMessage} type={alertType} showIcon /><br />
        </div>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="告警序列号" key="alertID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertID', {
							initialValue: item.OZ_AlarmID,
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="建单者工号" key="userAccount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userAccount', {
							initialValue: user.name,
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备" key="devName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('devName', {
							initialValue: item.Node,
							rules: [
							  {
									required: true,
							  },
							],
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="IP" key="ipAddress" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ipAddress', {
							initialValue: item.NodeAlias,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="告警级别" key="alertLevel" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertLevel', {
							initialValue: item.N_CustomerSeverity,
							rules: [],
						})(<Select disabled>
  <Option value={1}>故障</Option>
  <Option value={2}>告警</Option>
  <Option value={3}>预警</Option>
  <Option value={4}>提示</Option>
  <Option value={100}>信息</Option>
</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="告警时间" key="alertTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertTime', {
							initialValue: item.FirstOccurrence ? moment(item.FirstOccurrence * 1000) : null,
							rules: [],
						})(<DatePicker style={{ width: '100%' }}
  showTime
  disabled
  mode="time"
  format="YYYY-MM-DD HH:mm:ss"
  placeholder="Select Time"
						/>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用名称" key="appName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appName', {
							initialValue: item.N_AppName,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用代码" key="appCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appCode', {
							initialValue: item.N_AppCode,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件类型" key="comtype" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comtype', {
							initialValue: item.N_ComponentType,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件类型代码" key="comtypeCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comtypeCode', {
							initialValue: item.N_ComponentTypeId,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件名称" key="comName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comName', {
							initialValue: item.N_Component,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件代码" key="comCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comCode', {
							initialValue: item.N_ComponentId,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="子组件名称" key="subComName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subComName', {
							initialValue: item.N_SubComponent,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="子组件代码" key="subComCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subComCode', {
							initialValue: item.N_SubComponentId,
							rules: [],
						})(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '100%', float: 'left' }}>
          <FormItem label="处置建议" key="suggestion" hasFeedback {...formItemLayout1}>
            {getFieldDecorator('suggestion', {
							initialValue: item.suggestion,
							rules: [],
						})(<TextArea />)}
          </FormItem>
        </span>
        <span style={{ width: '100%', float: 'left' }}>
          <FormItem label="告警简述" key="alertTitle" hasFeedback {...formItemLayout1}>
            {getFieldDecorator('alertTitle', {
							initialValue: item.AlertGroup,
							rules: [],
						})(<TextArea disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '100%', float: 'left' }}>
          <FormItem label="告警详述" key="alertDetail" hasFeedback {...formItemLayout1}>
            {getFieldDecorator('alertDetail', {
							initialValue: item.N_SummaryCN,
							rules: [],
						})(<TextArea disabled />)}
          </FormItem>
        </span>
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
