import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { TreeSelect, Tree} from 'antd'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import DataList from './DataList'
import ButtonZone from './ButtonZone'
import DataModal from './DataModal'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import DataModalStdInfo from './DataModalStdInfo'
import DataModalMoFilters from '../../components/ConditionFilter/DataModalMoFilters'
import DataModalItemInfo from './DataModalItemInfo'
import Columns from './Columns'
import stdColums from './stdColums'
import ImportResultModal from '../../routes/objectMO/ImportByExcel/ImportResultModal'
import queryString from "query-string";
import HelpButton from "../../components/helpButton"
const TreeSelectNode = TreeSelect.TreeNode
const TreeNode = Tree.TreeNode


const ZabbixItemsInfo = ({
 location, dispatch, zabbixItemsGroup, zabbixItemsInfo, stdIndicatorGroup, objectGroup, appSelect, app, loading,
}) => {
	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
	//也可以通过 zabbixItemsInfo.(state的属性)来获取 state的属性
	const {
 list, pagination, currentItem, flag,modalVisible, tempList,hasPreParams,modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, itemType, resetCalInput, pageChange, q, selectTreeNodeKeys, see, expand, groupUUID,
 moImportFileList, showUploadList, moImportResultVisible,moImportResultType,moImportResultdataSource,chooseWay} = zabbixItemsInfo
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
			return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeSelectNode>
		}
		return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
	})

	const dataFilterProps = {
		key: zabbixItemsInfo.filterKey,
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
			if (data.filters.filterItems.value !== undefined) {
				data['filters.filterItems.value'] = data.filters.filterItems.value
				delete data.filters.filterItems.value
			}
			if (data.stdIndicator_name !== undefined) {
				data['stdIndicator.name'] = data.stdIndicator_name
				delete data.stdIndicator_name
			  }
			return data
		},
	}

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,
		pagination,
		tempList,
		flag,
		key: pageChange,
		batchDelete,
		choosedRows,
		q,
	}

	//组装dataModalProps前置准备
	//if ( modalType === 'create' ) { itemType = itemType }

	const dataModalProps = {																											//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		tempList,
    hasPreParams,
		item: currentItem || {},		//要展示在弹出窗口的选中对象
		type: modalType,
		flag,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		itemType, //==='create'?itemType:currentItem.itemType,
		resetCalInput,
		treeNodes: zabbixItemsGroup.treeDatas.length > 0 ? loopSelect(zabbixItemsGroup.treeDatas) : [],
		stdInfoVal: zabbixItemsInfo.stdInfoVal, //选中的指标
		moFilterValue: zabbixItemsInfo.moFilterValue,
		see,
		//modelkey: zabbixItemsInfo.setModelKey,
		chooseWay,
	}

	const dataModalCopyOrMoveProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
		visible: zabbixItemsInfo.modalVisibleCopyOrMove, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: zabbixItemsGroup.treeDatas.length > 0 ? loop(zabbixItemsGroup.treeDatas) : [],
		isClose,
		choosedRows,
		selectTreeNodeKeys,
	}

	const dataModalStdInfoProps = {
		dispatch,
		loading,

		visible: zabbixItemsInfo.selectUnitVisible,
		treeNodes: ((stdIndicatorGroup && stdIndicatorGroup.treeDatas && stdIndicatorGroup.treeDatas.length > 0) ? loop(stdIndicatorGroup.treeDatas) : []),
		expandKeys: parentKeys, //默认全部打开


		tableList: ((zabbixItemsInfo.stdList && zabbixItemsInfo.stdList.length > 0) ? zabbixItemsInfo.stdList : []),
		pagination: zabbixItemsInfo.paginationStdInfo,
		Columns: stdColums,
		isClose,
		stdgroupUUID: zabbixItemsInfo.stdgroupUUID, //选中的 指标分组

	}

	const dataModalItemInfoProps = {
		dispatch,
		loading,

		visible: zabbixItemsInfo.selectItemVisible,
		treeNodes: ((zabbixItemsGroup && zabbixItemsGroup.treeDatas && zabbixItemsGroup.treeDatas.length > 0) ? loop(zabbixItemsGroup.treeDatas) : []),
		expandKeys: parentKeys, //默认全部打开

		tableList: ((zabbixItemsInfo.itemList && zabbixItemsInfo.itemList.length > 0) ? zabbixItemsInfo.itemList : []),
		pagination: zabbixItemsInfo.paginationItemInfo,
		Columns,
		isClose,
		itemgroupUUID: zabbixItemsInfo.itemgroupUUID, //选中的 指标分组

	}

	//过滤规则配置参数 start
	const dataModalMoFiltersProps = {
		dispatch,
		loading,
		moFilterValue: zabbixItemsInfo.moFilterValue,
		moFilterName: 'moFilterValue',
		moFilterOldValue: zabbixItemsInfo.moFilterOldValue,
		queryPath: 'zabbixItemsInfo/controllerModal',
		visible: zabbixItemsInfo.selectMoFilter,
		visibleName: 'selectMoFilter',
		title: '监控对象关联规则',
		moTreeDatas: (objectGroup && objectGroup.treeDatas && objectGroup.treeDatas.length > 0 ? objectGroup.treeDatas : []),
		appsInfos: (appSelect && appSelect.list && appSelect.list.length > 0 ? appSelect.list : []),
		//modelkey: zabbixItemsInfo.setModelKey,

	}
	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'zabbixItemsInfo/setState'
	}
	const user = JSON.parse(sessionStorage.getItem('user'))
	const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
		expand,
		groupUUID,
		moImportFileList,
		showUploadList,
		q,
		user:user
	}
	let buton = <ButtonZone {...buttonZoneProps} />
	const hbProps = {
		title:'指标实现',
		tag:'zabbixItems'
	}

	//过滤规则配置参数 end


	return (
  <div className="content-inner">
    <Filter {...dataFilterProps} buttonZone={buton} />
    <DataList {...dataListProps} />
	<HelpButton {...hbProps}/>
    <DataModal {...dataModalProps} />
    <DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
    <DataModalStdInfo {...dataModalStdInfoProps} />
    <DataModalMoFilters {...dataModalMoFiltersProps} />
    <DataModalItemInfo {...dataModalItemInfoProps} />
	<ImportResultModal {...importResultModalProps}/>
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default ZabbixItemsInfo
