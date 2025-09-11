import { connect } from 'dva'
import List from './List'
import React from 'react'
import Search from './Search'
import Modal from './Modal'
const togetherConfig = ({
  location, dispatch, togetherConfig, loading,
}) => {
  const {
    q, list, pagination, isSynching, detail, batchDelete, chooseRows,visible,yamlData,type,currentItem,serviceArea,vList
  } = togetherConfig

  const listProps = {
    dispatch,
    dataSource: list,
    loading: loading.effects['togetherConfig/query'],
    pagination,
    location,
    q,
    serviceArea
  }

  const serachProps = {
    dispatch,
    serviceArea
  }
  
  const ModaltProps = {
    dispatch,
    visible,
    yamlData,
    type,
    currentItem,
    serviceArea,
    vList
  }

  return (
    <div className="content-inner">
      <Search {...serachProps} />
      <List {...listProps} />
      <Modal {...ModaltProps} />
    </div>
  )
}

export default connect(({ togetherConfig, loading }) => ({ togetherConfig, loading }))(togetherConfig)
