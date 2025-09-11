import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Filter from '../../components/Filter/Filter_history'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import WorkOrderModal from './WorkOrderModal'
import MainRuleModal from '../../routes/mainRuleInstanceInfo/DataModal'
import fenhang from '../../utils/fenhang'
import queryString from "query-string";
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';
import TraceBack from './traceBack/traceBack'
import DynamiColumDrawer from './DynamiColumDrawerFun'
import HistoryViewModal from '../utils/alarm/Modal'
import NotificationModal from '../notification/Modal'

moment.locale('zh-cn');//指定加载国际化目标

function historyviewInfo({
  location,
  dispatch,
  historyview,
  alarmFrom,
  alarmSeverity,
  moSelect,
  notifyWay,
  userSelect,
  appSelect,
  mainRuleInstanceInfo,
  loading,
  app,
  traceBack,
  alarm,
  notification,
}) {
  const {
    q,
    list,
    currentItem,
    pagination,
    batchMaintain,
    selectedRows,
    rowDoubleVisible,
    selectInfo,
    filterSelect,
    severitySql,
    sortSql,
    journalSql,
    detailsSql,
    defaultKey,
    info,
    loadReporter,
    title,
    expand,
    workOrderVisible,
    alertType,
    alertMessage,
    //改
    branchType,
    types,
    switchView,
    DrawerVisible,
    CustomColumns,
    ColumState,
    initColumState,
    saveCulumFlag,
  } = historyview
  const user = JSON.parse(sessionStorage.getItem('user'))

  document.title = title

  let Fenhangmaps = new Map()
  fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
  })

  if (user && FilterSchema) {
    let info = []
    if (user.branch != undefined && user.branch != '') {
      info.push(Fenhangmaps.get(user.branch))
    }
    for (let data of FilterSchema) {
      if (data.key === 'n_MgtOrg') {
        data.defaultValue = info
      }
    }
  }
  const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
    location,
    dispatch,
    onSearch(p) {
      const {
        search,
        pathname,
      } = location
      const query = queryString.parse(search);
      dispatch(routerRedux.push({
        pathname,
        search,
        query: {
          ...query,
          page: 0,
          q: p,
        },
      }))
    },
    q,
    externalSql: filterSelect,
  }
  const listProps = { // 这里定义的是表格对应的数据源与配置
    dispatch,
    dataSource: list,
    loading: loading.effects['historyview/queryHistoryview'],
    pagination,
    filterSelect,
    location,
    selectedRows,
    q,
    CustomColumns,
    ColumState,
    initColumState,
    saveCulumFlag,
  }

  const modalProps = {
    dispatch,
    alarm,
    visible: rowDoubleVisible,
    dataSource: selectInfo,
    severitySql,
    sortSql,
    journalSql,
    detailsSql,
    key: defaultKey,
    loading: loading,
    branchType,
    user,
    componentType: 'historyview',
  }

  const ruleModalProps = {	//这里定义的是弹出窗口要绑定的数据源
    loading,
    dispatch,
    modalType: 'update',	                                    //弹出窗口的类型是'创建'还是'编辑'
    modalName: '通知规则',
    see: 'yes',
    alarmFrom,
    alarmSeverity,
    moSelect,
    notifyWay,
    item: notification.currentItem,		//要展示在弹出窗口的选中对象
    ...notification
  }

  const dataModalProps = {	//这里定义的是弹出窗口要绑定的数据源
    ...mainRuleInstanceInfo,
    key: `${mainRuleInstanceInfo.ruleInstanceKey}_2`,
    loading: loading.models['mainRuleInstanceInfo'],
    dispatch,
    item: mainRuleInstanceInfo.currentItem,		//要展示在弹出窗口的选中对象
    type: mainRuleInstanceInfo.modalType,																		//弹出窗口的类型是'创建'还是'编辑'
    visible: mainRuleInstanceInfo.modalVisible,															//弹出窗口的可见性是true还是false
    cycles: mainRuleInstanceInfo.currentItem.tpe,
    timeType: mainRuleInstanceInfo.currentItem.timeDef ? mainRuleInstanceInfo.currentItem.timeDef.repeatType : mainRuleInstanceInfo.timeType,
    fenhang,
    user, //权限判断
    alarmApplyFilter: app.alarmApplyFilter,
    userSelect,
    appSelect,
    optionAppNameEditing: [],
    optionCluster: [],
    optionNamespace: [],
    optionIndicator: [],
    appNameAuto: mainRuleInstanceInfo.currentItem.appNameAuto === undefined ? '' : mainRuleInstanceInfo.currentItem.appNameAuto,
    appNameEditing: mainRuleInstanceInfo.currentItem.appNameEditing === undefined ? [] : mainRuleInstanceInfo.currentItem.appNameEditing.split(','),
  }
  const buttonZoneProps = {
    dispatch,
    loadReporter,
    location,
    batchMaintain,
    expand,
    q,
    branchType,
    types,
    switchView,
  }

  const modalWorkOrderProps = {
    dispatch,
    item: currentItem,
    visible: workOrderVisible,
    alertType,
    alertMessage,
    oelDatasource: '',
    loading: loading.models['historyview'],
    branchType,
  }
  //      <ConfigProvider locale={zhCN}>

  let btZone = <ButtonZone {...buttonZoneProps} />
  const traceBackprops = {
    dispatch,
    loading,
    traceBack,
    CustomColumns,
    ColumState,
    initColumState,
    saveCulumFlag,
  }
  const dynamiColumDrawerProps = {
    dispatch,
    location,
    DrawerVisible,
    CustomColumns,
    ColumState,
    initColumState,
    timeStamp: new Date().getTime()
  }

  const onDynamiColums = () => {
    dispatch({
      type: 'historyview/setState',
      payload: {
        DrawerVisible: true
      }
    })
  }

  return (
    <div >
      <Filter {...filterProps} buttonZone={btZone} extorFun={onDynamiColums} />
      {/* <Views /> */}
      {switchView ? <List {...listProps} /> : <TraceBack {...traceBackprops} />}
      <HistoryViewModal {...modalProps} />
      <WorkOrderModal {...modalWorkOrderProps} />
      <NotificationModal {...ruleModalProps} />
      <MainRuleModal {...dataModalProps} />
      <DynamiColumDrawer {...dynamiColumDrawerProps} />
    </div>
  )
}


historyviewInfo.propTypes = {
  historyview: PropTypes.object,
}


export default connect(({
  historyview,
  alarmFrom,
  alarmSeverity,
  moSelect,
  notifyWay,
  userSelect,
  appSelect,
  traceBack,
  mainRuleInstanceInfo,
  app,
  alarm,
  notification,
  loading,
}) => ({
  historyview,
  alarmFrom,
  alarmSeverity,
  moSelect,
  notifyWay,
  userSelect,
  appSelect,
  traceBack,
  mainRuleInstanceInfo,
  app,
  alarm,
  notification,
  loading,
}))(historyviewInfo)

//export default historyviewInfo
