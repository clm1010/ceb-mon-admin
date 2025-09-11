import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker, Icon, Alert, message, Tabs, Divider } from 'antd'
import moment from 'moment'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName,getSourceByKey } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
const FormItem = Form.Item
const { TabPane } = Tabs
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
	moSynState,
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	alertType,
	alertMessage,
	appSelect,
	appCategorlist,
	FScloud,
	snmpVerflag,
}) => {

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll,
	} = form
	const snmpVerOpt = getSourceByKey('snmpv3_protocols').map(e => <Option key={e.uuid} value={e.uuid} disabled={e.status}>{e.name}</Option>)

	if (moSynState) { //同步中
		alertMessage = '设备正在同步中，请稍后……',
			alertType = 'info'
	}

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create' && item.branchName === undefined) {
		item.branchName = user.branch
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

	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
		dispatch({
			type: 'f5/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'f5/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onBranchNameChange = (value) => {
		//如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
		if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH') || (value !== 'QH' && item.branchName === 'QH') || (value === 'QH' && item.branchName !== 'QH')) {
			delete item.firstSecArea
			delete item.secondSecArea
			resetFields(['firstSecArea', 'secondSecArea'])
		}
		item.branchName = value
		dispatch({
			type: 'f5/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
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

	const onOk = () => {
		validateFieldsAndScroll((errors) => {
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
			dispatch({
				type: 'f5/setState',	//@@@
				payload: {
					modalVisible: false,
					FScloud:false,
					snmpVerflag:true,
				}
			})
			//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && modalType === 'create') {
				dispatch({
					type: `f5/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `f5/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'f5/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				FScloud:false,
				snmpVerflag:true,
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

	//同步按钮触发的事件
	const onSync = () => {
		dispatch({
			type: 'f5/setState',				//@@@
			payload: ({
				moSynState: true,
			}),
		})
		dispatch({
			type: 'f5/moSync',				//@@@
			payload: {
				moFirstClass: item.firstClass,
				uuids: [item.uuid]
			},
		})
	}

	let icon = <Icon type="sync" />
	if (moSynState) {
		icon = <Icon type="loading" />
	}

	const openInfsModal = (item) => {
		const currentItem = { uuid: item.uuid }

		dispatch({
			type: 'interfaceList/setState',
			payload: {
				infsVisible: true,
			},
		})
		dispatch({
			type: 'interfacer/getInterfacesById',
			payload: {
				currentItem,
			},
		})
	}

	const policy = (item) => {
		dispatch({
			type: 'f5/preview',
			payload: {
				criteria: `branch == ${item.branchName}`,
				moCriteria: `uuid == ${item.uuid}`,
			},
		})
		dispatch({
			type: 'f5/setState',
			payload: {
				policyVisible: true,
			},
		})
	}
	const deciFScloud = (e) => {
		dispatch({
			type: 'f5/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	//end
	const onchangesnmpVer = (v) => {
		dispatch({
			type: 'f5/setState',
			payload: {
				snmpVerflag: v != 'V3',
			},
		})
	}

	return (
		<Modal {...modalOpts}
			width={1050}
			footer={[
				<Button key="sync" disabled={modalType !== 'update'} onClick={onSync}>{icon}同步</Button>,
				<Button key="cancel" onClick={onCancel}>关闭</Button>,
				<Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
			key="routerModal"
		>
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
					<FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
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
					<FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
						{getFieldDecorator('vendor', {
							initialValue: item.vendor,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>{genDictOptsByName('networkVendor')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="SNMP版本" key="snmpVer" hasFeedback {...formItemLayout}>
						{getFieldDecorator('snmpVer', {
							initialValue: item.snmpVer ? item.snmpVer : 'V1',
							rules: [
								{
									required: true,
								},
							],
						})(<Select onChange={onchangesnmpVer}>{genDictOptsByName('snmpVer')}</Select>)}
					</FormItem>
				</span>
				{
					snmpVerflag ?
						<Fragment>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="SNMP团体串" key="snmpCommunity" hasFeedback {...formItemLayout}>
									{getFieldDecorator('snmpCommunity', {
										initialValue: item.snmpCommunity,
										rules: [
											{
												required: true,
											},
										],
									})(<Input />)}
								</FormItem>
							</span>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
									{getFieldDecorator('snmpWriteCommunity', {
										initialValue: item.snmpWriteCommunity,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>
						</Fragment>
						:
						<Fragment>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="v3配置" key="snmpv3ConfigUUID" hasFeedback {...formItemLayout}>
									{getFieldDecorator('snmpv3ConfigUUID', {
										initialValue: item.snmpv3ConfigUUID,
										rules: [],
									})(<Select>{snmpVerOpt}</Select>)}
								</FormItem>
							</span>
						</Fragment>
				}
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
					<FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mngInfoSrc', {
							initialValue: item.mngInfoSrc ? item.mngInfoSrc : '手工',
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onChangeMngInfoSrc} disabled={!!((item.mngInfoSrc === '手工' && modalType === 'update' && _mngInfoSrc === '手工'))}>
							{genDictOptsByName('mngInfoSrc')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname === null ? '' : item.hostname,
							rules: [],
						})(<Input disabled={item.mngInfoSrc === '自动'} />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="区域" key="location" hasFeedback {...formItemLayout}>
						{getFieldDecorator('location', {
							initialValue: item.location === null ? '' : item.location,
							rules: [],
						})(<Input disabled={item.mngInfoSrc === '自动'} />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="ObjectID" key="objectID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('objectID', {
							initialValue: item.objectID === null ? '' : item.objectID,
							rules: [],
						})(<Input disabled={item.mngInfoSrc === '自动'} />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [],
						})(<Input />)}
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
								{
									required: true,
								},
							],
						})(<Select showSearch>{genDictOptsByName('deviceModel')}</Select>)}
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
					<FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [],
						})(<Select>{genDictOptsByName('SrcType')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="带内IP" key="inboundIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('inboundIP', {
							initialValue: item.inboundIP,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="IPV6" key="ipv6" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ipv6', {
							initialValue: item.ipv6,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="syslog发送IP" key="syslogSenderIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('syslogSenderIP', {
							initialValue: item.syslogSenderIP,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>
				
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="负载区分" key="extInt1" hasFeedback {...formItemLayout}>
						{getFieldDecorator('extInt1', {
							initialValue: item.extInt1 ? item.extInt1 : '0',
							rules: [],
						})(<Select>
							<Option value="0">0</Option>
							<Option value="1">1</Option>
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统版本" key="softwareVersion" hasFeedback {...formItemLayout}>
						{getFieldDecorator('softwareVersion', {
							initialValue: item.softwareVersion,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="联系人" key="contact" hasFeedback {...formItemLayout}>
						{getFieldDecorator('contact', {
							initialValue: item.contact,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="发现状态" key="syncStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('syncStatus', {
							initialValue: item.syncStatus ? item.syncStatus : '未同步',
							rules: [],
						})(<Select disabled>{genDictOptsByName('SyncStatus')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="发现时间" key="syncTime" hasFeedback {...formItemLayout}>
						{getFieldDecorator('syncTime', {
							initialValue: item.syncTime ? moment(item.syncTime) : null,
							rules: [],
						})(<DatePicker
							showTime
							style={{ width: '100%' }}
							disabled
							format="YYYY-MM-DD HH:mm:ss"
							placeholder="Select Time"
						/>)}
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
						<Fragment>
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
						</Fragment>
						:
						null
				}
				{
					modalType === 'update' ?
						<span style={{ width: '50%', float: 'right' }}>
							<Button style={{ marginLeft: 138 }} icon="search" onClick={() => openInfsModal(item)} />
							<Button style={{ marginLeft: 8 }} icon="fork" />
						</span>
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
