import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, Divider } from 'antd'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const modal = ({
	dispatch,
	modalVisible,
	item,
	form,
	modalType,
	modalName,
	alertType,
	alertMessage,
	appSelect,
	appCategorlist,
	FScloud,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll,
	} = form

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create' && item.branchName === undefined) {
		item.branchName = user.branch
	}

	// 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
	if (appSelect.currentItem.affectSystem !== undefined) {
		item.appName = appSelect.currentItem.affectSystem
		item.uniqueCode = appSelect.currentItem.c1
		item.appCode = appSelect.currentItem.englishCode
	}

	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '请输入应用信息查询',
		name: '应用分类名称',
		modeType: 'combobox',
		required: true,
		dispatch,
		form,
		disabled: false,
		compName: 'appName',
		formItemLayout,
		currentItem: { affectSystem: item.appName },
	})

	function genOptions(objArray) {
		let options = []
		let nameOption = new Set();
		objArray.forEach((option) => {
			let parm = option.affectSystem.split('|')[1]
			nameOption.add(parm)
		})
		nameOption.forEach((option) => {
			options.push(<Option key={option} value={option}>{option}</Option>)
		})
		return options
	}
	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'branchIp/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)
			if (data.name === undefined || data.name === '') {
				data.name = `${data.appName}_${data.alias}`
			}

			for (let field in data) {
				if (typeof (data[field]) === 'object') {
					data[field] = Date.parse(data[field])
				}
			}

			//清除appSelect内容
			dispatch({
				type: 'appSelect/clearState',				//@@@
			})
			//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && modalType === 'create') {
				dispatch({
					type: `branchIp/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `branchIp/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}

			dispatch({
				type: 'branchIp/setState',				//@@@//抛一个事件给监听这个type的监听器
				payload: {
					modalVisible: false,
					FScloud:false,
				},
			})
		})
	}//弹出窗口点击确定按钮触发的函数

	const onBranchNameChange = (value) => {
		//如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
		if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH') || (value !== 'QH' && item.branchName === 'QH') || (value === 'QH' && item.branchName !== 'QH')) {
			delete item.firstSecArea
			delete item.secondSecArea
			resetFields(['firstSecArea', 'secondSecArea'])
		}
		item.branchName = value
		dispatch({
			type: 'branchIp/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'branchIp/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				FScloud:false,
			},
		})
		//清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
		})
	}

	const modalOpts = {
		title: (modalType === 'create' ? `新增${modalName}` : `编辑${modalName}`),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	const deciFScloud = (e)=>{
		dispatch({
			type: 'branchIp/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	//end
	return (
		<Modal {...modalOpts} width={1050} key="lineModal">
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [
								{
									required: true, message: '别名不能为空',
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="IP" key="discoveryIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [
								{
									required: true,
								},
								{
									validator: validateIP,
								},
							],
						})(<Input disabled={modalType == 'update' ? true : false} />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="IP地址类型" key="ipType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ipType', {
							initialValue: item.ipType,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>
							{genDictOptsByName('ipType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="网点类型" key="branchType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchType', {
							initialValue: item.branchType,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>
							{genDictOptsByName('branchType')}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onBranchNameChange} disabled={user.branch !== undefined} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<AppSelect {...appSelectProps} />
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appCode', {
							initialValue: item.appCode,
						})(<Input disabled />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondSecArea', {
							initialValue: item.secondSecArea,
							rules: [
								{},
							],
						})(<Select allowClear>{genDictOptsByName('secondSecArea')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('netDomain', {
							initialValue: item.netDomain,
							rules: [
								{
									required: true,
								},
							]
						})(<Select >
							{genOptions(appCategorlist)}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主备模式" key="haMode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('haMode', {
							initialValue: item.haMode,
							rules: [],
						})(<Select>{genDictOptsByName('haRole')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="型号" key="model" hasFeedback {...formItemLayout}>
						{getFieldDecorator('model', {
							initialValue: item.model,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>{genDictOptsByName('onlineStatus')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
							rules: [
								{
									required: true,
								},
							],
						})(<Select >{genDictOptsByName('managedStatus')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
						{getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Select>{genDictOptsByName('room')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
						{getFieldDecorator('vendor', {
							initialValue: item.vendor,
							rules: [],
						})(<Select>{genDictOptsByName('networkVendor')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
						{getFieldDecorator('snmpWriteCommunity', {
							initialValue: item.snmpWriteCommunity,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('capType', {
							initialValue: item.capType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否全栈云" key="syncTime" hasFeedback {...formItemLayout}>
						{getFieldDecorator('FScloud', {
							initialValue: FScloud,
							rules: [],
						})(<Select onChange={deciFScloud}>
							<Option value={false}>否</Option>
							<Option value={true}>是</Option>
						</Select>)}
					</FormItem>
				</span>
				{
					FScloud ?
						<>
							<Divider orientation="left"><span style={{ color: "#eb2f96" }}>全栈云设置</span></Divider>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="业务IP" key="ecBizIP" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecBizIP', {
										initialValue: item.ecBizIP,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="出向EIP" key="ecExpressEip" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecExpressEip', {
										initialValue: item.ecExpressEip,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="域名" key="ecDomainName" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecDomainName', {
										initialValue: item.ecDomainName,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="虚机ID" key="ecInstanceID" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecInstanceID', {
										initialValue: item.ecInstanceID,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="入向EIP" key="ecIngressEip" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecIngressEip', {
										initialValue: item.ecIngressEip,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="监控对象" key="ecMonitorObject" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecMonitorObject', {
										initialValue: item.ecMonitorObject,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>
						</>
						:
						null
				}
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
