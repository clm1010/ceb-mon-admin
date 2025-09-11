import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
const FormItem = Form.Item

const FormItemProps = {
  style: {
    	margin: 0,
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
const modal = ({
	loading,
	dispatch,
  	visible,
  	currentItem,
  	form,
  	isClose,
  	fenhang,
  	user,
}) => {
	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	} = form
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})
	const onOk = () => {
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
	}
	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
	}

	const modalOpts = {
	    	title: '设备信息',
	    	visible,
	    	onOk,
	    	onCancel,
	    	wrapClassName: 'vertical-center-modal',
	    	maskClosable: false,
	    	width: 1250,
	}

	return (
  		isClose
  		?
  		null
  		:
  <Modal {...modalOpts}>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="名称" hasFeedback {...formItemLayout}>
        {getFieldDecorator('name', {
							initialValue: `${currentItem.name}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="发现IP" hasFeedback {...formItemLayout}>
        {getFieldDecorator('discoveryIP', {
							initialValue: `${currentItem.discoveryIP}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="所属行名称" hasFeedback {...formItemLayout}>
        {getFieldDecorator('discoveryIP', {
							initialValue: maps.get(currentItem.branchName),
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="一级安全域" hasFeedback {...formItemLayout}>
        {getFieldDecorator('firstSecArea', {
							initialValue: `${currentItem.firstSecArea}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="厂商" hasFeedback {...formItemLayout}>
        {getFieldDecorator('vendor', {
							initialValue: `${currentItem.vendor}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="SNMP 团体串" hasFeedback {...formItemLayout}>
        {getFieldDecorator('snmpCommunity', {
							initialValue: `${currentItem.snmpCommunity}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="SNMP 写团体串" hasFeedback {...formItemLayout}>
        {getFieldDecorator('snmpWriteCommunity', {
							initialValue: `${currentItem.snmpWriteCommunity}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="创建方式" hasFeedback {...formItemLayout}>
        {getFieldDecorator('createMethod', {
							initialValue: `${currentItem.createMethod}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="主机名" hasFeedback {...formItemLayout}>
        {getFieldDecorator('hostname', {
							initialValue: `${currentItem.hostname}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="区域" hasFeedback {...formItemLayout}>
        {getFieldDecorator('location', {
							initialValue: `${currentItem.location}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="ObjectID" hasFeedback {...formItemLayout}>
        {getFieldDecorator('objectID', {
							initialValue: `${currentItem.objectID}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="描述" hasFeedback {...formItemLayout}>
        {getFieldDecorator('description', {
							initialValue: `${currentItem.description}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="设备管理机构" hasFeedback {...formItemLayout}>
        {getFieldDecorator('mngtOrg', {
							initialValue: `${currentItem.mngtOrg}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="在线状态" hasFeedback {...formItemLayout}>
        {getFieldDecorator('onlineStatus', {
							initialValue: `${currentItem.onlineStatus}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="纳管状态" hasFeedback {...formItemLayout}>
        {getFieldDecorator('managedStatus', {
							initialValue: `${currentItem.managedStatus}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="机房" hasFeedback {...formItemLayout}>
        {getFieldDecorator('room', {
							initialValue: `${currentItem.room}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="srcType" hasFeedback {...formItemLayout}>
        {getFieldDecorator('srcType', {
							initialValue: `${currentItem.srcType}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="同步状态" hasFeedback {...formItemLayout}>
        {getFieldDecorator('syncStatus', {
							initialValue: `${currentItem.syncStatus}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
    <span style={{ width: '50%', float: 'left' }}>
      <FormItem label="同步时间" hasFeedback {...formItemLayout}>
        {getFieldDecorator('syncTime', {
							initialValue: `${currentItem.syncTime}`,
					  	})(<Input disabled="true" />)}
      </FormItem>
    </span>
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
