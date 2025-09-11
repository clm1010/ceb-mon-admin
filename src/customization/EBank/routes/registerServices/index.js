import React from 'react'
import { connect } from "dva"
import Filter from '../../../../components/Filter/Filter'
import ButtonZone from './ButtonZone'
import queryString from "query-string"
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import { routerRedux } from 'dva/router'
import ImportResultModal from '../../../../routes/objectMO/ImportByExcel/ImportResultModal'
import OneevaluateModal from './oneevaluateModal'
const registerServices = ({
    location, dispatch, loading, registerServices
}) => {
    const { list, q, pagination, choosedRows, modalVisible, modalType, currentItem, tempListMeta, tempListChecks, moImportResultVisible,
         moImportResultType, moImportResultdataSource, regColumns, batchDelete, serviceArea ,appDatas,oneSystemEvaluate,fetchingApp} = registerServices
    const user = JSON.parse(sessionStorage.getItem('user'))
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
        loading: loading.effects['registerServices/query'],
        pagination,
        location,
        regColumns,
        q,
    }

    const modalProps = {						//这里定义的是弹出窗口要绑定的数据源
        modalType,
        dispatch,
        item: modalType == 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
        type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
        visible: modalVisible,									//弹出窗口的可见性是true还是false
        tempListMeta,
        tempListChecks,
        user,
        serviceArea,
        appDatas,
        fetchingApp,
    }
    const buttonZoneProps = {
        dispatch,
        choosedRows,
        batchDelete,
        q,
        user,
    }

    let buton = <ButtonZone {...buttonZoneProps} />

    const importResultModalProps = {
        dispatch,
        visible: moImportResultVisible,
        type: moImportResultType,
        dataSource: moImportResultdataSource,
        queryPath: 'registerServices/updateState'
    }

    const oneevaluateModalProps = {
        dispatch,
        oneSystemEvaluate
    }
    return (
        <div className="content-inner">
            <Filter {...filterProps} buttonZone={buton} />
            <List {...listProps} />
            <Modal {...modalProps} />
            <ImportResultModal {...importResultModalProps} />
            <OneevaluateModal {...oneevaluateModalProps} />
        </div>
    )
}

export default connect(({ registerServices, loading }) => ({ registerServices, loading }))(registerServices)