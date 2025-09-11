import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Row, Col, Icon, Button, InputNumber, TreeSelect } from 'antd'
import { genDictOptsByName } from "../../../../utils/FunctionTool"
import { useState } from 'react'
import style from './modaless.less'
const FormItem = Form.Item
const TabPane = Tabs.TabPane
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
const formItemLayout3 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
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
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	modalType,
	tempListMeta1,
	tempListChecks1,
	user,
	serviceArea,
	projectsData,
	clusterData,
	namespaceData,
	serverData,
	podData,
	portObj
}) => {
	const tempListMetaValue = [
		{
			index: 1,
			key: 'ump_project',
			value: '',
		},
		{
			index: 2,
			key: '__param_cluster',
			value: '',
		},
		{
			index: 3,
			key: '__param_namespace',
			value: '',
		},
		{
			index: 4,
			key: '__param_pod',
			value: '',
		},
		{
			index: 5,
			key: 'service',
			value: '',
		},
		{
			index: 6,
			key: '__param_port',
			value: '',
		},
		{
			index: 7,
			key: '__param_protocol',
			value: '',
		},
	]
	const tempListChecksVuale = [
		{
			index: 1,
			http: '15.5.89.208:10901',
			interval: 15,
		},
	]

	const [tempListChecks, setTempListChecks] = useState(tempListChecksVuale)
	const [tempListMeta, setTempListMeta] = useState(tempListMetaValue)
	const [clusterOP, setClusterOP] = useState(projectsData[0] ? clusterData[projectsData[0]] : []) // 选择cluster

	const [projectVal, setProjectVal] = useState('')
	const [culsterVal, setCulsterVal] = useState('')
	const [portVal, setPortVal] = useState([])

	useEffect(() => {
		if (modalType == 'update') {
			setTempListChecks([...tempListChecks1])
		}
	}, [tempListChecks1])

	useEffect(() => {
		if (modalType == 'update') {
			if (Object.keys(item.meta).includes('ump_project') && Object.keys(item.meta).includes('__param_cluster') &&
				Object.keys(item.meta).includes('__param_namespace') && Object.keys(item.meta).includes('__param_pod') &&
				Object.keys(item.meta).includes('service')
			) {
				let meta_update_val = [...tempListMetaValue]
				for (const iterator of tempListMeta1) {
					if (iterator.key == 'ump_project') {
						meta_update_val[0].value = iterator.value
						continue
					}
					if (iterator.key == '__param_cluster') {
						meta_update_val[1].value = iterator.value
						continue
					}
					if (iterator.key == '__param_namespace') {
						meta_update_val[2].value = iterator.value
						continue
					}
					if (iterator.key == '__param_pod') {
						meta_update_val[3].value = iterator.value
						continue
					}
					if (iterator.key == 'service') {
						meta_update_val[4].value = iterator.value
						continue
					}
					if (iterator.key == '__param_port') {
						meta_update_val[5].value = iterator.value
						continue
					}
					if (iterator.key == '__param_protocol') {
						meta_update_val[6].value = iterator.value
						continue
					}

					meta_update_val.push({
						index: meta_update_val.length + 1,
						key: iterator.key,
						value: iterator.value,
					})
				}
				setTempListMeta([...meta_update_val])
			} else {
				setTempListMeta([...tempListMeta1])
			}
		}
	}, [tempListMeta1])


	const SelectServiceArea = serviceArea.map((item) => <Option value={item.value}>{item.name}</Option>)
	if (modalType == 'create') {
		let defaultArea
		for (const iterator of serviceArea) {
			if (iterator.name == '全栈管理域A-测试') {
				defaultArea = iterator.value
			}
		}
		item.tags = ['metrics-exporter']
		item.address = '15.5.89.208'
		item.port = '10901'
		item.serviceArea = '15.5.89.208'
		item.namespace = 'std'
	}
	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}

			let meta = {}
			meta.__metrics_path__ = '/dflist'
			// let checks = []
			tempListMeta.forEach(item => {
				let Matekey = data[`Metakey${item.index}`]
				let Matevalue = data[`Metavalue${item.index}`]
				meta[Matekey] = Matevalue
				delete data[`Metakey${item.index}`]
				delete data[`Metavalue${item.index}`]
			});
			// tempListChecks.forEach(item => {
			// 	let temp = {}
			// 	temp.http = data[`Checkshttp${item.index}`]
			// 	temp.interval = data[`Checksinterval${item.index}`] + 's'
			// 	checks.push(temp)
			// 	delete data[`Checkshttp${item.index}`]
			// 	delete data[`Checksinterval${item.index}`]
			// })
			let domain = user.domain ? user.domain : "总行"
			let registerStatus = modalType == 'update' ? item.registerStatus : 'UNREGISTERED'

			data.name = 'CDAMT-SUBNOA-MS-cdamt-df'
			data.id = `CDAMT-SUBNOA-MS-cdamt-df-${meta.__param_pod}`
			data.tags = ['metrics-exporter']
			data.address = '15.5.89.208'
			data.port = '10901'
			data.serviceArea = '15.5.89.208'
			data.namespace = meta.__param_namespace
			data.checks = [{ http: '15.5.89.208:10901', interval: '15.0s' }]

			let payload = {
				...data,
				meta,
				// checks,
				domain,
				registerStatus
			}
			resetFields()
			setTempListMeta([...tempListMetaValue])
			setTempListChecks([...tempListChecksVuale])
			// 如果__param_pod不存在则将namespace下的所有pod都进行增加
			if ((!meta.__param_pod || meta.__param_pod == '') && podData.length > 0) {
				podData.forEach(item => {
					payload.meta.__param_pod = item
					payload.id = `CDAMT-SUBNOA-MS-cdamt-df-${item}`
					dispatch({
						type: `registerServices/${modalType}`,											//抛一个事件给监听这个type的监听器
						payload: payload
					})
				})
			} else {
				dispatch({
					type: `registerServices/${modalType}`,											//抛一个事件给监听这个type的监听器
					payload: payload
				})
			}
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		setTempListMeta([...tempListMetaValue])
		setTempListChecks([...tempListChecksVuale])
		dispatch({
			type: 'registerServices/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})
	}

	const modalOpts = {
		title: type === 'create' ? '新增个性化注册服务' : type === 'update' ? '编辑个性化注册服务' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	//数值验证
	const blurFunctions = (rulr, value, callback) => {
		let regx = /^\+?[1-9][0-9]*$/
		if (!regx.test(value)) {
			callback('Please enter a positive integer！')
		} else {
			callback()
		}
	}
	const addMeta = () => {
		let temp = tempListMeta[tempListMeta.length - 1]
		let index = temp.index
		index++
		tempListMeta.push({
			index, key: '', value: '',
		})
		setTempListMeta([...tempListMeta])
	}
	const addChecks = () => {
		let temp = tempListChecks[tempListChecks.length - 1]
		let index = temp.index
		index++
		tempListChecks.push({
			index, http: '', interval: '',
		})
		setTempListChecks([...tempListChecks])
	}
	const removeMeta = (index) => {
		const tempListNew = tempListMeta.filter(temp => temp.index !== index)
		setTempListMeta([...tempListNew])
	}

	const removeChecks = (index) => {
		const tempListNew = tempListChecks.filter(temp => temp.index !== index)
		setTempListChecks([...tempListNew])
	}
	const onChangeProject = (value) => {
		setClusterOP([...clusterData[value]])
		setProjectVal(value)
	}
	const onChangeCluster = (value) => {
		setCulsterVal(value)
		dispatch({
			type: 'registerServices/getNamespace',
			payload: {
				project: projectVal,
				cluster: value,
			}
		})
	}
	const onChangeNamespace = (value) => {
		dispatch({
			type: 'registerServices/getPod',
			payload: {
				cluster: culsterVal,
				namespace: value
			}
		})
		dispatch({
			type: 'registerServices/getServer',
			payload: {
				cluster: culsterVal,
				namespace: value
			}
		})
	}
	const onService = (value) =>{
		portObj[value]
		setPortVal([...portObj[value]])
	}
	const myConditionMeta = tempListMeta.filter(e => e.key != '__metrics_path__').map(templet => {
		let TypeCompon
		switch (templet.key) {
			case 'ump_project':
				TypeCompon = <Select style={{ width: '100%' }} onChange={onChangeProject} showSearch>
					{projectsData.map(e => (
						<Option key={e}>{e}</Option>
					))}</Select>
				break;
			case '__param_cluster':
				TypeCompon = <Select style={{ width: '100%' }} onChange={onChangeCluster} showSearch>
					{clusterOP.map(e => (
						<Option key={e}>{e}</Option>
					))}</Select>
				break;
			case '__param_namespace':
				TypeCompon = <Select style={{ width: '100%' }} onChange={onChangeNamespace} showSearch>
					{namespaceData.map(e => (
						<Option key={e}>{e}</Option>
					))}</Select>
				break;
			case '__param_pod': podData
				TypeCompon = <Select style={{ width: '100%' }} showSearch>
					{podData.map(e => (
						<Option key={e}>{e}</Option>
					))}</Select>
				break;
			case 'service':
				TypeCompon = <Select style={{ width: '100%' }} onChange={onService} showSearch>
					{serverData.map(e => (
						<Option key={e} >{e}</Option>
					))}</Select>
				break;
			case '__param_port':
				TypeCompon = <Select style={{ width: '100%' }} showSearch>
					{portVal.map(e => (
						<Option key={e.port}>{e.port}</Option>
					))}</Select>
				break;
			case '__param_protocol':
				TypeCompon = <Select style={{ width: '100%' }} showSearch>
					{portVal.map(e => (
						<Option key={e.protocol}>{e.protocol}</Option>
					))}</Select>
				break;
			default:
				TypeCompon = <Input />
				break;
		}
		return (
			<Row key={`row_${templet.index}`} style={{ display: 'flex', justifyContent: 'center' }}>
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
						})(<Input style={{ width: '95%' }} />)}&nbsp;:
					</FormItem>
				</Col>
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
						})(TypeCompon)}
					</FormItem>
				</Col>
				<Col span={2} key={`col_${templet.index}_3`} style={{ marginLeft: '2%' }}>
					<Button disabled={tempListMeta.length === 1 || templet.index == 1} onClick={removeMeta.bind(this, templet.index)} style={{ marginTop: 2 }}>-</Button>
				</Col>
			</Row>
		)
	})

	const myConditionChecks = tempListChecks.map(templet =>
	(<Row key={`row_${templet.index}`} style={{ display: 'flex', justifyContent: 'center' }}>
		<Col span={10} key={`col_${templet.index}_1`}>
			<FormItem label="http" hasFeedback {...formItemLayout3} key={`Checkshttp_${templet.index}`} >
				{getFieldDecorator(`Checkshttp${templet.index}`, {
					initialValue: templet.http,
					rules: [
						{
							required: true,
							message: 'http必填',
						},
					],
				})(<Input disabled={tempListChecks.length === 1} />)}
			</FormItem>
		</Col>
		<Col span={10} key={`col_${templet.index}_2`}>
			<FormItem label="interval" hasFeedback {...formItemLayout3} key={`Checksinterval_${templet.index}`} >
				{getFieldDecorator(`Checksinterval${templet.index}`, {
					initialValue: templet.interval,
					rules: [
						{
							required: true,
							message: 'interval必填',
						},
					],
				})(<InputNumber min={1} step={1} precision={1} style={{ width: "100%" }} disabled={tempListChecks.length === 1} />)}
			</FormItem>
		</Col>
		<Col span={2} key={`col_${templet.index}_3`} >
			<Button disabled={tempListChecks.length === 1} onClick={removeChecks.bind(this, templet.index)} style={{ margin: 2 }} >-</Button>
		</Col>
	</Row>))

	return (

		<Modal {...modalOpts}
			width="900px"
			footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
		>
			<Form layout="horizontal">
				<div className={style.per_form_h}>
					{/* <Tabs defaultActiveKey="reg_1">
						<TabPane tab={<span><Icon type="user" />基本信息</span>} key="reg_1">

							<FormItem label="ID" hasFeedback {...formItemLayout}>
								{getFieldDecorator('id', {
									initialValue: (item.id ? item.id : 'CDAMT-SUBNOA-MS-cdamt-df'),
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
									initialValue: item.tags,
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
									initialValue: item.address,
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
									initialValue: item.port,
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
								})(<Select >
									{SelectServiceArea}
								</Select>)}
							</FormItem>
							<FormItem label="命名空间" hasFeedback {...formItemLayout}>
								{getFieldDecorator('namespace', {
									initialValue: item.namespace,
								})(<Input />)}
							</FormItem>
						</TabPane>
					</Tabs> */}
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
					{/* <Tabs defaultActiveKey="reg_3" activeKey="reg_3" >
						<TabPane tab="check" key="reg_3">
							{
								<Row span={24}>
									{myConditionChecks}
									<Col xl={20} md={20} >
										<Button onClick={addChecks} type="dashed" style={{ width: "100%", marginLeft: '10%' }} block>+</Button>
									</Col>
								</Row>
							}
						</TabPane>
					</Tabs> */}
				</div>
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
