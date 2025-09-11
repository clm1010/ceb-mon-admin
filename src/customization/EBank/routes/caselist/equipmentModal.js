import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker } from 'antd'
import { genDictOptsByName } from '../../../../utils/FunctionTool'
import moment from 'moment'
const FormItem = Form.Item

const formItemLayout = {
  	labelCol: {
    	span: 8,
  	},
  	wrapperCol: {
    	span: 16,
  	},
}

const modal = ({
  dispatch,
  visible,
  item,
  form: {
  	getFieldDecorator,
  	validateFields,
  	getFieldsValue,
  	resetFields,
	validateFieldsAndScroll,
  },
  equipmentSecondClass,
}) => {
	let type = ''
	if (equipmentSecondClass === 'ROUTER') {
		type = '路由器'
	} else if (equipmentSecondClass === 'SWITCH') {
		type = '交换机'
	} else if (equipmentSecondClass === 'FIREWALL') {
		type = '防火墙'
	} else if (equipmentSecondClass === 'F5') {
		type = '负载均衡'
	}
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'interfacer/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				equipmentVisible: false,
			},
		})
	}

 	const modalOpts = {
    title: `查看接口父设备 -- ${type}`,
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
		maskClosable: false,
  }

  return (
    <Modal {...modalOpts}
      width={850}
      footer={
        <Button key="cancel" onClick={onCancel}>关闭</Button>}
    >,
      <Form layout="horizontal">
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
							initialValue: item.name,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
							initialValue: item.branchName,
						})(<Select showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
						})(<Input />)}
          </FormItem>
        </span>
        {
					equipmentSecondClass === 'SWITCH' ?
  <span style={{ width: '50%', float: 'left' }}>
    <FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
      {getFieldDecorator('secondSecArea', {
									initialValue: item.secondSecArea,
								})(<Input />)}
    </FormItem>
  </span>
					:
					null
				}
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
							initialValue: item.vendor,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP版本" key="snmpVer" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpVer', {
							initialValue: item.snmpVer ? item.snmpVer : 'V1',
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP团体串" key="snmpCommunity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpCommunity', {
							initialValue: item.snmpCommunity,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpWriteCommunity', {
							initialValue: item.snmpWriteCommunity,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngInfoSrc', {
							initialValue: item.mngInfoSrc ? item.mngInfoSrc : '手工',
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('hostname', {
							initialValue: item.hostname === null ? '' : item.hostname,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="区域" key="location" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location', {
							initialValue: item.location === null ? '' : item.location,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="ObjectID" key="objectID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('objectID', {
							initialValue: item.objectID === null ? '' : item.objectID,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
							initialValue: item.description,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
						})(<Select showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="型号" key="model" hasFeedback {...formItemLayout}>
            {getFieldDecorator('model', {
							initialValue: item.model,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
            {getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现状态" key="syncStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncStatus', {
							initialValue: item.syncStatus ? item.syncStatus : '未同步',
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现时间" key="syncTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncTime', {
							initialValue: item.syncTime ? moment(item.syncTime) : null,
							rules: [],
						})(<DatePicker
  showTime
  style={{ width: '100%' }}
  disabled
  format="YYYY-MM-DD HH:mm:ss"
  placeholder="Select Time"
						/>)}
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
