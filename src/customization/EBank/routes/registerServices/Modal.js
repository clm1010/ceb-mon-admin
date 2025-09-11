import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Row, Col, Icon, Button, TreeSelect,Spin } from 'antd'
import debounce from 'throttle-debounce/debounce'
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
	visible,
	type,
	item,
	form: {
		getFieldDecorator,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	modalType,
	tempListMeta,
	user,
	serviceArea,
	appDatas,
	fetchingApp,
}) => {
	const SelectServiceArea = serviceArea.map((item) => <Option value={item.value}>{item.name}</Option>)
	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			let meta = {}
			let checks = []
			tempListMeta.forEach(item => {
				let Matekey = data[`Metakey${item.index}`]
				let Matevalue = data[`Metavalue${item.index}`]
				meta[Matekey] = Matevalue
				delete data[`Metakey${item.index}`]
				delete data[`Metavalue${item.index}`]
			});

			let domain = user.domain ? user.domain : "总行"
			let registerStatus = modalType == 'update' ? item.registerStatus : 'UNREGISTERED'

			let payload1 = {  //更新
				origin: item.origin,
				expStatus: item.expStatus,
				...data,
				meta,
				domain,
				registerStatus
			}
			let payload = {
				...data,
				meta,
				domain,
				registerStatus
			}
			resetFields()
			if (modalType == 'create') {
				dispatch({
					type: `registerServices/${modalType}`,											//抛一个事件给监听这个type的监听器
					payload: payload
				})
			} else if (modalType == "update") {
				dispatch({
					type: `registerServices/${modalType}`,											//抛一个事件给监听这个type的监听器
					payload: payload1
				})
			}
			dispatch({
				type: 'registerServices/updateState',													//抛一个事件给监听这个type的监听器
				payload: {
					modalVisible: false,
				},
			})
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'registerServices/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})
	}

	const modalOpts = {
		title: type === 'create' ? '新增注册服务' : type === 'update' ? '编辑注册服务' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}


	const addMeta = () => {
		let temp = tempListMeta[tempListMeta.length - 1]
		let index = temp.index
		index++
		tempListMeta.push({
			index, key: '', value: '',
		})
		dispatch({
			type: 'registerServices/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempListMeta,
			},
		})
	}

	const removeMeta = (index) => {
		const tempListNew = tempListMeta.filter(temp => temp.index !== index)
		dispatch({
			type: 'registerServices/updateState',							//抛一个事件给监听这个type的监听器
			payload: {
				tempListMeta: tempListNew,
			},
		})
	}

	const queryApp = (value) => {
		dispatch({
			type: 'registerServices/updateState',							//抛一个事件给监听这个type的监听器
			payload: {
				fetchingApp: true,
			},
		})
		dispatch({
			type: 'registerServices/getAllApp',							//抛一个事件给监听这个type的监听器
			payload: {
				q: `englishCode==*${value}*`,
			},
		})
	}

	const myConditionMeta = tempListMeta.map(templet =>
	(<Row key={`row_${templet.index}`} style={{ display: 'flex', justifyContent: 'center' }}>
		<Col span={10} key={`col_${templet.index}_1`}>
			<FormItem label=" " colon={false} hasFeedback {...formItemLayout4} key={`Metakey_${templet.index}`} >
				{getFieldDecorator(`Metakey${templet.index}`, {
					initialValue: templet.key,
					rules: [
						{
							required: true,
							message: '必填',
						},
					],
				})(<Input disabled={templet.index == 1} style={{ width: '95%' }} />)}&nbsp;:
			</FormItem>
		</Col>
		{
			templet.index == 1 ?
				<Col span={8} key={`col_${templet.index}_2`}>
					<FormItem label="" hasFeedback {...formItemLayout2} key={`Metavalue_${templet.index}`} >
						{getFieldDecorator(`Metavalue${templet.index}`, {
							initialValue: templet.value,
							rules: [
								{
									required: true,
									message: '必填',
								},
							],
						})(
							// <Select showSearch>
							// 	{
							// 		appDatas.map(item=><Option value={item.englishCode.toLowerCase()}>{item.englishCode.toLowerCase()}</Option>)
							// 	}
							// </Select>
							<Select
								notFoundContent={fetchingApp ? <Spin size="small" /> : null}
								allowClear
								showSearch
								placeholder="Please select"
								onSearch={debounce(800, queryApp)}
							>
								{
									appDatas.map(item => <Option value={item.englishCode.toLowerCase()}>{item.englishCode.toLowerCase()}</Option>)
								}
							</Select>)}
					</FormItem>
				</Col>
				:
				<Col span={8} key={`col_${templet.index}_2`}>
					<FormItem label="" hasFeedback {...formItemLayout2} key={`Metavalue_${templet.index}`} >
						{getFieldDecorator(`Metavalue${templet.index}`, {
							initialValue: templet.value,
							rules: [
								{
									required: true,
									message: '必填',
								},
							],
						})(<Input />)}
					</FormItem>
				</Col>
		}

		<Col span={2} key={`col_${templet.index}_3`} style={{ marginLeft: '2%' }}>
			<Button disabled={tempListMeta.length === 1 || templet.index == 1} onClick={removeMeta.bind(this, templet.index)} style={{ marginTop: 2 }}>-</Button>
		</Col>
	</Row>))


	return (

		<Modal {...modalOpts}
			width="700px"
			footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
		>
			<Form layout="horizontal">
				<Tabs defaultActiveKey="reg_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="reg_1">
						<FormItem label="ID" hasFeedback {...formItemLayout}>
							{getFieldDecorator('id', {
								initialValue: (item.id ? item.id : ''),
								rules: [
									{
										required: true,
										message: 'ID必填',
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="服务名" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: (item.name ? item.name : ''),
								rules: [
									{
										required: true,
										message: '服务名必填',
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="标签" hasFeedback {...formItemLayout}>
							{getFieldDecorator('tags', {
								initialValue: (item.tags ? item.tags : []),
								rules: [
									{
										required: true,
										message: '标签必填',
									},
								],
							})(<Select mode="multiple" style={{ width: '100%' }} >
								{genDictOptsByName('service_tags')}
							</Select>)}
						</FormItem>
						<FormItem label="地址" hasFeedback {...formItemLayout}>
							{getFieldDecorator('address', {
								initialValue: (item.address ? item.address : ''),
								rules: [
									{
										required: true,
										message: '地址必填',
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="端口" hasFeedback {...formItemLayout}>
							{getFieldDecorator('port', {
								initialValue: (item.port ? item.port : ''),
								rules: [
									{
										required: true,
										message: '端口必填',
									},
								],
							})(<Input />)}
						</FormItem>
						<FormItem label="服务域" hasFeedback {...formItemLayout}>
							{getFieldDecorator('serviceArea', {
								initialValue: item.serviceArea,
								rules: [
									{
										required: true,
										message: '服务域',
									},
								],
							})(<Select>
								{SelectServiceArea}
							</Select>)}
						</FormItem>
						<FormItem label="命名空间" hasFeedback {...formItemLayout}>
							{getFieldDecorator('namespace', {
								initialValue: (item.port ? item.namespace : ''),
							})(<Input />)}
						</FormItem>
					</TabPane>
				</Tabs>
				<Tabs defaultActiveKey="reg_2" activeKey="reg_2" >
					<TabPane tab="Meta" key="reg_2">
						{
							<Row span={24} style={{ border: '2px dashed #fff' }}>
								{myConditionMeta}
								<Col xl={20} md={20} >
									<Button onClick={addMeta} type="dashed" style={{ width: "100%", marginLeft: '10%' }} block>+</Button>
								</Col>
							</Row>
						}
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
