import { connect } from 'dva'
import List from './List'
import React from 'react'
import Modal from '../policy/templet/Modal'
import fenhang from '../../../../utils/fenhang'
import treeDataApp from '../../../../utils/treeDataApp'
import Patch from './patch'

const strategylist = ({
 location, dispatch, strategylist, loading,
}) => {
  const {
 q, list, pagination, isSynching, detail, modalType, isClose, tabstate, typeValue, stdInfoVal, timeList, currentItem, modalVisible, batchDelete, chooseRows,
} = strategylist
  // 分行的参数的确定
  const patchProps = {
    dispatch,
  }
  const listProps = {
    dispatch,
    dataSource: list,
    loading: loading.effects['strategylist/query'],
    pagination,
    location,
    isSynching,
    detail,
    batchDelete,
    chooseRows,
    q,
  }


  const modalProps = { // 这里定义的是弹出窗口要绑定的数据源
    modalType,
    fenhang,
    dispatch,
    item: modalType === 'create' ? {
      policyTemplate: {
        policyType: 'NORMAL',
        collectParams: {},
      },
    } : currentItem, // 要展示在弹出窗口的选中对象
    type: modalType, // 弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible, // 弹出窗口的可见性是true还是false
    checkStatus: 'done', // 检测状态done,success,fail,checking
    isClose,
    tabstate,
    typeValue,
    stdInfoVal,
    timeList,
    treeDataApp,
    operationType: 'edit',
    see: 'yes',
  }


  return (
    <div className="content-inner">
      <Patch {...patchProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  )
}

export default connect(({ strategylist, loading }) => ({ strategylist, loading }))(strategylist)
