import { connect } from 'dva'
import React from 'react'
import Conditionhook from './conditionHook'
import TableHook from './tableHook'

const autoSearch = ({
    location, dispatch, loading, autoSearch
}) => {
    
    const { project, clusert, nameSpace, service, monitorTag, dataSource, urlSuffix , qContion, pagination,clusterData} = autoSearch

    const conditionProps = {
        dispatch,
        project,
        clusert,
        nameSpace,
        service,
        monitorTag,
        urlSuffix,
        dataSource,
        clusterData
    }
    const tablePropos = {
        dispatch,
        loading:loading.effects['autoSearch/queryTest'],
        dataSource,
        qContion,
        pagination
    }

    return (
        <div className="content-inner" id="1">
            <Conditionhook {...conditionProps} />
            <TableHook {...tablePropos} />
        </div>
    )
}

export default connect(({ autoSearch, loading, }) => ({ autoSearch, loading }))(autoSearch)
