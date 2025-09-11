import React from 'react'
import { Form, Modal, Alert, Tabs, Icon, Switch, Row, Col, Tree, Spin } from 'antd'
import MoFilter from './moFilter/MoFilter'
import ConditionAdvancedMode from './ConditionFilter/ConditionAdvancedMode' //专家模式
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const TreeNode = Tree.TreeNode
const formItemLayout1 = {
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
	form,
	modalState,
	moAddFilterValue, //监控对象新增过滤功能开关
	moDeleteFilterValue, //监控对象删除过滤功能开关
	moUpdateFilterValue, //监控对象修改过滤功能开关
	moReadFilterValue, //监控对象查看过滤功能开关

	toolAddFilterValue, //监控工具
	toolDeleteFilterValue,
	toolUpdateFilterValue,
	toolReadFilterValue,

	tagAddFilterValue, //监控工具
	tagDeleteFilterValue,
	tagUpdateFilterValue,
	tagReadFilterValue,

	ptAddFilterValue, //策略模板
	ptDeleteFilterValue,
	ptUpdateFilterValue,
	ptReadFilterValue,

	priAddFilterValue, //策略规则
	prDeleteFilterValue,
	prUpdateFilterValue,
	prReadFilterValue,
	prIssuFilterValue,
	prCalculationFilterValue,

	riAddFilterValue, //监控实例
	riDeleteFilterValue,
	riUpdateFilterValue,
	riReadFilterValue,

	siAddFilterValue, //指标管理
	siDeleteFilterValue,
	siUpdateFilterValue,
	siReadFilterValue,

	ziAddFilterValue, //指标实现
	ziDeleteFilterValue,
	ziUpdateFilterValue,
	ziReadFilterValue,

	tpAddFilterValue, //周期管理
	tpDeleteFilterValue,
	tpUpdateFilterValue,
	tpReadFilterValue,

	notfAddFilterValue, //通知管理
	notfDeleteFilterValue,
	notfUpdateFilterValue,
	notfReadFilterValue,

	oelReadFilterValue, //oel
	oelConfirmFilterValue,
	oelCloseFilterValue,

	luAddFilterValue, //lookup表维护
	luDeleteFilterValue,
	luUpdateFilterValue,
	luReadFilterValue,
	mvReadFilterValue, //服务台
	cvReadFilterValue, //总行监控视图
	bvReadFilterValue, //分行监控视图
	hvReadFilterValue, //历史告警视图
	uiAddFilterValue, //用户
	uiDeleteFilterValue,
	uiUpdateFilterValue,
	uiReadFilterValue,
	rolesAddFilterValue, //角色
	rolesDeleteFilterValue,
	rolesUpdateFilterValue,
	rolesReadFilterValue,
	mtAddFilterValue, //维护期模板
	mtDeleteFilterValue,
	mtUpdateFilterValue,
	mtReadFilterValue,
	mrAddFilterValue, //维护期实例
	mrDeleteFilterValue,
	mrUpdateFilterValue,
	mrReadFilterValue,
	advAddFilterValue,
	advUpdateFilterValue,
	mtdisableFilterValue,
	fcAddFilterValue, //报表配置
	fcDeleteFilterValue,
	fcUpdateFilterValue,
	fcReadFilterValue,
	pfReadFilterValue, //性能
	readJobsFilterValue,//任务管理
	updateJobsFilterValue,
	delJobsFilterValue,
	addJobsFilterValue,
	myCreateFilterValue,//我的维护期
	myShortFilterValue,
	myPreFilterValue,
	myCheckFilterValue,
	authorization,
	moAddState,
	moDeleteState,
	moUpdateState,
	moReadState,
	tagAddState,
	tagDeleteState,
	tagUpdateState,
	tagReadState,
	toolAddState,
	toolDeleteState,
	toolUpdateState,
	toolReadState,
	ptAddState,
	ptDeleteState,
	ptUpdateState,
	ptReadState,
	priAddState,
	prDeleteState,
	prUpdateState,
	prReadState,
	prIssuState,
	prCalculationState,
	riAddState,
	riDeleteState,
	riUpdateState,
	riReadState,
	siAddState,
	siDeleteState,
	siUpdateState,
	siReadState,
	ziAddState,
	ziDeleteState,
	ziUpdateState,
	ziReadState,
	tpAddState,
	tpDeleteState,
	tpUpdateState,
	tpReadState,
	notfAddState,
	notfDeleteState,
	notfUpdateState,
	notfReadState,
	oelReadState,
	oelConfirmState,
	uiAddState,
	uiDeleteState,
	uiUpdateState,
	uiReadState,
	rolesAddState,
	rolesDeleteState,
	rolesUpdateState,
	rolesReadState,
	mtAddState,
	mtDeleteState,
	mtUpdateState,
	mtReadState,
	mtdisableState,
	mrAddState,
	mrDeleteState,
	mrUpdateState,
	mrReadState,
	advAddState,
	advUpdateState,
	efAddState, //过滤器
	efDeleteState,
	efUpdateState,
	efReadState,
	ostsAddState, //数据源配置
	ostsDeleteState,
	ostsUpdateState,
	ostsReadState,
	etAddState, //工具列表
	etDeleteState,
	etUpdateState,
	etReadState,
	evAddState, //视图配置
	evDeleteState,
	evUpdateState,
	evReadState,
	jobAddState,//任务管理
	jobDeleteState,
	jobUpdateState,
	jobReadState,
	//我的维护期
	myShortState,
	myPreState,
	myCheckState,
	permissionsTree,
	selectedKeys,
	allPermission,
	menus,
	conditionAdv,
	conditionNotf,
	userInfoList,
	colors,
	//服务注册
	registerAddState,
	registerDeleteState,
	registerUpdateState,
	registerReadState,
	addRegisterFilterValue,
	delRegisterFilterValue,
	updateRegisterFilterValue,
	readRegisterFilterValue,
	//个性化策略
	personalAddState,
	personalDeleteState,
	personalUpdateState,
	personalReadState,
	addPersonalFilterValue,
	delPersonalFilterValue,
	updatePersonalFilterValue,
	readPersonalFilterValue,
}) => {
	const {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
		setFieldsValue,
	} = form

	const permissionsTrees = tree => tree.map((item) => {
		if (item.children) {
			return <TreeNode title={item.title} key={item.key}>{permissionsTrees(item.children)}</TreeNode>
		}
		return <TreeNode title={item.title} key={item.key} />
	})
	let TreeDates = []
	if (permissionsTree && permissionsTree.length > 0) {
		TreeDates = permissionsTrees(permissionsTree)
	}

	const onCheck = (checkedKeys, info) => {
		//当单选树形菜单的子菜单时，父节点不会被选中，所以需要把父节点id加入到checkedkeys中来
		checkedKeys = checkedKeys.concat(info.halfCheckedKeys)
		dispatch({
			type: 'roles/updateState',
			payload: {
				allPermission: checkedKeys,
			},
		})
	}

	const onOk = () => {
		const data = { ...getFieldsValue() }
		let permissions = []
		//oel过滤器
		let oelefAdd = {
			action: 'create',
			has: data.efAddState,
			permissionFilter: {},
			resource: '/api/v1/ef',
		}
		let oelefDel = {
			action: 'delete',
			has: data.efDeleteState,
			permissionFilter: {},
			resource: '/api/v1/ef',
		}
		let oelefUpdate = {
			action: 'update',
			has: data.efUpdateState,
			permissionFilter: {},
			resource: '/api/v1/ef',
		}
		let oelefRead = {
			action: 'read',
			has: data.efReadState,
			permissionFilter: {},
			resource: '/api/v1/ef',
		}
		let efPerms = {}
		efPerms.resource = '/api/v1/ef'
		efPerms.permissions = []
		efPerms.permissions.push(oelefAdd)
		efPerms.permissions.push(oelefDel)
		efPerms.permissions.push(oelefUpdate)
		efPerms.permissions.push(oelefRead)
		permissions.push(efPerms)
		//oel数据源配置
		let oelostsAdd = {
			action: 'create',
			has: data.ostsAddState,
			permissionFilter: {},
			resource: '/api/v1/osts',
		}
		let oelostsDel = {
			action: 'delete',
			has: data.ostsDeleteState,
			permissionFilter: {},
			resource: '/api/v1/osts',
		}
		let oelostsUpdate = {
			action: 'update',
			has: data.ostsUpdateState,
			permissionFilter: {},
			resource: '/api/v1/osts',
		}
		let oelostsRead = {
			action: 'read',
			has: data.ostsReadState,
			permissionFilter: {},
			resource: '/api/v1/osts',
		}
		let ostsPerms = {}
		ostsPerms.resource = '/api/v1/osts'
		ostsPerms.permissions = []
		ostsPerms.permissions.push(oelostsAdd)
		ostsPerms.permissions.push(oelostsDel)
		ostsPerms.permissions.push(oelostsUpdate)
		ostsPerms.permissions.push(oelostsRead)
		permissions.push(ostsPerms)
		//oel工具列表
		let oeletAdd = {
			action: 'create',
			has: data.etAddState,
			permissionFilter: {},
			resource: '/api/v1/et',
		}
		let oeletDel = {
			action: 'delete',
			has: data.etDeleteState,
			permissionFilter: {},
			resource: '/api/v1/et',
		}
		let oeletUpdate = {
			action: 'update',
			has: data.etUpdateState,
			permissionFilter: {},
			resource: '/api/v1/et',
		}
		let oeletRead = {
			action: 'read',
			has: data.etReadState,
			permissionFilter: {},
			resource: '/api/v1/et',
		}
		let etPerms = {}
		etPerms.resource = '/api/v1/et'
		etPerms.permissions = []
		etPerms.permissions.push(oeletAdd)
		etPerms.permissions.push(oeletDel)
		etPerms.permissions.push(oeletUpdate)
		etPerms.permissions.push(oeletRead)
		permissions.push(etPerms)
		//视图配置
		let oelevAdd = {
			action: 'create',
			has: data.evAddState,
			permissionFilter: {},
			resource: '/api/v1/ev',
		}
		let oelevDel = {
			action: 'delete',
			has: data.evDeleteState,
			permissionFilter: {},
			resource: '/api/v1/ev',
		}
		let oelevUpdate = {
			action: 'update',
			has: data.evUpdateState,
			permissionFilter: {},
			resource: '/api/v1/ev',
		}
		let oelevRead = {
			action: 'read',
			has: data.evReadState,
			permissionFilter: {},
			resource: '/api/v1/ev',
		}

		let evPerms = {}
		evPerms.resource = '/api/v1/ev'
		evPerms.permissions = []
		evPerms.permissions.push(oelevAdd)
		evPerms.permissions.push(oelevDel)
		evPerms.permissions.push(oelevUpdate)
		evPerms.permissions.push(oelevRead)
		permissions.push(evPerms)

		let alarmApplyFilter = []
		let advFilter = advInfo(conditionAdv, '/api/v1/mts', 'ADV')
		if ((advFilter.filterItems === undefined || advFilter.filterItems.length === 0) && advFilter.filterItems !== undefined) {
			let infos = []
			if (conditionAdv.filterItems !== undefined) {
				if (conditionAdv.filterItems.length === 1) {
					if (conditionAdv.filterItems[0].field === '' && conditionAdv.filterItems[0].leftBrackets === '' && conditionAdv.filterItems[0].logicOp === '' && conditionAdv.filterItems[0].op === '' && conditionAdv.filterItems[0].rightBrackets === '' && conditionAdv.filterItems[0].value === '') {
						conditionAdv.filterItems = []
					}
				} else if (conditionAdv.filterItems.length > 1) {
					for (let info of conditionAdv.filterItems) {
						if (info.field === '' && info.leftBrackets === '' && info.logicOp === '' && info.op === '' && info.rightBrackets === '' && info.value === '') {
							infos.push(info)
						}
					}
					conditionAdv.filterItems = infos
				}
			}
			advFilter = {
				filterItems: conditionAdv.filterItems === undefined ? [] : conditionAdv.filterItems,
				filterMode: conditionAdv.filterMode,
				resource: '/api/v1/mts',
			}
		}
		alarmApplyFilter.push(advFilter)
		let notfFilter = advInfo(conditionNotf, '/api/v1/notification_rules', 'NOTF')
		if ((notfFilter.filterItems === undefined || notfFilter.filterItems.length === 0) && conditionNotf.filterItems !== undefined) {
			let infos = []
			if (conditionAdv.filterItems !== undefined) {
				if (conditionNotf.filterItems.length === 1) {
					if (conditionNotf.filterItems[0].field === '' && conditionNotf.filterItems[0].leftBrackets === '' && conditionNotf.filterItems[0].logicOp === '' && conditionNotf.filterItems[0].op === '' && conditionNotf.filterItems[0].rightBrackets === '' && conditionNotf.filterItems[0].value === '') {
						conditionNotf.filterItems = []
					}
				} else if (conditionNotf.filterItems.length > 1) {
					for (let info of conditionNotf.filterItems) {
						if (info.field === '' && info.leftBrackets === '' && info.logicOp === '' && info.op === '' && info.rightBrackets === '' && info.value === '') {
							infos.push(info)
						}
					}
					conditionNotf.filterItems = infos
				}
			}
			notfFilter = {
				filterItems: conditionNotf.filterItems === undefined ? [] : conditionNotf.filterItems,
				filterMode: conditionNotf.filterMode,
				resource: '/api/v1/notification_rules',
			}
		}
		alarmApplyFilter.push(notfFilter)
		let uiPermissions = []
		allPermission.forEach((itemcheck, index) => {
			menus.forEach((menu, index) => {
				if (menu.id === parseInt(itemcheck)) {
					uiPermissions.push(menu)
				}
			})
		})
		//oel配置授权

		//mo的新增filterValue, type, state, filterType, resource
		let moAddInfo = valueInfo(moAddFilterValue, 'MOAdd', '/api/v1/mos', 'create', 'moAdd')
		if (moAddInfo.action === undefined) {
			moAddInfo = filterInfo(moAddFilterValue, 'create', data.moAdd, 'BASIC', '/api/v1/mos')
		}
		//mo的删除
		let moDeleteInfo = valueInfo(moDeleteFilterValue, 'MODelete', '/api/v1/mos', 'delete', 'moDelete')
		if (moDeleteInfo.action === undefined) {
			moDeleteInfo = filterInfo(moDeleteFilterValue, 'delete', data.moDelete, 'BASIC', '/api/v1/mos')
		}
		//mo的修改
		let moUpdateInfo = valueInfo(moUpdateFilterValue, 'MOUpdate', '/api/v1/mos', 'update', 'moUpdate')
		if (moUpdateInfo.action === undefined) {
			moUpdateInfo = filterInfo(moUpdateFilterValue, 'update', data.moUpdate, 'BASIC', '/api/v1/mos')
		}
		//mo的查看
		let moReadInfo = valueInfo(moReadFilterValue, 'MORead', '/api/v1/mos', 'read', 'moRead')
		if (moReadInfo.action === undefined) {
			moReadInfo = filterInfo(moReadFilterValue, 'read', data.moRead, 'BASIC', '/api/v1/mos')
		}
		let moPerms = {}
		moPerms.resource = '/api/v1/mos'
		moPerms.permissions = []
		moPerms.permissions.push(moAddInfo)
		moPerms.permissions.push(moDeleteInfo)
		moPerms.permissions.push(moUpdateInfo)
		moPerms.permissions.push(moReadInfo)
		permissions.push(moPerms)
		//标签管理
		//增加
		let tagAddInfo = valueInfo(tagAddFilterValue, 'tagAdd', '/api/v1/tags', 'create', 'tagAdd')
		if (tagAddInfo.action === undefined) {
			tagAddInfo = filterInfo(tagAddFilterValue, 'create', data.tagAdd, 'BASIC', '/api/v1/tags')
		}
		//删除
		let tagDeleteInfo = valueInfo(tagDeleteFilterValue, 'tagDelete', '/api/v1/tags', 'delete', 'tagDelete')
		if (tagDeleteInfo.action === undefined) {
			tagDeleteInfo = filterInfo(tagDeleteFilterValue, 'delete', data.tagDelete, 'BASIC', '/api/v1/tags')
		}
		//修改
		let tagUpdateInfo = valueInfo(tagUpdateFilterValue, 'tagUpdate', '/api/v1/tags', 'update', 'tagUpdate')
		if (tagUpdateInfo.action === undefined) {
			tagUpdateInfo = filterInfo(tagUpdateFilterValue, 'update', data.tagUpdate, 'BASIC', '/api/v1/tags')
		}
		//查看
		let tagReadInfo = valueInfo(tagReadFilterValue, 'tagRead', '/api/v1/tags', 'read', 'tagRead')
		if (tagReadInfo.action === undefined) {
			tagReadInfo = filterInfo(tagReadFilterValue, 'read', data.tagRead, 'BASIC', '/api/v1/tags')
		}
		let tagPerms = {}
		tagPerms.resource = '/api/v1/tags'
		tagPerms.permissions = []
		tagPerms.permissions.push(tagAddInfo)
		tagPerms.permissions.push(tagDeleteInfo)
		tagPerms.permissions.push(tagUpdateInfo)
		tagPerms.permissions.push(tagReadInfo)
		permissions.push(tagPerms)

		//任务管理 moAddFilterValue为过滤器的内容由数据模板生成  addJobs是moAddFilterValue中的type由他来确定文本框类型 jobAdd是表单中功能授权开关的表单提取key
		let jobAddInfo = valueInfo(addJobsFilterValue, 'addJobs', '/api/v1/jobs', 'create', 'jobAdd')
		if (jobAddInfo.action === undefined) {
			jobAddInfo = filterInfo(addJobsFilterValue, 'create', data.jobAdd, 'BASIC', '/api/v1/jobs')
		}
		//任务的删除
		let jobDeleteInfo = valueInfo(delJobsFilterValue, 'delJobs', '/api/v1/jobs', 'delete', 'jobDelete')
		if (jobDeleteInfo.action === undefined) {
			jobDeleteInfo = filterInfo(delJobsFilterValue, 'delete', data.jobDelete, 'BASIC', '/api/v1/jobs')
		}
		//任务的修改
		let jobUpdateInfo = valueInfo(updateJobsFilterValue, 'updateJobs', '/api/v1/jobs', 'update', 'jobUpdate')
		if (jobUpdateInfo.action === undefined) {
			jobUpdateInfo = filterInfo(updateJobsFilterValue, 'update', data.jobUpdate, 'BASIC', '/api/v1/jobs')
		}
		//任务的查看
		let jobReadInfo = valueInfo(readJobsFilterValue, 'readJobs', '/api/v1/jobs', 'read', 'jobRead')
		if (jobReadInfo.action === undefined) {
			jobReadInfo = filterInfo(readJobsFilterValue, 'read', data.jobRead, 'BASIC', '/api/v1/jobs')
		}
		let jobPerms = {}
		jobPerms.resource = '/api/v1/jobs'
		jobPerms.permissions = []
		jobPerms.permissions.push(jobAddInfo)
		jobPerms.permissions.push(jobDeleteInfo)
		jobPerms.permissions.push(jobUpdateInfo)
		jobPerms.permissions.push(jobReadInfo)
		permissions.push(jobPerms)
		//监控工具
		//增加
		let toolAddInfo = valueInfo(toolAddFilterValue, 'toolAdd', '/api/v1/tools', 'create', 'toolAdd')
		if (toolAddInfo.action === undefined) {
			toolAddInfo = filterInfo(toolAddFilterValue, 'create', data.toolAdd, 'BASIC', '/api/v1/tools')
		}
		//删除
		let toolDeleteInfo = valueInfo(toolDeleteFilterValue, 'toolDelete', '/api/v1/tools', 'delete', 'toolDelete')
		if (toolDeleteInfo.action === undefined) {
			toolDeleteInfo = filterInfo(toolDeleteFilterValue, 'delete', data.toolDelete, 'BASIC', '/api/v1/tools')
		}
		//修改
		let toolUpdateInfo = valueInfo(toolUpdateFilterValue, 'toolUpdate', '/api/v1/tools', 'update', 'toolUpdate')
		if (toolUpdateInfo.action === undefined) {
			toolUpdateInfo = filterInfo(toolUpdateFilterValue, 'update', data.toolUpdate, 'BASIC', '/api/v1/tools')
		}
		//查看
		let toolReadInfo = valueInfo(toolReadFilterValue, 'toolRead', '/api/v1/tools', 'read', 'toolRead')
		if (toolReadInfo.action === undefined) {
			toolReadInfo = filterInfo(toolReadFilterValue, 'read', data.toolRead, 'BASIC', '/api/v1/tools')
		}
		let toolPerms = {}
		toolPerms.resource = '/api/v1/tools'
		toolPerms.permissions = []
		toolPerms.permissions.push(toolAddInfo)
		toolPerms.permissions.push(toolDeleteInfo)
		toolPerms.permissions.push(toolUpdateInfo)
		toolPerms.permissions.push(toolReadInfo)
		permissions.push(toolPerms)
		//策略模板
		//新增
		let ptAddInfo = valueInfo(ptAddFilterValue, 'ptAdd', '/api/v1/policy-templates', 'create', 'ptAdd')
		if (ptAddInfo.action === undefined) {
			ptAddInfo = filterInfo(ptAddFilterValue, 'create', data.ptAdd, 'BASIC', '/api/v1/policy-templates')
		}
		//删除
		let ptDeleteInfo = valueInfo(ptDeleteFilterValue, 'ptDelete', '/api/v1/policy-templates', 'delete', 'ptDelete')
		if (ptDeleteInfo.action === undefined) {
			ptDeleteInfo = filterInfo(ptDeleteFilterValue, 'delete', data.ptDelete, 'BASIC', '/api/v1/policy-templates')
		}
		//修改
		let ptUpdateInfo = valueInfo(ptUpdateFilterValue, 'ptUpdate', '/api/v1/policy-templates', 'update', 'ptUpdate')
		if (ptUpdateInfo.action === undefined) {
			ptUpdateInfo = filterInfo(ptUpdateFilterValue, 'update', data.ptUpdate, 'BASIC', '/api/v1/policy-templates')
		}
		//查询
		let ptReadInfo = valueInfo(ptReadFilterValue, 'ptRead', '/api/v1/policy-templates', 'read', 'ptRead')
		if (ptReadInfo.action === undefined) {
			ptReadInfo = filterInfo(ptReadFilterValue, 'read', data.ptRead, 'BASIC', '/api/v1/policy-templates')
		}
		let ptPerms = {}
		ptPerms.resource = '/api/v1/policy-templates'
		ptPerms.permissions = []
		ptPerms.permissions.push(ptAddInfo)
		ptPerms.permissions.push(ptDeleteInfo)
		ptPerms.permissions.push(ptUpdateInfo)
		ptPerms.permissions.push(ptReadInfo)
		permissions.push(ptPerms)
		//策略规则
		//新增
		let prAddInfo = valueInfo(priAddFilterValue, 'prAdd', '/api/v1/monitor-rules', 'create', 'prAdd')
		if (prAddInfo.action === undefined) {
			prAddInfo = filterInfo(priAddFilterValue, 'create', data.prAdd, 'BASIC', '/api/v1/monitor-rules')
		}
		//删除
		let prDeleteInfo = valueInfo(prDeleteFilterValue, 'prDelete', '/api/v1/monitor-rules', 'delete', 'prDelete')
		if (prDeleteInfo.action === undefined) {
			prDeleteInfo = filterInfo(prDeleteFilterValue, 'delete', data.prDelete, 'BASIC', '/api/v1/monitor-rules')
		}
		//修改
		let prUpdateInfo = valueInfo(prUpdateFilterValue, 'prUpdate', '/api/v1/monitor-rules', 'update', 'prUpdate')
		if (prUpdateInfo.action === undefined) {
			prUpdateInfo = filterInfo(prUpdateFilterValue, 'update', data.prUpdate, 'BASIC', '/api/v1/monitor-rules')
		}
		//查看
		let prReadInfo = valueInfo(prReadFilterValue, 'prRead', '/api/v1/monitor-rules', 'read', 'prRead')
		if (prReadInfo.action === undefined) {
			prReadInfo = filterInfo(prReadFilterValue, 'read', data.prRead, 'BASIC', '/api/v1/monitor-rules')
		}
		//下发
		let prIssuInfo = valueInfo(prIssuFilterValue, 'prIssu', '/api/v1/monitor-rules', 'issue', 'prIssu')
		if (prIssuInfo.action === undefined) {
			prIssuInfo = filterInfo(prIssuFilterValue, 'issue', data.prIssu, 'BASIC', '/api/v1/monitor-rules')
		}
		//计算
		let prCalculationInfo = valueInfo(prCalculationFilterValue, 'prCalculation', '/api/v1/monitor-rules', 'calc', 'prCalculation')
		if (prCalculationInfo.action === undefined) {
			prCalculationInfo = filterInfo(prCalculationFilterValue, 'calc', data.prCalculation, 'BASIC', '/api/v1/monitor-rules')
		}
		let prPerms = {}
		prPerms.resource = '/api/v1/monitor-rules'
		prPerms.permissions = []
		prPerms.permissions.push(prAddInfo)
		prPerms.permissions.push(prDeleteInfo)
		prPerms.permissions.push(prUpdateInfo)
		prPerms.permissions.push(prReadInfo)
		prPerms.permissions.push(prIssuInfo)
		prPerms.permissions.push(prCalculationInfo)
		permissions.push(prPerms)
		//监控实例
		//新增
		let riAddInfo = valueInfo(riAddFilterValue, 'riAdd', '/api/v1/rule-instances', 'create', 'riAdd')
		if (riAddInfo.action === undefined) {
			riAddInfo = filterInfo(riAddFilterValue, 'create', data.riAdd, 'BASIC', '/api/v1/rule-instances')
		}
		//删除
		let riDeleteInfo = valueInfo(riDeleteFilterValue, 'riDelete', '/api/v1/rule-instances', 'delete', 'riDelete')
		if (riDeleteInfo.action === undefined) {
			riDeleteInfo = filterInfo(riDeleteFilterValue, 'delete', data.riDelete, 'BASIC', '/api/v1/rule-instances')
		}
		//修改
		let riUpdateInfo = valueInfo(riUpdateFilterValue, 'riUpdate', '/api/v1/rule-instances', 'update', 'riUpdate')
		if (riUpdateInfo.action === undefined) {
			riUpdateInfo = filterInfo(riUpdateFilterValue, 'update', data.riUpdate, 'BASIC', '/api/v1/rule-instances')
		}
		//查询
		let riReadInfo = valueInfo(riReadFilterValue, 'riRead', '/api/v1/rule-instances', 'read', 'riRead')
		if (riReadInfo.action === undefined) {
			riReadInfo = filterInfo(riReadFilterValue, 'read', data.riRead, 'BASIC', '/api/v1/rule-instances')
		}
		let riPerms = {}
		riPerms.resource = '/api/v1/rule-instances'
		riPerms.permissions = []
		riPerms.permissions.push(riAddInfo)
		riPerms.permissions.push(riDeleteInfo)
		riPerms.permissions.push(riUpdateInfo)
		riPerms.permissions.push(riReadInfo)
		permissions.push(riPerms)
		//指标管理
		//新增
		let siAddInfo = valueInfo(siAddFilterValue, 'siAdd', '/api/v1/std-indicators', 'create', 'siAdd')
		if (siAddInfo.action === undefined) {
			siAddInfo = filterInfo(siAddFilterValue, 'create', data.siAdd, 'BASIC', '/api/v1/std-indicators')
		}
		//删除
		let siDeleteInfo = valueInfo(siDeleteFilterValue, 'siDelete', '/api/v1/std-indicators', 'delete', 'siDelete')
		if (siDeleteInfo.action === undefined) {
			siDeleteInfo = filterInfo(siDeleteFilterValue, 'delete', data.siDelete, 'BASIC', '/api/v1/std-indicators')
		}
		//修改
		let siUpdateInfo = valueInfo(siUpdateFilterValue, 'siUpdate', '/api/v1/std-indicators', 'update', 'riUpdate')
		if (siUpdateInfo.action === undefined) {
			siUpdateInfo = filterInfo(siUpdateFilterValue, 'update', data.siUpdate, 'BASIC', '/api/v1/std-indicators')
		}
		//查询
		let siReadInfo = valueInfo(siReadFilterValue, 'siRead', '/api/v1/std-indicators', 'read', 'siRead')
		if (siReadInfo.action === undefined) {
			siReadInfo = filterInfo(siReadFilterValue, 'read', data.siRead, 'BASIC', '/api/v1/std-indicators')
		}
		let siPerms = {}
		siPerms.resource = '/api/v1/std-indicators'
		siPerms.permissions = []
		siPerms.permissions.push(siAddInfo)
		siPerms.permissions.push(siDeleteInfo)
		siPerms.permissions.push(siUpdateInfo)
		siPerms.permissions.push(siReadInfo)
		permissions.push(siPerms)
		//指标实现
		//新增
		let ziAddInfo = valueInfo(ziAddFilterValue, 'ziAdd', '/api/v1/zabbix-items', 'create', 'ziAdd')
		if (ziAddInfo.action === undefined) {
			ziAddInfo = filterInfo(ziAddFilterValue, 'create', data.ziAdd, 'BASIC', '/api/v1/zabbix-items')
		}
		//删除
		let ziDeleteInfo = valueInfo(ziDeleteFilterValue, 'ziDelete', '/api/v1/zabbix-items', 'delete', 'ziDelete')
		if (ziDeleteInfo.action === undefined) {
			ziDeleteInfo = filterInfo(ziDeleteFilterValue, 'delete', data.ziDelete, 'BASIC', '/api/v1/zabbix-items')
		}
		//修改
		let ziUpdateInfo = valueInfo(ziUpdateFilterValue, 'ziUpdate', '/api/v1/zabbix-items', 'update', 'ziUpdate')
		if (ziUpdateInfo.action === undefined) {
			ziUpdateInfo = filterInfo(ziUpdateFilterValue, 'update', data.ziUpdate, 'BASIC', '/api/v1/zabbix-items')
		}
		//查询
		let ziReadInfo = valueInfo(siReadFilterValue, 'ziRead', '/api/v1/zabbix-items', 'read', 'ziRead')
		if (ziReadInfo.action === undefined) {
			ziReadInfo = filterInfo(siReadFilterValue, 'read', data.ziRead, 'BASIC', '/api/v1/zabbix-items')
		}
		let ziPerms = {}
		ziPerms.resource = '/api/v1/zabbix-items'
		ziPerms.permissions = []
		ziPerms.permissions.push(ziAddInfo)
		ziPerms.permissions.push(ziDeleteInfo)
		ziPerms.permissions.push(ziUpdateInfo)
		ziPerms.permissions.push(ziReadInfo)
		permissions.push(ziPerms)
		//周期管理
		//新增
		let tpAddInfo = valueInfo(tpAddFilterValue, 'tpAdd', '/api/v1/time-periods', 'create', 'tpAdd')
		if (tpAddInfo.action === undefined) {
			tpAddInfo = filterInfo(tpAddFilterValue, 'create', data.tpAdd, 'BASIC', '/api/v1/time-periods')
		}
		//删除
		let tpDeleteInfo = valueInfo(tpDeleteFilterValue, 'tpDelete', '/api/v1/time-periods', 'delete', 'tpDelete')
		if (tpDeleteInfo.action === undefined) {
			tpDeleteInfo = filterInfo(tpDeleteFilterValue, 'delete', data.tpDelete, 'BASIC', '/api/v1/time-periods')
		}
		//修改
		let tpUpdateInfo = valueInfo(tpUpdateFilterValue, 'tpUpdate', '/api/v1/time-periods', 'update', 'tpUpdate')
		if (tpUpdateInfo.action === undefined) {
			tpUpdateInfo = filterInfo(tpUpdateFilterValue, 'update', data.tpUpdate, 'BASIC', '/api/v1/time-periods')
		}
		//查询
		let tpReadInfo = valueInfo(tpReadFilterValue, 'tpRead', '/api/v1/time-periods', 'read', 'tpRead')
		if (tpReadInfo.action === undefined) {
			tpReadInfo = filterInfo(tpReadFilterValue, 'read', data.tpRead, 'BASIC', '/api/v1/time-periods')
		}
		let tpPerms = {}
		tpPerms.resource = '/api/v1/time-periods'
		tpPerms.permissions = []
		tpPerms.permissions.push(tpAddInfo)
		tpPerms.permissions.push(tpDeleteInfo)
		tpPerms.permissions.push(tpUpdateInfo)
		tpPerms.permissions.push(tpReadInfo)
		permissions.push(tpPerms)
		//通知管理
		//新增
		let notfAddInfo = valueInfo(notfAddFilterValue, 'notfAdd', '/api/v1/notification_rules', 'create', 'notfAdd')
		if (notfAddInfo.action === undefined) {
			notfAddInfo = filterInfo(notfAddFilterValue, 'create', data.notfAdd, 'BASIC', '/api/v1/notification_rules')
		}
		//删除
		let notfDeleteInfo = valueInfo(notfDeleteFilterValue, 'notfDelete', '/api/v1/notification_rules', 'delete', 'notfDelete')
		if (notfDeleteInfo.action === undefined) {
			notfDeleteInfo = filterInfo(notfDeleteFilterValue, 'delete', data.notfDelete, 'BASIC', '/api/v1/notification_rules')
		}
		//修改
		let notfUpdateInfo = valueInfo(notfUpdateFilterValue, 'notfUpdate', '/api/v1/notification_rules', 'update', 'notfUpdate')
		if (notfUpdateInfo.action === undefined) {
			notfUpdateInfo = filterInfo(notfUpdateFilterValue, 'update', data.notfUpdate, 'BASIC', '/api/v1/notification_rules')
		}
		//查询
		let notfReadInfo = valueInfo(notfReadFilterValue, 'notfRead', '/api/v1/notification_rules', 'read', 'notfRead')
		if (notfReadInfo.action === undefined) {
			notfReadInfo = filterInfo(notfReadFilterValue, 'read', data.notfRead, 'BASIC', '/api/v1/notification_rules')
		}
		let notfPerms = {}
		notfPerms.resource = '/api/v1/notification_rules'
		notfPerms.permissions = []
		notfPerms.permissions.push(notfAddInfo)
		notfPerms.permissions.push(notfDeleteInfo)
		notfPerms.permissions.push(notfUpdateInfo)
		notfPerms.permissions.push(notfReadInfo)
		permissions.push(notfPerms)
		//告警列表
		//查看
		let oelReadInfo = valueInfo(oelReadFilterValue, 'oelRead', '/api/v1/alarms', 'read', 'oelRead')
		if (oelReadInfo.action === undefined) {
			oelReadInfo = filterInfo(oelReadFilterValue, 'read', data.oelRead, 'BASIC', '/api/v1/alarms')
		}
		//右键菜单权限oelConfirm
		let oelConfirmInfo = valueInfo(oelConfirmFilterValue, 'oelConfirm', '/api/v1/alarms', 'update', 'oelConfirm')
		if (oelConfirmInfo.action === undefined) {
			oelConfirmInfo = filterInfo(oelConfirmFilterValue, 'update', data.oelConfirm, 'BASIC', '/api/v1/alarms')
		}
		let oelPerms = {}
		oelPerms.resource = '/api/v1/alarms'
		oelPerms.permissions = []
		oelPerms.permissions.push(oelReadInfo)
		oelPerms.permissions.push(oelConfirmInfo)
		permissions.push(oelPerms)
		//用户信息
		//新增
		let uiAddInfo = valueInfo(uiAddFilterValue, 'uiAdd', '/api/v1/users', 'create', 'uiAdd')
		if (uiAddInfo.action === undefined) {
			uiAddInfo = filterInfo(uiAddFilterValue, 'create', data.uiAdd, 'BASIC', '/api/v1/users')
		}
		//删除
		let uiDeleteInfo = valueInfo(uiDeleteFilterValue, 'uiDelete', '/api/v1/users', 'delete', 'uiDelete')
		if (uiDeleteInfo.action === undefined) {
			uiDeleteInfo = filterInfo(uiDeleteFilterValue, 'delete', data.uiDelete, 'BASIC', '/api/v1/users')
		}
		//修改
		let uiUpdateInfo = valueInfo(uiUpdateFilterValue, 'uiUpdate', '/api/v1/users', 'update', 'uiUpdate')
		if (uiUpdateInfo.action === undefined) {
			uiUpdateInfo = filterInfo(uiUpdateFilterValue, 'update', data.uiUpdate, 'BASIC', '/api/v1/users')
		}
		//查询
		let uiReadInfo = valueInfo(uiReadFilterValue, 'uiRead', '/api/v1/users', 'read', 'uiRead')
		if (uiReadInfo.action === undefined) {
			uiReadInfo = filterInfo(uiReadFilterValue, 'read', data.uiRead, 'BASIC', '/api/v1/users')
		}
		let uiPerms = {}
		uiPerms.resource = '/api/v1/users'
		uiPerms.permissions = []
		uiPerms.permissions.push(uiAddInfo)
		uiPerms.permissions.push(uiDeleteInfo)
		uiPerms.permissions.push(uiUpdateInfo)
		uiPerms.permissions.push(uiReadInfo)
		permissions.push(uiPerms)
		//角色信息
		//新增
		let rolesAddInfo = valueInfo(rolesAddFilterValue, 'rolesAdd', '/api/v1/roles', 'create', 'rolesAdd')
		if (rolesAddInfo.action === undefined) {
			rolesAddInfo = filterInfo(rolesAddFilterValue, 'create', data.rolesAdd, 'BASIC', '/api/v1/roles')
		}
		//删除
		let rolesDeleteInfo = valueInfo(rolesDeleteFilterValue, 'rolesDelete', '/api/v1/roles', 'delete', 'rolesDelete')
		if (rolesDeleteInfo.action === undefined) {
			rolesDeleteInfo = filterInfo(rolesDeleteFilterValue, 'delete', data.rolesDelete, 'BASIC', '/api/v1/roles')
		}
		//修改
		let rolesUpdateInfo = valueInfo(rolesUpdateFilterValue, 'rolesUpdate', '/api/v1/roles', 'update', 'rolesUpdate')
		if (rolesUpdateInfo.action === undefined) {
			rolesUpdateInfo = filterInfo(rolesUpdateFilterValue, 'update', data.rolesUpdate, 'BASIC', '/api/v1/roles')
		}
		//查询
		let rolesReadInfo = valueInfo(rolesReadFilterValue, 'rolesRead', '/api/v1/roles', 'read', 'rolesRead')
		if (rolesReadInfo.action === undefined) {
			rolesReadInfo = filterInfo(rolesReadFilterValue, 'read', data.rolesRead, 'BASIC', '/api/v1/roles')
		}
		let rolesPerms = {}
		rolesPerms.resource = '/api/v1/roles'
		rolesPerms.permissions = []
		rolesPerms.permissions.push(rolesAddInfo)
		rolesPerms.permissions.push(rolesDeleteInfo)
		rolesPerms.permissions.push(rolesUpdateInfo)
		rolesPerms.permissions.push(rolesReadInfo)
		permissions.push(rolesPerms)
		//维护期模板
		//新增
		let mtAddInfo = valueInfo(mtAddFilterValue, 'mtAdd', '/api/v1/mt-templates', 'create', 'mtAdd')
		if (mtAddInfo.action === undefined) {
			mtAddInfo = filterInfo(mtAddFilterValue, 'create', data.mtAdd, 'BASIC', '/api/v1/mt-templates')
		}
		//删除
		let mtDeleteInfo = valueInfo(mtDeleteFilterValue, 'mtDelete', '/api/v1/mt-templates', 'delete', 'mtDelete')
		if (mtDeleteInfo.action === undefined) {
			mtDeleteInfo = filterInfo(mtDeleteFilterValue, 'delete', data.mtDelete, 'BASIC', '/api/v1/mt-templates')
		}
		//修改
		let mtUpdateInfo = valueInfo(mtUpdateFilterValue, 'mtUpdate', '/api/v1/mt-templates', 'update', 'mtUpdate')
		if (mtUpdateInfo.action === undefined) {
			mtUpdateInfo = filterInfo(mtUpdateFilterValue, 'update', data.mtUpdate, 'BASIC', '/api/v1/mt-templates')
		}
		//查询
		let mtReadInfo = valueInfo(mtReadFilterValue, 'mtRead', '/api/v1/mt-templates', 'read', 'mtRead')
		if (mtReadInfo.action === undefined) {
			mtReadInfo = filterInfo(mtReadFilterValue, 'read', data.mtRead, 'BASIC', '/api/v1/mt-templates')
		}
		let mtPerms = {}
		mtPerms.resource = '/api/v1/mt-templates'
		mtPerms.permissions = []
		mtPerms.permissions.push(mtAddInfo)
		mtPerms.permissions.push(mtDeleteInfo)
		mtPerms.permissions.push(mtUpdateInfo)
		mtPerms.permissions.push(mtReadInfo)
		permissions.push(mtPerms)
		//维护期实例
		//新增
		let mrAddInfo = valueInfo(mrAddFilterValue, 'mrAdd', '/api/v1/mts', 'create', 'mrAdd')
		if (mrAddInfo.action === undefined) {
			mrAddInfo = filterInfo(mrAddFilterValue, 'create', data.mrAdd, 'BASIC', '/api/v1/mts')
		}
		//删除
		let mrDeleteInfo = valueInfo(mrDeleteFilterValue, 'mrDelete', '/api/v1/mts', 'delete', 'mrDelete')
		if (mrDeleteInfo.action === undefined) {
			mrDeleteInfo = filterInfo(mrDeleteFilterValue, 'delete', data.mrDelete, 'BASIC', '/api/v1/mts')
		}
		//修改
		let mrUpdateInfo = valueInfo(mrUpdateFilterValue, 'mrUpdate', '/api/v1/mts', 'update', 'mrUpdate')
		if (mrUpdateInfo.action === undefined) {
			mrUpdateInfo = filterInfo(mrUpdateFilterValue, 'update', data.mrUpdate, 'BASIC', '/api/v1/mts')
		}
		//查询
		let mrReadInfo = valueInfo(mrReadFilterValue, 'mrRead', '/api/v1/mts', 'read', 'mrRead')
		if (mrReadInfo.action === undefined) {
			mrReadInfo = filterInfo(mrReadFilterValue, 'read', data.mrRead, 'BASIC', '/api/v1/mts')
		}
		//创建专家模式
		let advAddInfo = valueInfo(advAddFilterValue, 'advAdd', '/api/v1/mts', 'create_expert_mode', 'advAdd')
		if (advAddInfo.action === undefined) {
			advAddInfo = filterInfo(advAddFilterValue, 'create_expert_mode', data.advAdd, 'BASIC', '/api/v1/mts')
		}
		//编辑专家模式
		let advUpdateInfo = valueInfo(advUpdateFilterValue, 'advUpdate', '/api/v1/mts', 'update_expert_mode', 'advUpdate')
		if (advUpdateInfo.action === undefined) {
			advUpdateInfo = filterInfo(advUpdateFilterValue, 'update_expert_mode', data.advUpdate, 'BASIC', '/api/v1/mts')
		}
		//短维护期
		let myShortInfo = valueInfo(myShortFilterValue, 'myShort', '/api/v1/mts', 'create_short_time_mt', 'myShort')
		if (myShortInfo.action === undefined) {
			myShortInfo = filterInfo(myShortFilterValue, 'create_short_time_mt', data.myShort, 'BASIC', '/api/v1/mts')
		}
		//预维护期
		let myPreInfo = valueInfo(myPreFilterValue, 'myPre', '/api/v1/mts', 'pre_creation', 'myPre')
		if (myPreInfo.action === undefined) {
			myPreInfo = filterInfo(myPreFilterValue, 'pre_creation', data.myPre, 'BASIC', '/api/v1/mts')
		}
		//复核权限
		let myCheckInfo = valueInfo(myCheckFilterValue, 'myCheck', '/api/v1/mts', 'review', 'myCheck')
		if (myCheckInfo.action === undefined) {
			myCheckInfo = filterInfo(myCheckFilterValue, 'review', data.myCheck, 'BASIC', '/api/v1/mts')
		}
		//禁用权限
		let mydisabledkInfo = valueInfo(mtdisableFilterValue, 'mtdisable', '/api/v1/mts', 'disable', 'mtdisable')
		if (mydisabledkInfo.action === undefined) {
			mydisabledkInfo = filterInfo(mtdisableFilterValue, 'disable', data.mtdisable, 'BASIC', '/api/v1/mts')
		}
		let mrPerms = {}
		mrPerms.resource = '/api/v1/mts'
		mrPerms.permissions = []
		mrPerms.permissions.push(mrAddInfo)
		mrPerms.permissions.push(mrDeleteInfo)
		mrPerms.permissions.push(mrUpdateInfo)
		mrPerms.permissions.push(mrReadInfo)
		mrPerms.permissions.push(advAddInfo)
		mrPerms.permissions.push(advUpdateInfo)
		mrPerms.permissions.push(myShortInfo)
		mrPerms.permissions.push(myPreInfo)
		mrPerms.permissions.push(myCheckInfo)
		mrPerms.permissions.push(mydisabledkInfo)
		permissions.push(mrPerms)
		//服务注册
		//增加
		let registerAddInfo = valueInfo(addRegisterFilterValue, 'registerAdd', '/api/v1/service-register', 'create', 'registerAdd')
		if (registerAddInfo.action === undefined) {
			registerAddInfo = filterInfo(addRegisterFilterValue, 'create', data.registerAdd, 'BASIC', '/api/v1/service-register')
		}
		//删除
		let registerDeleteInfo = valueInfo(delRegisterFilterValue, 'registerDelete', '/api/v1/service-register', 'delete', 'registerDelete')
		if (registerDeleteInfo.action === undefined) {
			registerDeleteInfo = filterInfo(delRegisterFilterValue, 'delete', data.registerDelete, 'BASIC', '/api/v1/service-register')
		}
		//修改
		let registerUpdateInfo = valueInfo(updateRegisterFilterValue, 'registerUpdate', '/api/v1/service-register', 'update', 'registerUpdate')
		if (registerUpdateInfo.action === undefined) {
			registerUpdateInfo = filterInfo(updateRegisterFilterValue, 'update', data.registerUpdate, 'BASIC', '/api/v1/service-register')
		}
		//查看
		let registerReadInfo = valueInfo(readRegisterFilterValue, 'registerRead', '/api/v1/service-register', 'read', 'registerRead')
		if (registerReadInfo.action === undefined) {
			registerReadInfo = filterInfo(readRegisterFilterValue, 'read', data.registerRead, 'BASIC', '/api/v1/service-register')
		}
		let registerPerms = {}
		registerPerms.resource = '/api/v1/service-register'
		registerPerms.permissions = []
		registerPerms.permissions.push(registerAddInfo)
		registerPerms.permissions.push(registerDeleteInfo)
		registerPerms.permissions.push(registerUpdateInfo)
		registerPerms.permissions.push(registerReadInfo)
		permissions.push(registerPerms)

		//个性化策略    personal Personal
		//增加
		let personalAddInfo = valueInfo(addPersonalFilterValue, 'personalAdd', '/api/v1/personalized-strategy', 'create', 'personalAdd')
		if (personalAddInfo.action === undefined) {
			personalAddInfo = filterInfo(addPersonalFilterValue, 'create', data.personalAdd, 'BASIC', '/api/v1/personalized-strategy')
		}
		//删除
		let personalDeleteInfo = valueInfo(delPersonalFilterValue, 'personalDelete', '/api/v1/personalized-strategy', 'delete', 'personalDelete')
		if (personalDeleteInfo.action === undefined) {
			personalDeleteInfo = filterInfo(delPersonalFilterValue, 'delete', data.personalDelete, 'BASIC', '/api/v1/personalized-strategy')
		}
		//修改
		let personalUpdateInfo = valueInfo(updatePersonalFilterValue, 'personalUpdate', '/api/v1/personalized-strategy', 'update', 'personalUpdate')
		if (personalUpdateInfo.action === undefined) {
			personalUpdateInfo = filterInfo(updatePersonalFilterValue, 'update', data.personalUpdate, 'BASIC', '/api/v1/personalized-strategy')
		}
		//查看
		let personalReadInfo = valueInfo(readPersonalFilterValue, 'personalRead', '/api/v1/personalized-strategy', 'read', 'personalRead')
		if (personalReadInfo.action === undefined) {
			personalReadInfo = filterInfo(readPersonalFilterValue, 'read', data.personalRead, 'BASIC', '/api/v1/personalized-strategy')
		}
		let personalPerms = {}
		personalPerms.resource = '/api/v1/personalized-strategy'
		personalPerms.permissions = []
		personalPerms.permissions.push(personalAddInfo)
		personalPerms.permissions.push(personalDeleteInfo)
		personalPerms.permissions.push(personalUpdateInfo)
		personalPerms.permissions.push(personalReadInfo)
		permissions.push(personalPerms)
		dispatch({
			type: 'roles/authorization',
			payload: {
				createdBy: authorization.createdBy,
				createdTime: authorization.createdTime,
				updatedBy: authorization.updatedBy,
				updatedTime: authorization.updatedTime,
				description: authorization.description,
				name: authorization.name,
				status: authorization.status,
				alarmApplyFilter, //扩展条件
				permissions, //功能数据权限
				uiPermissions, //菜单权限
				uuid: authorization.uuid,
				id: authorization.uuid,
			},
		})
		resetFields()
	}
	//专家模式下的应用过滤器
	const advInfo = (moFilterValue0, type, info) => {
		let alarmApplyFilter = {}
		let fields0 = []
		let filterIndex0 = [0]
		if (moFilterValue0 && moFilterValue0.filterIndex && moFilterValue0.filterIndex.length > 0) {
			filterIndex0 = moFilterValue0.filterIndex
		}
		if (moFilterValue0 && moFilterValue0.filterItems && moFilterValue0.filterItems.length > 0 && moFilterValue0.filterItems.length != filterIndex0.length) {
			let indexs = []
			moFilterValue0.filterItems.forEach((item, index) => {
				indexs.push(index)
			})
			filterIndex0 = indexs
		}
		filterIndex0.forEach((num) => {
			fields0.push(`leftBrackets_${info}_${num}`)
			fields0.push(`field_${info}_${num}`)
			fields0.push(`op_${info}_${num}`)
			fields0.push(`value_${info}_${num}`)
			fields0.push(`rightBrackets_${info}_${num}`)
			fields0.push(`logicOp_${info}_${num}`)
		})
		const valObj0 = { ...getFieldsValue(fields0) }
		let arrs = []
		filterIndex0.forEach((num, index) => {
			let bean = {}
			bean.leftBrackets = valObj0[`leftBrackets_${info}_${num}`]
			bean.field = valObj0[`field_${info}_${num}`]
			bean.op = valObj0[`op_${info}_${num}`]
			bean.value = valObj0[`value_${info}_${num}`]
			bean.rightBrackets = valObj0[`rightBrackets_${info}_${num}`]
			bean.logicOp = valObj0[`logicOp_${info}_${num}`]
			if (bean.field && bean.field !== '') {
				arrs.push(bean)
			}
		})
		//alarmApplyFilter.basicLogicOp = valObj0.basicLogicOp
		alarmApplyFilter.filterMode = moFilterValue0.filterMode
		alarmApplyFilter.filterItems = arrs
		alarmApplyFilter.resource = type
		return alarmApplyFilter
	}

	//该方法来格式化数据，将用户配置的权限信息转化为满足后台接口数据格式要求的数据，第一个参数为扩展条件，第二个为扩展条件选择框的类型，第三个为接口原地址(后台用)，create对应的操作，has为是否启用
	const valueInfo = (moFilterValue0, type, resource, action, has) => {
		let mofilterval0 = {}
		let fields0 = []
		let filterIndex0 = [0]
		let boss = {}
		if (moFilterValue0 && moFilterValue0.filterIndex && moFilterValue0.filterIndex.length > 0) {
			filterIndex0 = moFilterValue0.filterIndex
		}
		if (moFilterValue0 && moFilterValue0.filterItems && moFilterValue0.filterItems.length > 0 && moFilterValue0.filterItems.length != filterIndex0.length) {
			let indexs = []
			moFilterValue0.filterItems.forEach((item, index) => {
				indexs.push(index)
			})
			filterIndex0 = indexs
		}
		filterIndex0.forEach((num) => {
			//fields0.push(`TleftBrackets_${type}_${num}`)
			fields0.push(`Tfield_${type}_${num}`)
			fields0.push(`Top_${type}_${num}`)
			fields0.push(`Tvalue_${type}_${num}`)
			fields0.push(`iTvalue_${type}_${num}`)
			//fields0.push(`TrightBrackets_${type}_${num}`)
		})
		fields0.push(has)
		fields0.push(`TbasicLogicOp${type}`)
		const valObj0 = { ...getFieldsValue(fields0) }
		let arrs0 = []
		for (let index = 0; index < filterIndex0.length; index++) {
			let num = filterIndex0[index]
			let bean = {}
			bean.value = valObj0[`Tvalue_${type}_${num}`]
			bean.field = valObj0[`Tfield_${type}_${num}`]
			bean.op = valObj0[`Top_${type}_${num}`]
			if (bean.value === undefined || bean.value === '') {
				if (bean.field === undefined || bean.field === '') {
					if (bean.op === undefined || bean.op === '') {
						continue
					}
				}
			}
			if (bean.field === 'branchName' || bean.field === 'branch' || bean.field === 'informType'
				|| bean.field === 'createdBy' || bean.field === 'mngtOrgCode' || bean.field === 'N_OrgName' ||
				bean.field === 'N_MgtOrg' || bean.field === 'OZ_OrgName' || bean.field === 'filter.filterMode' ||
				bean.field === 'informType' || bean.field === 'N_MgtOrgId' || bean.field === 'oelConfirm' || bean.field === 'firstClass'
			) { //这里保存的是第三个下拉框的选择条件
				bean.value = valObj0[`Tvalue_${type}_${num}`]
			} else if(bean.field === 'domain'){
				bean.value = valObj0[`Tvalue_${type}_${num}`].join('-')
			}else {
				bean.value = valObj0[`iTvalue_${type}_${num}`]
			}
			if (bean.field !== undefined || bean.field !== '') {
				arrs0.push(bean)
			}
			boss.resource = resource
			boss.action = action
			boss.has = valObj0[`${has}`]
			boss.permissionFilter = {}
			boss.permissionFilter.basicLogicOp = valObj0[`TbasicLogicOp${type}`]
			boss.permissionFilter.filterMode = 'BASIC'
			boss.permissionFilter.filterItems = arrs0
		}
		return boss
	}
	//filterValue为用户选择的条件, type为action，state为has, filterType为filterMode， resource为resource   后者都是后台接口字段
	const filterInfo = (filterValue, type, state, filterType, resource) => {
		let filters = {}
		if (filterValue.filterItems !== undefined) {
			let infos = []
			if (filterValue.filterItems.length === 1) {
				if (filterValue.filterItems[0].field === undefined) { //如果是直接保存的  其它项是不会有filterValue.filterItems的   所以直接判断
					filterValue.filterItems = []
				} else if (filterValue.filterItems[0].field === '' && filterValue.filterItems[0].op === '' && filterValue.filterItems[0].value === '') { //防止用户保存空的没有内容的条件
					filterValue.filterItems = []
				}
			} else if (filterValue.filterItems.length > 1) { //存在多个条件的时候
				for (let info of filterValue.filterItems) {
					if (info.field != undefined && info.field != '') { //如果有正规的数据  这里只判断info.field  是因为在数据是残缺的时候   利用了后台帮我验证了
						infos.push(info)
					} else if (info.field === '' && info.op === '' && info.value === '') { //全为空的情况   将不会处理

					}
				}
				filterValue.filterItems = infos
			}
		}
		return filters = {
			action: type,
			has: state,
			permissionFilter: {
				basicLogicOp: filterValue.basicLogicOp,
				filterItems: filterValue.filterItems === undefined ? [] : filterValue.filterItems,
				filterMode: filterType,
			},
			resource,
		}
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'roles/updateState',
			payload: {
				authorizationVisible: false,
				conditionNotf: { filterMode: 'ADVANCED' },
				conditionAdv: { filterMode: 'ADVANCED' },
				conditionAdv: { filterMode: 'ADVANCED' },
				conditionNotf: { filterMode: 'ADVANCED' },
				moAddFilterValue: { basicLogicOp: 'AND' }, //监控对象新增过滤功能开关
				moDeleteFilterValue: { basicLogicOp: 'AND' }, //监控对象删除过滤功能开关
				moUpdateFilterValue: { basicLogicOp: 'AND' }, //监控对象修改过滤功能开关
				moReadFilterValue: { basicLogicOp: 'AND' }, //监控对象查看过滤功能开关

				toolAddFilterValue: { basicLogicOp: 'AND' }, //监控工具
				toolDeleteFilterValue: { basicLogicOp: 'AND' },
				toolUpdateFilterValue: { basicLogicOp: 'AND' },
				toolReadFilterValue: { basicLogicOp: 'AND' },

				ptAddFilterValue: { basicLogicOp: 'AND' }, //策略模板
				ptDeleteFilterValue: { basicLogicOp: 'AND' },
				ptUpdateFilterValue: { basicLogicOp: 'AND' },
				ptReadFilterValue: { basicLogicOp: 'AND' },

				priAddFilterValue: { basicLogicOp: 'AND' }, //策略规则
				prDeleteFilterValue: { basicLogicOp: 'AND' },
				prUpdateFilterValue: { basicLogicOp: 'AND' },
				prReadFilterValue: { basicLogicOp: 'AND' },
				prIssuFilterValue: { basicLogicOp: 'AND' },
				prCalculationFilterValue: { basicLogicOp: 'AND' },

				riAddFilterValue: { basicLogicOp: 'AND' }, //监控实例
				riDeleteFilterValue: { basicLogicOp: 'AND' },
				riUpdateFilterValue: { basicLogicOp: 'AND' },
				riReadFilterValue: { basicLogicOp: 'AND' },

				siAddFilterValue: { basicLogicOp: 'AND' }, //指标管理
				siDeleteFilterValue: { basicLogicOp: 'AND' },
				siUpdateFilterValue: { basicLogicOp: 'AND' },
				siReadFilterValue: { basicLogicOp: 'AND' },

				ziAddFilterValue: { basicLogicOp: 'AND' }, //指标实现
				ziDeleteFilterValue: { basicLogicOp: 'AND' },
				ziUpdateFilterValue: { basicLogicOp: 'AND' },
				ziReadFilterValue: { basicLogicOp: 'AND' },

				tpAddFilterValue: { basicLogicOp: 'AND' }, //周期管理
				tpDeleteFilterValue: { basicLogicOp: 'AND' },
				tpUpdateFilterValue: { basicLogicOp: 'AND' },
				tpReadFilterValue: { basicLogicOp: 'AND' },

				notfAddFilterValue: { basicLogicOp: 'AND' }, //通知管理
				notfDeleteFilterValue: { basicLogicOp: 'AND' },
				notfUpdateFilterValue: { basicLogicOp: 'AND' },
				notfReadFilterValue: { basicLogicOp: 'AND' },

				oelReadFilterValue: { basicLogicOp: 'AND' }, //oel
				oelConfirmFilterValue: { basicLogicOp: 'AND' },
				oelCloseFilterValue: { basicLogicOp: 'AND' },

				luAddFilterValue: { basicLogicOp: 'AND' }, //lookup表维护
				luDeleteFilterValue: { basicLogicOp: 'AND' },
				luUpdateFilterValue: { basicLogicOp: 'AND' },
				luReadFilterValue: { basicLogicOp: 'AND' },

				mvReadFilterValue: { basicLogicOp: 'AND' }, //服务台

				cvReadFilterValue: { basicLogicOp: 'AND' }, //总行监控视图

				bvReadFilterValue: { basicLogicOp: 'AND' }, //分行监控视图

				hvReadFilterValue: { basicLogicOp: 'AND' }, //历史告警视图

				uiAddFilterValue: { basicLogicOp: 'AND' }, //用户
				uiDeleteFilterValue: { basicLogicOp: 'AND' },
				uiUpdateFilterValue: { basicLogicOp: 'AND' },
				uiReadFilterValue: { basicLogicOp: 'AND' },

				rolesAddFilterValue: { basicLogicOp: 'AND' }, //角色
				rolesDeleteFilterValue: { basicLogicOp: 'AND' },
				rolesUpdateFilterValue: { basicLogicOp: 'AND' },
				rolesReadFilterValue: { basicLogicOp: 'AND' },

				mtAddFilterValue: { basicLogicOp: 'AND' }, //维护期模板
				mtDeleteFilterValue: { basicLogicOp: 'AND' },
				mtUpdateFilterValue: { basicLogicOp: 'AND' },
				mtReadFilterValue: { basicLogicOp: 'AND' },

				mrAddFilterValue: { basicLogicOp: 'AND' }, //维护期实例
				mrDeleteFilterValue: { basicLogicOp: 'AND' },
				mrUpdateFilterValue: { basicLogicOp: 'AND' },
				mrReadFilterValue: { basicLogicOp: 'AND' },
				advAddFilterValue: { basicLogicOp: 'AND' },
				advUpdateFilterValue: { basicLogicOp: 'AND' },
				myShortFilterValueProps: { basicLogicOp: 'AND' },
				myPreFilterValueProps: { basicLogicOp: 'AND' },
				myCheckFilterValueProps: { basicLogicOp: 'AND' },

				fcAddFilterValue: { basicLogicOp: 'AND' }, //报表配置
				fcDeleteFilterValue: { basicLogicOp: 'AND' },
				fcUpdateFilterValue: { basicLogicOp: 'AND' },
				fcReadFilterValue: { basicLogicOp: 'AND' },

				pfReadFilterValue: { basicLogicOp: 'AND' }, //性能
				// 个性化策略
				addPersonalFilterValue : { basicLogicOp: 'AND' },
				delPersonalFilterValue : { basicLogicOp: 'AND' },
				updatePersonalFilterValue : { basicLogicOp: 'AND' },
				readPersonalFilterValue : { basicLogicOp: 'AND' },

				moAddState: false,
				moDeleteState: false,
				moUpdateState: false,
				moReadState: false,
				tagAddState: false,
				tagDeleteState: false,
				tagUpdateState: false,
				tagReadState: false,
				toolAddState: false,
				toolDeleteState: false,
				toolUpdateState: false,
				toolReadState: false,
				ptAddState: false,
				ptDeleteState: false,
				ptUpdateState: false,
				ptReadState: false,
				priAddState: false,
				prDeleteState: false,
				prUpdateState: false,
				prReadState: false,
				prIssuState: false,
				prCalculationState: false,
				riAddState: false,
				riDeleteState: false,
				riUpdateState: false,
				riReadState: false,
				siAddState: false,
				siDeleteState: false,
				siUpdateState: false,
				siReadState: false,
				ziAddState: false,
				ziDeleteState: false,
				ziUpdateState: false,
				ziReadState: false,
				tpAddState: false,
				tpDeleteState: false,
				tpUpdateState: false,
				tpReadState: false,
				notfAddState: false,
				notfDeleteState: false,
				notfUpdateState: false,
				notfReadState: false,
				oelReadState: false,
				oelConfirmState: false,
				oelCloseState: false,
				luAddState: false,
				luDeleteState: false,
				luUpdateState: false,
				luReadState: false,
				mvReadState: false,
				cvReadState: false,
				bvReadState: false,
				hvReadState: false,
				uiAddState: false,
				uiDeleteState: false,
				uiUpdateState: false,
				uiReadState: false,
				rolesAddState: false,
				rolesDeleteState: false,
				rolesUpdateState: false,
				rolesReadState: false,
				mtAddState: false,
				mtDeleteState: false,
				mtUpdateState: false,
				mtReadState: false,
				mrAddState: false,
				mrDeleteState: false,
				mrUpdateState: false,
				mrReadState: false,
				advAddState: false,
				advUpdateState: false,
				fcAddState: false,
				fcDeleteState: false,
				fcUpdateState: false,
				fcReadState: false,
				pfReadState: false,
				efAddState: false, //过滤器
				efDeleteState: false,
				efUpdateState: false,
				efReadState: false,
				ostsAddState: false, //数据源配置
				ostsDeleteState: false,
				ostsUpdateState: false,
				ostsReadState: false,
				etAddState: false, //工具列表
				etDeleteState: false,
				etUpdateState: false,
				etReadState: false,
				evAddState: false, //视图配置
				evDeleteState: false,
				evUpdateState: false,
				evReadState: false,
				myShortState: false,
				myPreState: false,
				myCheckState: false,
				personalAddState: false, // 个性化策略
				personalDeleteState: false,
				personalUpdateState: false,
				personalReadState: false,
			},
		})
	}

	const modalOpts = {
		title: '角色信息维护',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const conditionAdvProps = {
		dispatch,
		filter: conditionAdv,
		queryPath: 'roles/updateState',
		moFilterName: 'conditionAdv',
		myform: form,
		isExpertRoles: true,
		info: 'ADV',
	}

	const conditionNotfProps = {
		dispatch,
		filter: conditionNotf,
		queryPath: 'roles/updateState',
		moFilterName: 'conditionNotf',
		myform: form,
		isExpertRoles: true,
		info: 'NOTF',
	}

	const moAddFilterProps = {
		dispatch,
		filter: moAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'moAddFilterValue',
		myform: form,
		objType: 'MOAdd',
		userInfoList,

	}

	const moDeleteFilterProps = {
		dispatch,
		filter: moDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'moDeleteFilterValue',
		myform: form,
		objType: 'MODelete',
		userInfoList,
	}

	const moUpdateFilterProps = {
		dispatch,
		filter: moUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'moUpdateFilterValue',
		myform: form,
		objType: 'MOUpdate',
		userInfoList,
	}

	const moReadFilterProps = {
		dispatch,
		filter: moReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'moReadFilterValue',
		myform: form,
		objType: 'MORead',
		userInfoList,
	}

	const tagAddFilterProps = {
		dispatch,
		filter: tagAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tagAddFilterValue',
		myform: form,
		objType: 'tagAdd',
	}

	const tagDeleteFilterProps = {
		dispatch,
		filter: tagDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tagDeleteFilterValue',
		myform: form,
		objType: 'tagDelete',
	}

	const tagUpdateFilterProps = {
		dispatch,
		filter: tagUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tagUpdateFilterValue',
		myform: form,
		objType: 'tagUpdate',
	}

	const tagReadFilterProps = {
		dispatch,
		filter: tagReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tagReadFilterValue',
		myform: form,
		objType: 'tagRead',
	}

	const toolAddFilterProps = {
		dispatch,
		filter: toolAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'toolAddFilterValue',
		myform: form,
		objType: 'toolAdd',
	}

	const toolDeleteFilterProps = {
		dispatch,
		filter: toolDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'toolDeleteFilterValue',
		myform: form,
		objType: 'toolDelete',
	}

	const toolUpdateFilterProps = {
		dispatch,
		filter: toolUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'toolUpdateFilterValue',
		myform: form,
		objType: 'toolUpdate',
	}

	const toolReadFilterProps = {
		dispatch,
		filter: toolReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'toolReadFilterValue',
		myform: form,
		objType: 'toolRead',
	}

	const ptAddFilterProps = {
		dispatch,
		filter: ptAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ptAddFilterValue',
		myform: form,
		objType: 'ptAdd',
	}

	const ptDeleteFilterProps = {
		dispatch,
		filter: ptDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ptDeleteFilterValue',
		myform: form,
		objType: 'ptDelete',
	}

	const ptUpdateFilterProps = {
		dispatch,
		filter: ptUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ptUpdateFilterValue',
		myform: form,
		objType: 'ptUpdate',
	}

	const ptReadFilterProps = {
		dispatch,
		filter: ptReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ptReadFilterValue',
		myform: form,
		objType: 'ptRead',
	}


	const priAddFilterProps = {
		dispatch,
		filter: priAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'priAddFilterValue',
		myform: form,
		objType: 'prAdd',
	}

	const prDeleteFilterProps = {
		dispatch,
		filter: prDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'prDeleteFilterValue',
		myform: form,
		objType: 'prDelete',
	}

	const prUpdateFilterProps = {
		dispatch,
		filter: prUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'prUpdateFilterValue',
		myform: form,
		objType: 'prUpdate',
	}

	const prReadFilterProps = {
		dispatch,
		filter: prReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'prReadFilterValue',
		myform: form,
		objType: 'prRead',
	}

	const prIssuFilterProps = {
		dispatch,
		filter: prIssuFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'prIssuFilterValue',
		myform: form,
		objType: 'prIssu',
	}

	const prCalculationFilterProps = {
		dispatch,
		filter: prCalculationFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'prCalculationFilterValue',
		myform: form,
		objType: 'prCalculation',
	}

	const riiAddFilterProps = {
		dispatch,
		filter: riAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'riAddFilterValue',
		myform: form,
		objType: 'riAdd',
	}

	const riDeleteFilterValueProps = {
		dispatch,
		filter: riDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'riDeleteFilterValue',
		myform: form,
		objType: 'riDelete',
	}

	const riUpdateFilterValueProps = {
		dispatch,
		filter: riUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'riUpdateFilterValue',
		myform: form,
		objType: 'riUpdate',
	}

	const riReadFilterProps = {
		dispatch,
		filter: riReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'riReadFilterProps',
		myform: form,
		objType: 'riRead',
	}

	const siAddFilterValueProps = {
		dispatch,
		filter: siAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'siAddFilterValue',
		myform: form,
		objType: 'siAdd',
	}

	const siDeleteFilterValueProps = {
		dispatch,
		filter: siDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'siDeleteFilterValue',
		myform: form,
		objType: 'siDelete',
	}

	const siUpdateFilterValueProps = {
		dispatch,
		filter: siUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'siUpdateFilterValue',
		myform: form,
		objType: 'siUpdate',
	}

	const siReadFilterValueProps = {
		dispatch,
		filter: siReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'siReadFilterValue',
		myform: form,
		objType: 'siRead',
	}

	const ziAddFilterValueProps = {
		dispatch,
		filter: ziAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ziAddFilterValue',
		myform: form,
		objType: 'ziAdd',
	}

	const ziDeleteFilterValueProps = {
		dispatch,
		filter: ziDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ziDeleteFilterValue',
		myform: form,
		objType: 'ziDelete',
	}

	const ziUpdateFilterValueProps = {
		dispatch,
		filter: ziUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ziUpdateFilterValue',
		myform: form,
		objType: 'ziUpdate',
	}

	const ziReadFilterValueProps = {
		dispatch,
		filter: ziReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'ziReadFilterValue',
		myform: form,
		objType: 'ziRead',
	}

	const tpAddFilterValueProps = {
		dispatch,
		filter: tpAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tpAddFilterValue',
		myform: form,
		objType: 'tpAdd',
	}

	const tpDeleteFilterValueProps = {
		dispatch,
		filter: tpDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tpDeleteFilterValue',
		myform: form,
		objType: 'tpDelete',
	}

	const tpUpdateFilterValueProps = {
		dispatch,
		filter: tpUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tpUpdateFilterValue',
		myform: form,
		objType: 'tpUpdate',
	}

	const tpReadFilterValueProps = {
		dispatch,
		filter: tpReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'tpReadFilterValue',
		myform: form,
		objType: 'tpRead',
	}

	const notfAddFilterValueProps = {
		dispatch,
		filter: notfAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'notfAddFilterValue',
		myform: form,
		objType: 'notfAdd',
		userInfoList,
	}

	const notfDeleteFilterValueProps = {
		dispatch,
		filter: notfDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'notfDeleteFilterValue',
		myform: form,
		objType: 'notfDelete',
		userInfoList,
	}

	const notfUpdateFilterValueProps = {
		dispatch,
		filter: notfUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'notfUpdateFilterValue',
		myform: form,
		objType: 'notfUpdate',
		userInfoList,
	}

	const notfReadFilterValueProps = {
		dispatch,
		filter: notfReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'notfReadFilterValue',
		myform: form,
		objType: 'notfRead',
		userInfoList,
	}

	const oelReadFilterValueProps = {
		dispatch,
		filter: oelReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'oelReadFilterValue',
		myform: form,
		objType: 'oelRead',
	}

	const oelConfirmFilterValueProps = {
		dispatch,
		filter: oelConfirmFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'oelConfirmFilterValue',
		myform: form,
		objType: 'oelConfirm',
	}

	const oelCloseFilterValueProps = {
		dispatch,
		filter: oelCloseFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'oelCloseFilterValue',
		myform: form,
		objType: 'oelColse',
	}

	const luAddFilterValueProps = {
		dispatch,
		filter: luAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'luAddFilterValue',
		myform: form,
		objType: 'luAdd',
	}

	const luDeleteFilterValueProps = {
		dispatch,
		filter: luDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'luDeleteFilterValue',
		myform: form,
		objType: 'luDelete',
	}

	const luUpdateFilterValueProps = {
		dispatch,
		filter: luUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'luUpdateFilterValue',
		myform: form,
		objType: 'luUpdate',
	}

	const luReadFilterValueProps = {
		dispatch,
		filter: luReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'luReadFilterValue',
		myform: form,
		objType: 'luRead',
	}

	const mvReadFilterValueProps = {
		dispatch,
		filter: mvReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mvReadFilterValue',
		myform: form,
		objType: 'mvRead',
	}

	const cvReadFilterValueProps = {
		dispatch,
		filter: cvReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'cvReadFilterValue',
		myform: form,
		objType: 'cvRead',
	}

	const bvReadFilterValueProps = {
		dispatch,
		filter: bvReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'bvReadFilterValue',
		myform: form,
		objType: 'bvRead',
	}

	const hvReadFilterValueProps = {
		dispatch,
		filter: hvReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'hvReadFilterValue',
		myform: form,
		objType: 'hvRead',
	}

	const uiAddFilterValueProps = {
		dispatch,
		filter: uiAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'uiAddFilterValue',
		myform: form,
		objType: 'uiAdd',
	}

	const uiDeleteFilterValueProps = {
		dispatch,
		filter: uiDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'uiDeleteFilterValue',
		myform: form,
		objType: 'uiDelete',
	}

	const uiUpdateFilterValueProps = {
		dispatch,
		filter: uiUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'uiUpdateFilterValue',
		myform: form,
		objType: 'uiUpdate',
	}

	const uiReadFilterValueProps = {
		dispatch,
		filter: uiReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'uiReadFilterValue',
		myform: form,
		objType: 'uiRead',
	}

	const rolesAddFilterValueProps = {
		dispatch,
		filter: rolesAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'rolesAddFilterValue',
		myform: form,
		objType: 'rolesAdd',
	}

	const rolesDeleteFilterValueProps = {
		dispatch,
		filter: rolesDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'rolesDeleteFilterValue',
		myform: form,
		objType: 'rolesDelete',
	}

	const rolesUpdateFilterValueProps = {
		dispatch,
		filter: rolesUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'rolesUpdateFilterValue',
		myform: form,
		objType: 'rolesUpdate',
	}

	const rolesReadFilterValueProps = {
		dispatch,
		filter: rolesReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'rolesReadFilterValue',
		myform: form,
		objType: 'rolesRead',
	}

	const mtAddFilterValueProps = {
		dispatch,
		filter: mtAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mtAddFilterValue',
		myform: form,
		objType: 'mtAdd',
	}

	const mtDeleteFilterValueProps = {
		dispatch,
		filter: mtDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mtDeleteFilterValue',
		myform: form,
		objType: 'mtDelete',
	}

	const mtUpdateFilterValueProps = {
		dispatch,
		filter: mtUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mtUpdateFilterValue',
		myform: form,
		objType: 'mtUpdate',
	}

	const mtReadFilterValueProps = {
		dispatch,
		filter: mtReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mtReadFilterValue',
		myform: form,
		objType: 'mtRead',
	}

	const mrAddFilterValueProps = {
		dispatch,
		filter: mrAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mrAddFilterValue',
		myform: form,
		objType: 'mrAdd',
		userInfoList,
	}

	const mrDeleteFilterValueProps = {
		dispatch,
		filter: mrDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mrDeleteFilterValue',
		myform: form,
		objType: 'mrDelete',
		userInfoList,
	}

	const mrUpdateFilterValueProps = {
		dispatch,
		filter: mrUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mrUpdateFilterValue',
		myform: form,
		objType: 'mrUpdate',
		userInfoList,
	}

	const mrReadFilterValueProps = {
		dispatch,
		filter: mrReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mrReadFilterValue',
		myform: form,
		objType: 'mrRead',
		userInfoList,
	}

	const advAddFilterValueProps = {
		dispatch,
		filter: advAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'advAddFilterValue',
		myform: form,
		objType: 'advAdd',
		userInfoList,
	}

	const advUpdateFilterValueProps = {
		dispatch,
		filter: advUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'advUpdateFilterValue',
		myform: form,
		objType: 'advUpdate',
		userInfoList,
	}

	const fcAddFilterValueProps = {
		dispatch,
		filter: fcAddFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'fcAddFilterValue',
		myform: form,
		objType: 'fcAdd',
	}

	const fcDeleteFilterValueProps = {
		dispatch,
		filter: fcDeleteFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'fcDeleteFilterValue',
		myform: form,
		objType: 'fcDelete',
	}

	const fcUpdateFilterValueProps = {
		dispatch,
		filter: fcUpdateFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'fcUpdateFilterValue',
		myform: form,
		objType: 'fcUpdate',
	}

	const fcReadFilterValueProps = {
		dispatch,
		filter: fcReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'fcReadFilterValue',
		myform: form,
		objType: 'fcRead',
	}

	const pfReadFilterValueProps = {
		dispatch,
		filter: pfReadFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'pfReadFilterValue',
		myform: form,
		objType: 'pfRead',
	}

	const addJobsFilterValueProps = {
		dispatch,
		filter: addJobsFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'addJobsFilterValue',
		myform: form,
		objType: 'addJobs',
	}

	const delJobsFilterValueProps = {
		dispatch,
		filter: delJobsFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'delJobsFilterValue',
		myform: form,
		objType: 'delJobs',
	}

	const updateJobsFilterValueProps = {
		dispatch,
		filter: updateJobsFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'updateJobsFilterValue',
		myform: form,
		objType: 'updateJobs',
	}

	const readJobsFilterValueProps = {
		dispatch,
		filter: readJobsFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'readJobsFilterValue',
		myform: form,
		objType: 'readJobs',
	}
	//我的维护期
	const myShortFilterValueProps = {
		dispatch,
		filter: myShortFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'myShortFilterValue',
		myform: form,
		objType: 'myShort',
		userInfoList,
	}
	const myPreFilterValueProps = {
		dispatch,
		filter: myPreFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'myPreFilterValue',
		myform: form,
		objType: 'myPre',
		userInfoList,
	}
	const myCheckFilterValueProps = {
		dispatch,
		filter: myCheckFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'myCheckFilterValue',
		myform: form,
		objType: 'myCheck',
		userInfoList,
	}
	const addRegisterFilterValueProps = {
		dispatch,
		filter: addRegisterFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'addRegisterFilterValue',
		myform: form,
		objType: 'registerAdd',
	}
	const delRegisterFilterValueProps = {
		dispatch,
		filter: delRegisterFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'delRegisterFilterValue',
		myform: form,
		objType: 'registerDel',
	}
	const updateRegisterFilterValueProps = {
		dispatch,
		filter: updateRegisterFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'updateRegisterFilterValue',
		myform: form,
		objType: 'registerUpdate',
	}
	const readRegisterFilterValueProps = {
		dispatch,
		filter: readRegisterFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'readRegisterFilterValue',
		myform: form,
		objType: 'registerRead',
	}
	// 个性化策略 personal Personal
	const addPersonalFilterValueProps = {
		dispatch,
		filter: addPersonalFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'addPersonalFilterValue',
		myform: form,
		objType: 'personalAdd',
	}
	const delPersonalFilterValueProps = {
		dispatch,
		filter: delPersonalFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'delPersonalFilterValue',
		myform: form,
		objType: 'personalDelete',
	}
	const updatePersonalFilterValueProps = {
		dispatch,
		filter: updatePersonalFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'updatePersonalFilterValue',
		myform: form,
		objType: 'personalUpdate',
	}
	const readPersonalFilterValueProps = {
		dispatch,
		filter: readPersonalFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'readPersonalFilterValue',
		myform: form,
		objType: 'personalRead',
	}

	const disabledFilterValueProps = {
		dispatch,
		filter: mtdisableFilterValue,
		queryPath: 'roles/updateState',
		moFilterName: 'mtdisableFilterValue',
		myform: form,
		objType: 'mtdisable',
		userInfoList,
	}

	const styles = {
		color: '#52C41A',
		fontSize: 22,
	}

	const styles2 = {
		color: '#666666',
		fontSize: 16,
	}

	const moAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				moAddState: check,
			},
		})
	}

	const moDelChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				moDeleteState: check,
			},
		})
	}

	const moUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				moUpdateState: check,
			},
		})
	}

	const moReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				moReadState: check,
			},
		})
	}

	const tagAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tagAddState: check,
			},
		})
	}

	const tagDelChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tagDeleteState: check,
			},
		})
	}

	const tagUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tagUpdateState: check,
			},
		})
	}

	const tagReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tagReadState: check,
			},
		})
	}

	const toolAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				toolAddState: check,
			},
		})
	}

	const toolDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				toolDeleteState: check,
			},
		})
	}

	const toolUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				toolUpdateState: check,
			},
		})
	}

	const toolReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				toolReadState: check,
			},
		})
	}

	const ptAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ptAddState: check,
			},
		})
	}

	const ptDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ptDeleteState: check,
			},
		})
	}

	const ptUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ptUpdateState: check,
			},
		})
	}

	const ptReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ptReadState: check,
			},
		})
	}


	const priAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				priAddState: check,
			},
		})
	}

	const prDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				prDeleteState: check,
			},
		})
	}

	const prUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				prUpdateState: check,
			},
		})
	}

	const prReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				prReadState: check,
			},
		})
	}

	const prIssuChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				prIssuState: check,
			},
		})
	}

	const prCalculationChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				prCalculationState: check,
			},
		})
	}

	const riAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				riAddState: check,
			},
		})
	}

	const riDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				riDeleteState: check,
			},
		})
	}

	const riUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				riUpdateState: check,
			},
		})
	}

	const riReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				riReadState: check,
			},
		})
	}

	const siAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				siAddState: check,
			},
		})
	}

	const siDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				siDeleteState: check,
			},
		})
	}

	const siUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				siUpdateState: check,
			},
		})
	}

	const siReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				siReadState: check,
			},
		})
	}

	const ziAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ziAddState: check,
			},
		})
	}

	const ziDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ziDeleteState: check,
			},
		})
	}

	const ziUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ziUpdateState: check,
			},
		})
	}

	const ziReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ziReadState: check,
			},
		})
	}

	const tpAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tpAddState: check,
			},
		})
	}

	const tpDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tpDeleteState: check,
			},
		})
	}

	const tpUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tpUpdateState: check,
			},
		})
	}

	const tpReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				tpReadState: check,
			},
		})
	}

	const notfAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				notfAddState: check,
			},
		})
	}

	const notfDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				notfDeleteState: check,
			},
		})
	}

	const notfUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				notfUpdateState: check,
			},
		})
	}

	const notfReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				notfReadState: check,
			},
		})
	}

	const oelReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				oelReadState: check,
			},
		})
	}

	const oelConfirmChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				oelConfirmState: check,
			},
		})
	}

	const uiAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				uiAddState: check,
			},
		})
	}

	const uiDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				uiDeleteState: check,
			},
		})
	}

	const uiUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				uiUpdateState: check,
			},
		})
	}

	const uiReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				uiReadState: check,
			},
		})
	}

	const rolesAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				rolesAddState: check,
			},
		})
	}

	const rolesDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				rolesDeleteState: check,
			},
		})
	}

	const rolesUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				rolesUpdateState: check,
			},
		})
	}

	const rolesReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				rolesReadState: check,
			},
		})
	}

	const mtAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mtAddState: check,
			},
		})
	}

	const mtDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mtDeleteState: check,
			},
		})
	}

	const mtUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mtUpdateState: check,
			},
		})
	}

	const mtReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mtReadState: check,
			},
		})
	}

	const mrAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mrAddState: check,
			},
		})
	}

	const mrDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mrDeleteState: check,
			},
		})
	}

	const mrUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mrUpdateState: check,
			},
		})
	}

	const mrReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mrReadState: check,
			},
		})
	}

	const advAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				advAddState: check,
			},
		})
	}

	const advUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				advUpdateState: check,
			},
		})
	}

	const jobAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				jobAddState: check,
			},
		})
	}

	const jobDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				jobDeleteState: check,
			},
		})
	}

	const jobUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				jobUpdateState: check,
			},
		})
	}

	const jobReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				jobReadState: check,
			},
		})
	}

	const efAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				efAddState: check,
			},
		})
	}

	const efDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				efDeleteState: check,
			},
		})
	}

	const efUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				efUpdateState: check,
			},
		})
	}

	const efReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				efReadState: check,
			},
		})
	}

	const ostsAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ostsAddState: check,
			},
		})
	}

	const ostsDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ostsDeleteState: check,
			},
		})
	}

	const ostsUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ostsUpdateState: check,
			},
		})
	}

	const ostsReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				ostsReadState: check,
			},
		})
	}

	const etAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				etAddState: check,
			},
		})
	}

	const etDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				etDeleteState: check,
			},
		})
	}

	const etUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				etUpdateState: check,
			},
		})
	}

	const etReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				etReadState: check,
			},
		})
	}

	const evAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				evAddState: check,
			},
		})
	}

	const evDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				evDeleteState: check,
			},
		})
	}

	const evUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				evUpdateState: check,
			},
		})
	}

	const evReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				evReadState: check,
			},
		})
	}
	//我的维护期
	const myShortChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				myShortState: check,
			},
		})
	}
	const myPreChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				myPreState: check,
			},
		})
	}
	const myCheckChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				myCheckState: check,
			},
		})
	}
	const registerAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				registerAddState: check,
			},
		})
	}
	const registerDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				registerDeleteState: check,
			},
		})
	}
	const registerUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				registerUpdateState: check,
			},
		})
	}
	const registerReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				registerReadState: check,
			},
		})
	}
	// 个性化策略
	const personalAddChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				personalAddState: check,
			},
		})
	}
	const personalDeleteChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				personalDeleteState: check,
			},
		})
	}
	const personalUpdateChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				personalUpdateState: check,
			},
		})
	}
	const personalReadChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				personalReadState: check,
			},
		})
	}

	const disabledChange = (check) => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				mtdisableState: check,
			},
		})
	}

	return (

		<Modal {...modalOpts} width="900px">
			<Spin spinning={modalState} delay={500} tip="正在上传授权信息...">
				<Form>
					<Tabs defaultActiveKey="2">
						<TabPane tab={<span><Icon type="layout" />菜单授权</span>} key="1">
							<Tree
								defaultCheckedKeys={selectedKeys}
								checkable
								defaultExpandAll
								onCheck={onCheck}
							>
								{TreeDates}
							</Tree>
						</TabPane>

						<TabPane tab={<span><Icon type="book" />功能数据授权</span>} key="2">
							<h3>&nbsp;&nbsp;监控对象</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={moAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="moAdd" {...formItemLayout1}>
												{getFieldDecorator('moAdd', {
													initialValue: moAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={moAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...moAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={moDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="moDelete" {...formItemLayout1}>
												{getFieldDecorator('moDelete', {
													initialValue: moDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={moDelChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...moDeleteFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={moUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="moUpdate" {...formItemLayout1}>
												{getFieldDecorator('moUpdate', {
													initialValue: moUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={moUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...moUpdateFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={moReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="moRead" {...formItemLayout1}>
												{getFieldDecorator('moRead', {
													initialValue: moReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={moReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...moReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />
							<h3>&nbsp;&nbsp;标签管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={tagAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tagAdd" {...formItemLayout1}>
												{getFieldDecorator('tagAdd', {
													initialValue: tagAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tagAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tagAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={tagDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tagDelete" {...formItemLayout1}>
												{getFieldDecorator('tagDelete', {
													initialValue: tagDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tagDelChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tagDeleteFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={tagUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tagUpdate" {...formItemLayout1}>
												{getFieldDecorator('tagUpdate', {
													initialValue: tagUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tagUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tagUpdateFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={tagReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tagRead" {...formItemLayout1}>
												{getFieldDecorator('tagRead', {
													initialValue: tagReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tagReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tagReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />
							<h3>&nbsp;&nbsp;监控工具</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={toolAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="toolAdd" {...formItemLayout1}>
												{getFieldDecorator('toolAdd', {
													initialValue: toolAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={toolAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...toolAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={toolDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="toolDelete" {...formItemLayout1}>
												{getFieldDecorator('toolDelete', {
													initialValue: toolDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={toolDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...toolDeleteFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={toolUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="toolUpdate" {...formItemLayout1}>
												{getFieldDecorator('toolUpdate', {
													initialValue: toolUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={toolUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...toolUpdateFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={toolReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="toolRead" {...formItemLayout1}>
												{getFieldDecorator('toolRead', {
													initialValue: toolReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={toolReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...toolReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />
							<h3>&nbsp;&nbsp;策略模板</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={ptAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ptAdd" {...formItemLayout1}>
												{getFieldDecorator('ptAdd', {
													initialValue: ptAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ptAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ptAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={ptDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ptDelete" {...formItemLayout1}>
												{getFieldDecorator('ptDelete', {
													initialValue: ptDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ptDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ptDeleteFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={ptUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ptUpdate" {...formItemLayout1}>
												{getFieldDecorator('ptUpdate', {
													initialValue: ptUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ptUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ptUpdateFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={ptReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ptRead" {...formItemLayout1}>
												{getFieldDecorator('ptRead', {
													initialValue: ptReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ptReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ptReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;策略规则</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={priAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prAdd" {...formItemLayout1}>
												{getFieldDecorator('prAdd', {
													initialValue: priAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={priAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...priAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={prDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prDelete" {...formItemLayout1}>
												{getFieldDecorator('prDelete', {
													initialValue: prDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={prDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...prDeleteFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={prUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prUpdate" {...formItemLayout1}>
												{getFieldDecorator('prUpdate', {
													initialValue: prUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={prUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...prUpdateFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={prReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prRead" {...formItemLayout1}>
												{getFieldDecorator('prRead', {
													initialValue: prReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={prReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...prReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="fork" style={prIssuState ? styles : styles2} />下发</span>} key="5">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prIssu" {...formItemLayout1}>
												{getFieldDecorator('prIssu', {
													initialValue: prIssuState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={prIssuChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...prIssuFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="calculator" style={prCalculationState ? styles : styles2} />计算</span>} key="6">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="prCalculation" {...formItemLayout1}>
												{getFieldDecorator('prCalculation', {
													initialValue: prCalculationState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={prCalculationChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...prCalculationFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;监控实例</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={riAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="riAdd" {...formItemLayout1}>
												{getFieldDecorator('riAdd', {
													initialValue: riAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={riAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...riiAddFilterProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={riDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="riDelete" {...formItemLayout1}>
												{getFieldDecorator('riDelete', {
													initialValue: riDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={riDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...riDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={riUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="riUpdate" {...formItemLayout1}>
												{getFieldDecorator('riUpdate', {
													initialValue: riUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={riUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...riUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={riReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="riRead" {...formItemLayout1}>
												{getFieldDecorator('riRead', {
													initialValue: riReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={riReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...riReadFilterProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;指标管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={siAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="siAdd" {...formItemLayout1}>
												{getFieldDecorator('siAdd', {
													initialValue: siAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={siAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...siAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={siDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="siDelete" {...formItemLayout1}>
												{getFieldDecorator('siDelete', {
													initialValue: siDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={siDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...siDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={siUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="siUpdate" {...formItemLayout1}>
												{getFieldDecorator('siUpdate', {
													initialValue: siUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={siUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...siUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={siReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="siRead" {...formItemLayout1}>
												{getFieldDecorator('siRead', {
													initialValue: siReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={siReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...siReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;指标实现</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={ziAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ziAdd" {...formItemLayout1}>
												{getFieldDecorator('ziAdd', {
													initialValue: ziAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ziAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ziAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={ziDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ziDelete" {...formItemLayout1}>
												{getFieldDecorator('ziDelete', {
													initialValue: ziDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ziDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ziDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={ziUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ziUpdate" {...formItemLayout1}>
												{getFieldDecorator('ziUpdate', {
													initialValue: ziUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ziUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ziUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={ziReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="ziRead" {...formItemLayout1}>
												{getFieldDecorator('ziRead', {
													initialValue: ziReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ziReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...ziReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;周期管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={tpAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tpAdd" {...formItemLayout1}>
												{getFieldDecorator('tpAdd', {
													initialValue: tpAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tpAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tpAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={tpDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tpDelete" {...formItemLayout1}>
												{getFieldDecorator('tpDelete', {
													initialValue: tpDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tpDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tpDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={tpUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tpUpdate" {...formItemLayout1}>
												{getFieldDecorator('tpUpdate', {
													initialValue: tpUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tpUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tpUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={tpReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="tpRead" {...formItemLayout1}>
												{getFieldDecorator('tpRead', {
													initialValue: tpReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={tpReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...tpReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;通知管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={notfAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="notfAdd" {...formItemLayout1}>
												{getFieldDecorator('notfAdd', {
													initialValue: notfAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={notfAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...notfAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={notfDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="notfDelete" {...formItemLayout1}>
												{getFieldDecorator('notfDelete', {
													initialValue: notfDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={notfDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...notfDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={notfUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="notfUpdate" {...formItemLayout1}>
												{getFieldDecorator('notfUpdate', {
													initialValue: notfUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={notfUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...notfUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={notfReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="notfRead" {...formItemLayout1}>
												{getFieldDecorator('notfRead', {
													initialValue: notfReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={notfReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...notfReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;告警列表</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="search" style={oelReadState ? styles : styles2} />查看</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="oelRead" {...formItemLayout1}>
												{getFieldDecorator('oelRead', {
													initialValue: oelReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={oelReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...oelReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="bars" style={oelConfirmState ? styles : styles2} />右键菜单</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="oelConfirm" {...formItemLayout1}>
												{getFieldDecorator('oelConfirm', {
													initialValue: oelConfirmState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={oelConfirmChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...oelConfirmFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="setting" style={ostsReadState ? styles : styles2} />配置项</span>} key="3">
									<Row>
										<Col span={18}>
											<Alert message="数据源授权" type="info" showIcon />
										</Col>
									</Row>
									<br />
									<Row>
										<Col span={10}>
											<FormItem label="新增" key="ostsAddState" {...formItemLayout1}>
												{getFieldDecorator('ostsAddState', {
													initialValue: ostsAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ostsAddChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="删除" key="ostsDeleteState" {...formItemLayout1}>
												{getFieldDecorator('ostsDeleteState', {
													initialValue: ostsDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ostsDeleteChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="修改" key="ostsUpdateState" {...formItemLayout1}>
												{getFieldDecorator('ostsUpdateState', {
													initialValue: ostsUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ostsUpdateChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="查询" key="ostsReadState" {...formItemLayout1}>
												{getFieldDecorator('ostsReadState', {
													initialValue: ostsReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={ostsReadChange} />)}
											</FormItem>
										</Col>
									</Row>

									<Row>
										<Col span={18}>
											<Alert message="过滤器授权" type="info" showIcon />
										</Col>
									</Row>
									<br />
									<Row>
										<Col span={10}>
											<FormItem label="新增" key="efAddState" {...formItemLayout1}>
												{getFieldDecorator('efAddState', {
													initialValue: efAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={efAddChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="删除" key="efDeleteState" {...formItemLayout1}>
												{getFieldDecorator('efDeleteState', {
													initialValue: efDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={efDeleteChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="修改" key="efUpdateState" {...formItemLayout1}>
												{getFieldDecorator('efUpdateState', {
													initialValue: efUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={efUpdateChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="查询" key="efReadState" {...formItemLayout1}>
												{getFieldDecorator('efReadState', {
													initialValue: efReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={efReadChange} />)}
											</FormItem>
										</Col>
									</Row>

									<Row>
										<Col span={18}>
											<Alert message="工具授权" type="info" showIcon />
										</Col>
									</Row>
									<br />
									<Row>
										<Col span={10}>
											<FormItem label="新增" key="etAddState" {...formItemLayout1}>
												{getFieldDecorator('etAddState', {
													initialValue: etAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={etAddChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="删除" key="etDeleteState" {...formItemLayout1}>
												{getFieldDecorator('etDeleteState', {
													initialValue: etDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={etDeleteChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="修改" key="etUpdateState" {...formItemLayout1}>
												{getFieldDecorator('etUpdateState', {
													initialValue: etUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={etUpdateChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="查询" key="etReadState" {...formItemLayout1}>
												{getFieldDecorator('etReadState', {
													initialValue: etReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={etReadChange} />)}
											</FormItem>
										</Col>
									</Row>

									<Row>
										<Col span={18}>
											<Alert message="视图授权" type="info" showIcon />
										</Col>
									</Row>
									<br />
									<Row>
										<Col span={10}>
											<FormItem label="新增" key="evAddState" {...formItemLayout1}>
												{getFieldDecorator('evAddState', {
													initialValue: evAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={evAddChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="删除" key="evDeleteState" {...formItemLayout1}>
												{getFieldDecorator('evDeleteState', {
													initialValue: evDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={evDeleteChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="修改" key="evUpdateState" {...formItemLayout1}>
												{getFieldDecorator('evUpdateState', {
													initialValue: evUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={evUpdateChange} />)}
											</FormItem>
										</Col>
										<Col span={10}>
											<FormItem label="查询" key="evReadState" {...formItemLayout1}>
												{getFieldDecorator('evReadState', {
													initialValue: evReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={evReadChange} />)}
											</FormItem>
										</Col>
									</Row>

								</TabPane>
							</Tabs>

							<br />

							<h3>&nbsp;&nbsp;用户管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={uiAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="uiAdd" {...formItemLayout1}>
												{getFieldDecorator('uiAdd', {
													initialValue: uiAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={uiAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...uiAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={uiDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="uiDelete" {...formItemLayout1}>
												{getFieldDecorator('uiDelete', {
													initialValue: uiDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={uiDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...uiDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={uiUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="uiUpdate" {...formItemLayout1}>
												{getFieldDecorator('uiUpdate', {
													initialValue: uiUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={uiUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...uiUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={uiReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="uiRead" {...formItemLayout1}>
												{getFieldDecorator('uiRead', {
													initialValue: uiReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={uiReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...uiReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;角色管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={rolesAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="rolesAdd" {...formItemLayout1}>
												{getFieldDecorator('rolesAdd', {
													initialValue: rolesAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={rolesAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...rolesAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={rolesDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="rolesDelete" {...formItemLayout1}>
												{getFieldDecorator('rolesDelete', {
													initialValue: rolesDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={rolesDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...rolesDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={rolesUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="rolesUpdate" {...formItemLayout1}>
												{getFieldDecorator('rolesUpdate', {
													initialValue: rolesUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={rolesUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...rolesUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={rolesReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="rolesRead" {...formItemLayout1}>
												{getFieldDecorator('rolesRead', {
													initialValue: rolesReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={rolesReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...rolesReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;维护期模板</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={mtAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mtAdd" {...formItemLayout1}>
												{getFieldDecorator('mtAdd', {
													initialValue: mtAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mtAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mtAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={mtDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mtDelete" {...formItemLayout1}>
												{getFieldDecorator('mtDelete', {
													initialValue: mtDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mtDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mtDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={mtUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mtUpdate" {...formItemLayout1}>
												{getFieldDecorator('mtUpdate', {
													initialValue: mtUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mtUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mtUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={mtReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mtRead" {...formItemLayout1}>
												{getFieldDecorator('mtRead', {
													initialValue: mtReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mtReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mtReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;维护期实例管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={mrAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mrAdd" {...formItemLayout1}>
												{getFieldDecorator('mrAdd', {
													initialValue: mrAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mrAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mrAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={mrDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mrDelete" {...formItemLayout1}>
												{getFieldDecorator('mrDelete', {
													initialValue: mrDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mrDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mrDeleteFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={mrUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mrUpdate" {...formItemLayout1}>
												{getFieldDecorator('mrUpdate', {
													initialValue: mrUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mrUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mrUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={mrReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mrRead" {...formItemLayout1}>
												{getFieldDecorator('mrRead', {
													initialValue: mrReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={mrReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...mrReadFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="file-protect" style={myShortState ? styles : styles2} />短时</span>} key="5">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="myShort" {...formItemLayout1}>
												{getFieldDecorator('myShort', {
													initialValue: myShortState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={myShortChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...myShortFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="exception" style={myPreState ? styles : styles2} />预创建</span>} key="6">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="myPre" {...formItemLayout1}>
												{getFieldDecorator('myPre', {
													initialValue: myPreState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={myPreChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...myPreFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="solution" style={myCheckState ? styles : styles2} />复核</span>} key="7">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="myCheck" {...formItemLayout1}>
												{getFieldDecorator('myCheck', {
													initialValue: myCheckState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={myCheckChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...myCheckFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="solution" style={mtdisableState ? styles : styles2} />禁用</span>} key="8">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="mtdisable" {...formItemLayout1}>
												{getFieldDecorator('mtdisable', {
													initialValue: mtdisableState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={disabledChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...disabledFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="pushpin" style={advAddState ? styles : styles2} />创建专家模式</span>} key="9">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="advAdd" {...formItemLayout1}>
												{getFieldDecorator('advAdd', {
													initialValue: advAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={advAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...advAddFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="pushpin-o" style={advUpdateState ? styles : styles2} />编辑专家模式</span>} key="10">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="advUpdate" {...formItemLayout1}>
												{getFieldDecorator('advUpdate', {
													initialValue: advUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={advUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...advUpdateFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;任务管理</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={jobAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="jobAddState" {...formItemLayout1}>
												{getFieldDecorator('jobAdd', {
													initialValue: jobAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={jobAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...addJobsFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={jobDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="jobDeleteState" {...formItemLayout1}>
												{getFieldDecorator('jobDelete', {
													initialValue: jobDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={jobDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...delJobsFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={jobUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="jobUpdateState" {...formItemLayout1}>
												{getFieldDecorator('jobUpdate', {
													initialValue: jobUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={jobUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...updateJobsFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={jobReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="uiRead" {...formItemLayout1}>
												{getFieldDecorator('jobRead', {
													initialValue: jobReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={jobReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...readJobsFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />
							<h3>&nbsp;&nbsp;服务注册</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={registerAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="registerAddState" {...formItemLayout1}>
												{getFieldDecorator('registerAdd', {
													initialValue: registerAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={registerAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...addRegisterFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={registerDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="registerDeleteState" {...formItemLayout1}>
												{getFieldDecorator('registerDelete', {
													initialValue: registerDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={registerDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...delRegisterFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={registerUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="registerUpdateState" {...formItemLayout1}>
												{getFieldDecorator('registerUpdate', {
													initialValue: registerUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={registerUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...updateRegisterFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={registerReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="registerReadState" {...formItemLayout1}>
												{getFieldDecorator('registerRead', {
													initialValue: registerReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={registerReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...readRegisterFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

							<h3>&nbsp;&nbsp;个性化策略</h3>
							<Tabs defaultActiveKey="1" tabPosition="left">
								<TabPane tab={<span><Icon type="solution" style={personalAddState ? styles : styles2} />新增</span>} key="1">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="personalAddState" {...formItemLayout1}>
												{getFieldDecorator('personalAdd', {
													initialValue: personalAddState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={personalAddChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...addPersonalFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="delete" style={personalDeleteState ? styles : styles2} />删除</span>} key="2">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="personalDeleteState" {...formItemLayout1}>
												{getFieldDecorator('personalDelete', {
													initialValue: personalDeleteState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={personalDeleteChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...delPersonalFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="edit" style={personalUpdateState ? styles : styles2} />修改</span>} key="3">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="personalUpdateState" {...formItemLayout1}>
												{getFieldDecorator('personalUpdate', {
													initialValue: personalUpdateState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={personalUpdateChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...updatePersonalFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tab={<span><Icon type="search" style={personalReadState ? styles : styles2} />查询</span>} key="4">
									<Row>
										<Col span={10}>
											<FormItem label="功能开关" key="personalReadState" {...formItemLayout1}>
												{getFieldDecorator('personalRead', {
													initialValue: personalReadState,
													valuePropName: 'checked',
												})(<Switch checkedChildren="激活" unCheckedChildren="禁用" onChange={personalReadChange} />)}
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col>
											<MoFilter {...readPersonalFilterValueProps} />
										</Col>
									</Row>
								</TabPane>
							</Tabs>
							<br />

						</TabPane >
						<TabPane tab={<span><Icon type="safety" />维护期应用范围</span>} key="3">
							<ConditionAdvancedMode {...conditionAdvProps} />
						</TabPane>
						<TabPane tab={<span><Icon type="mail" />通知应用范围</span>} key="4">
							<ConditionAdvancedMode {...conditionNotfProps} />
						</TabPane>
					</Tabs>
				</Form>
			</Spin>
		</Modal>
	)
}

export default Form.create()(modal)
