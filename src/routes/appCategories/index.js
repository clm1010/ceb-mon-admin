import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import fenhang from '../../utils/fenhang'
import queryString from "query-string";

const appCategories = ({
 location, loading, appCategories, dispatch,
}) => {
	const {
 q, batchDelete, selectedRows, pagination, dataSource, modalVisible, type, item,
} = appCategories

	const filterProps = {
		filterSchema: FilterSchema,
		q,
		dispatch,
		onSearch (q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
            query.page = 0
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({ 
				pathname,
				search: stringified,
				query: {
	      	...query,
	        page: 0,
	        q,
	      },
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
		batchDelete,
		selectedRows,
		dispatch,
		loading,
	}

	const listProps = {
		dispatch,
		loading,
		dataSource,
		pagination,
		batchDelete,
		selectedRows,
		q,
	}

	const modalProps = {
		dispatch,
		visible: modalVisible,
		type,
		item,
		fenhang,
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

export default connect(({ appCategories, loading }) => ({ appCategories, loading: loading.models.appCategories }))(appCategories)
