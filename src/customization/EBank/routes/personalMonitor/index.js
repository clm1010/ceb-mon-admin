import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from '../../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import queryString from "query-string";

const personalMonitor = ({ location, dispatch, loading, personalMonitor }) => {

    const { list, currentItem, modalVisible, modalType, pagination, q,batchDelete,choosedRows,showCurve,listTag,fetchingtag,listIndicator,fetchingindicator,paramTag,
	     cluster, namespace, service,CurveData
	} = personalMonitor

	const modalProps = {
		visible:modalVisible,
		dispatch,
		item: modalType === 'create' ? {} : currentItem, 
		showCurve,
		listTag,
		fetchingtag,
		listIndicator,
		fetchingindicator,
		modalType,
		paramTag,
		cluster,
		namespace,
		service,
		CurveData
	}
    const listProps = {
        dataSource: list,
		dispatch,
        pagination,
		loading:loading.effects['personalMonitor/query'],
        q,
    }
    const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
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

    const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
	}
	let buton = <ButtonZone {...buttonZoneProps} />

    return (
        <div className="content-inner">
            <Filter {...filterProps} buttonZone={buton} />
            <List {...listProps} />
			<Modal {...modalProps}/>
        </div>
    )

}

export default connect(({ personalMonitor, loading }) => ({ personalMonitor, loading }))(personalMonitor)