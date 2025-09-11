import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import queryString from "query-string";

const formConfiguration = ({
 location, loading, formConfiguration, dispatch,
}) => {
	const {
		batchDelete,
		dataSource,
		modalVisible,
		pagination,
		selectedRows,
		type,
		q,
		day,
	    week,
	    mon,
	    fix,
	    dayInfo,
		weekInfo,
		monInfo,
		fixInfo,
		checkboxState,
		itme,
		alertType,
		alertMessage,
		expand,
	} = formConfiguration

	const filterProps = {
		filterSchema: FilterSchema,
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
	    	/*const { query, pathname } = location
		    dispatch(routerRedux.push({
		    	pathname,
		      query: {
		      	...query,
		        page: 0,
		        q,
		      },
		    }))*/
	    },
	}

	const buttonZoneProps = {
		dispatch,
		batchDelete,
		selectedRows,
		expand,
	}

	const listProps = {
		dispatch,
		dataSource,
		pagination,
		loading: loading.effects['formConfiguration/query'],
		q,
	}

	const modalProps = {
		dispatch,
		visible: modalVisible,
		day,
	    week,
	    mon,
	    fix,
	   	dayInfo,
		weekInfo,
		monInfo,
		fixInfo,
		checkboxState,
		itme,
		alertType,
		alertMessage,
	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
  <div className="content-inner" id="1">
    <Filter {...filterProps} buttonZone={btZone} />
    <List {...listProps} />
    <Modal {...modalProps} />
  </div>
	)
}

export default connect(({ formConfiguration, loading }) => ({ formConfiguration, loading }))(formConfiguration)
