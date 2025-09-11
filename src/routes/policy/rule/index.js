import React from 'react'
import { routerRedux } from 'dva/router'
import { TreeSelect,Tree  } from 'antd'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import Calculate from './Calculate'
import CalcBranch from '../utils/calcBranch'
import DataModalMoFilters from '../../../components/ConditionFilter/DataModalMoFilters'
import SelectTemplets from './SelectTemplets'
import stdColums from '../templet/stdColums'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import MonitorInstanceModal from './MonitorInstanceModal'
import DataModalStdInfo from './DataModalStdInfo'
import DataModalObjectInfo from '../utils/DataModalObjectInfo' //监控对象
import fenhang from '../../../utils/fenhang'
import queryString from "query-string";
//新增策略模板-操作详情部分功能代码----start
import OperationModalDesc from '../utils/OperationModalDesc'
const TreeSelectNode = TreeSelect.TreeNode
const TreeNode = Tree.TreeNode
//新增策略模板-操作详情部分功能代码----end
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal' //导入
import LabelModal from './lableinfo'
import HelpButton from '../../../components/helpButton'
const policyRule = ({
	policyRuleGroup,
	location,
	dispatch,
	objectGroup,
	stdIndicatorGroup,
	policyRule,
	policyTempletGroup,
	objectMOsModal,
	loading,
	app,
	appSelect,
	labelGroup,
}) => {
	const {
		tempgroupUUID,alarmFilterOldInfo,alarmFilterInfo,pagination1,templets,selectIndex,tempList,objectVisible,tempVisible,list,pagination,currentItem,modalVisible,modalType,checkStatus,isClose,batchDelete,choosedRows,
		filterSchema,checkAll,checkedList,indeterminate,keys,pageChange,q,see,calculateState,issueState,expand,groupUUID, moImportFileList, showUploadList, moImportResultVisible, moImportResultType, moImportResultdataSource,
		typeValue, labelVisible, lablelist, lablepagination, lableInfoVal,element, lableInfoVal1,element1,either,labelgroupUUID,selectItemObj,ArrNodes,treeData
	} = policyRule
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
			return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeSelectNode>
		}
		return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
	})
	const dataModalCopyOrMoveProps = { //这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: policyRule.copyOrMoveModalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: policyRule.copyOrMoveModal, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: policyRuleGroup.treeDatas.length > 0 ? loop(policyRuleGroup.treeDatas) : [],
		choosedRows,
		key: keys,
	}
	const modalProps = { //这里定义的是弹出窗口要绑定的数据源
		modalType,
		dispatch,
		fenhang,
		item: modalType === 'create' ? {} : currentItem, //要展示在弹出窗口的选中对象
		type: modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible, //弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		isClose,
		tempList,
		/*
	    ruleValue:ruleValue,
	    ruleValue1:ruleValue1,
		*/
		alarmFilterInfo,
		treeNodes: policyRuleGroup.treeDatas.length > 0 ? loopSelect(policyRuleGroup.treeDatas) : [],
		see,
		key: `${policyRule.modalVisibleKey}_0`,
		typeValue,
		lableInfoVal,
		element,
		lableInfoVal1,
		element1,
		ArrNodes,
		treeData,
	}
	/*
  const objectModalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
    visible: objectVisible,
    ruleValue:ruleValue		,
    ruleValue1:ruleValue1,
    alarmFilterInfo:alarmFilterInfo,
    alarmFilterType:alarmFilterType,
  }
  */

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
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
		queryPreProcess (data) {
			if (data.tags_name !== undefined) {
				data['tags.name'] = data.tags_name
				delete data.tags_name
			}
			return data
		},
	}

	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,
		fenhang,
		pagination,
		batchDelete,
		choosedRows,
		q,
	}

	const selectTempletsProps = {
		key: `${policyRule.modalVisibleKey}_2`,
		dispatch,
		visible: tempVisible,
		tempList,
		selectIndex,
		templets,
		pagination1,
		loading,
		treeNodes: ((policyTempletGroup && policyTempletGroup.treeDatas && policyTempletGroup.treeDatas.length > 0) ? loop(policyTempletGroup.treeDatas) : []),
		tempgroupUUID, //选中的 指标分组
		//treeNodes:policyTempletGroup.treeDatas,
		typeValue,
	}

	const DataModalMoFiltersProps = {
		key: `${policyRule.modalVisibleKey}_1`,
		dispatch,
		loading,
		visible: objectVisible, //控制弹出窗
		visibleName: 'objectVisible', //控制弹出窗state中的名称
		moFilterValue: alarmFilterInfo, //保存对象的值
		moFilterName: 'alarmFilterInfo', //保存对象在state中的名称，
		moFilterOldValue: alarmFilterOldInfo, //保存最初的状态,点击cancel的时候可以恢复，在编辑时很有用
		queryPath: 'policyRule/updateState', //保存的路径
		title: '监控对象关联规则', //弹出窗的名称
		moTreeDatas: (objectGroup && objectGroup.treeDatas && objectGroup.treeDatas.length > 0 ? objectGroup.treeDatas : []), //MO节点树
		appsInfos: (appSelect && appSelect.list && appSelect.list.length > 0 ? appSelect.list : []),
		typeValue,
	}

	const calculateProps = {
		dispatch,
		loading,
		visible: policyRule.calculateVisible, //控制弹出窗
		dataSource1: policyRule.dataSource1,
		dataSource2: policyRule.dataSource2,
		dataSource3: policyRule.dataSource3,
		dataSource4: policyRule.dataSource4,
		dataSource5: policyRule.dataSource5,
		dataSource6: policyRule.dataSource6,
		user: JSON.parse(sessionStorage.getItem('user')), //下发权限控制
		fenhang, //分行列表
		checkAll,
		checkedList,
		indeterminate,
		criteria: policyRule.criteria,
		issueState,
	}

	const calcBranchProps = {
		dispatch,
		loading,
		visible: policyRule.branchVisible, //控制弹出窗
		user: JSON.parse(sessionStorage.getItem('user')), //下发权限控制
		fenhang, //分行列表
		checkAll,
		checkedList,
		indeterminate,
		fenhangArr: policyRule.fenhangArr,
		onCancel () {
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					branchVisible: false,
					checkedList: [],
				},
			})
		},
		calculateState,
	}

	const MonitorInstanceProps = { //这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: policyRule.MonitorInstanceItem,
		visible: policyRule.monitorInstanceVisible,
		tabstate: policyRule.tabstate,
		typeValue: policyRule.typeValue,
		stdInfoVal: policyRule.stdInfoVal,
		timeList: policyRule.timeList,
		type: policyRule.monitorInstanceType,
		obInfoVal: policyRule.obInfoVal,
		operationType: policyRule.operationType,
	}
	const dataModalStdInfoProps = {
		dispatch,
		loading,
		visible: policyRule.kpiVisible,
		treeNodes: ((stdIndicatorGroup && stdIndicatorGroup.treeDatas && stdIndicatorGroup.treeDatas.length > 0) ? loop(stdIndicatorGroup.treeDatas) : []),
		tableList: ((policyRule.stdList && policyRule.stdList.length > 0) ? policyRule.stdList : []),
		pagination: policyRule.pagination2,
		Columns: stdColums,
		stdgroupUUID: policyRule.stdgroupUUID, //选中的 指标分组
	}

	/*
	const dataModalObjectInfoProps = {    //监控对象
		dispatch,
		loading,
		visible:policyRule.selectObjectVisible,
	  treeNodes: ((objectGroup && objectGroup.treeDatas && objectGroup.treeDatas.length > 0) ?  loop(objectGroup.treeDatas) : []),

		tableList: ((policyRule.obList && policyRule.obList.length > 0) ? policyRule.obList : []),
		pagination: policyRule.pagination3,
		Columns:objectColums,
		isClose,
		obgroupUUID:policyRule.obgroupUUID,   //选中的 对象分组
	}
	*/
	const dataModalObjectInfoProps = { //监控对象
		dispatch,
		loading,
		objectMOsModal,
		obInfoValName: 'obInfoVal', //更新选择的对象名称
		statePath: 'policyRule/updateState', //更新选择对象的路径
		objectVisible: policyRule.selectObjectVisible,
		objectVisibleName: 'selectObjectVisible',
		key: `${objectMOsModal.openModalKey}_openKey`,
	}
	const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
		dispatch,
		visible: policyRule.operationVisible,
		fileType: policyRule.fileType,
		loading,
		newOperationItem: policyRule.newOperationItem,
		checkStatus, //检测状态done,success,fail,checking
		isClose,
		tabstate: policyRule.tabstate,
		typeValue: policyRule.typeValue,
		stdInfoVal: policyRule.stdInfoVal,
		timeList: policyRule.timeList,
//		treeNodes: ruleInstanceGroup.treeDatas.length > 0 ? loopSelect(ruleInstanceGroup.treeDatas) : [],
//		treeDataApp,
		operationType: policyRule.operationType, //记录操作详情操作状态，add/edit
		onCancel () {
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					operationVisible: false,
				},
			})
		},
	}
	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'policyRule/updateState',
	}
	const lableinfo = {
		visible:labelVisible,
		dispatch,
		loading,
		lablelist,
		lablepagination,
		lableInfoVal,
		lableInfoVal1,
		treeNodes: ((labelGroup && labelGroup.treeDatas && labelGroup.treeDatas.length > 0) ? loop(labelGroup.treeDatas) : []),
		either,
		labelgroupUUID,
	}
	const user = JSON.parse(sessionStorage.getItem('user'))
	const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
		expand,
		q,
		groupUUID,
		moImportFileList,
		showUploadList,
		user: user,
	}
  	let buton = <ButtonZone {...buttonZoneProps} />
	const hbProps = {
		title:'策略规则',
		tag:'policyRule'
	}

	//新增策略模板-操作详情部分功能代码----end
	return (
  <div className="content-inner">
    <Filter {...filterProps} buttonZone={buton} />
    <List {...listProps} />
	<HelpButton {...hbProps}/>
    <Modal {...modalProps} />
    <DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
    <DataModalMoFilters {...DataModalMoFiltersProps} />
    <Calculate {...calculateProps} />
    <CalcBranch {...calcBranchProps} />
    <SelectTemplets {...selectTempletsProps} />
    <MonitorInstanceModal {...MonitorInstanceProps} />
    <DataModalStdInfo {...dataModalStdInfoProps} />
    <DataModalObjectInfo {...dataModalObjectInfoProps} />
	{/* <OperationModalDesc {...operationModalDescProps} />新增策略模板-操作详情部分功能代码 */}
	<ImportResultModal {...importResultModalProps}/>
	<LabelModal {...lableinfo}/>
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default policyRule
