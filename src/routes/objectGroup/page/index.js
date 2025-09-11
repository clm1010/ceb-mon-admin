import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import moTree from '../../../utils/moTree/moTree'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import ImportResultModal from '../../objectMO/ImportByExcel/ImportResultModal'
import queryString from "query-string";

const page = ({
 location, loading, page, dispatch, app, appSelect,
}) => {
	const {
		q,
		batchDelete,
		selectedRows,
		pagination,
		dataSource,
		modalVisible,
		type,
		firstClass,
	    secondClass,
	    thirdClass,
	    currentItem,
	    alertType,
	    alertMessage,
	    keys,
	    AppOption,
	   	appCode,
	   	c1,
	   	showUploadList,
	  	moImportResultVisible,
	  	moImportResultdataSource,
	  	moImportResultType,
		  moImportFileList,
		  appCategorlist,
	} = page

	const {
		user,
	} = app

	const filterProps = {
		filterSchema: FilterSchema,
		q,
		moTypeTree: moTree,
		dispatch,
		onSearch (q) {
		  const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
      query.page = 0
	    dispatch(routerRedux.push({ 
	    	pathname,
				search: search,
				query:query,
	    }))
		},
	}

	const buttonZoneProps = {
		batchDelete,
		selectedRows,
		dispatch,
		loading,
		showUploadList,
	  	moImportResultVisible,
	  	moImportResultdataSource,
	  	moImportResultType,
	  	moImportFileList,
	  	user,
	}

	const listProps = {
		dispatch,
		loading: loading.effects['page/query'],
		dataSource,
		pagination,
		batchDelete,
		selectedRows,
		q,
		key: keys,
	}

	const modalProps = {
		dispatch,
		visible: modalVisible,
		type,
		firstClass,
	    secondClass,
	    thirdClass,
	    alertType,
	    alertMessage,
	    item: currentItem,
	    AppOption,
	   	appCode,
	   	c1,
		   appSelect,
		   appCategorlist,
	}

	const importResultModalProps = {
  		dispatch,
  		visible: moImportResultVisible,
  		type: moImportResultType,
  		dataSource: moImportResultdataSource,
  		queryPath: 'page/setState',
  	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
  <div className="content-inner" id="1">
    <Filter {...filterProps} buttonZone={btZone} />
    <List {...listProps} />
    <Modal {...modalProps} />
    <ImportResultModal {...importResultModalProps} />
  </div>
	)
}

export default connect(({
 page, app, appSelect, loading,
}) => ({
 page, app, appSelect, loading,
}))(page)
