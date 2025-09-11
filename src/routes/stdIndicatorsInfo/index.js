/**
 * @module 监控配置/监控指标管理
 * @description
 * ## 指标操作
 * ##### 新增
 * 添加新的指标，点击弹出新增标准指标窗口。
 * 
 * ##### 批量复制
 * 将多条指标复制到不同的分组。
 * 
 * ##### 批量移动
 * 将多条指标移动到不同的分组。
 * 
 * ##### 批量删除
 * 选中多条指标并点击顶部“批量删除“按钮删除多条。
 * 
 * ##### 导出
 * 将指标导出至Excel文档。
 * 
 * ##### 导入
 * 导入指标Excel文件。
 * 
 * ##### 删除
 * 选中指标并点击顶部或右侧"删除"按钮删除指标。
 * 
 * ##### 查看
 * 点击打开查看标准指标窗口。
 * 
 * ##### 编辑
 * 点击打开编辑标准指标窗口进行编辑。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { TreeSelect, Tree} from 'antd'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import DataList from './DataList'
import DataModal from './DataModal'
import DataModalCopyOrMove from './DataModalCopyOrMove'
import ButtonZone from './ButtonZone'
import PolicyModalDesc from '../../components/policyModal/PolicyModalDesc'

import PolicyColumns from '../../utils/PolicyColumns'
import TemplatesColumns from '../../utils/TemplatesColumns'
import MosColumns from '../../utils/MosColumns'
import ImportResultModal from '../objectMO/ImportByExcel/ImportResultModal'
import queryString from "query-string";
import HelpButton from "../../components/helpButton"
const TreeSelectNode = TreeSelect.TreeNode
const TreeNode = Tree.TreeNode

const StdIndicatorsInfo = ({
 location, dispatch, stdIndicatorGroup, stdIndicatorsinfo, app,loading,
}) => {
	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
	//也可以通过 stdIndicatorsinfo.(state的属性)来获取 state的属性
	const {
 list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, pageChange, q, see, expand,
 groupUUID, moImportFileList, showUploadList, moImportResultVisible,moImportResultType,moImportResultdataSource
} = stdIndicatorsinfo
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

	const dataFilterProps = {
		key: stdIndicatorsinfo.filterKey,
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

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,//.models.stdIndicatorsinfo,
		pagination,
		key: pageChange,
		batchDelete,
		choosedRows,
		q,
	}

	const dataModalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		treeNodes: stdIndicatorGroup.treeDatas.length > 0 ? loopSelect(stdIndicatorGroup.treeDatas) : [],
                treeData:stdIndicatorGroup.treeDatas,
		see,
	}

	const dataModalCopyOrMoveProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
		visible: stdIndicatorsinfo.modalVisibleCopyOrMove, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: stdIndicatorGroup.treeDatas.length > 0 ? loop(stdIndicatorGroup.treeDatas) : [],
		isClose,
		choosedRows,
	}

	/*
		关联的实例
	*/
	const policyListProps = {
		dispatch,
		loading,
		scroll: 0,
		columns: PolicyColumns,
		dataSource: stdIndicatorsinfo.policyList,
		pagination: stdIndicatorsinfo.paginationPolicy,
		onPageChange (page) {
			/*
				获取关联实例的数据
			*/
			dispatch({
				type: 'stdIndicatorsinfo/queryPolicies',
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
		visible: stdIndicatorsinfo.policyVisible,
		policyListProps,
		loading,
		titlename: '关联策略实例',
		policyObjInfo: `关联策略实例数 ${stdIndicatorsinfo.stdPolicyNumber}`,

		onCancel () {
			dispatch({
				type: 'stdIndicatorsinfo/controllerModal',
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
		关联的模板
	*/
	const templatesListProps = {
		dispatch,
		loading,
		scroll: 0,
		columns: TemplatesColumns,
		dataSource: stdIndicatorsinfo.templatesList,
		pagination: stdIndicatorsinfo.paginationPolicy,
		onPageChange (page) {
			dispatch({
				type: 'stdIndicatorsinfo/queryTemplates',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
				},
			})
		},

	}
	const templatesModalDescProps = {
		dispatch,
		visible: stdIndicatorsinfo.templatesVisible,
		policyListProps: templatesListProps,
		loading,
		titlename: '关联策略模板',
		policyObjInfo: `关联策略模板数 ${stdIndicatorsinfo.stdTemplatesNumber}`,

		onCancel () {
			dispatch({
				type: 'stdIndicatorsinfo/controllerModal',
				payload: {
					templatesVisible: false,
					stdUUIDTemplates: '', //点击cancel 值为空
					stdTemplatesNumber: 0,
					templatesList: [],

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
		dataSource: stdIndicatorsinfo.mosList,
		pagination: stdIndicatorsinfo.paginationPolicy,
		onPageChange (page) {
			dispatch({
				type: 'stdIndicatorsinfo/queryMos',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
					relatedType: 'KPI',
				},
			})
		},

	}
	const mosModalDescProps = {
		dispatch,
		visible: stdIndicatorsinfo.mosVisible,
		policyListProps: mosListProps,
		loading,
		titlename: '关联监控对象',
		policyObjInfo: `关联监控对象数 ${stdIndicatorsinfo.stdMosNumber}`,

		onCancel () {
			dispatch({
				type: 'stdIndicatorsinfo/controllerModal',
				payload: {
					mosVisible: false,
					stdUUIDMos: '', //点击cancel 值为空
					stdMosNumber: 0,
					mosList: [],
				},
			})
		},
	}
	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'stdIndicatorsinfo/setState'
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
		title:'监控指标',
		tag:'stdIndicatorInfo'
	}

	return (
  <div className="content-inner">
    <Filter {...dataFilterProps} buttonZone={buton} />
    <DataList {...dataListProps} />
	<HelpButton {...hbProps}/>
    <DataModal {...dataModalProps} />
    <DataModalCopyOrMove {...dataModalCopyOrMoveProps} />
    <PolicyModalDesc {...policyModalDescProps} />
    <PolicyModalDesc {...templatesModalDescProps} />
    <PolicyModalDesc {...mosModalDescProps} />
	<ImportResultModal {...importResultModalProps}/>
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default StdIndicatorsInfo
