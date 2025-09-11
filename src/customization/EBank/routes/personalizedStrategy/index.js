import React from 'react'
import { connect } from "dva"
import Filter from '../../../../components/Filter/Filter'
import ButtonZone from './ButtonZone'
import queryString from "query-string"
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import { routerRedux } from 'dva/router'
const personalizedStrategy = ({
    location, dispatch, loading, personalizedStrategy
}) => {
    const { list, q, pagination, modalVisible ,currentItem} = personalizedStrategy
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
                query,
            }))
        },
    }
    const listProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        dataSource: list,
        loading: loading.effects['personalizedStrategy/query'],
        pagination,
        location,
        q,
    }
    const modalProps = {
        dispatch,
        modalVisible,
        currentItem
    }
    const buttonZoneProps = {
        dispatch,
        q,
    }

    let buton = <ButtonZone {...buttonZoneProps} />


    return (
        <div className="content-inner">
            <Filter {...filterProps} buttonZone={buton} />
            <List {...listProps} />
            <Modal {...modalProps} />
        </div>
    )
}

export default connect(({ personalizedStrategy, loading }) => ({ personalizedStrategy, loading }))(personalizedStrategy)