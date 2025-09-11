import React from 'react'
import { connect } from 'dva'
import List from './List'
import Search from './search'
import Modal from './modal'
import AddModal from './addModal'

const auditLog = ({ dispatch, auditLog, location, loading }) => {
    const {
        list, pagination, currentItem, condition, auditLogVisiable, modalVisiable,ModalList,apiList
    } = auditLog

    const listProps = {
        dispatch,
        dataSource: list,
        loading: loading.effects['auditLog/query'],
        pagination,
        condition,
    }

    const searchProps = {
        dispatch,
        condition,
        ModalList,
        apiList,
    }

    const modalProps = {
        dispatch,
        auditLogVisiable,
        ModalList,
        apiList,
    }

    const addModalProps = {
        dispatch,
        modalVisiable,
    }
    
    return (
        <div className="content-inner" id="1">
            <Search {...searchProps} />
            <List {...listProps} />
            <Modal {...modalProps} />
            <AddModal {...addModalProps} />
        </div>
    )
}

export default connect(({ auditLog, loading }) => ({ auditLog, loading }))(auditLog)
