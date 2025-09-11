import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Modal, Select } from 'antd'
import { genDictOptsByName } from '../../utils/FunctionTool'
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
	visible,
	form,
	item,
	type,
	fenhang,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue,
	} = form
	//对更新时间和创建时间处理一下
	if (item.createdTime && item.createdTime !== 0) {
		let text = item.createdTime
		item.createdTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
	}
	if (item.onlineDate && item.onlineDate !== 0) {
		let text = item.onlineDate + "000"
		let aa = Number(text)
		item.onlineDate1 = new Date(aa).format('yyyy-MM-dd hh:mm:ss')
	}
	if (item.updatedTime && item.updatedTime !== 0) {
		let text = item.updatedTime
		item.updatedTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
	}
	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			//将时间转换为时间戳
			if(data.createdTime && data.createdTime!=''){
				data.createdTime = Date.parse(data.createdTime)
			}
			if(data.onlineDate && data.onlineDate!=''){
				data.onlineDate = Date.parse(data.onlineDate)/1000
			}
			if(data.updatedTime && data.updatedTime!=''){
				data.updatedTime = Date.parse(data.updatedTime)
			}
			dispatch({
				type: `appCategories/${type}`,
				payload: {
					currentItem: data,
				},
			})
			resetFields()
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'appCategories/setState',
			payload: {
				modalVisible: false,
				item: {},
				type: '',
			},
		})
	}

	const modalOpts = {
		title: '模板',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	return (
		<Modal {...modalOpts} width={1100}>
			<Form layout="horizontal">
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用系统名称" key="affectSystem" hasFeedback {...formItemLayout}>
						{getFieldDecorator('affectSystem', {
							initialValue: item.affectSystem,
							rules: [
								{ required: true },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用系统ID" key="c1" hasFeedback {...formItemLayout}>
						{getFieldDecorator('c1', {
							initialValue: item.c1,
							rules: [
								{ required: true },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用管理员A" key="applicateManagerA" hasFeedback {...formItemLayout}>
						{getFieldDecorator('applicateManagerA', {
							initialValue: item.applicateManagerA,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用管理员A工号" key="applicateManagerAID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('applicateManagerAID', {
							initialValue: item.applicateManagerAID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用管理员B" key="applicateManagerB" hasFeedback {...formItemLayout}>
						{getFieldDecorator('applicateManagerB', {
							initialValue: item.applicateManagerB,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用管理员B工号" key="applicateManagerBID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('applicateManagerBID', {
							initialValue: item.applicateManagerBID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机构信息" key="branch" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branch', {
							initialValue: item.branch,
							rules: [
								{ required: true },
							],
						})(<Select
							showSearch
							width='100%'
						>
							{genDictOptsByName('appBranch')}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="业务部门" key="businessDepartment" hasFeedback {...formItemLayout}>
						{getFieldDecorator('businessDepartment', {
							initialValue: item.businessDepartment,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="业务部门ID" key="businessDepartmentID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('businessDepartmentID', {
							initialValue: item.businessDepartmentID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="业务功能介绍" key="businessIntroduction" hasFeedback {...formItemLayout}>
						{getFieldDecorator('businessIntroduction', {
							initialValue: item.businessIntroduction,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="业务管理员" key="businessManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('businessManager', {
							initialValue: item.businessManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="业务管理员工号" key="businessManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('businessManagerID', {
							initialValue: item.businessManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="容量类型" key="capType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('capType', {
							initialValue: item.capType,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="DBA" key="dba" hasFeedback {...formItemLayout}>
						{getFieldDecorator('dba', {
							initialValue: item.dba,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="DBAB" key="dbaB" hasFeedback {...formItemLayout}>
						{getFieldDecorator('dbaB', {
							initialValue: item.dbaB,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="DBAB工号" key="dbaBID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('dbaBID', {
							initialValue: item.dbaBID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="DBA工号" key="dbaID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('dbaID', {
							initialValue: item.dbaID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用系统编码" key="englishCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('englishCode', {
							initialValue: item.englishCode,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否应用系统" key="ifSystem" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ifSystem', {
							initialValue: item.ifSystem,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否运维管辖" key="ifOption" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ifOption', {
							initialValue: item.ifOption,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>			
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统类别" key="sysType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('sysType', {
							initialValue: item.sysType,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="项目所属处室" key="belongOffice" hasFeedback {...formItemLayout}>
						{getFieldDecorator('belongOffice', {
							initialValue: item.belongOffice,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="项目所属中心" key="belongCenter" hasFeedback {...formItemLayout}>
						{getFieldDecorator('belongCenter', {
							initialValue: item.belongCenter,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="所属应用团队" key="belongTeam" hasFeedback {...formItemLayout}>
						{getFieldDecorator('belongTeam', {
							initialValue: item.belongTeam,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用联系人" key="appContacts" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appContacts', {
							initialValue: item.appContacts,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用联系人工号" key="appContactsAccount" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appContactsAccount', {
							initialValue: item.appContactsAccount,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是全局应用系统" key="isGlobalApp" hasFeedback {...formItemLayout}>
						{getFieldDecorator('isGlobalApp', {
							initialValue: item.isGlobalApp,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否核心系统" key="isCoreSystem" hasFeedback {...formItemLayout}>
						{getFieldDecorator('isCoreSystem', {
							initialValue: item.isCoreSystem,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否重要系统" key="isImportant" hasFeedback {...formItemLayout}>
						{getFieldDecorator('isImportant', {
							initialValue: item.isImportant,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否关键系统" key="isKey" hasFeedback {...formItemLayout}>
						{getFieldDecorator('isKey', {
							initialValue: item.isKey,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="中间件管理员" key="middlewareManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('middlewareManager', {
							initialValue: item.middlewareManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="中间件管理员B" key="middlewareManagerB" hasFeedback {...formItemLayout}>
						{getFieldDecorator('middlewareManagerB', {
							initialValue: item.middlewareManagerB,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="中间件管理员B工号" key="middlewareManagerBID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('middlewareManagerBID', {
							initialValue: item.middlewareManagerBID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="中间件管理员工号" key="middlewareManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('middlewareManagerID', {
							initialValue: item.middlewareManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="网络域" key="networkDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('networkDomain', {
							initialValue: item.networkDomain,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="上线时间" key="onlineDate" hasFeedback {...formItemLayout}>
						{getFieldDecorator('onlineDate', {
							initialValue: item.onlineDate1,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="操作管理员" key="operateManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('operateManager', {
							initialValue: item.operateManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="操作管理员工号" key="operateManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('operateManagerID', {
							initialValue: item.operateManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="项目经理" key="pm" hasFeedback {...formItemLayout}>
						{getFieldDecorator('pm', {
							initialValue: item.pm,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="项目经理工号" key="pmID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('pmID', {
							initialValue: item.pmID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="质量管理员" key="qualityManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('qualityManager', {
							initialValue: item.qualityManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="质量管理员ID" key="qualityManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('qualityManagerID', {
							initialValue: item.qualityManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="服务支持人" key="serviceSupporter" hasFeedback {...formItemLayout}>
						{getFieldDecorator('serviceSupporter', {
							initialValue: item.serviceSupporter,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="服务支持人ID" key="serviceSupporterID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('serviceSupporterID', {
							initialValue: item.serviceSupporterID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统使用范围" key="scope" hasFeedback {...formItemLayout}>
						{getFieldDecorator('scope', {
							initialValue: item.scope,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="安全等级" key="securityLevel" hasFeedback {...formItemLayout}>
						{getFieldDecorator('securityLevel', {
							initialValue: item.securityLevel,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="服务器等级" key="serverLevel" hasFeedback {...formItemLayout}>
						{getFieldDecorator('serverLevel', {
							initialValue: item.serverLevel,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="使用状态" key="status" hasFeedback {...formItemLayout}>
						{getFieldDecorator('status', {
							initialValue: item.status,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="存储管理员" key="storeManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('storeManager', {
							initialValue: item.storeManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="存储管理员工号" key="storeManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('storeManagerID', {
							initialValue: item.storeManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统编码" key="systemCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemCode', {
							initialValue: item.systemCode,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统等级" key="systemLevel" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemLevel', {
							initialValue: item.systemLevel,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="测试系统管理员" key="systemManager" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManager', {
							initialValue: item.systemManager,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统管理员A" key="systemManagerA" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManagerA', {
							initialValue: item.systemManagerA,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统管理员A工号" key="systemManagerAID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManagerAID', {
							initialValue: item.systemManagerAID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统管理员B" key="systemManagerB" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManagerB', {
							initialValue: item.systemManagerB,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统管理员B工号" key="systemManagerBID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManagerBID', {
							initialValue: item.systemManagerBID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统管理员工号" key="systemManagerID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemManagerID', {
							initialValue: item.systemManagerID,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统名称" key="systemName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('systemName', {
							initialValue: item.systemName,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="功能表转化系数" key="transferCoefficient" hasFeedback {...formItemLayout}>
						{getFieldDecorator('transferCoefficient', {
							initialValue: item.transferCoefficient,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="同步人" key="ext1" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ext1', {
							initialValue: item.ext1,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="创建人" key="createdBy" hasFeedback {...formItemLayout}>
						{getFieldDecorator('createdBy', {
							initialValue: item.createdBy,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="创建时间" key="createdTime" hasFeedback {...formItemLayout}>
						{getFieldDecorator('createdTime', {
							initialValue: item.createdTime1,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="更新人" key="updatedBy" hasFeedback {...formItemLayout}>
						{getFieldDecorator('updatedBy', {
							initialValue: item.updatedBy,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="更新时间" key="updatedTime" hasFeedback {...formItemLayout}>
						{getFieldDecorator('updatedTime', {
							initialValue: item.updatedTime1,
							rules: [
								{ required: false },
							],
						})(<Input />)}
					</FormItem>
				</span>
			</Form>
		</Modal>
	)
}

export default Form.create()(modal)
