import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import ButtonZone from './ButtonZone'
import FilterSchema from './FilterSchema'
import AuthorizationModal from './authorizationModal'
import List from './List'
import Modal from './Modal'
import DataModalObjectInfo from '../../../components/DataModalObjectInfo2' //监控对象
import queryString from "query-string";
const roles = ({
	location,
	dispatch,
	roles,
	loading,
	objectMOsModal,
	app,
}) => {
	const {
		list,
		pagination,
		currentItem,
		modalVisible,
		batchDelete,
		selectedRows,
		grantVisible,
		pageChange,
		q,
		modalState,
		authorizationVisible,
		moAddFilterValue, //监控对象新增过滤授权
		moDeleteFilterValue, //监控对象删除过滤授权
		moUpdateFilterValue, //监控对象修改过滤授权
		moReadFilterValue, //监控对象查看过滤授权

		tagAddFilterValue, //监控工具
		tagDeleteFilterValue,
		tagUpdateFilterValue,
		tagReadFilterValue,

		toolAddFilterValue, //监控工具
		toolDeleteFilterValue,
		toolUpdateFilterValue,
		toolReadFilterValue,

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
		oelCloseState,
		luAddState,
		luDeleteState,
		luUpdateState,
		luReadState,
		mvReadState,
		cvReadState,
		bvReadState,
		hvReadState,
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
		fcAddState,
		fcDeleteState,
		fcUpdateState,
		fcReadState,
		pfReadState,
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
		myCreateState,//我的维护期
		myShortState,
		myPreState,
		myCheckState,
		keys,
		permissionsTree,
		selectedKeys,
		allPermission,
		conditionAdv,
		conditionNotf,
		advKeys,
		userInfoList,
		colors,
		//注册服务
		registerAddState,
		registerDeleteState,
		registerUpdateState,
		registerReadState,
		addRegisterFilterValue,
		delRegisterFilterValue,
		updateRegisterFilterValue,
		readRegisterFilterValue,
		// 个性化策略
		personalAddState,
		personalDeleteState,
		personalUpdateState,
		personalReadState,
		addPersonalFilterValue,
		delPersonalFilterValue,
		updatePersonalFilterValue,
		readPersonalFilterValue,
	} = roles
	const {
		menu,
	} = app
	const modalProps = { //这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: currentItem, //要展示在弹出窗口的选中对象
		type: roles.modalType, //弹出窗口的类型是'创建'还是'编辑'
		SeeText: roles.SeeText,
		visible: roles.modalVisible,
		pagination: roles.pagination1,
		userList: roles.userList,
		loading,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
		onSearch (q) {
			const { search, pathname } = location
			const query = queryString.parse(q);
			dispatch(routerRedux.push({
				pathname,
				search: search,
				query: {
					...query,
					page: 0,
					q,
				},
			}))
		},
	}

	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading.effects['roles/query'],
		pagination,
		// key: pageChange,
		currentPermissions: roles.currentPermissions,
		q,
	}
	/*const grantmodalProps = { //这里定义的是弹出窗口要绑定的数据源
		dispatch,
		treeData: roles.treeData, //当前用户的功能权限数组
		item: currentItem, //要展示在弹出窗口的选中对象
		type: roles.modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: roles.grantVisible,
		jiaList: roles.jiaList,
		jianList: roles.jianList,
		dataList: roles.dataList,
		basicDataOp: roles.basicDataOp,
		oelFilterValue: roles.oelFilterValue,
		oelFilterOldValue: roles.oelFilterOldValue,
		selectedKeys: roles.selectedKeys,
		checkedFlg: roles.checkedFlg,
		checkedKeys: roles.checkedKeys,
		moFilterValue0: roles.moFilterValue0,
		displayFlg1: roles.displayFlg1,
		displayFlg2: roles.displayFlg2,
		isClose: roles.isClose,
		menus: menu,
		permissionsTree: roles.permissionsTree,
		allPermission: roles.allPermission
	}*/
	const dataModalObjectInfoProps = { //监控对象
		dispatch,
		loading,
		objectMOsModal,
		selectIndex: roles.selectIndex,
		selectType: roles.selectType,
		jiaList: roles.jiaList,
		jianList: roles.jianList,
		objectVisible: roles.selectMOVisible,
	}

	const authorizationProps = {
		modalState,
		advKeys,
		dispatch,
		visible: authorizationVisible,
		moAddFilterValue, //监控对象新增过滤授权
		moDeleteFilterValue, //监控对象删除过滤授权
		moUpdateFilterValue, //监控对象修改过滤授权
		moReadFilterValue, //监控对象查看过滤授权

		tagAddFilterValue, //标签管理
		tagDeleteFilterValue,
		tagUpdateFilterValue,
		tagReadFilterValue,

		toolAddFilterValue, //监控工具
		toolDeleteFilterValue,
		toolUpdateFilterValue,
		toolReadFilterValue,

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
		authorization,

    readJobsFilterValue,//任务管理
    updateJobsFilterValue,
    delJobsFilterValue,
    addJobsFilterValue,
	myCreateFilterValue,//我的维护期
	myShortFilterValue,
	myPreFilterValue,
	myCheckFilterValue,
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
		oelCloseState,
		luAddState,
		luDeleteState,
		luUpdateState,
		luReadState,
		mvReadState,
		cvReadState,
		bvReadState,
		hvReadState,
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
		fcAddState,
		fcDeleteState,
		fcUpdateState,
		fcReadState,
		pfReadState,
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
	myCreateState,//我的维护期
	myShortState,
	myPreState,
	myCheckState,
		key: keys,
		permissionsTree,
		selectedKeys,
		allPermission,
		menus: menu,
		conditionAdv,
		conditionNotf,
		userInfoList,
		colors,
		//注册服务
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
	}

	const buttonZoneProps = {
		dispatch,
		batchDelete,
		selectedRows,
	}

	let buton = <ButtonZone {...buttonZoneProps} />

	return (//<GrantModal {...grantmodalProps} />
  <div className="content-inner">
    <Filter {...filterProps} buttonZone={buton} />
    <List {...listProps} />
    <Modal {...modalProps} />
    <DataModalObjectInfo {...dataModalObjectInfoProps} />
    <AuthorizationModal {...authorizationProps} />
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
	roles,
	loading,
	objectMOsModal,
	app,
}) => ({
	roles,
	loading,
	objectMOsModal,
	app,
}))(roles)
