import React from 'react'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import { routerRedux } from 'dva/router'
import Modalmo from './Modalmo'
import MonitorInstanceModal from './MonitorInstanceModal'
import Modalrule from './Modalrule'
import Modaltool from './Modaltool'
import Modaltemp from './Modaltemp'
import ButtonZone from './ButtonZone'
import fenhang from '../../utils/fenhang'
import treeDataApp from '../../utils/treeDataApp'
import OperationModalDesc from '../policy/utils/OperationModalDesc'
import queryString from "query-string";
import HelpButton from '../../components/helpButton'

const notNetDown = ({
    location, dispatch, loading, notNetDown,
}) => {
    const {list,choosedRows,batchDelete,resetCalInput,advancedItem,pagination,checkStatus,isClose,filter, modalMOVisible,see,timeList, modalToolVisible, branchs, modalRuleVisible, modalTempVisible,  currentItem,tabstate, typeValue, stdInfoVal ,q,oper,onIssueForbid} = notNetDown	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
   
    // const {
    //   list, pagination, currentItem, modalVisible, modalType, checkStatus, errorList, isClose, batchDelete, batchDeletes, choosedRowslist, choosedRows, filterSchema, branchs, checkAll, checkedList, indeterminate, see, expand,
     
    //   filter,selectIndex,resetCalInput,modaType,advancedItem,onIssueForbid,disItem} = ruleInstance	
   
    const listProps = { //这里定义的是查询页面要绑定的数据源
            dispatch,
            dataSource: list,
            dataSource2: notNetDown.list2,
            loading: loading.effects['mo/query'],
            pagination,
            choosedRows,
            branchs,
            q,
            tabShowPage: notNetDown.tabShowPage,
            paginationMan: notNetDown.paginationMan,
          }
        const filterProps = { //这里定义的是查询页面要绑定的数据源
            expand: false,
            filterSchema: FilterSchema,
            q : q,
            dispatch,
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
            queryPreProcess (data) {
              if (data.mo_name !== undefined) {
              data['mo.name'] = data.mo_name
              delete data.mo_name
            }
            if (data.mo_discoveryIP !== undefined) {
              data['mo.discoveryIP'] = data.mo_discoveryIP
              delete data.mo_discoveryIP
            }
            if (data.rule_name !== undefined) {
              data['rule.name'] = data.rule_name
              delete data.rule_name
            }
            if (data.toolInst.toolType !== undefined) {
              data['toolInst.toolType'] = data.toolInst.toolType
              delete data.toolInst.toolType
            }
            if (data.toolInst_name !== undefined) {
              data['toolInst.name'] = data.toolInst_name
              delete data.toolInst_name
            }
            if (data.policy_name !== undefined) {
              data['policy.name'] = data.policy_name
              delete data.policy_name
            }
            if (data.policy_alarmSettings_conditions_indicator_name !== undefined) {
              data['policy.alarmSettings.conditions.indicator.name'] = data.policy_alarmSettings_conditions_indicator_name
              delete data.policy_alarmSettings_conditions_indicator_name
            }
            return data
            },
          }
        

    const modalMoProps = {	//这里定义的是弹出窗口要绑定的数据源
        loading,
        dispatch,
        item: currentItem,		//要展示在弹出窗口的选中对象
        modalVisible: modalMOVisible, //弹出窗口的可见性是true还是false
        modalName: 'MO对象详情',		//@@@
    }

    const modalRuleProps = {									//这里定义的是弹出窗口要绑定的数据源
        dispatch,
        citem: currentItem,		//要展示在弹出窗口的选中对象
        visible: modalRuleVisible,									//弹出窗口的可见性是true还是false
    }

    const modalToolProps = {									//这里定义的是弹出窗口要绑定的数据源
        dispatch,
        item: currentItem,		//要展示在弹出窗口的选中对象
        visible: modalToolVisible,									//弹出窗口的可见性是true还是false
    }

    const modalTempProps = { //这里定义的是弹出窗口要绑定的数据源
        fenhang,
        dispatch,
        item: currentItem, //要展示在弹出窗口的选中对象
        visible: modalTempVisible, //弹出窗口的可见性是true还是false
        tabstate,
        typeValue,
        stdInfoVal,
        treeDataApp,
    }
    const MonitorInstanceProps = {
      key: `${notNetDown.ruleInstancecreateOrUpdateKEY}_createOrUpdate`,
      dispatch,
      item: notNetDown.MonitorInstanceItem,
      visible: notNetDown.monitorInstanceVisible,
      visible2: notNetDown.ruleInfsVisible,
      ruleUUIDs: notNetDown.ruleUUID,
      tabstate: notNetDown.tabstate,
      typeValue: notNetDown.typeValue,
      stdInfoVal: notNetDown.stdInfoVal,
      timeList: notNetDown.timeList,
      type: notNetDown.monitorInstanceType,
      obInfoVal: notNetDown.obInfoVal,
      treeDataApp,
      fenhang,
      branchs,
      operationType: notNetDown.operationType,
      see,
    }
    const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
      dispatch,
      visible: notNetDown.operationVisible,
      fileType: notNetDown.fileType,
      loading,
      newOperationItem: notNetDown.newOperationItem,
      checkStatus, //检测状态done,success,fail,checking
      isClose,
      tabstate: notNetDown.tabstate,
      typeValue: notNetDown.typeValue,
      stdInfoVal: notNetDown.stdInfoVal,
      timeList: notNetDown.timeList,
      // treeNodes: ruleInstanceGroup.treeDatas.length > 0 ? loopSelect(ruleInstanceGroup.treeDatas) : [],
      treeDataApp,
      operationType: notNetDown.operationType, //记录操作详情操作状态，add/edit
      CheckboxSate: notNetDown.CheckboxSate,
      CheckboxSate1: notNetDown.CheckboxSate1,
      onCancel () {
        dispatch({
          type: 'notNetDown/updateState',
          payload: {
            operationVisible: false,
            CheckboxSate: true,
          },
        })
      },
      filter:filter,
      advancedItem,
      resetCalInput,
    }
  
	const buttonZoneProps = {
        dispatch,
        batchDelete,
        choosedRows,
        oper,
        onIssueForbid,
      }
      let buton = <ButtonZone {...buttonZoneProps} />
      const hbProps = {
        title:'非网络监控实例',
        tag:'notNetDown'
      }
    return (
        <div className="content-inner">
            {/* <Filter {...filterProps} buttonZone={buton} /> */}
            <Filter {...filterProps} />
            <List {...listProps} />
	          <HelpButton {...hbProps}/>
            <Modalmo {...modalMoProps} />
            <MonitorInstanceModal {...MonitorInstanceProps} />
            <Modalrule {...modalRuleProps} />
            <Modaltool {...modalToolProps} />
            <Modaltemp {...modalTempProps} />
            <OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
        </div>
    )
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ notNetDown, loading }) => ({ notNetDown, loading: loading }))(notNetDown)
