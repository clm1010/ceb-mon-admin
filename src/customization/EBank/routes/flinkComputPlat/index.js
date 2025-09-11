
import React, { useState } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from "query-string";
import { Row, Col, Tabs, Icon, Table } from 'antd'

import DictModal from './DictModal'
import AddDictModal from './addDictModal'

import SearchModal from './device/SearchModal'
import SearchDevice from './device/search'
import ButtonDevice from './device/ButtonZone'
import ListDevice from './device/List'
import DeviceMOdal from './device/modal'
import BindGroup from './device/bindGroup';

import SearchPolicy from './policy/search'
import ButtonPolicy from './policy/ButtonZone'
import ListPolicy from './policy/List'
import Modal from './policy/Modal'

import ListPolicyGroup from './policyGroup/List'
import ButtonGroup from './policyGroup/ButtonZone'
import ModalGroup from './policyGroup/Modal'
import SearchGroup from './policyGroup/search'
import AddTemp from './policyGroup/AddTempModal'
import ReplaceTemp from './policyGroup/replaceTemp'
import BindDevGroup from './policyGroup/BindDevGroup';

import ListTemplate from './template/List'
import ButtonTemplate from './template/ButtonZone'
import ModalTemplate from './template/Modal'
import SearchTemplate from './template/search'
import AddConditio from './template/AddCondition';


import ListCondition from './condition/List'
import ButtonCondition from './condition/ButtonZone'
import ModalCondition from './condition/Modal'
import SearchCondition from './condition/search'

const TabPane = Tabs.TabPane

const flinkComputPlat = ({
  location, dispatch, loading, flinkComputPlat,
}) => {
  const { choosedRows, batchDelete, pagination, modalVisible, currentItem, contions, listDevice, tableStatue, searchMoalVisible,paginationDevice,Groupagination,
    searchValues, deviceModalVisible, dictModalVisible, addDictVisible, DictList1, DictList2, DictList3, level, parentId, parentId1, parentId2, showpolicyGropuVisible,
    showTemplateVisible, showConditionVisible, tempModalVisible, groupItem, polickList, groupList, tempList, contionList, addconditonVisible, tempItem,tempCondition,groupTemp,
    bindgoupVisible,bindGroupTyep,Tempagination,pagination1,replaceTempModalVisible,bindDevGroupModalVisible,devGroupList,devGroupAllList
  } = flinkComputPlat	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

  const [tabStatue, setTabStatue] = useState('plicky')
  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: tabStatue == 'plicky' ? polickList : tabStatue == 'device' ? listDevice : tabStatue == 'plickyGroup' ? groupList : tabStatue == 'template' ? tempList : contionList,
    loading: loading.models['flinkComputPlat'],
    pagination:tabStatue == 'plicky' ? pagination : tabStatue == 'device'  ? paginationDevice : pagination1,
    choosedRows,
    contions,
  }

  const modalMoProps = {	//这里定义的是弹出窗口要绑定的数据源
    loading,
    dispatch,
    item: currentItem,		//要展示在弹出窗口的选中对象
    modalVisible: modalVisible, //弹出窗口的可见性是true还是false
    modalName: 'MO对象详情',		//@@@
  }

  const buttonPorps = {
    dispatch,
    batchDelete,
    choosedRows,
    tableStatue,
    contions
  }
  const searchProps = {
    dispatch,
    tableStatue,
    searchValues,
    devGroupAllList,
  }
  const searchModalMoProps = {
    dispatch,
    searchMoalVisible
  }
  const devicemodalProps = {
    dispatch,
    deviceModalVisible,
  }
  const dictModalProps = {
    dispatch,
    dictModalVisible,
    DictList1,
    DictList2,
    DictList3,
    parentId,
    parentId1,
    parentId2,
  }
  const addmodalProps = {
    dispatch,
    addDictVisible,
    level,
    parentId,
  }

  const modalGroupProps = {
    dispatch,
    showpolicyGropuVisible,
    item: currentItem,
  }

  const modalTempProps = {
    dispatch,
    showTemplateVisible,
    item: currentItem,
    DictList1,
    DictList2,
    DictList3,
  }
  const modalConditionProps = {
    dispatch,
    showConditionVisible,
    item: currentItem,
    groupItem,
  }

  const AddTempProps = {
    dispatch,
    tempModalVisible,
    item: tempList,
    groupItem,
    groupTemp,
  }
  const addconditonPropos = {
    dispatch,
    addconditonVisible,
    contionList,
    tempItem,
    tempCondition,
  }
  const bindGroupProps = {
    dispatch,
    Groupagination,
    groupList,
    choosedRows,
    bindgoupVisible,
    bindGroupTyep
  }
  const replaceTempProps ={
    dispatch,
    replaceTempModalVisible,
    groupList
  }
  const bindDevGroupProps = {
    dispatch,
    bindDevGroupModalVisible,
    devGroupList,
    devGroupAllList,
    item: currentItem,
  }
  const onTabClick = (key) => {
    setTabStatue(key)
    if (key === 'plicky') {
      dispatch({
        type: 'flinkComputPlat/query',
        payload: {},
      })
    } else if (key === 'device') {
      dispatch({
        type: 'flinkComputPlat/queryDevice',
        payload: {},
      })
      dispatch({
        type: 'flinkComputPlat/getAllDeviceGroup',
        payload: {
        },
      })
    } else if (key === 'plickyGroup') {
      dispatch({
        type: 'flinkComputPlat/queryGroup',
        payload: {},
      })
    } else if (key === 'template') {
      dispatch({
        type: 'flinkComputPlat/querytemplate',
        payload: {},
      })
    } else if (key === 'condition') {
      dispatch({
        type: 'flinkComputPlat/querycondition',
        payload: {},
      })
    }

  }

  return (
    <div className="content-inner">
      <Row gutter={12} className="content-tree">
        <Tabs onTabClick={onTabClick} size='large' type='card'>
          <TabPane tab={<span><Icon type="container" />实例列表</span>} key="plicky">
            <Col lg={5} md={6} sm={7} xs={24} style={{ padding: 0 }}>
              <SearchPolicy {...searchProps} />
            </Col>
            <Col lg={19} md={18} sm={17} xs={24} className="content-right">
              <ButtonPolicy {...buttonPorps} />
              <ListPolicy {...listProps} />
            </Col>
          </TabPane>
          <TabPane tab={<span><Icon type="database" />设备列表</span>} key="device">
            <Col lg={5} md={6} sm={7} xs={24} style={{ padding: 0 }}>
              <SearchDevice {...searchProps} />
            </Col>
            <Col lg={19} md={18} sm={17} xs={24} className="content-right">
              <ButtonDevice {...buttonPorps} />
              <ListDevice {...listProps} />
            </Col>
          </TabPane>
          <TabPane tab={<span><Icon type="cluster" />策略组</span>} key="plickyGroup">
            <Col lg={5} md={6} sm={7} xs={24} style={{ padding: 0 }}>
              <SearchGroup {...searchProps} />
            </Col>
            <Col lg={19} md={18} sm={17} xs={24} className="content-right">
              <ButtonGroup {...buttonPorps} />
              <ListPolicyGroup {...listProps} />
            </Col>
          </TabPane>
          <TabPane tab={<span><Icon type="profile" />策略模板</span>} key="template">
            <Col lg={5} md={6} sm={7} xs={24} style={{ padding: 0 }}>
              <SearchTemplate {...searchProps} />
            </Col>
            <Col lg={19} md={18} sm={17} xs={24} className="content-right">
              <ButtonTemplate {...buttonPorps} />
              <ListTemplate {...listProps} />
            </Col>
          </TabPane>
          <TabPane tab={<span><Icon type="code" />策略公式</span>} key="condition">
            <Col lg={5} md={6} sm={7} xs={24} style={{ padding: 0 }}>
              <SearchCondition {...searchProps} />
            </Col>
            <Col lg={19} md={18} sm={17} xs={24} className="content-right">
              <ButtonCondition {...buttonPorps} />
              <ListCondition {...listProps} />
            </Col>
          </TabPane>
        </Tabs>

        <DeviceMOdal {...devicemodalProps} />
        <DictModal {...dictModalProps} />
        <AddDictModal  {...addmodalProps} />
        <Modal  {...modalMoProps} />
        <SearchModal {...searchModalMoProps} />
        <ModalGroup {...modalGroupProps} />
        <ModalTemplate {...modalTempProps} />
        <ModalCondition {...modalConditionProps} />
        <AddTemp {...AddTempProps} />
        <AddConditio {...addconditonPropos} />
        <BindGroup  {...bindGroupProps}/>
        <ReplaceTemp {...replaceTempProps}/>
        <BindDevGroup {...bindDevGroupProps}/>
      </Row>
    </div>
  )
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ flinkComputPlat, loading }) => ({ flinkComputPlat, loading: loading }))(flinkComputPlat)
