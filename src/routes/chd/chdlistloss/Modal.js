import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
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
    validateFields,
    getFieldsValue,
    resetFields,
  },
  cfgType,
  isClose,
  detail,
}) => {
	function onOk () {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.parentId = detail.uuid
      dispatch({
				type: `cfg/${type}`,											//抛一个事件给监听这个type的监听器
				payload: data,
			})
			resetFields()
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'cfg/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
		resetFields()
	}

  const modalOpts = {
    title: `${type === 'create' ? '新增发现配置' : '编辑发现配置'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    type,
  }

 	function onChange (value) {
		dispatch({
			type: 'cfg/showModal',
			payload: {
				cfgType: value,
			},
		})
	}

  return (
    <Modal {...modalOpts} width="600px" height="600px">
      <Form layout="horizontal">
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cfgType', {
            initialValue: typeof (item.cfgType) === 'undefined' ? 'ZABBIX_AGENT' : item.cfgType,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select onChange={onChange} disabled={type !== 'create'}>
            <Select.Option value="ZABBIX_AGENT">Zabbix Agent</Select.Option>
            <Select.Option value="SNMP_V1">SNMP V1</Select.Option>
            <Select.Option value="SNMP_V2">SNMP V2</Select.Option>
            <Select.Option value="SNMP_V3">SNMP V3</Select.Option>
            <Select.Option value="OTHER">OTHER</Select.Option>
          </Select>)}
        </FormItem>
        <FormItem label="IP范围" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ipRange', {
		            initialValue: item.ipRange,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<Input type="textarea" rows={4} />)}
        </FormItem>
        <FormItem label="轮询间隔" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pollInterval', {
		            initialValue: item.pollInterval,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}秒
        </FormItem>
        <FormItem label="端口号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('port', {
		            initialValue: item.port,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}
        </FormItem>
        {
	      	((cfgType.startsWith('SNMP') && type === 'create') || (type != 'create' && item.cfgType.startsWith('SNMP'))) ?
  <FormItem label="SNMP Community:" hasFeedback {...formItemLayout}>
    {getFieldDecorator('communityString', {
		            initialValue: item.communityString,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<Input />)}
  </FormItem>
	      	:
	      	null
      	}
        <FormItem label="激活" {...formItemLayout}>
          {getFieldDecorator('activated', {
		            initialValue: item.activated,
		          })(<Switch />)}
        </FormItem>
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
