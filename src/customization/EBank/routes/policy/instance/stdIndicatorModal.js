import React from 'react'
import PropTypes from 'prop-types'
import mystyle from './stdIndicatorModal.less'
import { Form, Input, Modal, Button, Row, Col } from 'antd'

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
	checkStatus,
	isClose,
}) => {
	const onCancel = () => {
		dispatch({
			type: 'policyInstance/hideModal',
			payload: {
				stdIndVisible: false,
				isClose: true,
				stdIndicators: {},
			},
		})
	}


	const modalOpts = {
		title: '标准指标详情',
		visible,
		//onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}


	return (
		isClose ? null :
		<Modal {...modalOpts} height="600px" footer={[<Button key="back" size="default" type="primary" onClick={onCancel}>OK</Button>]}>
  <Form key="stdicatorDesc" layout="horizontal">
    <FormItem label="指标名称" {...formItemLayout}>
      {getFieldDecorator('name', {
					initialValue: item.name,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="指标描述" {...formItemLayout}>
      {getFieldDecorator('description', {
					initialValue: item.description,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="单位" {...formItemLayout}>
      {getFieldDecorator('unit', {
					initialValue: item.unit,
				  })(<Input disabled />)}
    </FormItem>
    <FormItem label="数据类型" {...formItemLayout}>
      {getFieldDecorator('dataType', {
					initialValue: item.dataType,
				  })(<Input disabled />)}
    </FormItem>

    <FormItem label="分组" {...formItemLayout}>
      {getFieldDecorator('group', {
					initialValue: '',
				  })(<Input disabled />)}
    </FormItem>

    <Row>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建者:</Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={item.createdBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(item.createdTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新者: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={item.updatedBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(item.updatedTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
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
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
