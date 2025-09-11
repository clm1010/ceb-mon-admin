import React from 'react'
import PropTypes from 'prop-types'
import mystyle from './DataModal.less'
import { Form, Input, Modal, TreeSelect, Row, Col } from 'antd'

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
	indicatorsItem = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	modalType,
	checkStatus,
	isClose,
}) => {
	const onOk = () => {
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				indicatorsModalVisible: false,
			},
		})
	}
 const onCancel = () => {
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				indicatorsModalVisible: false,
			},
		})
	}

	const modalOpts = {
		title: '指标详情',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}


	const treeProps = {

		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		treeDefaultExpandAll: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
	}

	return (
		isClose ? null :
		<Modal {...modalOpts} height="600px" >
  <Form layout="horizontal">
    <FormItem label="指标名称" hasFeedback {...formItemLayout}>
      {getFieldDecorator('name', {
					initialValue: indicatorsItem.name,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="指标描述" hasFeedback {...formItemLayout}>
      {getFieldDecorator('description', {
					initialValue: indicatorsItem.description,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="单位" hasFeedback {...formItemLayout}>
      {getFieldDecorator('unit', {
					initialValue: indicatorsItem.unit,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="数据类型" hasFeedback {...formItemLayout}>
      {getFieldDecorator('dataType', {
					initialValue: indicatorsItem.dataType,
				  })(<Input disabled />)}
    </FormItem>


    <FormItem label="分组" hasFeedback {...formItemLayout}>
      {getFieldDecorator('targetGroupUUIDs', {
					initialValue: indicatorsItem.groupname, /*此处为字段的值，可以把 item对象 的值放进来*/
				  })(<Input disabled />)}
    </FormItem>

    <Row>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建者:</Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={indicatorsItem.createdBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(indicatorsItem.createdTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新者: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={indicatorsItem.updatedBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(indicatorsItem.updatedTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
    </Row>

  </Form>
		</Modal>

	)
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
}

export default Form.create()(modal)
