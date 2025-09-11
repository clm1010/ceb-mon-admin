import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, Tag, Divider } from 'antd'
import MoSingleSelectComp from '../utils/moSingleSelectComp'
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
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	alertType,
	alertMessage,
	moSingleSelect,
	interfacer,
	c1,
	AppOption,
	appCode,
	appSelect,
	appCategorlist,
	FScloud,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form
	const aaInterface = []
	if ('aAItfsList' in item) {
		for (let itf of item.aAItfsList) {
			if (itf.ip !== undefined) {
				aaInterface.push(<Option key={itf.uuid} ip={itf.ip} value={`${itf.portName}&${itf.ip}`} record={itf}><Tag>{itf.portName}</Tag><span style={{ color: '#bebebe' }}>{itf.ip}</span></Option>)
			}
		}
	}
	const zzInterface = []
	if ('zZItfsList' in item) {
		for (let itf of item.zZItfsList) {
			if (itf.ip !== undefined) {
				zzInterface.push(<Option key={itf.uuid} ip={itf.ip} value={`${itf.portName}&${itf.ip}`} record={itf}><Tag>{itf.portName}</Tag><span style={{ color: '#bebebe' }}>{itf.ip}</span></Option>)
			}
		}
	}

	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create') {
		item.branchName = user.branch
		if (!('lineType' in item) || item.lineType === undefined) {
			item.lineType = 'INTERNAL'
		}
	}

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

	const onAaIntfSelect = (value, option) => {
		//获取选中的接口对象
		item.aaIntf = { uuid: option.props.record.uuid, name: option.props.record.name }
		// item.aaPhyName = option.props.record.name //接口物理名称，拼关键字用
		item.aaPort = option.props.record.portName

		setFieldsValue({
			aaIP: option.props.record.ip,
		})
		//要传递给后台的接口对象
		dispatch({
			type: 'line/setState',
			payload: ({
				currentItem: item,
			}),
		})
	}
	const onZzIntfSelect = (value, option) => {
		//获取选中的接口对象
		item.zzIntf = { uuid: option.props.record.uuid, name: option.props.record.name }
		// item.zzPhyName = option.props.record.name //接口物理名称，拼关键字用
		item.zzPort = option.props.record.portName

		setFieldsValue({
			zzIP: option.props.record.ip,
		})
		//要传递给后台的接口对象
		dispatch({
			type: 'line/setState',
			payload: ({
				currentItem: item,
			}),
		})
	}

	const onAaDeviceSelect = (value, option) => {
		//清空设备组件状态
		dispatch({
			type: 'moSingleSelect/setState',
			payload: ({
				isLoading: false,
				options: [],
			}),
		})

		//清空当前item中选中的接口对象
		delete item.aaIntf
		item.aaDeviceIP = ''
		item.aaDeviceIP = option.props.record.discoveryIP
		dispatch({
			type: 'line/setState',
			payload: ({
				currentItem: item,
			}),
		})

		resetFields(['aaIntf'])
		//获取选中设备的uuid
		let uuid = option.props.uuid
		//发起查询该设备下端口列表的请求
		dispatch({
			type: 'line/getAaInterfacesById',
			payload: ({
				uuid,
				pageSize: 300,
			}),
		})
	}
	const onZzDeviceSelect = (value, option) => {
		//清空设备组件状态
		dispatch({
			type: 'moSingleSelect/setState',
			payload: ({
				isLoading: false,
				options: [],
			}),
		})

		//清空当前item中选中的接口对象
		delete item.zzIntf
		item.zzDeviceIP = ''
		item.zzDeviceIP = option.props.record.discoveryIP
		dispatch({
			type: 'line/setState',
			payload: ({
				currentItem: item,
			}),
		})

		resetFields(['zzIntf'])
		//获取选中设备的uuid
		let uuid = option.props.uuid
		//发起查询该设备下端口列表的请求
		dispatch({
			type: 'line/getZzInterfacesById',
			payload: ({
				uuid,
				pageSize: 300,
			}),
		})
	}

	const queryMo = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'moSingleSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					externalFilter: ` firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5')`,
				}),
			})
			//查询，传入输入的查询字段
			dispatch({
				type: 'moSingleSelect/query',
				payload: ({
					inputInfo: value,
					pageSize: 20,
				}),
			})
		}
	}

	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '请输入应用信息查询',
		name: '应用分类名称',
		modeType: 'combobox',
		required: false,
		dispatch, form, item,
		disabled: false,
		compName: 'appName',
		formItemLayout,
		currentItem: { affectSystem: item.appName },
		cDefaultName: item.appName === undefined ? '' : item.appName,
		setPath: 'line/setState',
	})

	const aaDeviceSelectProps =
		Object.assign(
			{},
			moSingleSelect,
			{
				placeholders: '请输入设备IP或名字查询',
				name: '本端设备IP',
				modeType: 'combox',
				required: true,
				dispatch,
				item,
				form,
				disabled: modalType === 'update' ? true : false,
				compName: 'aaDevice',
				formItemLayout,
				externalFilter: '',
				defaultValue: modalType === 'update' ? ('aaDeviceIP' in item ? item.aaDeviceIP : '查不到所属设备') : '',
				onSelect: onAaDeviceSelect,
				query: queryMo,
			}
		)
	const zzDeviceSelectProps =
		Object.assign(
			{},
			moSingleSelect,
			{
				placeholders: '请输入设备IP或名字查询',
				name: '对端设备IP',
				modeType: 'combox',
				required: true,
				dispatch,
				item,
				form,
				disabled: modalType === 'update' ? true : false,
				compName: 'zzDevice',
				formItemLayout,
				externalFilter: '',
				defaultValue: modalType === 'update' ? ('zzDeviceIP' in item ? item.zzDeviceIP : '查不到所属设备') : '',
				onSelect: onZzDeviceSelect,
				query: queryMo,
			}
		)

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'line/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})
	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors && !('_zzPort' in errors && item.lineType !== 'INTERNAL')) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)

			if (c1 !== '') {
				data.uniqueCode = c1
			}
			for (let field in data) {
				if (typeof (data[field]) === 'object') {
					data[field] = Date.parse(data[field])
				}
			}

			//保存MO信息，跳转到抓取设备信息流程
			dispatch({
				type: `line/${modalType}`,				//@@@
				payload: {
					currentItem: data,
				},
			})

			dispatch({
				type: 'line/setState',				//@@@//抛一个事件给监听这个type的监听器
				payload: {
					modalVisible: false,
					FScloud: false,
				},
			})
			resetFields()
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'line/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				appCode: '',
				c1: '',
				FScloud: false,
			},
		})
	}

	const onLineTypeChange = (val) => {
		item.lineType = val
		item.zzIP = ''
		delete item.zzPort
		delete item.zzDeviceIP
		delete item.zzIntf

		dispatch({
			type: 'line/setState', //抛一个事件给监听这个type的监听器
			payload: {
				currentItem: item,
			},
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
	let info = ''
	if (item.aaIntf) {
		info = item.aaIntf.ip
	}
	const deciFScloud = (e) => {
		dispatch({
			type: 'line/setState',
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
							rules: [
								{
									required: true,
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="线路类型" hasFeedback {...formItemLayout}>
						{getFieldDecorator('lineType', {
							initialValue: item.lineType,
						})(<Select onChange={onLineTypeChange}>
							{genDictOptsByName('lineType')}
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
						})(<Select disabled={item.branchName !== undefined} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<MoSingleSelectComp {...aaDeviceSelectProps} />
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					{item.lineType === 'INTERNAL' ?
						<MoSingleSelectComp {...zzDeviceSelectProps} />
						:
						null
					}
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="本端接口" hasFeedback {...formItemLayout}>
						{getFieldDecorator('_aaPort', {
							initialValue: item.aaPort,
							rules: [
								{
									required: true,
								},
							],
						})(<Select showSearch onSelect={onAaIntfSelect} notFoundContent="请选择本端设备IP触发接口列表刷新" disabled={modalType == 'update' ? true : false}>
							{aaInterface}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					{item.lineType === 'INTERNAL' ?
						<FormItem label="对端接口" hasFeedback {...formItemLayout}>
							{getFieldDecorator('_zzPort', {
								initialValue: item.zzPort,
								rules: [
									{
										required: true,
									},
								],
							})(<Select showSearch onSelect={onZzIntfSelect} notFoundContent="请选择对端设备IP触发接口列表刷新" disabled={modalType == 'update' ? true : false}>
								{zzInterface}
							</Select>)}
						</FormItem>
						:
						null
					}
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="本端接口IP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('aaIP', {
							initialValue: item.aaIP,
							rules: [
								{
									required: true,
								},
								{
									validator: validateIP,
								},
							],
						})(<Input readOnly disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="对端接口IP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('zzIP', {
							initialValue: item.zzIP,
							rules: [
								{
									required: true,
								},
								{
									validator: validateIP,
								},
							],
						})(<Input disabled={item.lineType === 'INTERNAL'} />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="本端接口物理名称" hasFeedback {...formItemLayout}>
						{getFieldDecorator('aaPhyName', {
							initialValue: item.aaIntf ? item.aaIntf.name : '',
						})(<Input readOnly disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					{item.lineType === 'INTERNAL' ?
						<FormItem label="对端接口物理名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('zzPhyName', {
								initialValue: item.zzIntf ? item.zzIntf.name : '',
								rules: [
									{
										required: true,
									},
								],
							})(<Input readOnly disabled />)}
						</FormItem>
						:
						null
					}
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('netDomain', {
							initialValue: item.netDomain,
						})(<Select >
							{genOptions(appCategorlist)}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="专线ID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('lineID', {
							initialValue: item.lineID,
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主备模式" hasFeedback {...formItemLayout}>
						{getFieldDecorator('haMode', {
							initialValue: item.haMode,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>
							{genDictOptsByName('haRole')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="采集带宽来源" hasFeedback {...formItemLayout}>
						{getFieldDecorator('bwFromA', {
							initialValue: (item.isbwFromA ? 'true' : 'false'),
						})(<Select>
							<Select.Option value="true">本端</Select.Option>
							<Select.Option value="false">对端</Select.Option>
						</Select>)}
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
						})(<Select disabled={modalType === 'update' && !(user.name === 'admin' || user.roles[0].name === '超级管理员')}>{genDictOptsByName('onlineStatus')}</Select>)}
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
						})(<Select disabled={modalType === 'update' && !(user.name === 'admin' || user.roles[0].name === '超级管理员')}>{genDictOptsByName('managedStatus')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="服务商" hasFeedback {...formItemLayout}>
						{getFieldDecorator('provider', {
							initialValue: item.provider,
						})(<Select>
							{genDictOptsByName('provider')}
						</Select>)}
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
					<AppSelect {...appSelectProps} />
				</span>


				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appCode', {
							initialValue: appCode,
						})(<Input disabled />)}
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
					<FormItem label="VPN" key="vpn" hasFeedback {...formItemLayout}>
						{getFieldDecorator('vpn', {
							initialValue: item.vpn,
							rules: [

							],
						})(<Input maxLength={64} />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="SLA号" hasFeedback {...formItemLayout}>
						{getFieldDecorator('slaNum', {
							initialValue: item.slaNum,
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="线路分类" hasFeedback {...formItemLayout}>
						{getFieldDecorator('typ', {
							initialValue: item.typ,
						})(<Select showSearch>{genDictOptsByName('Line_stle')}</Select>)}
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
