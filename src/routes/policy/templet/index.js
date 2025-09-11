import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import IndicatorsModal from './IndicatorsModal'
import DataModalStdInfo from './DataModalStdInfo'
import { TreeSelect,Tree  } from 'antd'
import stdColums from './stdColums'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import PolicyModalDesc from '../../../components/policyModal/PolicyModalDesc'
import PolicyColumns from '../../../utils/PolicyColumns'
import MosColumns from '../../../utils/MosColumns'
//新增策略模板-操作详情部分功能代码----start
import OperationModalDesc from '../utils/OperationModalDesc'
//新增策略模板-操作详情部分功能代码----end
import ColumeEdit from './ColumeEdit'
import treeDataApp from '../../../utils/treeDataApp'
import fenhang from '../../../utils/fenhang'
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal'
import queryString from "query-string";
import HelpButton from '../../../components/helpButton'

const TreeSelectNode = TreeSelect.TreeNode
const TreeNode = Tree.TreeNode
const policyTemplet = ({
	policyTempletGroup,
	location,
	dispatch,
	stdIndicatorGroup,
	policyTemplet,
	app,
	loading,
}) => {
	const {
		CheckboxSate,CheckboxSate1,indicatorsItem,stdInfoVal,stdList,timeList,kpiVisible,list,stdgroupUUID,pagination,pagination1,currentItem,modalVisible,modalType,checkStatus,isClose,batchDelete,choosedRows,
		filterSchema,tabstate,typeValue,keys,pageChange,q,see,expand,groupUUID, moImportFileList, showUploadList, moImportResultVisible,moImportResultType,moImportResultdataSource,
		filter,selectIndex,resetCalInput,modaType,advancedItem,
		xyAais,yAais,legend,option1,content,expr,showFlag // performance data display
	} = policyTemplet //这里把入参tool做了拆分，后面代码可以直接调用拆分的变量
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
		type: policyTemplet.copyOrMoveModalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: policyTemplet.copyOrMoveModal, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: policyTempletGroup.treeDatas.length > 0 ? loop(policyTempletGroup.treeDatas) : [],
		choosedRows,
		key: keys,
	}
	const modalProps = { //这里定义的是弹出窗口要绑定的数据源
		modalType,
		fenhang,
		dispatch,
		item: modalType === 'create' ? {
			policyTemplate: {
				policyType: 'NORMAL',
				collectParams: {},
			},

		} : currentItem, //要展示在弹出窗口的选中对象
		type: modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible, //弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		isClose,
		tabstate,
		typeValue,
		stdInfoVal,
		timeList,
		treeNodes: policyTempletGroup.treeDatas.length > 0 ? loopSelect(policyTempletGroup.treeDatas) : [],
		treeDataApp,
		operationType: policyTemplet.operationType,
		see,
	}
	const columeModalProps = { //这里定义的是弹出窗口要绑定的数据源
		modalType,
		dispatch,
		item: modalType === 'create' ? {
			policyTemplate: {
				policyType: 'NORMAL',
				collectParams: {},
			},

		} : currentItem, //要展示在弹出窗口的选中对象
		type: modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: policyTemplet.columeVisible, //弹出窗口的可见性是true还是false
		isClose,
		columeList: policyTemplet.columeList,
		columeInfo: policyTemplet.columeInfo,
		selectKey1: policyTemplet.selectKey1,
		selectKey2: policyTemplet.selectKey2,
	}
	const dataModalStdInfoProps = {
		dispatch,
		loading,
		visible: kpiVisible,
		treeNodes: ((stdIndicatorGroup && stdIndicatorGroup.treeDatas && stdIndicatorGroup.treeDatas.length > 0) ? loop(stdIndicatorGroup.treeDatas) : []),
		//expandKeys:expandkeys, //默认全部打开
		tableList: ((stdList && stdList.length > 0) ? stdList : []),
		pagination: pagination1,
		Columns: stdColums,
		isClose,
		stdgroupUUID, //选中的 指标分组
		selectIndex,
		filter,
		modaType,
		fileType: policyTemplet.fileType,
	}
	const filterProps = { //这里定义的是查询页面要绑定的数据源
		//key: policyTemplet.filterKey,
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
	}

	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		fenhang,
		loading: loading,
		pagination,
		batchDelete,
		choosedRows,
		key: pageChange,
		q,
	}
	/*
		关联的实例
	*/
	const policyListProps = {
		dispatch,
		loading,
		scroll: 0,
		columns: PolicyColumns,
		dataSource: policyTemplet.policyList,
		pagination: policyTemplet.paginationPolicy,
		onPageChange (page) {
			/*
				获取关联实例的数据
			*/
			dispatch({
				type: 'policyTemplet/queryPolicies',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
				},
			})
		},

	}
	const policyModalDescProps = {
		dispatch,
		visible: policyTemplet.policyVisible,
		policyListProps,
		loading,
		titlename: '关联策略实例',
		policyObjInfo: `关联策略实例数 ${policyTemplet.stdPolicyNumber}`,
		onCancel () {
			dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					policyVisible: false,
					stdUUIDToPolicy: '', //点击cancel 值为空
					stdPolicyNumber: 0,
					policyList: [],
				},
			})
		},
	}
	/*
		关联的对象
	*/
	const mosListProps = {
		dispatch,
		loading,
		scroll: 3500,
		columns: MosColumns,
		dataSource: policyTemplet.mosList,
		pagination: policyTemplet.paginationPolicy,
		onPageChange (page) {
			dispatch({
				type: 'policyTemplet/queryMos',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
					relatedType: 'POLICY_TEMPLATE',
				},
			})
		},

	}
	const mosModalDescProps = {
		dispatch,
		visible: policyTemplet.mosVisible,
		policyListProps: mosListProps,
		loading,
		titlename: '关联监控对象',
		policyObjInfo: `关联监控对象数 ${policyTemplet.stdMosNumber}`,

		onCancel () {
			dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					mosVisible: false,
					stdUUIDMos: '', //点击cancel 值为空
					stdMosNumber: 0,
					mosList: [],
				},
			})
		},
	}
	const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
		dispatch,
		visible: policyTemplet.operationVisible,
		fileType: policyTemplet.fileType,
		loading,
		newOperationItem: policyTemplet.newOperationItem,
		checkStatus, //检测状态done,success,fail,checking
		isClose,
		tabstate,
		typeValue,
		stdInfoVal,
		timeList,
		CheckboxSate,
		CheckboxSate1,
		treeNodes: policyTempletGroup.treeDatas.length > 0 ? loopSelect(policyTempletGroup.treeDatas) : [],
		treeDataApp,
		operationType: policyTemplet.operationType, //记录操作详情操作状态，add/edit
		filter:filter,
		advancedItem,
		resetCalInput,
		isDS:(typeValue === 'PROMETHEUS'),
		performanceItem:{
			xyAais:xyAais,
			yAais:yAais,
			legend:legend,
			option1:option1,
			content:content,
			expr:expr,
			showFlag:showFlag,
		}
	}
	//新增策略模板-操作详情部分功能代码----end
	const indicatorsModalProps = {
		dispatch,
		indicatorsItem, //要展示在弹出窗口的选中对象
		visible: policyTemplet.indicatorsModalVisible, //弹出窗口的可见性是true还是false
	}
	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'policyTemplet/updateState'
	}
	const user = JSON.parse(sessionStorage.getItem('user'))
	const buttonZoneProps = {
	  	dispatch,
	  	batchDelete,
	  	choosedRows,
		expand,
		q,
		groupUUID,
		user:user,
		moImportFileList,
		showUploadList
	}
  	let buton = <ButtonZone {...buttonZoneProps} />

	const hbProps = {
		title:'策略模板',
		tag:'policyTemplet'
	}
	return (
  <div className="content-inner">
    <Filter {...filterProps} buttonZone={buton} />
    <List {...listProps} />
	<HelpButton {...hbProps}/>
    <Modal {...modalProps} />

    <DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
    <DataModalStdInfo {...dataModalStdInfoProps} />

{/*     <PolicyModalDesc {...policyModalDescProps} />
    <PolicyModalDesc {...mosModalDescProps} /> */}
    <OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
    <IndicatorsModal {...indicatorsModalProps} />
	<ImportResultModal {...importResultModalProps}/>
    {/*<ColumeEdit {...columeModalProps}/>*/}
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default policyTemplet
