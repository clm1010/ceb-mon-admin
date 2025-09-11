import React from 'react'
import { routerRedux } from 'dva/router'
import { Tree } from 'antd'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import DataList from './DataList'
import DataModal from './DataModal'
import queryString from "query-string";

const TreeNode = Tree.TreeNode

const LookupInfo = ({
 location, dispatch, lookupGroup, lookupinfo, loading,
}) => {
	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
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
    filterq,
    q,
    expand,
    dataSource,
    organization,
    rsqlParam,
    tableName,
    tableType
} = lookupinfo
	const { moState } = lookupGroup
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

	const dataFilterProps = {
		key: lookupinfo.filterKey,
		expand: false,
		filterSchema: FilterSchema,
		onSearch (q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
			query.page = 0
			query.filterq = q
			query.dataSource = dataSource
			query.organization = organization
			query.rsqlParam = rsqlParam
			query.tableName = tableName
			query.tableType = tableType
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({ 
				pathname,
				search: stringified,
				query,
				/*query:{
					...querySearch,
					page: 0,
					q,
					filterq: q,
          dataSource:dataSource,
          organization:organization,
          rsqlParam:rsqlParam,
          tableName:tableName,
          tableType:tableType
				},*/
			}))
			/*const { query, pathname } = location
			dispatch(routerRedux.push({
				pathname,
				query: {
					...query,
					page: 0,
					q,
					filterq: q,
          dataSource:dataSource,
          organization:organization,
          rsqlParam:rsqlParam,
          tableName:tableName,
          tableType:tableType
				},
			}))*/
		},
	}

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,
		pagination,
		location,
		onPageChange (page) {
				const { search, pathname } = location
				const query = queryString.parse(search);
				query.filterq = q
				query.page = page.current - 1
				query.pageSize = page.pageSize
				query.dataSource = dataSource,
        query.organization=organization,
        query.rsqlParam=rsqlParam,
        query.tableName=tableName,
        query.tableType=tableType
        const stringified = queryString.stringify(query)
		  	dispatch(routerRedux.push({
				pathname,
				search : stringified,
				query,
				/*query: {
			  		...query,
			  		page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
			  		pageSize: page.pageSize,
            filterq: q,
            dataSource:dataSource,
            organization:organization,
            rsqlParam:rsqlParam,
            tableName:tableName,
            tableType:tableType
				},*/
		  	}))
		},
		batchDelete,
		choosedRows,
		selectInfo: lookupGroup.selectArray,
		moState,
	}

	const dataModalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible, //弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
//		treeNodes: lookupGroup.treeDatas.length > 0 ? loopSelect(lookupGroup.treeDatas) : [],
		selectInfo: lookupGroup.selectArray,
	}

	const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
		selectInfo: lookupGroup.selectArray,
		q,
		moState,
		expand,
	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
  <div className="content-inner">
    <Filter {...dataFilterProps} buttonZone={btZone} />
    <DataList {...dataListProps} />
    <DataModal {...dataModalProps} />
  </div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default LookupInfo
