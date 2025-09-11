import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal'
import ManagedModal from './managedModal'
import moTree from '../../../utils/moTree/moTree'
import queryString from "query-string";

const storages = ({
 location, dispatch, storages, loading, app, appSelect,
}) => {
	const {
		q,
		list,
		modalVisible,
		alertType,
		alertMessage,
		item,
		modalType,
		pagination,
		batchDelete,
		selectedRows,
		managedModalVisible,
		manageState,
		managedType,
		managedData,
		pageChange,
		firstClass,
		secondClass,
		thirdClass,
		moImportFileList,
	  	showUploadList,
	  	moImportResultVisible,
	  	moImportResultdataSource,
	  	moImportResultType,
	  	appCode,
		c1,
		appCategorlist,
		_mngInfoSrc,
		FScloud,
		optionSelectAppName,
	} = storages

	const {
		user,
	} = app

	const modalProps = {
		loading,
		dispatch,
		alertType,
		alertMessage,
		item,
		visible: modalVisible,
		modalType,
		thirdClass,
		appCode,
		c1,
		appSelect,
		appCategorlist,
		_mngInfoSrc,
		FScloud,
	}

  const filterProps = {
    filterSchema: FilterSchema,
    q,
    moTypeTree: moTree,
    dispatch,
	optionSelectAppName,
	modalName:'storages',
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

  const listProps = {
    dispatch,
    dataSource: list,
    pagination,
    q,
    firstClass,
	  secondClass,
	  thirdClass,
	  loading: loading.effects['storages/query'],
    key: pageChange,
  }

  const buttonZoneProps = {
    dispatch,
    batchDelete,
	selectedRows,
	user,
	moImportFileList,
	showUploadList,
	moImportResultVisible,
	moImportResultdataSource,
	moImportResultType,
  }

  const managedModalProps = {
  	dispatch,
  	visible: managedModalVisible,
  	manageState,
  	choosedRows: selectedRows,
  	managedType,
  	managedData,
  }

   const importResultModalProps = {
  		dispatch,
  		visible: moImportResultVisible,
  		type: moImportResultType,
  		dataSource: moImportResultdataSource,
  		queryPath: 'storages/setState',
  }

	let btZone = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner" id="area">
      <Filter {...filterProps} buttonZone={btZone} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <ManagedModal {...managedModalProps} />
      <ImportResultModal {...importResultModalProps} />
    </div>
  )
}

export default connect(({
 app, storages, appSelect, loading,
}) => ({
 app, storages, appSelect, loading,
}))(storages)
