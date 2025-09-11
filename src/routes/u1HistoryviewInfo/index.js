import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import HistoryViewModal from './Modal'
import ButtonZone from './ButtonZone'
import Fenhang from '../../utils/fenhang'

function u1HistoryviewInfo ({
 location, dispatch, u1Historyview, loading,
}) {
	document.title = 'U1历史告警查询'
	const {
		q,
		list,
		appList,
		currentItem,
		modalVisible,
		modalType,
		pagination,
		batchDelete,
		selectedRows,
		rowDoubleVisible,
		eventDisposalPagination,
		levelChangePagination,
		SMSnotificationPagination,
		levelChangeDataSource,
		eventDataSource,
		SMSnotificationDataSource,
		selectInfo,
		filterSelect,
		severitySql,
	  	sortSql,
	  	journalSql,
	  	detailsSql,
	  	defaultKey,
	  	info,
		  loadReporter,
		  expand,
	} = u1Historyview

  const user = JSON.parse(sessionStorage.getItem('user'))

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	if (user && FilterSchema) {
		let info = []
		if (user.branch != undefined && user.branch != '') {
			info.push(Fenhangmaps.get(user.branch))
		}
		for (let data of FilterSchema) {
			if (data.key === 'n_MgtOrg') {
				data.defaultValue = info
			}
		}
	}
	const filterProps = { //这里定义的是查询页面要绑定的数据源
	    expand: false,
	    filterSchema: FilterSchema,
	    location,
	    dispatch,
	    onSearch (p) {
	    	const { query, pathname } = location
		    dispatch(routerRedux.push({
		    	pathname,
		      query: {
		      	...query,
		        page: 0,
		        q: p,
		      },
		    }))
	    },
	   q,
	   externalSql: filterSelect,
	}
	const listProps = { //这里定义的是表格对应的数据源与配置
	    dispatch,
	    dataSource: list,
	    loading: loading,
	    pagination,
	    filterSelect,
		location,
		q,
    }

	const modalProps = {
		dispatch,
		visible: rowDoubleVisible,
		eventDisposalPagination,
		levelChangePagination,
		SMSnotificationPagination,
		levelChangeDataSource,
  		eventDataSource,
  		SMSnotificationDataSource,
  		dataSource: selectInfo,
  		severitySql,
	  	sortSql,
	  	journalSql,
	  	detailsSql,
	  	key: defaultKey,
	  	loading,
	}

	const buttonZoneProps = {
		dispatch,
		loadReporter,
		expand,
	}

	let btZone = <ButtonZone {...buttonZoneProps} />
	return (
  <div>
    <Filter {...filterProps} buttonZone={btZone} />
    <List {...listProps} />
    <HistoryViewModal {...modalProps} />
  </div>
	)
}


u1HistoryviewInfo.propTypes = {
  u1Historyview: PropTypes.object,
}

export default u1HistoryviewInfo
