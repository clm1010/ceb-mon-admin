import React from 'react'
import PropTypes from 'prop-types'
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

const IP = ({
 location, loading, IP, dispatch, app, appSelect,
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
	    currentItem,
	    alertType,
	    alertMessage,
	    keys,
	    appCode,
	    showUploadList,
	  	moImportResultVisible,
	  	moImportResultdataSource,
	  	moImportResultType,
		moImportFileList,
		appCategorlist,
		FScloud,
		optionSelectAppName,
	} = IP

	const {
		user,
	} = app

	const filterProps = {
		filterSchema: FilterSchema,
		q,
		moTypeTree: moTree,
		dispatch,
		optionSelectAppName,
		modalName:'IP',
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
		loading: loading.effects['IP/query'],
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
	    alertType,
	    alertMessage,
	    item: currentItem,
	    appCode,
		appSelect,
		appCategorlist,
		FScloud,
	}

	const importResultModalProps = {
  		dispatch,
  		visible: moImportResultVisible,
  		type: moImportResultType,
  		dataSource: moImportResultdataSource,
  		queryPath: 'IP/setState',
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
 IP, app, appSelect, loading,
}) => ({
 IP, app, appSelect, loading,
}))(IP)
