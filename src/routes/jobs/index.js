import React from 'react'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import filterSchema from './fileItem'
import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import Switchs from './switch'
import List from './List'
import Modal from './Model'
import Drawers from './drawer'

const jobs = ({ history, loading, dispatch, jobs }) => {

  const { q, modalVisible, drawerVisible, popoverVisible, progressButtonState, stepButtonState, sourceData, pagination, batchDelete, selectedRows, item, uuid, stepItems, toolProgress, instProgress, mos, issueMotoInsts } = jobs

  //查询条件
  const filterProps = {
    filterSchema: filterSchema,
    dispatch,
    onSearch (q) {
      const { search, pathname } = location
      const query = queryString.parse(search);
      query.q = q
      query.page = 0
      dispatch(routerRedux.push({
        pathname,
        search: search,
        query:query,
      }))
    },
  }

  //switch的搜索框
  const switchsProps = {
    dispatch,
    q,
    batchDelete,
    selectedRows: selectedRows,
  }

  //List表格
  const ListProps = {
    dispatch,
    loading: loading.effects['jobs/query'],
    dataSource: sourceData,
    pagination:pagination,
    batchDelete: batchDelete,
    selectedRows: selectedRows,
    q
  }
  const Switch = <Switchs {...switchsProps}/>

  const modalProps = {
    dispatch,
    visible:modalVisible,
    drawerVisible,
    progressButtonState,
    item,
    uuid
  }

  const drawersProps = {
    dispatch,
    visible: drawerVisible,
    popoverVisible,
    stepButtonState,
    stepItems,
    toolProgress,
    instProgress,
    mos,
    issueMotoInsts,
    uuid,
    formItem:item
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={Switch}/>
      <List {...ListProps}/>
      <Modal {...modalProps}/>
      <Drawers {...drawersProps}/>
    </div>
  )
}

export default connect(({ jobs, loading }) => ({ jobs, loading }))(jobs)
