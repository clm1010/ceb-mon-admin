import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import NeFilter from '../../../../../components/NEFilter/NEFilter'
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
}
const modal = ({
	dispatch,
	loading,
	onPageChange,
	pagination,
  visible,
  type,
  item = {},
  form = {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  modalType,
  checkStatus,
  isClose,
  ruleValue,
  ruleValue1,
  alarmFilterInfo,
  alarmFilterType,
}) => {
	const onOk = () => {
		let aa = this_child.genJson()
																//弹出窗口点击确定按钮触发的函数
		form.validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...form.getFieldsValue(),
      }
      dispatch({
				type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
				payload: {
					ruleValue: aa,
					ruleValue1: '已配置',
					modalVisible: true,														//弹出窗口是否可见
    			objectVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				   modalVisible: true,														//弹出窗口是否可见
    			objectVisible: false,
			},
		})
	}

  const modalOpts = {
    title: '对象关联规则',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    ruleValue,
    maskClosable: false,
  }

  const neFilterProps = {
	  	type: alarmFilterType,
	  	form,
	  	info: alarmFilterInfo,
	}
	 let this_child = null
    function getDS () {
    }

   function getChild (child) {
        this_child = child
    }

  return (<Form>
    <Modal {...modalOpts} width="700px">
      <NeFilter {...neFilterProps} ref={getChild} />

    </Modal>
  </Form>
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
