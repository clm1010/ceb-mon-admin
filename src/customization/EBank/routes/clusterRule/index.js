import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from "query-string";
import { parse } from 'qs'
import List from './List'
import Filter from '../../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import DataModal from './Modal'
import ButtonZone from './ButtonZone'
import TransferModal from './TransferModal'

const clusterRule = ({ dispatch, clusterRule, loading }) => {
    const {
        q, list, selecteRows, isClose, pagination, modalType, currentItem, pageChange, expand, modalVisible, batchDelete, choosedRows, normalTreeSelected,
        basicsTreeSelected, normalTreeData, basicsTreeData
        , ruleType, RuleVisible, proData_original, preData_original, proData_target, preData_target,transfromLoading,  normalList,  basicsList, 
    } = clusterRule

    const listProps = {
        dispatch,
        dataSource: list,
        loading: loading.effects['clusterRule/query'],
        pagination,
        key: pageChange,
        selecteRows,
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
                query,
            }))
        },
    }
    const buttonZoneProps = {
        dispatch,
        batchDelete,
        choosedRows,
        expand,
        q,
    }
    let buton = <ButtonZone {...buttonZoneProps} />

    const dataModalProps = {									// 这里定义的是弹出窗口要绑定的数据源
        dispatch,
        item: modalType === 'create' ? {} : currentItem,		// 要展示在弹出窗口的选中对象
        type: modalType,										// 弹出窗口的类型是'创建'还是'编辑'
        visible: modalVisible,									// 弹出窗口的可见性是true还是false
        isClose,
        see: 'yes',
        normalTreeSelected,
        basicsTreeSelected,
        normalTreeData,
        basicsTreeData,

        normalList, 
        basicsList, 
    }

    const transformModalProps = {
        dispatch,
        visible: RuleVisible,
        loading: transfromLoading,
        ruleType,
        proData_original,
        preData_original,
        proData_target,
        preData_target,
    }
console.log('transform-loading',loading.effects['clusterRule/getRuleNormal'])
    return (
        <div className="content-inner" id="1">
            <Filter {...filterProps} buttonZone={buton} />
            <List {...listProps} />
            <DataModal {...dataModalProps} />
            <TransferModal {...transformModalProps} />
        </div>
    )
}

export default connect(({ clusterRule, loading }) => ({ clusterRule, loading }))(clusterRule)
