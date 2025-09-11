/**
* @module 告警中心/实时告警列表
* @description
* URL: <u>/oel</u>
*
* 此页面用于刷新 查询告警 工具配置。
*
* ## 告警操作
* ##### 刷新告警
* 立即刷新所有告警 组件nav的onFresh方法
*
* ##### 查询告警
* 点击弹出一个弹框,输入条件查询 组件nav的showModal方法
*
* ##### 工具配置
* 配置工具列表 组件nav的onTool方法

* ## 查询配置
* 点击按条件查询工具
*
* ## 新建工具
* 点击创建新的工具
*
* ##### 数据源配置
* 点击弹出数据源配置弹框进行配置 组件nav的DataSouseSet方法

* ## 查询数据源配置
* 按名称，os，ip查询配置
*
* ## 新建数据源配置
* 点击创建新的配置
*
* ##### 过滤器配置
* 点击弹出弹框,按条件进行过滤,也可以新增过滤器 组件nav的onEventFilter方法
*
* ##### 视图配置
* 点击弹出弹框,配置视图 组件nav的viewSet方法

* #### 暂停
* 点击暂停刷新时间
*
* #### 继续
* 点击继续刷新列表

* ## 列表名字
* 点击按照升序或降序排列
*
* ## 告警信息
* 双击弹出该条详细的告警信息
*
* ##### 告警级别
* 点击下拉框选择告警级别进行过滤 组件nav的handleChange方法
*/

import React from 'react'
import { connect } from 'dva'
import List from './List'
import Nav from './Nav'
import Countdown from './Countdown'
import TagZone from './TagZone'
import { Row, Col } from 'antd'
import FilterModal from './FilterModal'
import SearchFilter from './SearchFilter'

// import DetailModal from './DetailModal'
import DetailModal from '../utils/alarm/Modal'

import EventFilterModal from './OELEventFilter/EventFilterModal'

import WorkOrderModal from './WorkOrderModal'
import ProcessEventModal from './ProcessEventModal'

import ToolSet from './toolSet/ToolSet'
import ToolEdit from './toolSet/ToolEdit'
import ToolEd from './toolSet/ToolEd'

import ViewSet from './view/ViewSet'
import CopyView from './view/CopyView'
import ColumeEdit from './view/ColumeEdit'

import DataSouseSet from './dataSouse/DataSouseSet'
import DataSouseEdit from './dataSouse/DataSouseEdit'
import CopyDataSouse from './dataSouse/CopyDataSouse'

// internationalization
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';

import fenhang from '../../utils/fenhang'
import NotificationModal from '../notification/Modal'
import MainRuleModal from '../../routes/mainRuleInstanceInfo/DataModal'
moment.locale('zh-cn');//指定加载国际化目标
// end internationalization

const oel = ({
  location, dispatch, oel, oelEventFilter, loading, oelToolset, oelDataSouseset, eventviews, alarm, notification, alarmFrom, 
  alarmSeverity, moSelect, notifyWay, mainRuleInstanceInfo,userSelect,appSelect,app,
}) => {
  const {
    title, filterDisable, list, pagination, currentItem, initValue, tagFilters, currentSelected, visibleFilter, visibleDetail, oelViewer, oelColumns, oelDatasource,
    toolList, oelFilter, filteredSeverityMap, filterList, datasourceList, viewList, countState, orderBy, selectedRows, cfgType, woCurrentItem, alertType, alertMessage,
    processEventVisible, contextType, contextMessage, workOrderVisible, fieldKeyword, curDetailTabKey,
    preSearch, visibleSearchFilter, appNameList, fetchingApp, Service_Impact_Num, HotPotNum, callUsers,
  } = oel
  const user = JSON.parse(sessionStorage.getItem('user'))
  document.title = title
  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['oel/query'],
    pagination,
    location,
    tagFilters,
    currentSelected,
    oelColumns,
    oelDatasource,
    oelFilter,
    oelViewer,
    toolList,
    selectedRows,
    user,
    onPageChange(page, filters, sorter) {
      const { query, pathname } = location

      let orderBy = ''
      //如果用户点击排序按钮
      if (sorter.order != undefined) {
        let order = sorter.order === 'descend' ? ' desc' : ' asc'

        //排序字段首字母大写
        let filterName = sorter.field.slice(0, 1).toUpperCase() + sorter.field.slice(1)
        orderBy = `order by ${filterName}${order}`
      } else {
        orderBy = 'order by FirstOccurrence desc'
      }


      dispatch({
        type: 'oel/query',
        payload: {
          pagination: page,
          oelDatasource,
          oelViewer,
          oelFilter,
          orderBy,
        },
      })
    },
  }

  const countdownProps = {
    dispatch,
    initValue,
    countState,
    filteredSeverityMap,
    location,
    pagination,
    oelDatasource,
    oelViewer,
    oelFilter,
    orderBy,
    tagFilters,
    userBranch: user.branch
  }

  const tagProps = {
    dispatch,
    tagFilters,
    currentSelected,
    location,
    pagination,
    oelDatasource,
    oelViewer,
    oelFilter,
    orderBy,
  }

  const navProps = {
    dispatch,
    location,
    loading,
    showEventFilterList: filterList,
    showdataSouseList: datasourceList,
    showviewList: viewList,
    tagFilters,
    currentSelected,
    filteredSeverityMap,
    oelViewer,
    oelColumns,
    oelDatasource,
    oelFilter,
    countState,
    orderBy,
    pagination,
    filterDisable,
    preSearch,
    Service_Impact_Num,
    HotPotNum,
  }

  const modalFilterProps = {
    dispatch,
    visibleFilter,
    tagFilters,
    cfgType,
  }
  const modalSearchFilterProps = {
    dispatch,
    visibleSearchFilter,
    tagFilters,
    currentSelected,
    appNameList,
    fetchingApp
  }

  const modalDetailProps = {
    dispatch,
    visible: visibleDetail,
    dataSource: currentItem,
    fieldKeyword,
    curDetailTabKey,
    loading: loading,
    alarm,
    branchType: 'ZH',
    componentType: 'oel',
    user
  }

  const modalWorkOrderProps = {
    dispatch,
    item: woCurrentItem,
    visible: workOrderVisible,
    alertType,
    alertMessage,
    oelDatasource,
    loading,
  }

  const modalProcessEventProps = {
    dispatch,
    selectedRows,
    visible: processEventVisible,
    oelDatasource,
    contextType,
    contextMessage,
    callUsers,
  }

  const eventFilterProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    loading,
    location,
    oelEventFilter,
  }

  const toolSetProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: oelToolset.toolsetVisible,
    dataSource: oelToolset.toolList,
    loading,
  }
  const tooleditProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: oelToolset.tooleditVisible,															//弹出窗口的可见性是true还是false
  }

  const tooledProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    item: oelToolset.currentItem,
    visible: oelToolset.tooledVisible,															//弹出窗口的可见性是true还是false
  }

  const dataSouseeditProps = {															//这里定义的是弹出窗口要绑定的数据源
    currentItemdata: oelDataSouseset.currentItemdata,
    dispatch,
    displayObsSrvsList: oelDataSouseset.displayObsSrvsList,
    visible: oelDataSouseset.dataSouseeditVisible,
    type: oelDataSouseset.datatype,														//弹出窗口的可见性是true还是false
  }
  const dataSouseSetProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: oelDataSouseset.dataSousesetVisible,
    dataSource: oelDataSouseset.dataSouseList,
    loading,
  }

  const copydataSouseProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: oelDataSouseset.copydataSouseVisible,
  }

  const columeModalProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    loading,
    modaltype: eventviews.modaltype,
    visible: eventviews.columeVisible,															//弹出窗口的可见性是true还是false
    columeList: eventviews.columeList,
    columeInfo: eventviews.columeInfo,
    columeInfoName: eventviews.columeInfoName,
    columeInfoWidth: eventviews.columeInfoWidth,
    columeInfoLocked: eventviews.columeInfoLocked,
    columeInfoSort: eventviews.columeInfoSort,
    selectKey1: eventviews.selectKey1,
    selectKey2: eventviews.selectKey2,
    currentView: eventviews.currentView,
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

  const mainRuleModalProps = {
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
    appNameAuto: mainRuleInstanceInfo.currentItem.appNameAuto === undefined ? '' : mainRuleInstanceInfo.currentItem.appNameAuto,
    appNameEditing: mainRuleInstanceInfo.currentItem.appNameEditing === undefined ? [] : mainRuleInstanceInfo.currentItem.appNameEditing.split(','),
  }

  const viewSetProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: eventviews.viewsetVisible,
    dataSource: eventviews.viewList,
    loading,
  }

  const copyviewProps = {															//这里定义的是弹出窗口要绑定的数据源
    dispatch,
    visible: eventviews.copyviewVisible,
    currentView: eventviews.currentView,
  }

  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <Row gutter={24}>
          <Col className="oel-nav">
            <Nav {...navProps} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col className="oel-tag-zone">
            <TagZone {...tagProps} />
          </Col>
        </Row>
        <Row gutter={24} style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
          <Col className="content-inner2">
            <Countdown {...countdownProps} />
          </Col>
        </Row>
        {/* <Row gutter={24} style={{ backgroundColor: 'white', paddingTop: 8, paddingBottom: 8 }}>
        <Col className="content-inner2">
          <ConclusionInfo {...countdownProps} />
        </Col>
      </Row> */}
        <Row gutter={24}>
          <Col className="content-inner3">
            <List {...listProps} />
          </Col>
        </Row>
        {/* 查询 */}
        <FilterModal {...modalFilterProps} />
        <SearchFilter {...modalSearchFilterProps} />

        <DetailModal {...modalDetailProps} />

        <DataSouseSet {...dataSouseSetProps} />
        <CopyDataSouse {...copydataSouseProps} />
        <DataSouseEdit {...dataSouseeditProps} />

        {/*工具配置 start*/}
        <ToolSet {...toolSetProps} />
        <ToolEdit {...tooleditProps} />
        <ToolEd {...tooledProps} />
        {/* end*/}

        <ColumeEdit {...columeModalProps} />
        <ViewSet {...viewSetProps} />
        <CopyView {...copyviewProps} />

        {/* 存放引用的入口页面 */}
        <EventFilterModal {...eventFilterProps} />

        {/* 工单弹出界面 */}
        <WorkOrderModal {...modalWorkOrderProps} />
        <ProcessEventModal {...modalProcessEventProps} />
        {/* 
        // 通知规则
         */}
        <NotificationModal {...ruleModalProps} />
        <MainRuleModal {...mainRuleModalProps} />
      </ConfigProvider>
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
  oel, oelEventFilter, oelToolset, oelDataSouseset, eventviews, loading, alarm, notification, alarmFrom, 
  alarmSeverity, moSelect, notifyWay, userinfo, mainRuleInstanceInfo,userSelect,appSelect,  app,
}) => ({
  oel, oelToolset, oelEventFilter, oelDataSouseset, eventviews, loading, alarm, notification, alarmFrom, 
  alarmSeverity, moSelect, notifyWay, userinfo, mainRuleInstanceInfo,userSelect,appSelect,  app,
}))(oel)
