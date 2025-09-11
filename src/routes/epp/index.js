/**
 * @module 监控配置/监控工具管理 
 * @description
 * URL: <u>/epplist</u>
 * ## 指标操作
 * ##### 新增
 * 添加新的指标，点击弹出新增标准指标窗口。
 * 
 * ##### 批量删除
 * 选中多条指标并点击顶部“批量删除“按钮删除多条。
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
import { Tree } from 'antd'
import ButtonZone from './ButtonZone'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'

import PolicyModalDesc from '../../components/policyModal/PolicyModalDesc'
import MosColumns from '../../utils/MosColumns'
import queryString from "query-string";
import LabelModal from './lableinfo'
import HelpButton from '../../components/helpButton'
const TreeNode = Tree.TreeNode
const epp = ({
	location, dispatch, epp, loading, labelGroup,
}) => {
	const {
		list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, pageChange, q, typeValue,
		labelVisible, lablelist, lablepagination, lableInfoVal, labelgroupUUID,element
	} = epp	//这里把入参epp做了拆分，后面代码可以直接调用拆分的变量

	const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})

	const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		typeValue,
		lableInfoVal,
		element,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			if(q!='' && q!=undefined){
				q+=';__distinct__==true'
			}
			query.q = q
            query.page = 0
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({
				pathname,
				search: stringified,
				query: query,
			}))
		},
		queryPreProcess(data) {
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
		loading: loading.effects['epp/query'],
		pagination,
		key: pageChange,
		q,
		batchDelete,
		choosedRows,
	}

	/*
		  关联的对象
	  */
	const mosListProps = {
		dispatch,
		loading,
		scroll: 3500,
		columns: MosColumns,
		dataSource: epp.mosList,
		pagination: epp.paginationMos,
		onPageChange(page) {
			dispatch({
				type: 'epp/queryMos',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
					relatedType: 'epp_INST',
				},
			})
		},

	}
	const mosModalDescProps = {
		dispatch,
		visible: epp.mosVisible,
		policyListProps: mosListProps,
		loading,
		titlename: '关联监控对象',
		policyObjInfo: `关联监控对象数 ${epp.eppMosNumber}`,

		onCancel() {
			dispatch({
				type: 'epp/showModal',
				payload: {
					mosVisible: false,
					eppInstUUIDMos: '', //点击cancel 值为空
					eppMosNumber: 0,
					mosList: [],
				},
			})
		},
	}
	const lableinfo = {
		visible: labelVisible,
		dispatch,
		lablelist,
		lablepagination,
		lableInfoVal,
		loading: loading.effects['epp/lablequery'],
		treeNodes: ((labelGroup && labelGroup.treeDatas && labelGroup.treeDatas.length > 0) ? loop(labelGroup.treeDatas) : []),
		labelgroupUUID,
	}
	const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
	}
	let buton = <ButtonZone {...buttonZoneProps} />
	const hbProps = {
		title:'监控工具',
		tag:'epplist'
	}

	return (
		<div className="content-inner">
			<Filter {...filterProps} buttonZone={buton} />
			<List {...listProps} />
			<HelpButton {...hbProps}/>
			<Modal {...modalProps} />
			<PolicyModalDesc {...mosModalDescProps} />
			<LabelModal {...lableinfo} />
		</div>
	)
}

//通过connect把model的数据注入到这个epp页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ epp, labelGroup, loading }) => ({ epp, labelGroup, loading: loading }))(epp)
