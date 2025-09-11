import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import BatchSyncModal from './batchSyncModal'
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal'
import ManagedModal from './managedModal'
import moTree from '../../../utils/moTree/moTree'
import PolicyListModal from '../utils/policyListComp'
import queryString from "query-string";
//@@@
const os = ({
 location, dispatch, os, loading, app, policyList, appSelect,
}) => {
	const {
		q,
		list,
		currentItem,
		modalVisible,
		modalType,
		_mngInfoSrc,
		pagination,
		batchDelete,
		batchSync,
		selectedRows,
		moSynState,
		batchSyncModalVisible,
		batchSyncState,
		batchsyncSuccessList,
		batchsyncFailureList,
		alertType,
		alertMessage,
	    moImportFileList,
		showUploadList,
		moImportResultVisible,
		moImportResultdataSource,
		moImportResultType,
		managedModalVisible,
		manageState,
		managedType,
		managedData,
		secondClass,
		pageChange,
		AppOption,
	    appCode,
		c1,
		appCategorlist,
		FScloud,
		optionSelectAppName,
	} = os					//@@@//这里把入参做了拆分，后面代码可以直接调用拆分的变量

	const {
		user,
	} = app

	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		_mngInfoSrc,
		modalVisible, //弹出窗口的可见性是true还是false
		modalName: '操作系统',		//@@@
		moSynState,
		alertType,
		alertMessage,
		appSelect,
		secondClass,
		AppOption,
	    appCode,
		c1,
		appCategorlist,
		FScloud,
	}
  const filterProps = { //这里定义的是查询页面要绑定的数据源
    //expand : false,
    filterSchema: FilterSchema,
    q,
    moTypeTree: moTree,													//把mo类型树形结构数据传给FILTER展现
    dispatch,
	optionSelectAppName,
	modalName:'os',
    onSearch (q) {
    	const { search, pathname } = location
		const query = queryString.parse(search);
		query.q = q
		query.page = 0
		const stringified = queryString.stringify(query)
	    dispatch(routerRedux.push({ 
	    	pathname,
			search: stringified,
			query:query,
	    }))
    },
  }

    const {
		modalPolicyVisible,
		moPolicyInfo,
		openPolicyType,
		policyInstanceId,
		paginationInfs,
	} = policyList

	const policyListProps = {
		dispatch,
		loading,
	  modalPolicyVisible,
		moPolicyInfo,
		openPolicyType,
		policyInstanceId,
		pagination: paginationInfs,
		onPageChange (page) {
			dispatch({
				type: 'policyList/queryPolicy',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
				},
			})
		},
 }

  const listProps = { //这里定义的是表格对应的数据源与配置
    dispatch,
    dataSource: list,
    loading: loading.effects['os/query'],
    pagination,
    q,
    key: pageChange,
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

  const modalOptsProps = {
	dispatch,
	visible: batchSyncModalVisible,
	choosedRows: selectedRows,
	batchSyncState,
	batchsyncSuccessList,
	batchsyncFailureList,
}
   const importResultModalProps = {
  		dispatch,
  		visible: moImportResultVisible,
  		type: moImportResultType,
  		dataSource: moImportResultdataSource,
  		queryPath: 'os/setState',
  }

  const managedModalProps = {
  		dispatch,
  		visible: managedModalVisible,
  		manageState,
  		choosedRows: selectedRows,
  		managedType,
  		managedData,
  }

	let btZone = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner" id="area">
      <Filter {...filterProps} buttonZone={btZone} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <BatchSyncModal {...modalOptsProps} />
      <PolicyListModal {...policyListProps} />
      <ImportResultModal {...importResultModalProps} />
      <ManagedModal {...managedModalProps} />
    </div>
  )
}

export default connect(({
 os, appSelect, loading, policyList, app,
}) => ({
 os, appSelect, app, policyList, loading,
}))(os) //@@@
