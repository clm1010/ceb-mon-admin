import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import fenhang from './../../utils/fenhang'
const Option = Select.Option
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
  	},
  	checkStatus,
  	isClose,
  	selectparentKeys,
  	user,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
	      	if (errors) {
	        		return
	      	}
		 	let parentUUID = ''
		  	if (selectparentKeys && selectparentKeys.length > 0) {
			  	parentUUID = selectparentKeys[0]
		  	}
	      	const data = {
	        		...getFieldsValue(),
				parentUUID,

	      	}
	      	dispatch({
				type: `mainRuleInstanceGroup/${type}`,											//抛一个事件给监听这个type的监听器
				payload: data,

			})
    		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'mainRuleInstanceGroup/controllerState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
	}


  	const modalOpts = {
	    title: `${type === 'create' ? '新增实例管理组' : '编辑实例管理组'}`,
	    visible,
	    onOk,
	    onCancel,
	    wrapClassName: 'vertical-center-modal',
	    maskClosable: false,
  	}

  	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	//适用范围查询条件搜索
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
  	return (
  		isClose ? null :
  <Modal {...modalOpts} height="600px">
    <Form layout="horizontal">
      <FormItem label="id" style={{ display: 'none' }} hasFeedback {...formItemLayout}>
        {getFieldDecorator('uuid', {
            				initialValue: item.uuid,
          			})(<Input />)}
      </FormItem>

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

      {/* <FormItem label="名称" hasFeedback {...formItemLayout}>
        				{getFieldDecorator('name', {
        					initialValue: item.name ? item.name:user.branch,
        					rules: [
        					{
        						required: true,
        					}
        					],
        				})
        					( selectparentKeys.length === 0 ?
        					(!user.branch ?
	        					(<Select
	    							showSearch
	    							filterOption={mySearchInfo}
	  						>
	   							{fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
	  						</Select>)
  						:
	  						(<Select
	    							showSearch
	    							filterOption={mySearchInfo}
	    							disabled={true}
	  						>
	   							<Option key={user.branch}>{maps.get(user.branch)}</Option>
	  						</Select>)
        					)
        					:(<Input />)
        					)
        				}
        			</FormItem> */}

      <FormItem label="描述" style={{ display: (type === 'update' ? 'none' : 'block') }} hasFeedback {...formItemLayout}>
        {getFieldDecorator('description', {
            				initialValue: item.description,
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
