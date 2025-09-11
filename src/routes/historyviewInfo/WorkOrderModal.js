import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, DatePicker, Alert, Button } from 'antd'
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
  loading,
  branchType,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form

	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create') {
		item.branchName = user.branch
	}
/*
ticketRequest.userAccount = user.get("username")
            * ticketRequest.serial = alarm.getOrDefault("Serial", "").toString
            * ticketRequest.identifier = alarm.getOrDefault("Identifier", "").toString
            * ticketRequest.lastOccurrence = alarm.getOrDefault("LastOccurrence", "").toString
            ticketRequest.userName = user.get("username")
            ticketRequest.userUuid = user.get("uuid")
            ticketRequest.source = alarm.getOrDefault("source", "").toString
            * ticketRequest.reportResourse = alarm.getOrDefault("N_PeerPort", "").toString
            * ticketRequest.belongOrg = alarm.getOrDefault("N_OrgName", "").toString
            * ticketRequest.monitorTool = alarm.getOrDefault("N_PeerPort", "").toString
*/
	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  }
		  let data = {
				...getFieldsValue(),
		  }

		  	item.OZ_AlarmID = data.alertID
			item.Node = data.devName
			item.NodeAlias = data.ipAddress
			item.N_CustomerSeverity = data.alertLevel
			item.N_AppName = data.appName
			item.N_AppCode = data.appCode
			item.N_ComponentType = data.comtype
			item.N_ComponentTypeId = data.comtypeCode
			item.N_Component = data.comName
			item.N_ComponentId = data.comCode
			item.N_SubComponent = data.subComName
			item.N_SubComponentId = data.subComCode
			item.AlertGroup = data.alertTitle
			item.N_SummaryCN = data.alertDetail

			let itemCop = {}
		  	for (let p in item) {
				let _p = ''
				if (p.startsWith('oz_')) {
					_p = p.replace('oz_', 'OZ_')
				} else {
					_p = p.slice(0, 1).toUpperCase() + p.slice(1)
				}
				itemCop[_p] = item[p]
			}

		  let info = []
		  info.push(itemCop)
		  //保存MO信息，跳转到抓取设备信息流程

			dispatch({
				type: 'historyview/sendOuts',				//@@@
				payload: {
					alarms: info,
					typ: '生成工单',
					user,
					content: data.suggestion || '',
					source: '',
				},
			})
			resetFields()
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'historyview/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				workOrderVisible: false,
				alertMessage: '工单信息',
				alertType: '',
			},
		})
	}

	const alarmResume = () =>{
		let resume = ''
		if(item.n_ComponentType == '应用' || item.n_ComponentType == '中间件' || item.n_ComponentType == '系统' || item.n_ComponentType == '数据库' ){
			resume = `${item.n_AppName}-${item.nodeAlias}-${item.n_SumMaryCn.split(';模式子组')[0]}`
		}else if(item.n_ComponentType == '硬件' ){
			resume = `${item.N_ObjectDescr}-${item.nodeAlias}-${item.n_SumMaryCn}`
		}else if(item.n_ComponentType == '存储' ){
			resume = `${item.N_ObjectDescr}-${item.n_SumMaryCn}`
		}else{
			resume = item.alertGroup
		}
		return resume
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
    <Modal {...modalOpts}
      width={850}
      key="workOrderModal"
      height="600px"
      footer={branchType == 'XYK' ? [<Button key="back" onClick={onCancel}>取消</Button>] : [
        <Button key="back" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>
		  确定
        </Button>,
	  ]}
    >
      <Form layout="horizontal">
        <div>
          <Alert message={alertMessage} type={alertType} showIcon /><br />
        </div>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="告警序列号" key="alertID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertID', {
							initialValue: item.oz_AlarmID,
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="建单者工号" key="userAccount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userAccount', {
							initialValue: user.name,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备" key="devName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('devName', {
							initialValue: item.node,
							rules: [
							  {
									required: true,
							  },
							],
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="IP" key="ipAddress" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ipAddress', {
							initialValue: item.nodeAlias,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="告警级别" key="alertLevel" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alertLevel', {
							initialValue: item.n_CustomerSeverity,
							rules: [],
						})(<Select >
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
							initialValue: item.firstOccurrence ? moment(item.firstOccurrence) : null,
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
							initialValue: item.n_AppName,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用代码" key="appCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appCode', {
							initialValue: item.n_AppCode,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件类型" key="comtype" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comtype', {
							initialValue: item.n_ComponentType,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件类型代码" key="comtypeCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comtypeCode', {
							initialValue: item.n_ComponentTypeID,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件名称" key="comName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comName', {
							initialValue: item.n_Component,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="组件代码" key="comCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('comCode', {
							initialValue: item.n_ComponentID,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="子组件名称" key="subComName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subComName', {
							initialValue: item.n_SubComponent,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="子组件代码" key="subComCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('subComCode', {
							initialValue: item.n_SubComponentID,
							rules: [],
						})(<Input />)}
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
							initialValue: alarmResume(),
							rules: [],
						})(<TextArea />)}
          </FormItem>
        </span>
        <span style={{ width: '100%', float: 'left' }}>
          <FormItem label="告警详述" key="alertDetail" hasFeedback {...formItemLayout1}>
            {getFieldDecorator('alertDetail', {
							initialValue: item.n_SumMaryCn,
							rules: [],
						})(<TextArea />)}
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
