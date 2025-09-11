import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Row, Col, Icon, Button, TreeSelect } from 'antd'
import { genDictOptsByName } from "../../../../utils/FunctionTool"
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const { TreeNode } = TreeSelect;
const { Option } = Select;
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout2 = {
	labelCol: {
		span: 0,
	},
	wrapperCol: {
		span: 24,
	},
}

const formItemLayout4 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 20,
	},
}

const modal = ({
	dispatch,
	form: {
		getFieldDecorator,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	oneSystemEvaluate,
}) => {
	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}

			dispatch({
				type: `registerServices/evaluate`,											//抛一个事件给监听这个type的监听器
				payload: {
					project:data.project
				}
			})

			dispatch({
				type: 'registerServices/updateState',													//抛一个事件给监听这个type的监听器
				payload: {
					oneSystemEvaluate: false,
				},
			})
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'registerServices/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				oneSystemEvaluate: false,
			},
		})
	}

	const modalOpts = {
		title: '单系统监控评价',
		visible:oneSystemEvaluate,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}


	return (

		<Modal {...modalOpts}
			width="700px"
			footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
		>
			<Form layout="horizontal">
				<Tabs defaultActiveKey="reg_1">
					<TabPane tab={<span><Icon type="user" />单系统监控评价</span>} key="reg_1">
						<FormItem label="project" hasFeedback {...formItemLayout}>
							{getFieldDecorator('project', {
								initialValue: "",
								rules: [
									{
										required: true,
										message: '项目名必填',
									},
								],
							})(<Input />)}
						</FormItem>
					</TabPane>
				</Tabs>
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
