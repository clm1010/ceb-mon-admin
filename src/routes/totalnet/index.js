import React from 'react'
import List from './List'
import { connect } from 'dva'
import Patch from './patch'
import { routerRedux } from 'dva/router'
import FilterSchema from './FilterSchema'
import Filter from '../../components/Filter/Monitoring'
import Modal from './Modal'
import DataModal from '../../routes/stdIndicatorsInfo/DataModal'
import PolModal from '../policy/templet/Modal' 
import fenhang from '../../utils/fenhang'
import treeDataApp from '../../utils/treeDataApp'
import EchartsModal from './EchartModal'
import queryString from "query-string";

const totalnet = ({ location, dispatch, totalnet, loading }) => {
  const { appCode, startTime, endTime, circle,  scoreLineData, q, parentUUID, kpiUUID, moKpiVisible, checkStatus, shouldMonitor, isMonitoring, stdInfoVal, tabstate, timeList, list, batchDelete, selecteRows, pagination, pageChange, branch, backRoute, percent, modalType, isClose, typeValue, currentItem, modalVisible, paginationKpi, moPleVisible, echartsVisible, currentItemPle, currentItemKpi } = totalnet
// 分行的参数的确定
  const PatchProps = {
    backRoute,
    dispatch,
  }
  const filterProps = {
    filterSchema: FilterSchema,
    q,
    dispatch,
    percent,
    area: 'ZH',
    onSearch (q) {
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

  const listProps = {
    dispatch,
    dataSource: list,
    loading: loading.effects['totalnet/query'],
    location,
    pagination,
    key: pageChange,
    batchDelete,
    selecteRows,
    q,
    backRoute,
    percent,
    onSearch (q) {
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

  const modalProps = { // 这里定义的是弹出窗口要绑定的数据源
    selecteRows,
    paginationKpi,
    modalType,
    dispatch,
    currentItem,
    kpiUUID,
    parentUUID,
    shouldMonitor,
    isMonitoring,
    type: modalType, // 弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible, // 弹出窗口的可见性是true还是false
    // visible: true,
    isClose,
    typeValue,
  }
  const polModalProps = { // 这里定义的是弹出窗口要绑定的数据源
    modalType,
    fenhang,
    dispatch,
    item: modalType === 'create' ? {
      policyTemplate: {
        policyType: 'NORMAL',
        collectParams: {},
      },
    } : currentItemPle, // 要展示在弹出窗口的选中对象
    type: modalType, // 弹出窗口的类型是'创建'还是'编辑'
    visible: moPleVisible, // 弹出窗口的可见性是true还是false
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

  const cpuLineChart ={
    dispatch,
    visible:echartsVisible,
    startTime,
    endTime,
    circle,
    data: scoreLineData,
    appCode,
  }

  const kpiModalProps = { // 这里定义的是弹出窗口要绑定的数据源
    dispatch,
    item: modalType === 'create' ? {} : currentItemKpi,		// 要展示在弹出窗口的选中对象
    type: modalType,																		// 弹出窗口的类型是'创建'还是'编辑'
    visible: moKpiVisible,															// 弹出窗口的可见性是true还是false
    checkStatus,																				// 检测状态done,success,fail,checking
    isClose,
    //	treeNodes: stdIndicatorGroup.treeDatas.length > 0 ? loopSelect(stdIndicatorGroup.treeDatas) : [],
    see: 'yes',
  }
  return (
    <div className="content-inner" id="1">
      <Patch {...PatchProps} />
      <Filter {...filterProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <DataModal {...kpiModalProps} />
      <PolModal {...polModalProps} /> 
      <EchartsModal {...cpuLineChart}/>
    </div>
  )
}

export default connect(({ totalnet, loading }) => ({ totalnet, loading }))(totalnet)