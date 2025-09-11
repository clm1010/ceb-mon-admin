/**
 * @module 监控配置/策略实例管理 
 * @description
 * URL: <u>/policyInstanceGroup/policyInstance</u>
 * ## 实例操作 
 * ##### 批量删除
 * 选中多条实例并点击顶部“批量删除“按钮删除多条。
 *
 * ##### 删除
 * 选中实例按右侧"删除"按钮删除实例。
 * 
 * ##### 查看
 * 点击打开查看策略实例。
 * 
 * ##### 编辑
 * 点击打开编辑策略实例窗口进行编辑。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import Filter from '../../../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import { Tree } from 'antd'
import DataModalStdInfo from './DataModalStdInfo'
import DataModalObjectInfo from './DataModalObjectInfo'//监控对象
import objectColums from './objectColums'
import TempletModal from './TempletModal' //模板详情
import stdColums from './stdColums'
import StdIndicatorModal from './stdIndicatorModal'
import PolicyModalDesc from '../../../../../components/policyModal/PolicyModalDesc'
import MosColumns from '../../../../../utils/MosColumns'
import IndicatorsModal from './IndicatorsModal'
import treeDataApp from '../../../../../utils/treeDataApp'
import fenhang from '../../../../../utils/fenhang'
import ButtonZone from './ButtonZone'
import queryString from "query-string";
//新增策略实例-操作详情部分功能代码----start
import OperationModalDesc from '../../utils/OperationModalDesc'
//新增策略实例-操作详情部分功能代码----end
const TreeNode = Tree.TreeNode

const policyInstance = ({
	policyInstanceGroup, location, dispatch, stdIndicatorGroup, policyInstance, loading, objects,
   }) => {
	   const {
	policyTemplet, indicatorsItem, stdInfoVal, obInfoVal, stdList, obList, timeList, kpiVisible, objectVisible, list, stdgroupUUID, obgroupUUID, pagination, pagination1, pagination2, pagination3, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, tabstate, typeValue, see, expand,
	filterMode,fields} = policyInstance	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量
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
   
   
	   const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
			 modalType,
		   dispatch,
		   fenhang,
		   item: modalType === 'create' ? {
			   policy: {
				   policyType: 'NORMAL',
				   collectParams: {},
				   monitorMethod: {
							toolType: 'ZABBIX',
					 },
			   },
   
		   } : currentItem,		//要展示在弹出窗口的选中对象
		   type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		   visible: modalVisible,															//弹出窗口的可见性是true还是false
		   checkStatus,																				//检测状态done,success,fail,checking
		   isClose,
		   tabstate,
		   typeValue,
		   stdInfoVal,
		   obInfoVal, //监控对象
		   timeList,
		   treeNodes: policyInstanceGroup.treeDatas.length > 0 ? loopSelect(policyInstanceGroup.treeDatas) : [],
			 treeDataApp,
			 operationType: policyInstance.operationType,
			 see,
	   }
   
		const dataModalStdInfoProps = {
		   dispatch,
		   loading,
   
		   visible: kpiVisible,
		   treeNodes: ((stdIndicatorGroup && stdIndicatorGroup.treeDatas && stdIndicatorGroup.treeDatas.length > 0) ? loop(stdIndicatorGroup.treeDatas) : []),
		   //expandKeys:expandkeys, //默认全部打开
   
		   tableList: ((stdList && stdList.length > 0) ? stdList : []),
		   pagination: pagination1,
		   Columns: stdColums,
		   isClose,
		   stdgroupUUID, //选中的 指标分组
   
	   }
		const dataModalObjectInfoProps = { //监控对象
		   dispatch,
		   loading,
   
		   visible: objectVisible,
		   treeNodes: ((objects && objects.treeDatas && objects.treeDatas.length > 0) ? loop(objects.treeDatas) : []),
		   //expandKeys:expandkeys, //默认全部打开
   
		   tableList: ((obList && obList.length > 0) ? obList : []),
		   pagination: pagination2,
		   Columns: objectColums,
		   isClose,
		   obgroupUUID, //选中的 对象分组
	   }
   
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
		 }
   
		 const listProps = { //这里定义的是查询页面要绑定的数据源
		   dispatch,
		   dataSource: list,
		   fenhang,
		   loading: loading,
		   pagination,
		   location,
		   onPageChange (page) {
					   const { search, pathname } = location
					   const query = queryString.parse(search);
					   query.page = page.current - 1
			 query.pageSize = page.pageSize0
			 const stringified = queryString.stringify(query)
				 dispatch(routerRedux.push({
							   pathname,
							   search : stringified,
							   query,
					   /*query: {
						 ...query,
						 page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
						 pageSize: page.pageSize,
					   },*/
				 }))
				 // 设置高度
				 let heightSet = {
				   height: '1021px',
				   overflow: 'hidden',
			   }
			   if (page.pageSize === 10) {
				   heightSet.height = '1021px'
			   } else if (page.pageSize === 20) {
				   heightSet.height = '1691px'
			   } else if (page.pageSize === 30) {
				   heightSet.height = '2397px'
			   } else if (page.pageSize === 40) {
				   heightSet.height = '3085px'
			   } else if (page.pageSize === 100) {
				   heightSet.height = '6709px'
			   } else if (page.pageSize === 200) {
				   heightSet.height = '20825px'
			   }
				 dispatch({
				   type: 'policyInstance/showModal',
				   payload: {
					   heightSet,
				   },
			   })
		   },
		   batchDelete,
		   choosedRows,
		   policyTemplet,
		 }
   
		 const stdIndicatorsProps = {
			  dispatch,
			  visible: policyInstance.stdIndVisible,
			  item: (policyInstance.stdIndicators ? policyInstance.stdIndicators : {}),
			  checkStatus,
			  isClose,
		 }
   
		/*
		   关联的对象
	   */
	   const mosListProps = {
		   dispatch,
		   loading,
		   scroll: 3500,
		   columns: MosColumns,
		   dataSource: policyInstance.mosList,
		   pagination: policyInstance.paginationPolicy,
		   onPageChange (page) {
			   dispatch({
				   type: 'policyInstance/queryMos',
				   payload: {
					   current: page.current - 1,
					   page: page.current - 1,
					   pageSize: page.pageSize,
					   relatedType: 'POLICY',
   
				   },
			   })
		   },
   
	   }
   
		 const mosModalDescProps = {
		   dispatch,
		   visible: policyInstance.mosVisible,
		   policyListProps: mosListProps,
		   loading,
		   titlename: '关联监控对象',
		   policyObjInfo: `关联监控对象数 ${policyInstance.stdMosNumber}`,
   
		   onCancel () {
			   dispatch({
				   type: 'policyInstance/updateState',
				   payload: {
					   mosVisible: false,
					   stdUUIDMos: '', //点击cancel 值为空
					   stdMosNumber: 0,
					   mosList: [],
				   },
			   })
		   },
	   }
	   const indicatorsModalProps = {
		   dispatch,
		   indicatorsItem,		//要展示在弹出窗口的选中对象
			  visible: policyInstance.indicatorsModalVisible,															//弹出窗口的可见性是true还是false
	   }
		 const templetModalProps = { //模板详情
			  dispatch,
			  visible: policyInstance.templetModalVisible,
			  policyTemplet: policyInstance.policyTemplet,
			  typeValue: policyInstance.typeValue,
		 }
   
		 const operationModalDescProps = { //新增策略模板-操作详情部分功能代码----start
			  dispatch,
			  visible: policyInstance.operationVisible,
			  fileType: policyInstance.fileType,
			  loading,
			  newOperationItem: policyInstance.newOperationItem,
		   checkStatus, //检测状态done,success,fail,checking
		   isClose,
		   tabstate,
		   typeValue,
		   stdInfoVal,
		   timeList,
		   treeNodes: policyInstanceGroup.treeDatas.length > 0 ? loopSelect(policyInstanceGroup.treeDatas) : [],
		   treeDataApp,
		   operationType: policyInstance.operationType, //记录操作详情操作状态，add/edit
		   CheckboxSate: policyInstance.CheckboxSate,
		   CheckboxSate1: policyInstance.CheckboxSate1,
		   onCancel () {
			   dispatch({
				   type: 'policyInstance/updateState',
				   payload: {
					   operationVisible: false,
					   CheckboxSate: true,
					   CheckboxSate1: true,
				   },
			   })
		   },
		   filterMode,
		   fields,
		 }
   
		const buttonZoneProps = {
			 dispatch,
			 batchDelete,
			 choosedRows,
			 expand,
	   }
		 let buton = <ButtonZone {...buttonZoneProps} />
   
	   //新增策略模板-操作详情部分功能代码----end
   
		 return (
	   <div className="content-inner">
		 <Filter {...filterProps} buttonZone={buton} />
		 <List {...listProps} />
		 <Modal {...modalProps} />
		 <DataModalStdInfo {...dataModalStdInfoProps} />
		 <PolicyModalDesc {...mosModalDescProps} />
		 <IndicatorsModal {...indicatorsModalProps} />
		 <StdIndicatorModal {...stdIndicatorsProps} />
		 <TempletModal {...templetModalProps} />
		 <DataModalObjectInfo {...dataModalObjectInfoProps} />
		 <OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
	   </div>
		 )
   }

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default policyInstance
