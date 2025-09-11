import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'antd'
import OperateRecord from './operateRecord'
const modal = ({
    dispatch,
    operateRecordList,
    showOperateRecord,
    seeOperate,
}) => {
    const onCancel = () => {
        dispatch({
            type: 'mainRuleInstanceInfo/updateState',
            payload: {
                showOperateRecord: false,
                operateRecordList:[],
                seeOperate:true
            },
        })
    }

    const modalOpts = {
        title: '查看维护期操作记录',
        visible: showOperateRecord,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 1000,
    }
    const OperateProps = {
        operateRecordList,
        seeOperate
    }
    return (
        <Modal {...modalOpts} footer={<Button key="cancel" onClick={onCancel}>关闭</Button>}>
            <OperateRecord {...OperateProps} />
        </Modal>
    )
}

modal.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
}

export default modal