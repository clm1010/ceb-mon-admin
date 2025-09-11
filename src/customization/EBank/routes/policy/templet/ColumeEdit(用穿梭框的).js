import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Transfer, Icon, Checkbox, Select, InputNumber } from 'antd'
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
  modalType,
  checkStatus,
  isClose,
	columeState,
}) => {
	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					columeVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					columeVisible: false,
				},
		})
	}
	const TransferClick = () => {															//弹出窗口中点击取消按钮触发的函数
	}

  const modalOpts = {
    title: `${type === 'create' ? '新增策略模板' : '编辑策略模板'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

	//穿梭框-------------------start

  const filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1
  }
  const handleChange = (targetKeys) => {
    columeState.targetKeys = targetKeys
    dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				columeState,
			},
		})
  }

	//穿梭框-------------------end
  return (

    <Modal {...modalOpts} width="450px">
      <Form layout="horizontal">
        <Transfer
          onclick={TransferClick}
          dataSource={columeState.mockData}
          showSearch
          filterOption={filterOption}
          targetKeys={columeState.targetKeys}
          onChange={handleChange}
          render={item => item.title}
        />
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
      		>
          <Icon type="user" />
        </Button>
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
        >
          <Icon type="user" />
        </Button>
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
        >
          <Icon type="user" />
        </Button>
        <Button
          size="small"
          style={{ float: 'right', margin: 5 }}
        >
          <Icon type="user" />
        </Button>
        <br />
        <FormItem label="列名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: '',
          })(<Input />)}
        </FormItem>
        <FormItem label="列宽" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: '',
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="是否锁定" hasFeedback {...formItemLayout}>
          			{getFieldDecorator('suo', {
            			initialValue: true,
            			valuePropName: 'checked',
                })(<Checkbox >周期内</Checkbox>)}
        </FormItem>
        <div style={{ position: 'relative' }} id="area1" />
        <FormItem label="排序" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sort', {
            initialValue: 'desc',
          })(<Select
  					  //onChange={typeChange}
            getPopupContainer={() => document.getElementById('area1')}
          >
            <Select.Option value="desc">降序</Select.Option>
            <Select.Option value="asc">升序</Select.Option>
             </Select>)}
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
