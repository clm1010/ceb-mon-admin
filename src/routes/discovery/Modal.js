import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, Modal, Radio, Select} from 'antd'
import fenhang from './../../utils/fenhang'
import CronInput from './Cron/CronInput'
const RadioGroup = Radio.Group
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
  visible,
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose, toolsUrl,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {
		//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      	dispatch({
					type: `discovery/${type}`,											//抛一个事件给监听这个type的监听器
					payload: data,
				})
					resetFields()
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'discovery/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})
	}

	const onCheckStart = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      dispatch({
				type: 'tool/showCheckStatus',											//抛一个事件给监听这个type的监听器
				payload: {
					currentItem: data,
					checkStatus: 'checking',
				},
			})
    })
	}

  const Option = Select.Option
  let options = []
  toolsUrl.forEach((opt) => {
    if (opt.name != "syslog-epp") 
      options.push(<Option key={opt.name} value={opt.url}>{opt.name + "_" + opt.url}</Option>)
  })

	const onCheckCancel = () => {																				//弹出窗口点击确定按钮触发的函数
  	dispatch({
			type: 'tool/showCheckStatus',											//抛一个事件给监听这个type的监听器
			payload: {
				checkStatus: 'done',
			},
		})
	}

	//机构查询条件搜索
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}

  const modalOpts = {
    title: `${type === 'create' ? '新增发现任务' : '编辑发现任务'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    zIndex:1000
  }

  const validateIpRange = (rule, value, callback) => {
		let isIPaddress = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[1-9]{1,2},{0,1}/

    value.split(",").forEach(ip => {
      if (!isIPaddress.test(ip)){
        callback('格式：11.11.11.11/24,22.22.22.22/24')
      }
      let mask = ip.split("/")
      if (mask[1] > 32)  callback('掩码不能大于32')
    })

	    callback()
	}


  return (
    <Modal {...modalOpts} height="600px">
      <Form layout="horizontal">
        <FormItem label="任务名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('taskName', {
            initialValue: item.taskName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="扫描域" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ipRange', {
            initialValue: item.ipRange,
            rules: [
              {
                required: true,
              },
              {
                validator: validateIpRange,
              },
            ],
          })(<Input placeholder="格式：192.168.0.1/24" />)}
        </FormItem>
        <FormItem label="扫描周期" hasFeedback {...formItemLayout}>
          {getFieldDecorator('scanCycle', {
            initialValue: item.scanCycle,
            rules: [
              {
                required: true,
              },
            ],
          })(<CronInput />)}
        </FormItem>
        {/*<FormItem label="部署主机" hasFeedback {...formItemLayout}>*/}
        {/*  {getFieldDecorator('targetHost', {*/}
        {/*    initialValue: item.targetHost,*/}
        {/*    rules: [*/}
        {/*      {*/}
        {/*        required: true,*/}
        {/*      },*/}
        {/*    ],*/}
        {/*  })(<Select showSearch allowClear filterOption={mySearchInfo} placeholder="支持输入搜索">*/}
        {/*    {options}*/}
        {/*  </Select>)}*/}
        {/*</FormItem>*/}
        <FormItem label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('enabled', {
            initialValue: item.enabled,
            rules: [
              {
                required: true,
              },
            ],
          })(<RadioGroup>
            <Radio value="0">启用</Radio>
            <Radio value="-1">停用</Radio>
          </RadioGroup>)}
        </FormItem>
        <FormItem label="community" hasFeedback {...formItemLayout}>
          {getFieldDecorator('community', {
            initialValue: item.community,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="port" hasFeedback {...formItemLayout}>
          {getFieldDecorator('port', {
            initialValue: item.port,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="version" hasFeedback {...formItemLayout}>
          {getFieldDecorator('version', {
            initialValue: item.enabled,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="所属机构" hasFeedback {...formItemLayout}>
          {getFieldDecorator('branch', {
            initialValue: item.branch,
            rules: [
              {
                required: false,
              },
            ],
          })(<Select showSearch allowClear filterOption={mySearchInfo} placeholder="支持输入搜索">
            {fenhang.map(d => <Select.Option key={d.key}>{d.value}</Select.Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('remark', {
            initialValue: item.remark,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
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
