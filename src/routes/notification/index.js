/**
 * @module 监控配置/通知规则管理 
 * @description
 * URL: <u>/notification</u>
 * ## 通知规则操作
 * ##### 新增
 * 新增通知规则，点击弹出新增通知规则窗口。
* 
 * ##### 删除(批量)
 * 选中多条指标并点击顶部“删除“按钮删除多条。
*
 * ##### 删除
 * 选中当前通知规则,"删除"按钮删除通知规则。
 * 
 * ##### 查看
 * 点击打开查看通知规则窗口。
 * 
 * ##### 编辑
 * 点击打开编辑通知规则窗口进行编辑。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import queryString from "query-string"
import ImportResultModal from '../../routes/objectMO/ImportByExcel/ImportResultModal'
//@@@
const notification = ({
	location, dispatch, notification, notificationGroup, userinfo, app, roles, loading, alarmFrom, alarmSeverity, notifyWay, moSelect, appSelect,
   }) => {
	   const {
		   user,
		   alarmApplyFilter,
	   } = app
	   const {
		   list,
		   currentItem,
		   modalVisible,
		   modalType,
		   pagination,
		   batchDelete,
		   selectedRows,
		   alertType,
		   alertMessage,
		   notificationType,
		   users,
		   targetKeys,
		   num,
		   appInfo,
		   mos,
		   roleTargetKeys,
		   AppOption,
		   AppUuid,
		   moUuid,
		   keys,
		   filterInfo,
		   q,
		   see,
		   TransferState,
		   moImportFileList,
		   showUploadList,
		   moImportResultVisible,
		   moImportResultType,
		   moImportResultdataSource,
	   } = notification
	   const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		   loading,
		   dispatch,
		   item: currentItem,		//要展示在弹出窗口的选中对象
		   modalType, //弹出窗口的类型是'创建'还是'编辑'
		   modalVisible, //弹出窗口的可见性是true还是false
		   modalName: '通知规则',
		   alertType,
		   alertMessage,
		   alarmFrom,
		   alarmSeverity,
		   moSelect,
		   appSelect,
		   notifyWay,
		   userinfo,
		   notificationType,
		   users,
		   targetKeys,
		   num,
		   appInfo,
		   mos,
		   roleTargetKeys,
		   AppOption,
		   AppUuid,
		   moUuid,
		   filterInfo,
		   see,
		   TransferState,
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
		   queryPreProcess (data) {
			   if (data.appCategory !== undefined) {
				   data['appCategory.affectSystem'] = data.appCategory
				   delete data.appCategory
			   }
			   if (data.users !== undefined) {
				   data['user.name'] = data.users
				   delete data.users
			   }
			   if (data.user !== undefined) {
				   data['user.mobile'] = data.user
				   delete data.user
			   }
			   if (data.rule_name !== undefined) {
				   data['rule.name'] = data.rule_name
				   delete data.rule_name
			   }
			   return data
		   },
	 }
   
	 const listProps = { //这里定义的是表格对应的数据源与配置
	   dispatch,
	   dataSource: list,
	   loading: loading.effects['notification/query'],
	   pagination,
	   batchDelete,
	   selectedRows,
	   user,
	   key: keys,
	   q,
	   alarmApplyFilter,
	 }
   
	 const importResultModalProps = {
	   dispatch,
	   visible: moImportResultVisible,
	   type: moImportResultType,
	   dataSource: moImportResultdataSource,
	   queryPath: 'notification/setState'
	}
	 const buttonZoneProps = { //这里定义的按钮区域需要的配置
	   dispatch,
	   location,
	   batchDelete,
	   selectedRows,
	   item: currentItem,
	   moImportFileList,
	   showUploadList,
	   q,
	   user,
	 }
   
	 let btZone = <ButtonZone {...buttonZoneProps} />
	 return (
	   <div className="content-inner" id="area">
		 <Filter {...filterProps} buttonZone={btZone} />
		 <List {...listProps} />
		 <Modal {...modalProps} />
		 <ImportResultModal {...importResultModalProps}/>
	   </div>
	 )
   }

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
 router, notification, notificationGroup, userinfo, roles, alarmFrom, alarmSeverity, app, notifyWay, moSelect, appSelect, loading,
}) => ({
 router, notification, notificationGroup, userinfo, roles, app, alarmFrom, alarmSeverity, notifyWay, moSelect, appSelect, loading,
}))(notification) //@@@
