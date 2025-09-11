import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import ButtonZone from './ButtonZone'
import Filter from './../../components/Filter/Filter'
import List from './List'
import TaskModel from './TaskModalDesc'
import Modal from './Modal'
import FilterSchema from './FilterSchema'
import InfoModalDesc from './InfoModalDesc'
import OnInfoModalDesc from './OnInfoModalDesc'
import InInfoModalDesc from './InInfoModalDesc'
import NoInfoModalDesc from './NoInfoModalDesc'
import queryString from "query-string";
import NewWork from './../MOWizard/NetWizard/objWizard'

const discovery = ({
 location, dispatch, discovery, loading,mowizard,appSelect,
}) => {

	const {
 list, pagination, currentItem,currentId, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, pageChange, q,toolsUrl,onInfoVisible,inInfoVisible,isRepeat} = discovery	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量

  const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
    type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															//弹出窗口的可见性是true还是false
    checkStatus,																				//检测状态done,success,fail,checking
    isClose,
    toolsUrl,
  }

  const filterProps = { //这里定义的是查询页面要绑定的数据源
    filterSchema: FilterSchema,
	  expand: false,
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

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['discovery/queryShowInfo'],
    pagination,
    key: pageChange,
    q,
    batchDelete,
    choosedRows,
  }

  const taskModalDescProps = {
    dispatch,
    visible: discovery.taskVisible,
    loading,
    titlename: '任务列表',
    discovery,
    q,
    onCancel () {
      dispatch({
        type: 'discovery/showModal',
        payload: {
          taskVisible: false,
          branch: '', //点击cancel 值为空
          taskList: [],
          q:""
        },
      })
    },
  }

  const mosModalDescProps = {
    dispatch,
    visible: discovery.mosVisible,
    loading,
    titlename: '发现设备',
    policyObjInfo: `发现设备数 ${discovery.infoNum}`,
    discovery,
    q,
    onCancel () {
      dispatch({
        type: 'discovery/showModal',
        payload: {
          mosVisible: false,
          branch: '', //点击cancel 值为空
          infoNum: 0,
          infoList: [],
          q:""
        },
      })
    },
  }

  const noInfoDescProps = {
    dispatch,
    visible: discovery.noInfoVisible,
    loading,
    titlename: '配置不规范设备',
    policyObjInfo: `配置不规范设备数 ${discovery.noInfoNum}`,
    discovery,
    q,
    onCancel () {
      dispatch({
        type: 'discovery/showModal',
        payload: {
          noInfoVisible: false,
          branch: '', //点击cancel 值为空
          noInfoNum: 0,
          infoList: [],
          q:""
        },
      })
    },
  }
  const onLineDescProps = {
    dispatch,
    visible: discovery.onInfoVisible,
    loading,
    titlename: '上线设备',
    policyObjInfo: `上线设备数 ${discovery.onInfoNum}`,
    discovery,
    q,
    onCancel () {
      dispatch({
        type: 'discovery/showModal',
        payload: {
          onInfoVisible: false,
          branch: '', //点击cancel 值为空
          onInfoNum: 0,
          infoList: [],
          q:""
        },
      })
    },
  }

  const inInfoDescProps = {
    dispatch,
    visible: discovery.inInfoVisible,
    loading,
    titlename: '无效设备',
    policyObjInfo: `无效设备数 ${discovery.inInfoNum}`,
    discovery,
    q,
    isRepeat,
    currentId,
    onCancel () {
      dispatch({
        type: 'discovery/showModal',
        payload: {
          inInfoVisible: false,
          branch: '', //点击cancel 值为空
          inInfoNum: 0,
          infoList: [],
          q:""
        },
      })
    },
  }

	const buttonZoneProps = {
	  	dispatch,
	  	batchDelete,
	  	choosedRows,
	}

  const newWorkModel = {	//这里定义的是弹出窗口要绑定的数据源
    loadingEffect:false,
    dispatch,
    neitem: mowizard.neitem,		//要展示在弹出窗口的选中对象
    modalType:'create', //弹出窗口的类型是'创建'还是'编辑'
    wizardVisible:mowizard.wizardVisible, //弹出窗口的可见性是true还是false
    currentStep:mowizard.currentStep,
    appSelect,
    ifList:mowizard.ifList,
    selectedRows:[],
    policyAllList:mowizard.policyAllList,
    policyExistList:mowizard.policyExistList,
    policyList:mowizard.policyList,
    errorList:mowizard.errorList,
    preListType:mowizard.preListType,
    errorMessage:'',
    q,
    secondSecAreaDisabled:true, //二级安全域禁用状态
    isMon:mowizard.isMon,
  }

	let buton = <ButtonZone {...buttonZoneProps} />

  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={buton} />
      <List {...listProps} />
      <TaskModel {...taskModalDescProps} />
      <Modal {...modalProps} />
      <InfoModalDesc {...mosModalDescProps} />
      <OnInfoModalDesc {...onLineDescProps} />
      <InInfoModalDesc {...inInfoDescProps} />
      <NoInfoModalDesc {...noInfoDescProps} />
      <NewWork {...newWorkModel} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ discovery, loading,mowizard,appSelect }) => ({ discovery, loading:loading,mowizard,appSelect }))(discovery)
