import React from 'react'
import { connect } from 'dva'
import List from './List'
import Search from './search'

const qhNetLog = ({ dispatch, qhNetLog, loading }) => {
    const {
        list, pagination, condition, branch_ips
    } = qhNetLog

    const listProps = {
        dispatch,
        dataSource: list,
        loading: loading.effects['qhNetLog/query'],
        pagination,
        condition,
    }

    const searchProps = {
        dispatch,
        condition,
        branch_ips,
    }

    return (
        <div className="content-inner" id="1">
            <Search {...searchProps} />
            <List {...listProps} />
        </div>
    )
}

export default connect(({ qhNetLog, loading }) => ({ qhNetLog, loading }))(qhNetLog)
