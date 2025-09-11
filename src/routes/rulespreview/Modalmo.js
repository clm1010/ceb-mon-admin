import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker, Icon, Alert, Tooltip, message } from 'antd'
import { onSearchInfo, genDictOptsByName } from '../../utils/FunctionTool'
import firstSecAreaAll from '../../utils/selectOption/firstSecAreaAll'
import moment from 'moment'

import Fenhang from '../../utils/fenhang'

const FormItem = Form.Item

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

const formButtonLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
	dispatch,
  modalVisible,
  item,
  form,
  modalType,
  modalName,
  alertType,
	alertMessage,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'rulesPreview/updateState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalMOVisible: false,
			},
		})
	}

	const onChangeMngInfoSrc = (value) => {
		item.mngInfoSrc = value
  	dispatch({
			type: 'rulesPreview/updateState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'rulesPreview/updateState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onBranchNameChange = (value) => {
		 item.branchName = value
		 dispatch({
			 type: 'rulesPreview/updateState',				//@@@
			 payload: {
				 currentItem: item,
			 },
		 })
	 }


  const modalOpts = {
    title: (`查看${modalName}`),
    visible: modalVisible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
	  maskClosable: false,
  }


  return (
    <Modal {...modalOpts}
      width={850}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal">
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
							initialValue: item.name,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [],
						})(<Select onSelect={onBranchNameChange} disabled filterOption={onSearchInfo}>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [],
						})(<Select disabled>{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH')) }
						   </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
							initialValue: item.vendor,
							rules: [],
						})(<Select disabled>{genDictOptsByName('networkVendor')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP版本" key="snmpVer" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpVer', {
							initialValue: item.snmpVer ? item.snmpVer : 'V1',
							rules: [],
						})(<Select disabled>{genDictOptsByName('snmpVer')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP团体串" key="snmpCommunity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpCommunity', {
							initialValue: item.snmpCommunity,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpWriteCommunity', {
							initialValue: item.snmpWriteCommunity,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用分类名称" key="appName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appName', {
							initialValue: item.appName,
						})(<Input readOnly />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appCode', {
							initialValue: item.appCode,
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('capType', {
							initialValue: item.capType,
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngInfoSrc', {
							initialValue: item.mngInfoSrc ? item.mngInfoSrc : '手工',
						})(<Select onSelect={onChangeMngInfoSrc} disabled>
  {genDictOptsByName('mngInfoSrc')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('hostname', {
							initialValue: item.hostname === null ? '' : item.hostname,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="区域" key="location" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location', {
							initialValue: item.location === null ? '' : item.location,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="ObjectID" key="objectID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('objectID', {
							initialValue: item.objectID === null ? '' : item.objectID,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
							initialValue: item.description,
							rules: [],
						})(<Input readOnly />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
							rules: [],
						})(<Select disabled onSelect={onMngtOrg} filterOption={onSearchInfo} >{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="型号" key="model" hasFeedback {...formItemLayout}>
            {getFieldDecorator('model', {
							initialValue: item.model,
							rules: [],
						})(<Select disabled>{genDictOptsByName('deviceModel')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
							rules: [],
						})(<Select disabled>{genDictOptsByName('onlineStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
							rules: [],
						})(<Select disabled>{genDictOptsByName('managedStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
            {getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Select disabled>{genDictOptsByName('room')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [],
						})(<Select disabled>{genDictOptsByName('SrcType')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现状态" key="syncStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncStatus', {
							initialValue: item.syncStatus ? item.syncStatus : '未同步',
							rules: [],
						})(<Select disabled>{genDictOptsByName('SyncStatus')}</Select>)}
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

        {
					modalType === 'update' ?
  <span style={{ width: '50%', float: 'right' }}>
    <Tooltip placement="topLeft" title="查看设备接口" arrowPointAtCenter>
      <Button style={{ marginLeft: 138 }} icon="search" onClick={() => openInfsModal(item)} />
    </Tooltip>
    <Tooltip placement="topLeft" title="查看实时策略" arrowPointAtCenter>
      <Button style={{ marginLeft: 8 }} icon="fork" />
    </Tooltip>
  </span>
					:
					null
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
}

export default Form.create()(modal)
