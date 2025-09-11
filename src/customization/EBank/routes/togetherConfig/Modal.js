import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Select, Tabs, Row, Col, Icon, Tag, Button } from 'antd'
import Yaml from './Yam'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItemProps = {
	style: {
		margin: 0,
	},
}
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}

const modal = ({
	dispatch,
	visible,
	type,
	currentItem,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	yamlData,
	serviceArea,
	vList
}) => {
	const SelectServiceArea = serviceArea.map((item) => <Option value={item.value}>{item.name}</Option>)

	const [vnum, setVnum] = useState(0)
	const [vYaml, setVYaml] = useState({})

	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			if(currentItem.status == 'REGISTERED'){
				Modal.confirm({
					title:'警告',
					content:'当前为已注册状态,确定后服务将直接被注册,请确定yaml是否正确。',
					okText:'确定',
					cancelText:'取消',
					onOk:()=>{
						resetFields()
						dispatch({
							type: `togetherConfig/register`,											//抛一个事件给监听这个type的监听器
							payload: {
								name: data.name,
								typ: data.typ,
								area: data.area,
								data: JSON.stringify(yamlData)
							},
						})
						dispatch({
							type: 'togetherConfig/updateState',													//抛一个事件给监听这个type的监听器
							payload: {
								visible: false,
								currentItem: {}
							},
						})
					},
					onCancel:()=>{
						dispatch({
							type: 'togetherConfig/updateState',													//抛一个事件给监听这个type的监听器
							payload: {
								visible: false,
								currentItem: {}
							},
						})
					}
				})
			}else{
				resetFields()
				dispatch({
					type: `togetherConfig/create`,											//抛一个事件给监听这个type的监听器
					payload: {
						name: data.name,
						typ: data.typ,
						area: data.area,
						data: JSON.stringify(yamlData)
					},
				})
				dispatch({
					type: 'togetherConfig/updateState',													//抛一个事件给监听这个type的监听器
					payload: {
						visible: false,
						currentItem: {}
					},
				})
			}
		})
	}

	const onCancel = () => {
		resetFields()														//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'togetherConfig/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				visible: false,
				currentItem: {}
			},
		})
	}

	const modalOpts = {
		title: '集中配置',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 102,
	}
	let selectOpt = vList.map(element => {
		let res = ''
		switch (element.status) {
			case "UNREGISTERED":
			  res = <Tag >未注册</Tag>
			  break;
			case "REGISTERED":
			  res = <Tag color='#87d068'>已注册</Tag>
			  break;
			case "DEREGISTERED":
			  res = <Tag color='#f50'>已注销</Tag>
			  break;
		  }
		return <Select.Option value={element.vtag}>v{element.vtag}-{res}-{new Date(element.createdTime).format('yyyy-MM-dd hh:mm:ss')}</Select.Option>
	});
	const typeChange = (v) => {
		vList.forEach(element => {
			if (element.vtag == v) {
				setVYaml(element)
			}
		});

	}
	const operations = (<FormItem {...FormItemProps} key="modeswitchWai">
		{getFieldDecorator('optionSeltion', {
			// initialValue: ,
		})(<Select placeholder="请选择历史版本" onChange={typeChange}  style={{ width: '350px' }} >
			{selectOpt}
		</Select>)
		}
	</FormItem>)

	const yamlProps = {
		dispatch,
		currentItem: vYaml.name ? vYaml : currentItem
	}

	return (
		<Modal {...modalOpts} footer={type == 'see' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>,
		<Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
			width="970px">
			<Form layout="horizontal">
				<Tabs defaultActiveKey="policy_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="policy_1">
						<span style={{ width: '33%', float: 'left' }}>
							<FormItem label="名称" hasFeedback {...formItemLayout}>
								{getFieldDecorator('name', {
									initialValue: currentItem.name,
									rules: [
										{
											required: true,
										},
									],
								})(<Input disabled={type == 'update'} />)}
							</FormItem>
						</span>
						<span style={{ width: '33%', float: 'left' }}>
							<FormItem label="类型" hasFeedback {...formItemLayout}>
								{getFieldDecorator('typ', {
									initialValue: currentItem.typ,
									rules: [
										{
											required: true,
										},
									],
								})(<Input disabled={type == 'update'} />)}
							</FormItem>
						</span>
						<span style={{ width: '33%', float: 'left' }}>
							<FormItem label="服务域" hasFeedback {...formItemLayout}>
								{getFieldDecorator('area', {
									initialValue: currentItem.area,
									rules: [
										{
											required: true,
										},
									],
								})(<Select disabled={type == 'update'}>
									{SelectServiceArea}
								</Select>)}
							</FormItem>
						</span>
					</TabPane>
				</Tabs>
				<Tabs defaultActiveKey="policy_2" tabBarExtraContent={operations}>
					<TabPane tab={<span><Icon type="tool" />Yam编写</span>} key="policy_2" >
						<FormItem hasFeedback {...formItemLayout}>
							{getFieldDecorator('yaml', {
								initialValue: '',
							})(<Yaml  {...yamlProps} />)}
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
