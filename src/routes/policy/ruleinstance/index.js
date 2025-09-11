import React from 'react'
import { routerRedux } from 'dva/router'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import { Tree } from 'antd'
import stdColums from '../templet/stdColums'
import RuleModalDesc from '../utils/RuleModalDesc'
import MonitorInstanceModal from './MonitorInstanceModal'
//import DataModalStdInfo from './DataModalStdInfo'
import DataModalStdInfo from '../templet/DataModalStdInfo'
import DataModalBranchs from './DataModalBranchs'
import ErrorModal from './ErrorModal'
import DataModalObjectInfo from '../utils/DataModalObjectInfo'
import DataModalTerrace from './DataModalTerrace'
//监控对象
import treeDataApp from '../../../utils/treeDataApp'
import fenhang from '../../../utils/fenhang'
//新增策略模板-操作详情部分功能代码----start
import OperationModalDesc from '../utils/OperationModalDesc'
import queryString from "query-string";
import HelpButton from '../../../components/helpButton'
const TreeNode = Tree.TreeNode
//新增策略模板-操作详情部分功能代码----end

const ruleInstance = ({
 ruleInstanceGroup, location, dispatch, objectMOsModal, stdIndicatorGroup, ruleInstance, loading, app,
}) => {
	const {
 list, pagination, currentItem, modalVisible, modalType, checkStatus, errorList, isClose, batchDelete, batchDeletes, choosedRowslist, choosedRows, filterSchema, branchs, checkAll, checkedList, indeterminate, see, expand,

 filter,selectIndex,resetCalInput,modaType,advancedItem,onIssueForbid,disItem,criteria,checkedTerrList, issueFlag,moCritera, issueType} = ruleInstance	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量


	/*
		获取树节点
	*/
	const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})

	/*
		获取选择树节点
	*/
	const loopSelect = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
	})

	const filterProps = { //这里定义的是查询页面要绑定的数据源
  		expand: false,
    		filterSchema: FilterSchema,
    		onSearch (q) {
    			const { search, pathname } = location
				const query = queryString.parse(search);
				query.q = q
                query.page = 0
                const stringified = queryString.stringify(query)
	    		dispatch(routerRedux.push({
					pathname,
					search: stringified,
					query,
	      		    /*query: {
	      			    ...query,
	        			page: 0,
	        			q,
	      		},*/
	    		}))
			},
			queryPreProcess (data) {
				if (data.mo_name !== undefined) {
					data['mo.name'] = data.mo_name
					delete data.mo_name
				}
				if (data.mo_ip !== undefined) {
					data['mo.discoveryIP'] = data.mo_ip
					delete data.mo_ip
				}
				if (data.policy_name !== undefined) {
					data['policy.name'] = data.policy_name
					delete data.policy_name
				}
				if (data.rule_name !== undefined) {
					data['rule.name'] = data.rule_name
					delete data.rule_name
				}
				return data
			},
	  }
  	const listProps = { //这里定义的是查询页面要绑定的数据源
    		dispatch,
    		dataSource: list,
    		dataSource2: ruleInstance.list2,
    		loading: loading,
    		fenhang,
    		user: JSON.parse(sessionStorage.getItem('user')),
    		branchs,
    		pagination,
    		paginationMan: ruleInstance.paginationMan,
    		location,
    		onPageChange (page) {
			  const { search, pathname } = location
			  const query = queryString.parse(search);
              query.page = page.current - 1
              query.pageSize = page.pageSize
              const stringified = queryString.stringify(query)
      		  dispatch(routerRedux.push({
					pathname,
					search:stringified,
					query
        			/*query: {
          			...query,
          			page: page.current - 1,		//分页要减1，因为后端数据页数从0开始
          			pageSize: page.pageSize,
        			},*/
      		  }))

      		// 设置高度
			  let heightSet = {
				height: '1110px',
				overflow: 'hidden',
			}
			if (page.pageSize === 10) {
				heightSet.height = '1110px'
			} else if (page.pageSize === 20) {
				heightSet.height = '1834px'
			} else if (page.pageSize === 30) {
				heightSet.height = '2630px'
			} else if (page.pageSize === 40) {
				heightSet.height = '3480px'
			} else if (page.pageSize === 100) {
				heightSet.height = '8300px'
			} else if (page.pageSize === 200) {
				heightSet.height = '17080px'
			}
	      	dispatch({
				type: 'ruleInstance/showModal',
				payload: {
					heightSet,
				},
			})
    		},
    		batchDelete,
    		choosedRows,
			tabShowPage: ruleInstance.tabShowPage,
  	}

	const ruleListProps = {
		dispatch,
		loading,
		fenhang,
		scroll: 3500,
		choosedRows,
		batchDeletes,
		choosedRowslist,
//		columns: RuleColumns,
		dataSource: ruleInstance.ruleInfsList,
		listUUID: ruleInstance.ruleUUID,
		pagination: ruleInstance.paginationInfs,
		onPageChange (page) {
			dispatch({
				type: 'ruleInstance/queryInfsrule',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
				},
			})
		},
	}
  	const ruleModalDescProps = {
		dispatch,
		visible: ruleInstance.ruleInfsVisible,
		ruleListProps,
		loading,
		fenhang,
		titlename: '关联监控实例',
		ruleObjInfo: `关联监控实例数 ${ruleInstance.ruleInfsNumber}`,
		choosedRows,
		batchDeletes,
		choosedRowslist,
		onCancel () {
			dispatch({
				type: 'ruleInstance/showRuleModal',
				payload: {
					ruleInfsVisible: false,
					ruleUUID: '', //点击cancel 值为空
					ruleInfsNumber: 0,
					ruleInfsList: [],
				},
			})
		},
	}


	const MonitorInstanceProps = {
		key: `${ruleInstance.ruleInstancecreateOrUpdateKEY}_createOrUpdate`,
		dispatch,
		item: ruleInstance.MonitorInstanceItem,
		visible: ruleInstance.monitorInstanceVisible,
		visible2: ruleInstance.ruleInfsVisible,
		ruleUUIDs: ruleInstance.ruleUUID,
		tabstate: ruleInstance.tabstate,
		typeValue: ruleInstance.typeValue,
		stdInfoVal: ruleInstance.stdInfoVal,
		timeList: ruleInstance.timeList,
		type: ruleInstance.monitorInstanceType,
		obInfoVal: ruleInstance.obInfoVal,
		treeDataApp,
		fenhang,
		branchs,
		operationType: ruleInstance.operationType,
		see,
  }
  const dataModalStdInfoProps = {
		dispatch,
		loading,
		visible: ruleInstance.kpiVisible,
		treeNodes: ((stdIndicatorGroup && stdIndicatorGroup.treeDatas && stdIndicatorGroup.treeDatas.length > 0) ? loop(stdIndicatorGroup.treeDatas) : []),
		tableList: ((ruleInstance.stdList && ruleInstance.stdList.length > 0) ? ruleInstance.stdList : []),
		pagination: ruleInstance.pagination2,
		Columns: stdColums,
		stdgroupUUID: ruleInstance.stdgroupUUID, //选中的 指标分组
		selectIndex,
		filter,
		modaType,
		fileType: ruleInstance.fileType,
	}
	const dataModalObjectInfoProps = { //监控对象
		dispatch,
		loading,
		objectMOsModal,
		obInfoValName: 'obInfoVal', //更新选择的对象名称
		statePath: 'ruleInstance/showModal', //更新选择对象的路径
		objectVisible: ruleInstance.selectObjectVisible,
		objectVisibleName: 'selectObjectVisible',
		key: `${objectMOsModal.openModalKey}_openKey`,
	}
  const dataModalCopyOrMoveProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: ruleInstance.copyOrMoveModalType,										//弹出窗口的类型是'创建'还是'编辑'
		visible: ruleInstance.copyOrMoveModal, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		checkStatus, //检测状态done,success,fail,checking
		treeNodes: ruleInstanceGroup.treeDatas.length > 0 ? loop(ruleInstanceGroup.treeDatas) : [],
		choosedRows,
	}

	const dataModalBranchsProps = {								//这里定义的是弹出窗口要绑定的数据源
		key: `${ruleInstance.ruleInstanceKey}_3`,
		dispatch,
		type: ruleInstance.branchsType,									//弹出窗口的类型是'创建'还是'编辑'
		visible: ruleInstance.branchsVisible, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		fenhang,
		checkAll,
		checkedList,
		indeterminate,
		user: JSON.parse(sessionStorage.getItem('user')),
		fenhangArr: ruleInstance.fenhangArr,
                issueType,
	}

	const dataModalTerraceProps = {								//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		type: ruleInstance.terrType,									//弹出窗口的类型是'创建'还是'编辑'
		visible: ruleInstance.terrVisible,
		checkedTerrList,
		issueFlag,
		criteria,
		moCritera,
	}
	const errorModalProps = {
		dispatch,
		visible: ruleInstance.errorVisible,
		errorList,
	}


	const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
		dispatch,
		visible: ruleInstance.operationVisible,
		fileType: ruleInstance.fileType,
		loading,
		newOperationItem: ruleInstance.newOperationItem,
		checkStatus, //检测状态done,success,fail,checking
		isClose,
		tabstate: ruleInstance.tabstate,
		typeValue: ruleInstance.typeValue,
		stdInfoVal: ruleInstance.stdInfoVal,
		timeList: ruleInstance.timeList,
		treeNodes: ruleInstanceGroup.treeDatas.length > 0 ? loopSelect(ruleInstanceGroup.treeDatas) : [],
		treeDataApp,
		operationType: ruleInstance.operationType, //记录操作详情操作状态，add/edit
		CheckboxSate: ruleInstance.CheckboxSate,
		CheckboxSate1: ruleInstance.CheckboxSate1,
		onCancel () {
			dispatch({
				type: 'ruleInstance/updateState',
				payload: {
					operationVisible: false,
					CheckboxSate: true,
				},
			})
		},
		filter:filter,
		advancedItem,
		resetCalInput,
		isDS:false
	}

	const buttonZoneProps = {
	  	dispatch,
	  	batchDelete,
	  	choosedRows,
	  	checkAll,
		expand,
		onIssueForbid,
		disItem,
	}
  	let buton = <ButtonZone {...buttonZoneProps} />
	const hbProps = {
		title:'监控实例',
		tag:'ruleInstance'
	}
	//新增策略模板-操作详情部分功能代码----end
  	return (
    	<div className="content-inner">
			<Filter {...filterProps} buttonZone={buton} />
			<List {...listProps} />
			<HelpButton {...hbProps}/>
			<RuleModalDesc {...ruleModalDescProps} />
			<MonitorInstanceModal {...MonitorInstanceProps} />
			<DataModalStdInfo {...dataModalStdInfoProps} />
			<DataModalObjectInfo {...dataModalObjectInfoProps} />
			<DataModalBranchs {...dataModalBranchsProps} />
			<DataModalTerrace {...dataModalTerraceProps} />
			<ErrorModal {...errorModalProps} />
			<OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
		</div>
  	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default ruleInstance
