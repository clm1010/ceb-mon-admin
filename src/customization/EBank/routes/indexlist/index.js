import { connect } from 'dva'
import React from 'react'
import List from './List'
import DataModal from '../../../../routes/stdIndicatorsInfo/DataModal'
import Patch from './patch'

const indexlist = ({ dispatch, indexlist, loading }) => {
  const {
 q, list, batchDelete, selecteRows, checkStatus, isClose, pagination, modalType, currentItem, pageChange, backRoute, modalVisible,
} = indexlist
  // 分行的参数的确定
  const PatchProps = {
    backRoute,
  }
  const listProps = {
    dispatch,
    dataSource: list,
    loading: loading.effects['indexlist/query'],
    pagination,
    key: pageChange,
    batchDelete,
    selecteRows,
    q,
  }

  const dataModalProps = {															// 这里定义的是弹出窗口要绑定的数据源
    dispatch,
    item: modalType === 'create' ? {} : currentItem,		// 要展示在弹出窗口的选中对象
    type: modalType,																		// 弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															// 弹出窗口的可见性是true还是false
    checkStatus,																				// 检测状态done,success,fail,checking
    isClose,
    //	treeNodes: stdIndicatorGroup.treeDatas.length > 0 ? loopSelect(stdIndicatorGroup.treeDatas) : [],
    see: 'yes',
  }
  return (
    <div className="content-inner" id="1">
      <Patch {...PatchProps} />
      <List {...listProps} />
      <DataModal {...dataModalProps} />
    </div>
  )
}

export default connect(({ indexlist, loading }) => ({ indexlist, loading }))(indexlist)
