
import React from 'react'
import { connect } from 'dva'
import Filter from '../../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './/Modal'
import { routerRedux } from 'dva/router'
import queryString from "query-string";

const orgOper = ({
    location, dispatch, loading, orgOper,
}) => {
    const { list, choosedRows, pagination, modalVisible, currentItem, q, userList, type } = orgOper	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
    const listProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        dataSource: list,
        loading: loading.effects['orgOper/query'],
        pagination,
        choosedRows,
        q,
    }
    const filterProps = { //这里定义的是查询页面要绑定的数据源
        expand: false,
        filterSchema: FilterSchema,
        q: q,
        dispatch,
        onSearch(q) {
            const { search, pathname } = location
            const query = queryString.parse(search);
            dispatch(routerRedux.push({
                pathname,
                search: search,
                query: {
                    ...query,
                    page: 0,
                    q,
                },
            }))
        },
    }

    const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
        loading:loading.effects['orgOper/getOrgAllUser'] || loading.effects['orgOper/getOrgUser'],
        dispatch,
        dataSource: userList,		//要展示在弹出窗口的选中对象
        visible: modalVisible, //弹出窗口的可见性是true还是false
        item:currentItem,
        type,
        pagination
    }
    return (
        <div className="content-inner">
            {/* <Filter {...filterProps}  /> */}
            <List {...listProps} />
            <Modal {...modalProps} />
        </div>
    )
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ orgOper, loading }) => ({ orgOper, loading: loading }))(orgOper)
