import { connect } from 'dva'
import React from 'react'
import List from './List'
import FilterSchema from './FilterSchema'
import { routerRedux, Link } from 'dva/router'
import Modal from './Modal'
import EquipmentModal from './equipmentModal'
import Patch from './patch'
import queryString from "query-string";

const caselist = ({
 location, dispatch, caselist, indexlist, strategylist, appSelect, loading,
}) => {
    const {
 q, list, batchDelete, selecteRows, checkStatus, modalVisible, _mngInfoSrc, isClose, currentItem, pagination, pageChange, tipItem, tipItem1, backRoute, equipment, equipmentVisible, equipmentSecondClass,
} = caselist
    // 分行的参数的确定
    const PatchProps = {
        backRoute,
    }
    const listProps = {
        dispatch,
        dataSource: list,
        loading: loading.effects['caselist/query'],
        pagination,
        key: pageChange,
        batchDelete,
        selecteRows,
        q,
        toolmess: indexlist,
        tipItem,
        tipItem1,
        backRoute,
    }
    const filterProps = {
        filterSchema: FilterSchema,
        q,
        dispatch,
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
    const modalProps = { //这里定义的是弹出窗口要绑定的数据源
        loading,
        dispatch,
        item: currentItem, //要展示在弹出窗口的选中对象
        modalType: 'update', //弹出窗口的类型是'创建'还是'编辑'
        modalVisible, //弹出窗口的可见性是true还是false
        modalName: '设备详情',		//@@@
        _mngInfoSrc,
        appSelect,
    }
    const equipmentModalProps = { //接口详情
        dispatch,
        item: equipment,
        visible: equipmentVisible,
        equipmentSecondClass,
    }
    return (
      <div className="content-inner" id="1">
        <Patch {...PatchProps} />
        {/* <Filter {...filterProps}/>*/}
        <List {...listProps} />
        <Modal {...modalProps} />
        <EquipmentModal {...equipmentModalProps} />
      </div>
    )
}

export default connect(({
 caselist, indexlist, strategylist, appSelect, loading,
}) => ({
 caselist, indexlist, strategylist, appSelect, loading,
}))(caselist)
