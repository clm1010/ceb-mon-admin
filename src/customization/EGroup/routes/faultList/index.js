import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

import List from './List'
import Filter from '../../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import queryString from "query-string";

const faultList = ({
 faultList, location, dispatch, loading,
}) => {
	const { list, pagination, q } = faultList
	const filterProps = {
		expand: false,
	    filterSchema: FilterSchema,
     	onSearch (q) {
				const { search, pathname } = location
				const query = queryString.parse(search);
				query.q = q
				query.page = 0
				dispatch(routerRedux.push({ 
					pathname,
					search: search,
					query: query,
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

	const listProps = {
		dataSource: list,
		pagination,
		q,
		dispatch,
		loading,
	}

	return (
  <div className="content-inner">
    <Filter {...filterProps} />
    <List {...listProps} />
  </div>
	)
}

export default connect(({ faultList, loading }) => ({ faultList, loading: loading.models.faultList }))(faultList)
