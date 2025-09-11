/**
 * @module 维护期管理/维护期模板
 * @description
 * ## 实例操作
 * ##### 新增
 * 添加新的实例，点击弹出新增实例窗口。
 * 
 * ##### 删除
 * 点击删除选中的实例。
 * 
 * ##### 批量复制
 * 选中多条实例并点击顶部“复制“按钮复制多条。
 * 
 * 批量移动
 * 选中实例点击批量移动
 * 
 * ##### 删除
 * 选中实例并点击顶部或右侧"删除"按钮删除实例。
 * 
 * ##### 查看
 * 点击打开查看标准实例窗口。
 * 
 * ##### 编辑
 * 点击打开编辑标准实例窗口进行编辑。
 * 
 * ##### 实例化
 * 点击打开实例化实例窗口进行编辑。
 * 
 * ##### 克隆
 * 点击克隆选中的实例。
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from './Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import DataModal from './DataModal'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import ImportResultModal from '../../../routes/objectMO/ImportByExcel/ImportMainRuleModal'
import { Tree } from 'antd'
import fenhang from '../../../utils/fenhang'
import ModalInstance from './ModalInstance'
import queryString from "query-string";
const TreeNode = Tree.TreeNode

const maintenanceTemplet = ({
	maintenanceTempletGroup, location, dispatch, maintenanceTemplet, loading, userSelect, appSelect,
}) => {
	const user = JSON.parse(sessionStorage.getItem('user'))
	const {
		list,
		pagination,
		pagination1,
		currentItem,
		modalVisible,
		modalType,
		datamodalVisible,
		datamodalType,
		isClose,
		batchDelete,
		choosedRows,
		filterSchema,
		Filters,
		itemType,
		cycles,
		tempList,
		timeType,
		tempDayList,
		tempWeekListMon,
		tempWeekListTue,
		tempWeekListWed,
		tempWeekListThu,
		tempWeekListFri,
		tempWeekListSat,
		tempWeekListSun,
		checkedWeek,
		isenabled,
		isExpert,
		fetchingIP,
		fetchingApp,
		localPath,
		branchipOptions,					//网点
		options,							//网络域四霸
		serversOptions, //主机
		osOptions,							//操作系统
		dbOptions,							//数据库
		mwsOptions,							//中间件
		appOptions,							//应用
		keysTime,
		pageChange,
		q,
		applicantInfo,
		expand,
		optionAppNameEditing,
		optionCluster,
		optionNamespace,
		optionIndicator,
		appNameAuto,
		appNameEditing,
		appDistributed,
		clusterDistributed,
		namespaceDistributed,
		indicatorDistributed,
		appDistributedFlag,
		clusterDistributedFlag,
		namespaceDistributedFlag,
		indicatorDistributedFlag,
		timeOut,
		nameChange,
		timeValue,
		startValue,
		endValue,
		outTimeChange,
		showEndTime,
		arrGroupValue,
		showGroupValue,
		forbind,
		restrict,
		selectedReviewer,
		reviewers,
		whitelistEnabled,
		transaStatus,
		batchStatus,
		instanceVisible,
		moImportResultVisible,
		moImportResultType,
		moImportResultdataSource,
		alertLevel,
		AgentValue,
		ticket,
		timeRange,
	} = maintenanceTemplet

	const {
		selectTreeNode,
		selectKeys
	} = maintenanceTempletGroup
	/*
		获取树节点
	*/
	const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})

	/*
		获取选择树节点
	*/
	const loopSelect = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
	})
	const dataModalCopyOrMoveProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: maintenanceTemplet.copyOrMoveModalType,
		visible: maintenanceTemplet.copyOrMoveModal, //弹出窗口的可见性是true还是false
		treeNodes: maintenanceTempletGroup.treeDatas.length > 0 ? loop(maintenanceTempletGroup.treeDatas) : [],
		choosedRows,
		key: keysTime,
	}
	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		modalType,
		dispatch,
		currentItem: modalType === 'create' ? {} : maintenanceTemplet.currentItem,		//要展示在弹出窗口的选中对象
	    type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
	    visible: modalVisible,															//弹出窗口的可见性是true还是false
	    isClose,
	    loading,
	    fenhang,
	    listHost1: maintenanceTemplet.listHost1,
	    listHost2: maintenanceTemplet.listHost2,
	    host2portMap: maintenanceTemplet.host2portMap,
	    listPort1: maintenanceTemplet.listPort1,
	    listPort2: maintenanceTemplet.listPort2,
	    listApp1: maintenanceTemplet.listApp1,
	    listApp2: maintenanceTemplet.listApp2,
	    listQita1: maintenanceTemplet.listQita1,
	    listQita2: maintenanceTemplet.listQita2,
		listDistributed2: maintenanceTemplet.listDistributed2,
	    paginationHost: maintenanceTemplet.paginationHost,
	    paginationPort: maintenanceTemplet.paginationPort,
	    paginationApp: maintenanceTemplet.paginationApp,
	    paginationQita: maintenanceTemplet.paginationQita,
	    selectHostuuid: maintenanceTemplet.selectHostuuid,

		selectedKeysHost1: maintenanceTemplet.selectedKeysHost1,
		selectedKeysHost2: maintenanceTemplet.selectedKeysHost2,
		selectedKeysPort1: maintenanceTemplet.selectedKeysPort1,
		selectedKeysPort2: maintenanceTemplet.selectedKeysPort2,
		selectedKeysApp1: maintenanceTemplet.selectedKeysApp1,
		selectedKeysApp2: maintenanceTemplet.selectedKeysApp2,
		selectedKeysQita1: maintenanceTemplet.selectedKeysQita1,
		selectedKeysQita2: maintenanceTemplet.selectedKeysQita2,

	    alarmType: maintenanceTemplet.alarmType,
	    moFilterValue: maintenanceTemplet.moFilterValue,
	    list,
	    buttonState: maintenanceTemplet.buttonState,
	    user: user,
	    isExpert,
	    	hostOtherValue: maintenanceTemplet.hostOtherValue,
  		appOtherValue: maintenanceTemplet.appOtherValue,
  		gjtzOtherValue: maintenanceTemplet.gjtzOtherValue,
  		fetchingIP: maintenanceTemplet.fetchingIP,
  		fetchingApp,
  		alertGroupValue: maintenanceTemplet.alertGroupValue,
  		componentValue: maintenanceTemplet.componentValue,
  		targetGroupUUIDs: maintenanceTemplet.targetGroupUUIDs,
  		branchipOptions,				//网点
   		options: maintenanceTemplet.options,								//网络域四霸
   		serversOptions,					//主机
	    osOptions,							//操作系统
	    dbOptions,							//数据库
	    mwsOptions,							//中间件
	    appOptions,							//应用
	    appSelect,
		appDistributed,
		clusterDistributed,
		namespaceDistributed,
		indicatorDistributed,
		appDistributedFlag,
		clusterDistributedFlag,
		namespaceDistributedFlag,
		indicatorDistributedFlag,
		optionAppNameEditing: maintenanceTemplet.optionAppNameEditing,
		optionCluster,
		optionNamespace,
		optionIndicator,
		appNameAuto,
		appNameEditing,
		arrGroupValue,
		showGroupValue,
		forbind,
		transaStatus,
		batchStatus,
		userSelect,
		applicantInfo,
		alertLevel,
		AgentValue,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		key: maintenanceTemplet.filterKey,
		expand: false,
		filterSchema: FilterSchema,
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
			query.page = 0
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({
				pathname,
				search: stringified,
				query,
				/*query: {
					...query,
				page: 0,
				q,
			},*/
			}))
		},
	}

	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,
		pagination,
		fenhang,
		key: pageChange,
		batchDelete,
		choosedRows,
		Filter,
		user: user,
		q,
	}

	const dataModalProps = {	//这里定义的是弹出窗口要绑定的数据源
		key: `${maintenanceTemplet.ruleInstanceKey}_2`,
		loading,
		dispatch,
		item: currentItem || {},		//要展示在弹出窗口的选中对象
		type: datamodalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: datamodalVisible,															//弹出窗口的可见性是true还是false
		//		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		itemType,
		//		resetCalInput: resetCalInput,
		//		treeNodes: mainRuleInstanceGroup.treeDatas.length > 0 ? loopSelect(mainRuleInstanceGroup.treeDatas) : [],
		cycles,
		isenabled,
		Filters,
		checkedWeek,
		tempList,
		tempDayList,
		tempWeekListMon,
		tempWeekListTue,
		tempWeekListWed,
		tempWeekListThu,
		tempWeekListFri,
		tempWeekListSat,
		tempWeekListSun,
		timeType,

		listHost1: maintenanceTemplet.listHost1,
	    listHost2: maintenanceTemplet.listHost2,
	    host2portMap: maintenanceTemplet.host2portMap,
	    listPort1: maintenanceTemplet.listPort1,
	    listPort2: maintenanceTemplet.listPort2,
	    listApp1: maintenanceTemplet.listApp1,
	    listApp2: maintenanceTemplet.listApp2,
	    listQita1: maintenanceTemplet.listQita1,
	    listQita2: maintenanceTemplet.listQita2,
		listDistributed2: maintenanceTemplet.listDistributed2,
	    paginationHost: maintenanceTemplet.paginationHost,
	    paginationPort: maintenanceTemplet.paginationPort,
	    paginationApp: maintenanceTemplet.paginationApp,
	    paginationQita: maintenanceTemplet.paginationQita,
	    selectHostuuid: maintenanceTemplet.selectHostuuid,

		selectedKeysHost1: maintenanceTemplet.selectedKeysHost1,
		selectedKeysHost2: maintenanceTemplet.selectedKeysHost2,
		selectedKeysPort1: maintenanceTemplet.selectedKeysPort1,
		selectedKeysPort2: maintenanceTemplet.selectedKeysPort2,
		selectedKeysApp1: maintenanceTemplet.selectedKeysApp1,
		selectedKeysApp2: maintenanceTemplet.selectedKeysApp2,
		selectedKeysQita1: maintenanceTemplet.selectedKeysQita1,
		selectedKeysQita2: maintenanceTemplet.selectedKeysQita2,

		alarmType: maintenanceTemplet.alarmType,
		moFilterValue: maintenanceTemplet.moFilterValue,
		vaillist: maintenanceTemplet.vaillist,
		user: user,
		buttonState: maintenanceTemplet.buttonState,
		isExpert,
		hostOtherValue: maintenanceTemplet.hostOtherValue,
		appOtherValue: maintenanceTemplet.appOtherValue,
		gjtzOtherValue: maintenanceTemplet.gjtzOtherValue,
		localPath,
		fetchingIP: maintenanceTemplet.fetchingIP,
		alertGroupValue: maintenanceTemplet.alertGroupValue,
		componentValue: maintenanceTemplet.componentValue,
		branchipOptions: maintenanceTemplet.branchipOptions,					//网点
		options: maintenanceTemplet.options,							//网络域四霸
		serversOptions, //主机
		osOptions,							//操作系统
		dbOptions,							//数据库
		mwsOptions,							//中间件
		appOptions,							//应用
		userSelect,
		applicantInfo,
		appSelect,
		optionAppNameEditing,
		optionCluster,
		optionNamespace,
		optionIndicator,
		appNameAuto,
		appNameEditing,
		appDistributed,
		clusterDistributed,
		namespaceDistributed,
		indicatorDistributed,
		appDistributedFlag,
		clusterDistributedFlag,
		namespaceDistributedFlag,
		indicatorDistributedFlag,
		timeOut,
		nameChange,
		timeValue,
		startValue,
		endValue,
		outTimeChange,
		showEndTime,
		arrGroupValue,
		showGroupValue,
		forbind,
		restrict,
		selectedReviewer,
		reviewers,
		whitelistEnabled,
		transaStatus,
		batchStatus,
		alertLevel,
		AgentValue,
	}

	const Instanceropos = {
		dispatch,
		choosedRows,
		instanceVisible,
		user,
		userSelect,
		applicantInfo,
		choosedRows,
		tempList,
		timeOut,          //改开始
		showEndTime,     //结束
		reviewers,
		timeValue,
		selectedReviewer, //授权人
		reviewers,
		endValue,
		startValue,
		nameChange,
		restrict, //权限
		selectTreeNode,
		ticket,
		timeRange,
	}
	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'maintenanceTemplet/updateState',
	}

	const buttonZoneProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,
		pagination,
		fenhang,
		key: pageChange,
		batchDelete,
		choosedRows,
		Filter,
		user: user,
		q,
		expand,
		selectKeys,
		selectTreeNode
	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
		<div className="content-inner">
			<Filter {...filterProps} buttonZone={btZone} />
			<List {...listProps} />
			<Modal {...modalProps} />
			<DataModal {...dataModalProps} />
			<DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
			<ModalInstance {...Instanceropos} />
			<ImportResultModal {...importResultModalProps} />
		</div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default maintenanceTemplet
