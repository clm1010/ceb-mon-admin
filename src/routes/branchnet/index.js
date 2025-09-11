import React from 'react'
import List from './List'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FilterSchema from './FilterSchema'
import Filter from '../../components/Filter/Monitoring'
import Patch from './patch'
import Modal from './Modal'
import PolModal from '../policy/templet/Modal' 
import fenhang from '../../utils/fenhang'
import treeDataApp from '../../utils/treeDataApp'
import DataModal from '../stdIndicatorsInfo/DataModal'
import EchartsModal from './EchartModal'
import queryString from "query-string";

const branchnet = ({ dispatch, branchnet,location, loading }) => {
  const { appCode, startTime, endTime, circle,  scoreLineData, q, parentUUID, kpiUUID, moKpiVisible, checkStatus, shouldMonitor, isMonitoring, stdInfoVal, tabstate, timeList, list, batchDelete, selecteRows, pagination, pageChange, branch, backRoute, percent, modalType, isClose, typeValue, currentItem, modalVisible, paginationKpi, moPleVisible, echartsVisible, currentItemPle, currentItemKpi } = branchnet
  const back = {
    backRoute,
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
  const filterProps = {
    filterSchema: FilterSchema,
    branch,
    q,
    dispatch,
    percent,
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
  const listProps = {
    backRoute,
    dispatch,
    dataSource: list,
    loading: loading.effects['branchnet/query'],
    pagination,
    key: pageChange,
    batchDelete,
    selecteRows,
    percent,
    q,
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

  const modalProps = { // 这里定义的是弹出窗口要绑定的数据源
    selecteRows,
    paginationKpi,
    modalType,
    dispatch,
    currentItem,
    parentUUID,
    shouldMonitor,
    kpiUUID,
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
      <Patch {...back} />
      <Filter {...filterProps} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <DataModal {...kpiModalProps} />
      <PolModal {...polModalProps} />
      <EchartsModal {...cpuLineChart}/>
    </div>
  )
}

export default connect(({ branchnet, totalnet, loading }) => ({ branchnet, totalnet, loading }))(branchnet)
