import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal'
import moTree from '../../../utils/moTree/moTree'
import queryString from "query-string";

const user = JSON.parse(sessionStorage.getItem('user'))
//@@@
const urlDns = ({
	location, dispatch, urlDns, appSelect, loading,
}) => {
	const {
		q,
		list,
		currentItem,
		modalVisible,
		modalType,
		pagination,
		batchDelete,
		selectedRows,
		alertType,
		alertMessage,
		moImportFileList,
		showUploadList,
		moImportResultVisible,
		moImportResultdataSource,
		moImportResultType,
		pageChange,
		c1,
		AppOption,
		appCode,
		appCategorlist,
		optionSelectAppName,
	} = urlDns					//@@@//这里把入参做了拆分，后面代码可以直接调用拆分的变量


	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		modalVisible, //弹出窗口的可见性是true还是false
		modalName: 'urlDns',		//@@@
		alertType,
		alertMessage,
		appSelect,
		c1,
		AppOption,
		appCode,
		appCategorlist,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		filterSchema: FilterSchema,
		q,
		moTypeTree: moTree,													//把mo类型树形结构数据传给FILTER展现
		dispatch,
		optionSelectAppName,
		modalName: 'urlDns',
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
			query.page = 0
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({
				pathname,
				search: stringified,
				query: query,
			}))
		},
	}

	const listProps = { //这里定义的是表格对应的数据源与配置
		dispatch,
		dataSource: list,
		loading: loading.effects['urlDns/query'],
		pagination,
		key: pageChange,
		q,
		batchDelete,
		selectedRows,
	}

	const buttonZoneProps = { //这里定义的按钮区域需要的配置
		dispatch,
		location,
		batchDelete,
		selectedRows,
		user,
		moImportFileList,
		showUploadList,
		moImportResultVisible,
		moImportResultdataSource,
		moImportResultType,
	}

	const importResultModalProps = {
		dispatch,
		visible: moImportResultVisible,
		type: moImportResultType,
		dataSource: moImportResultdataSource,
		queryPath: 'urlDns/setState',
	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
		<div className="content-inner" id="area">
			<Filter {...filterProps} buttonZone={btZone} />
			<List {...listProps} />
			<Modal {...modalProps} />
			<ImportResultModal {...importResultModalProps} />
		</div>
	)
}

export default connect(({ urlDns, appSelect, loading }) => ({ urlDns, appSelect, loading }))(urlDns)
