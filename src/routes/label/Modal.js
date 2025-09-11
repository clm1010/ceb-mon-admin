import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect, Radio} from 'antd'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const SHOW_ALL = TreeSelect.SHOW_ALL

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
  treeNodes,
  inputKeyValue,
}) => {

  const onOk = () => {
    //弹出窗口点击确定按钮触发的函数
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let reg = /^(?!ump_tool).*/
      // if(type == 'update' && !reg.test(item.key)){
      // 	Modal.warning({
      //     title: '系统自动生成的标签不能进行编辑',
      //     okText: 'OK',
      //   })
      // }else{
        let targetGroupUUIDs = []
        let groupData = data.group
        if (groupData && groupData.length > 0) {
          let arrs = []
          groupData.forEach((item) => {
            if (arrs.length > 0) {
              arrs = [...arrs, item.value]
            } else {
              arrs = [item.value]
            }
          })
          targetGroupUUIDs = arrs
        }
        let payload = {
          ...data , 
          targetGroupUUIDs,
        }
        dispatch({
          type: `label/${type}`,											//抛一个事件给监听这个type的监听器
          payload: payload,
        })
        resetFields()
      // }
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'label/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
      },
    })
  }

  const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, {
						value: item.uuid,
						label: item.name,
					}]
				} else {
					arrs = [{
						value: item.uuid,
						label: item.name,
					}]
				}
			})
		}
		return arrs
  }
  
  const treeProps = {
		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
		style: {
			width: 300,
		},
  }
  
  const modalOpts = {
    title: `${type === 'create' ? '新增标签' : '编辑标签'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  const InputonChange = (event)=>{
    let inputKeyValue=''
    if(event && event.target && event.target.value){
      inputKeyValue = event.target.value
    }
    dispatch({
      type: 'label/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        inputKeyValue:inputKeyValue
      },
    })
  }
  function validatorkey (rule, value, callback) {
    let reg = /^(?!(_))\w{0,63}$/i
    if (!(reg.test(value) )&& value !== undefined) {
      callback('键值格式不正确,不能以下划线和ump_tool开头')
    } else {
      callback()
    }
  }

  function validatorvalue (rule, value, callback) {
    let reg = /^[a-zA-Z0-9]{1}[a-zA-Z0-9-_.]{0,254}[a-zA-Z0-9]{1}$/
    if (!(reg.test(value) )&& value !== undefined) {
      callback('值格式不正确')
    } else {
      callback()
    }
  }
  let proInputValue =  inputKeyValue=='ump_tool' ? 'ump-prometheus-' : ''
  return (
    <Modal {...modalOpts} height="600px">
      <Form layout="horizontal">
        <FormItem label="标签名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="标签键" hasFeedback {...formItemLayout}>
          {getFieldDecorator('key', {
            initialValue: item.key,
            rules: [
              {
                required: true,
              },
              {
                validator: validatorkey,
              }
            ],
          })(<Input id ="key" onChange={InputonChange}/>)}
        </FormItem>
        <FormItem label="标签值" hasFeedback {...formItemLayout}>
          {getFieldDecorator('value', {
            initialValue: item.value ? item.value : proInputValue,
            rules: [
              {
                required: true,
              },
              {
                validator: validatorvalue,
              }
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="标签描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="分组" hasFeedback {...formItemLayout}>
          {getFieldDecorator('group', {
            initialValue: showGroupName(item ? item.group : ""), /*此处为字段的值，可以把 item对象 的值放进来*/
            rules: [
              {
                type: 'array',
              },
            ],
          })(<TreeSelect {...treeProps}>
            {treeNodes}
           </TreeSelect>)}
        </FormItem>
        <FormItem label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('enabled', {
            initialValue: item.enabled==undefined ? 'true' : `${item.enabled}`,
            rules: [
              {
                required: true,
              },
            ],
          })(<RadioGroup>
            <Radio value='true'>是</Radio>
            <Radio value='false'>否</Radio>
          </RadioGroup>)}
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
