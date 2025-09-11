import React from 'react'
import PropTypes from 'prop-types'
import { Input , Modal, Button, Form, Row, Col, Tag } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout3 = {
	labelCol: {
		span: 3,
	},
	wrapperCol: {
		span: 21,
	},
}

const modal = ({
	dispatch,
	modalVisible,
	type,
	dataSource,
	currentItem,
	loading,
	pagination,
	form,
}) => {

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

	const onCancel = () => {
		dispatch({
            type: 'personalizedStrategy/querySuccess',										//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false
			},
		})
	}



	const modalOpts = {
		title:'查看个性化策略',
		visible:modalVisible,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const SearchUserName = (value) => {
		dispatch({
			type: 'orgOper/getOrgAllUser',
			payload: {
				orgId: item.id,
				username: value
			},
		})
	}

	return (
		<Modal {...modalOpts} width="55%" footer={<Button key="cancel" onClick={onCancel}>关闭</Button>}>
			<Row gutter={24}>
				<Col span={24}>
					<FormItem label={<Tag color='purple'>alertMsg:</Tag>} key="alertMsg" colon={false} hasFeedback {...formItemLayout3}>
						{getFieldDecorator('alertMsg', {
							initialValue: currentItem.alertMsg,
						})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
					</FormItem>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col span={24}>
					<FormItem label={<Tag color='cyan'>indicator</Tag>} key="indicator" colon={false} hasFeedback {...formItemLayout3}>
						{getFieldDecorator('indicator', {
							initialValue: currentItem.indicator,
						})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
					</FormItem>
				</Col>
			</Row>
			<Row gutter={24}>
				<Col span={24}>
					<FormItem label={<Tag color='volcano'>promql</Tag>} key="promql" colon={false} hasFeedback {...formItemLayout3}>
						{getFieldDecorator('promql', {
							initialValue: currentItem.promql,
						})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
					</FormItem>
				</Col>
			</Row>
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
