import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import ManagedModal from './managedModal'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import moTree from '../../../utils/moTree/moTree'
import queryString from "query-string";
import PolicyListModal from '../utils/policyListComp'

//@@@
const osFs = ({
	location, dispatch, osFs, moSingleSelect, loading,appSelect, policyList
   }) => {
	const {
		q,
		list,
		currentItem,
		modalVisible,
		modalType,
		pagination,
		batchDelete,
		selectedRows,
		moSynState,
		_mngInfoSrc,
		alertType,
		alertMessage,
		pageChange,
		firstClass,
		secondClass,
		thirdClass,
		appCategorlist,
		managedModalVisible,
		manageState,
		managedType,
		managedData,
	} = osFs					//@@@//这里把入参做了拆分，后面代码可以直接调用拆分的变量

	// const thirdClass = location.query? location.query.thirdClass: '';

	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		q,
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		modalVisible, //弹出窗口的可见性是true还是false
		modalName: '文件系统',		//@@@
		moSynState,
		_mngInfoSrc,
		alertType,
		alertMessage,
		moSingleSelect,    
		location,
		firstClass,
		secondClass,
		thirdClass,
		appCategorlist,
		appSelect,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
	q: `firstClass=='OS';secondClass==${secondClass};thirdClass==${thirdClass}`,
    moTypeTree: moTree,													//把mo类型树形结构数据传给FILTER展现
    dispatch,
    onSearch (q) {
    	const { search, pathname } = location
		const query = queryString.parse(search);
		query.q = q
		query.page = 0
		const stringified = queryString.stringify(query)
	    dispatch(routerRedux.push({ 
	    	pathname,
			search: stringified,
			query:query,
	    }))
		},
	/*queryPreProcess (data) {
		if (data.belongsTo.firstSecArea !== undefined) {
				data['belongsTo.firstSecArea'] = data.belongsTo.firstSecArea
				delete data.belongsTo.firstSecArea
		}
		return data
	},*/
  }

  const listProps = { //这里定义的是表格对应的数据源与配置
    dispatch,
    dataSource: list,
    loading: loading.effects['osFs/query'],
    pagination,
    secondClass,
    q,
    batchDelete,
    selectedRows,
    key: pageChange,
  }
  const {
	modalPolicyVisible,
	moPolicyInfo,
	openPolicyType,
	policyInstanceId,
	paginationInfs,
} = policyList

const policyListProps = {
	dispatch,
	loading,
  modalPolicyVisible,
	moPolicyInfo,
	openPolicyType,
	policyInstanceId,
	pagination: paginationInfs,
	onPageChange (page) {
		dispatch({
			type: 'policyList/queryPolicy',
			payload: {
				current: page.current - 1,
				page: page.current - 1,
				pageSize: page.pageSize,
			},
		})
	},
}
  const managedModalProps = {
	dispatch,
	visible: managedModalVisible,
	manageState,
	choosedRows: selectedRows,
	managedType,
	managedData,
}

  const buttonZoneProps = { //这里定义的按钮区域需要的配置
    dispatch,
    location,
    batchDelete,
    selectedRows,
  }

	let btZone = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner" id="area">
      <Filter {...filterProps} buttonZone={btZone} />
      <List {...listProps} />
      <Modal {...modalProps} />
	  <PolicyListModal {...policyListProps} />
	  <ManagedModal {...managedModalProps} />
    </div>
  )
}

export default connect(({ 
	osFs, moSingleSelect, loading, appSelect, policyList
}) => ({
	 osFs, moSingleSelect, loading, appSelect, policyList
	 }))(osFs)	//@@@

