/**
* @module 自服务管理/网络自服务
* @description 
* URL: <u>/MOwizard</u>
*
* 此页面用于网络域设备的发现和配置下发。
* 包含设备、线路、网点IP的的上线和下线,实现向导式配置, 分为设备、线路、网点IP三个tab(切换调用index的 callback 方法)。
* 
* ## 设备向导
* 包含设备的上线、下线、变更和查询操作。
* ##### 上线
* 点击弹出MO向导弹框,根据提示添加设备监控。
* 设备向导包含4步：设备发现、信息同步（必要信息填写）、监控接口选择（可编辑带宽和监控指标-性能采集；性能监控；syslog监控）、下发实例预览。
* 调用组件 ButtonZone 的 onIssue 方法
* 
* ##### 下线
* 设备下线包含保存（保存需下发的监控数据）和下发（保存并下发监控数据）两个操作。
* 调用组件 ButtonZone 的 onDelete 方法
*
* ##### 查询
* 在条件过滤框里过滤查询。
* 调用组件 queryForm 的 query 方法
* 
* ##### 变更
* 列表每一行右侧的变更按钮, 弹出编辑弹框,修改对应设备信息。
* 调用组件 List 的 onEdit 方法
* 
*
* ## 线路向导
* 包含线路的上线、下线、变更和查询操作。
* ##### 上线
* 点击弹出线路向导框,根据提示添加线路监控。
*
* 线路向导包含3步：设备查询、信息编辑、下发实例预览。
* 调用组件 ButtonZone 的 onIssue 方法
* 
* ##### 下线
* 线路下线包含保存（保存需下发的监控数据）和下发（保存并下发监控数据）两个操作。
* 调用组件 ButtonZone 的 onDelete 方法
*
* ##### 查询
* 在条件过滤框里过滤查询 调用组件 queryForm 的 query 方法
* 
* ##### 变更
* 列表每一行右侧的变更按钮, 弹出编辑弹框,修改对应设备信息, 调用组件 List 的 onEdit 方法
* 
*
* ## 网点IP向导
* 包含网点IP的上线、下线、变更和查询操作。
* ##### 上线
* 点击弹出网点IP向导框,根据提示添加网点IP监控。
* 网点IP向导包含3步：设备查询、信息编辑、下发实例预览。
* 调用组件 ButtonZone 的 onIssue 方法
* 
* ##### 下线
* 网点IP下线包含保存（保存需下发的监控数据）和下发（保存并下发监控数据）两个操作。
* 调用组件 ButtonZone 的 onDelete 方法
*
* ##### 查询
* 在条件过滤框里过滤查询 调用组件 queryForm 的 query 方法
* 
* ##### 变更
* 列表每一行右侧的变更按钮, 弹出编辑弹框,修改对应设备信息, 调用组件 List 的 onEdit 方法
* 
*/
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Icon, Modal, Tabs, Row, Col,Alert } from 'antd'
import Filter from './queryForm'

import FilterSchema from './NetWizard/FilterSchema'
import LineFilterSchema from './LineWizard/FilterSchema'
import BranchIPFilter from './BRIPWizard/FilterSchema'

import NEList from './NetWizard/List'
import LineList from './LineWizard/List'
import BranchIPList from './BRIPWizard/List'

import ButtonZone from './NetWizard/ButtonZone'
import LineButtonZone from './LineWizard/ButtonZone'
import BranchIPButtonZone from './BRIPWizard/ButtonZone'

import NeWizard from './NetWizard/objWizard'
import LineWizard from './LineWizard/lineWizard'
import BranchIPWizard from './BRIPWizard/ipWizard'
import HelpButton from '../../components/helpButton'

import BatchSyncModal from './batchSyncModal'

const TabPane = Tabs.TabPane

const moTree = [{
  name: '请选择类型',
  key: 'MO',
  children: [{
    name: '网络',
    key: 'NETWORK',
  }/*,
  {
    name: 'IP',
    key: 'IP',
  },
  {
    name: '硬件',
    key: 'HARDWARE',
  },
  {
    name: '操作系统',
    key: 'OS',
  }, {
    name: '数据库',
    key: 'DB',
  }, {
    name: '中间件',
    key: 'MW',
 }, {
    name: '应用',
    key: 'APP',
  }*/],
}]

const mowizard = ({
 location, dispatch, mowizard, loading, app, appSelect
}) => {
	const {
    list,
    pagination,
    neitem,
    wizardVisible,
    lineWizardVisible,
    currentStep,
    modalType,
    batchDelete,
    selectedRows,
    dataList,
    pageChange,
    q,
    checkAll,
    ifList,
    policyAllList,
    policyExistList,
    policyList,
    errorList,
    preListType,
    errorMessage,
    listLine,
    changeType,
    ip,
    moIp,
    moType,
    message,
    moName,
    lineItem,
    loadingEffect,
    batchSelect,
    secondSecAreaDisabled, //二级安全域禁用状态
    onIssueForbid,         //下发禁止状态
    bripWizardVisible,
    bripItem,
    listBrIP,
    bripCurrentStep,
    } = mowizard	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

  const tabsOpts = {
		//activeKey: openPolicyType,
		defaultActiveKey:"NET",
  }

  const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
    q : q,
    moTypeTree: moTree,
    dispatch,
    onSearch (q) {
      //console.log("QQ:"+q)
	    dispatch({
        type: 'mowizard/queryMOs',
          payload: {
          page: 0,
          q,
        },
      })
    },
  }

  const lineFilterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: LineFilterSchema,
//    q : q,
    //moTypeTree: moTree,
    dispatch,
    onSearch (q) {
	    dispatch({
        type: 'mowizard/queryLines',
              payload: {
          page: 0,
          q,
        },
      })
    },
  }

  const branchIPFilterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: BranchIPFilter,
    dispatch,
    onSearch (q) {
	    dispatch({
        type: 'mowizard/queryBrIPs',
        payload: {
          page: 0,
          q,
        },
      })
    },
  }

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading,//.effects['mowizard/query'],
    pagination,
    key: pageChange,
    batchDelete,
    batchSelect,
    q,
  }

  const listLineProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: listLine,
    loading: loading,//.effects['mowizard/queryLines'],
    pagination,
    key: pageChange,
    batchDelete,
    batchSelect,
    q,
  }

  const listBranchIPProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: listBrIP,
    loading: loading,
    pagination,
    key: pageChange,
    batchDelete,
    batchSelect,
    q,
  }

  const buttonZoneProps = {
    dispatch,
    batchDelete,
    checkAll,
    q,
    batchSelect,
  }

  const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		loadingEffect,
		dispatch,
		neitem: neitem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		wizardVisible, //弹出窗口的可见性是true还是false
    currentStep,
    appSelect,
    ifList,
    changeType,
    ip,
    moIp,
    moType,
    message,
    moName,
    selectedRows,
    policyAllList,
    policyExistList,
    policyList,
    errorList,
    preListType,
    errorMessage,
    q,
    secondSecAreaDisabled, //二级安全域禁用状态
    onIssueForbid,
    }

    const modalOptsProps = {
      dispatch,
      visible: mowizard.batchSyncModalVisible,
      choosedRows: selectedRows,
      batchSyncState:mowizard.batchSyncState,
      batchsyncSuccessList:mowizard.batchsyncSuccessList,
      batchsyncFailureList:mowizard.batchsyncFailureList,
    }

  const modalLineProps = {	//这里定义的是弹出窗口要绑定的数据源
		loadingEffect,
		dispatch,
		lineItem: lineItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		lineWizardVisible, //弹出窗口的可见性是true还是false
    currentStep,
    appSelect,
    policyAllList,
    policyExistList,
    policyList,
    errorList,
    dataList,
    preListType,
    errorMessage,
    q,
    onIssueForbid,
    }

  const modalBRIPProps = {	//这里定义的是弹出窗口要绑定的数据源
    loadingEffect,
    dispatch,
    neitem: bripItem,		//要展示在弹出窗口的选中对象
    modalType, //弹出窗口的类型是'创建'还是'编辑'
    wizardVisible: bripWizardVisible, //弹出窗口的可见性是true还是false
    currentStep: bripCurrentStep,
    appSelect,
    policyAllList,
    dataList,
    policyExistList,
    policyList,
    errorList,
    preListType,
    errorMessage,
    q,
  }
      
  const callback = (key) => {
    if ("NET" === key){
      dispatch({
        type: 'mowizard/queryMOs',
        payload: {

        },
      })
      dispatch({
        type: 'mowizard/setState',
        payload: {
          batchDelete: false,
          batchSelect: [],
        },
      })
    } else if ("LINE" === key){
      dispatch({
        type: 'mowizard/queryLines',
        payload: {

        },
      })
      dispatch({
        type: 'mowizard/setState',
        payload: {
          batchDelete: false,
          batchSelect: [],
        },
      })
    } else if ("BR_IP" === key){
      dispatch({
        type: 'mowizard/queryBrIPs',
        payload: {

        },
      })
      dispatch({
        type: 'mowizard/setState',
        payload: {
          batchDelete: false,
          batchSelect: [],
        },
      })

    }
  }

  let buton = <ButtonZone {...buttonZoneProps} />
  let lineButon = <LineButtonZone {...buttonZoneProps} />
  let branchIPButon = <BranchIPButtonZone {...buttonZoneProps} />
  const hbProps = {
		title:'网络自服务',
		tag:'mowizard'
	}

  return (
    <div className="content-inner">
    <Row gutter={24}>
      <Col>
	      <HelpButton {...hbProps}/>
        <Tabs size="small" {...tabsOpts} onTabClick={callback} tabPosition='right'>
          <TabPane tab={<span>设备</span>} key="NET">
              <Filter {...filterProps}  buttonZone={buton} />
              <NEList {...listProps} />
              <NeWizard {...modalProps}  />
              <BatchSyncModal {...modalOptsProps} />
          </TabPane>
          <TabPane tab={<span>线路</span>} key="LINE">
              <Filter {...lineFilterProps}  buttonZone={lineButon} />
              <LineList {...listLineProps} />
              <LineWizard {...modalLineProps}  />
          </TabPane>
          <TabPane tab={<span>网点IP</span>} key="BR_IP">
              <Filter {...branchIPFilterProps}  buttonZone={branchIPButon} />
              <BranchIPList {...listBranchIPProps} />
              <BranchIPWizard {...modalBRIPProps}/>
          </TabPane>
        </Tabs>
      </Col>
    </Row>

  </div>

  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
  mowizard, loading, app, appSelect
}) => ({
  mowizard, loading:loading.models.mowizard, app, appSelect
}))(mowizard)
