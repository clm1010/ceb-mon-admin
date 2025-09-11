/**
 * @module 维护期管理/维护期设置
 * @description
 * ## 实例操作
 * ##### 新增
 * 添加新的实例，点击弹出新增实例窗口。
 * 
 * ##### 删除
 * 点击删除选中的实例。
 * 
 * ##### 复制
 * 选中多条实例并点击顶部“复制“按钮复制多条。
 * 
 * 批量移动
 * 选中实例点击批量移动
 * 
 * 普通模板
 * 点击下载普通的模板
 * 
 * 一线服务台专用模板
 * 点击下载专用模板
 * 
 * ##### 导入
 * 导入实例Excel文件。
 * 
 * 老平台上传
 * 上传老平台指定文件
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
 * ##### 克隆
 * 点击克隆选中的实例。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { Tree } from 'antd'
import Filter from './Filter'
import MtFilterSchema from './MtFilterSchema'
import DataList from './DataList'
import ButtonZone from './ButtonZone'
import DataModal from './DataModal'
import ImportResultModal from '../../routes/objectMO/ImportByExcel/ImportMainRuleModal'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import fenhang from './../../utils/fenhang'
import OldImport from './oldImport'
import queryString from "query-string";
//import BranchData from '../utils/maintenance/branchData'
import OperateModal from './OperateModal'
import DelBathModal from './DelBathModal'
const TreeNode = Tree.TreeNode


const MainRuleInstanceInfo = ({
 location, dispatch, mainRuleInstanceGroup, mainRuleInstanceInfo, stdIndicatorGroup, stdIndicatorsinfo, objectGroup, loading, userSelect, appSelect,
}) => {
	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
	//也可以通过 mainRuleInstanceInfo.(state的属性)来获取 state的属性
	const {
		list,
		pagination,
		currentItem,
		modalVisible,
		modalType,
		checkStatus,
		isClose,
		batchDelete,
		choosedRows,
		filterSchema,
		itemType,
		resetCalInput,
		cycles,
		tempList,
		isLevels,
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
		fetchingIP,
		fetchingApp,
		branchipOptions,
		options,
		serversOptions,
		osOptions,
		dbOptions,
		mwsOptions,
		appOptions,
		keysTime,
		pageChange,
		q,
		filterInfo,
		applicantInfo,
		moImportFileList,
	  	showUploadList,
	  	moImportResultVisible,
	 	moImportResultdataSource,
	  	moImportResultType,
	  	oldImportSource,
		oldVisible,
		expand,
		nameKey,
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
	optionSelectAppName,
	timeOut,
	nameChange,
	timeValue,
	startValue,
	endValue,
	outTimeChange,
	showEndTime,
	nowDate,
	arrGroupValue,      //高级模式的组
	showGroupValue,		//显示的数据
	forbind,
	forbindQita,
	restrict,
	selectedReviewer,
	reviewers,	
	transaStatus,
	batchStatus,
	showOperateRecord, // 显示操作记录信息
	operateRecordList, //操作记录数据
	seeOperate,
	recalculate,
	oploading,
	del_bath_visible,
	choosedRowsItem,
	checkedValue
	} = mainRuleInstanceInfo

  const user = JSON.parse(sessionStorage.getItem('user'))
	/*
		获取树节点
	*/
	let parentKeys = []
	const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			parentKeys.push(item.uuid)
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

	const dataFilterProps = { //这里定义的是查询页面要绑定的数据源
		expand,
	    filterSchema: MtFilterSchema,
      optionSelectAppName,
      dispatch,
     	onSearch (q) {
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

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		fenhang,
		dataSource: list,
		loading: loading,
		pagination,
		key: pageChange,
		batchDelete,
		choosedRows,
		user: user, //权限判断
		q,
		alarmApplyFilter: JSON.parse(sessionStorage.getItem('alarmApplyFilter')),
		moImportFileList,
	  	showUploadList,
	  	moImportResultVisible,
	 	moImportResultdataSource,
	  	moImportResultType,
	}

	//组装dataModalProps前置准备
	//if ( modalType === 'create' ) { itemType = itemType }

	const dataModalProps = {	//这里定义的是弹出窗口要绑定的数据源
		key: `${mainRuleInstanceInfo.ruleInstanceKey}_1`,
		loading,
		dispatch,
		item: currentItem || {},		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		itemType,
		resetCalInput,
		treeNodes: mainRuleInstanceGroup.treeDatas.length > 0 ? loopSelect(mainRuleInstanceGroup.treeDatas) : [],
		cycles,
		isenabled,
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
		fenhang,
		checked: mainRuleInstanceInfo.checked,
		listHost1: mainRuleInstanceInfo.listHost1,
		listHost2: mainRuleInstanceInfo.listHost2,
		host2portMap: mainRuleInstanceInfo.host2portMap,
		listPort1: mainRuleInstanceInfo.listPort1,
		listPort2: mainRuleInstanceInfo.listPort2,
		listApp1: mainRuleInstanceInfo.listApp1,
		listApp2: mainRuleInstanceInfo.listApp2,
		listQita1: mainRuleInstanceInfo.listQita1,
		listQita2: mainRuleInstanceInfo.listQita2,
		listDistributed2: mainRuleInstanceInfo.listDistributed2,
		paginationHost: mainRuleInstanceInfo.paginationHost,
		paginationPort: mainRuleInstanceInfo.paginationPort,
		paginationApp: mainRuleInstanceInfo.paginationApp,
		paginationQita: mainRuleInstanceInfo.paginationQita,
		selectHostuuid: mainRuleInstanceInfo.selectHostuuid,
		selectedKeysHost1: mainRuleInstanceInfo.selectedKeysHost1,
		selectedKeysHost2: mainRuleInstanceInfo.selectedKeysHost2,
		selectedKeysPort1: mainRuleInstanceInfo.selectedKeysPort1,
		selectedKeysPort2: mainRuleInstanceInfo.selectedKeysPort2,
		selectedKeysApp1: mainRuleInstanceInfo.selectedKeysApp1,
		selectedKeysApp2: mainRuleInstanceInfo.selectedKeysApp2,
		selectedKeysQita1: mainRuleInstanceInfo.selectedKeysQita1,
		selectedKeysQita2: mainRuleInstanceInfo.selectedKeysQita2,
		alarmType: mainRuleInstanceInfo.alarmType,
		moFilterValue: mainRuleInstanceInfo.moFilterValue,
		list,
		//	    branchArray: mainRuleInstanceInfo.branchArray,
		//	    branchStr: mainRuleInstanceInfo.branchStr,
		user: user, //权限判断
		buttonState: mainRuleInstanceInfo.buttonState,
		hostOtherValue: mainRuleInstanceInfo.hostOtherValue,
		appOtherValue: mainRuleInstanceInfo.appOtherValue,
		gjtzOtherValue: mainRuleInstanceInfo.gjtzOtherValue,
		fetchingIP,
		fetchingApp,
		alertGroupValue: mainRuleInstanceInfo.alertGroupValue,
		componentValue: mainRuleInstanceInfo.componentValue,
		alertLevel:mainRuleInstanceInfo.alertLevel,
		AgentValue:mainRuleInstanceInfo.AgentValue,
		targetGroupUUIDs: mainRuleInstanceInfo.targetGroupUUIDs,
		branchipOptions: mainRuleInstanceInfo.branchipOptions,
		options: mainRuleInstanceInfo.options,
		serversOptions,
		osOptions,
		dbOptions,
		mwsOptions,
		appOptions,
		alarmApplyFilter: JSON.parse(sessionStorage.getItem('alarmApplyFilter')),
		filterInfo,
		userSelect,
		applicantInfo,
		appSelect,
		nameKey,
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
		nowDate,
		arrGroupValue,      //高级模式的组
		showGroupValue,		//显示的数据
		forbind,
		forbindQita,
		restrict,
		selectedReviewer,
		reviewers,
		transaStatus,
		batchStatus,
		operateRecordList,
		recalculate,
		oploading,
		checkedValue,
	}

	const dataModalCopyOrMoveProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
		visible: mainRuleInstanceInfo.modalVisibleCopyOrMove, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: mainRuleInstanceGroup.treeDatas.length > 0 ? loop(mainRuleInstanceGroup.treeDatas) : [],
		isClose,
		choosedRows,
		key: keysTime,
	}

	const importResultModalProps = {
  		dispatch,
  		visible: moImportResultVisible,
  		type: moImportResultType,
  		dataSource: moImportResultdataSource,
  		queryPath: 'mainRuleInstanceInfo/updateState',
  	}

	const oldImportProps = {
		dispatch,
		visible: oldVisible,
		dataSource: oldImportSource,
	}

	const buttonZoneProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		fenhang,
		dataSource: list,
		loading: loading,
		pagination,
		key: pageChange,
		batchDelete,
		choosedRows,
		user: user, //权限判断
		q,
		alarmApplyFilter: JSON.parse(sessionStorage.getItem('alarmApplyFilter')),
		moImportFileList,
	  	showUploadList,
	  	moImportResultVisible,
	 	moImportResultdataSource,
		moImportResultType,
		expand,
	}
	const operateModalPropos = {
		showOperateRecord,
		operateRecordList,
		dispatch,
		seeOperate,
	}
	let btZone = <ButtonZone {...buttonZoneProps} />

	const delbathPropos = {
		dispatch,
		del_bath_visible,
		dataSource : choosedRowsItem,
		choosedRows,
	}
	return (
		<div className="content-inner">
			<Filter {...dataFilterProps} buttonZone={btZone} />
			<DataList {...dataListProps} />
			<DataModal {...dataModalProps} />
			<DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
			<ImportResultModal {...importResultModalProps} />
			<OldImport {...oldImportProps} />
			<OperateModal {...operateModalPropos}/>
			<DelBathModal {...delbathPropos} />
			{/*
				<BranchData {...branchDataProps}/>
			*/}
		</div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default MainRuleInstanceInfo
