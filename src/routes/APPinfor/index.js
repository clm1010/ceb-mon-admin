import React from 'react'
import List from './List'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
// import HistoryViewModal from '../historyviewInfo/Modal'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from "query-string";

const APPinfor = ({
 location, dispatch, APPinfor, historyview, loading,
}) => {
    const {
 q, list, pagination, batchDelete, selecteRows,
} = APPinfor
    const {
        rowDoubleVisible,
        eventDisposalPagination,
        levelChangePagination,
        SMSnotificationPagination,
        levelChangeDataSource,
        eventDataSource,
        SMSnotificationDataSource,
        defaultKey,
    } = historyview
    let selectInfo = {}
    selectInfo = { ...historyview.list[0] }
    const filterProps = { //这里定义的是查询页面要绑定的数据源
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
        dispatch,
        dataSource: list,
        loading: loading.effects['branchnet/query'],
        pagination,
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
        severitySql: `rsPK.serverName=='${selectInfo.serverName}';rsPK.serverSerial=='${selectInfo.serverSerial}'`,
        sortSql: 'rsPK.startDate,desc',
        journalSql: `rjPK.serverName=='${selectInfo.serverName}';rjPK.serverSerial=='${selectInfo.serverSerial}'`,
        detailsSql: `alarmId=='${selectInfo.serverName}_${selectInfo.serverSerial}'`,
        key: defaultKey,
        loading,
    }
    return (
      <div className="content-inner" id="1">
        <Filter {...filterProps} />
        <List {...listProps} />
        {/* <HistoryViewModal {...modalProps} /> */}
      </div>
    )
}

export default connect(({ APPinfor, historyview, loading }) => ({ APPinfor, historyview, loading }))(APPinfor)
