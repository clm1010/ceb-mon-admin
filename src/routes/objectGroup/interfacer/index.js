import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import moTree from '../../../utils/moTree/moTree'
import EquipmentModal from './equipmentModal'
import queryString from "query-string";
//@@@
const interfacer = ({
 location, dispatch, interfacer, moSingleSelect, loading,
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
		zabbixUrl,
		alertType,
		alertMessage,
		equipment,
		equipmentVisible,
		equipmentSecondClass,
		pageChange,
		firstClass,
		secondClass,
		appCategorlist,
		sortInfo,
		optionSelectAppName,
	} = interfacer					//@@@//这里把入参做了拆分，后面代码可以直接调用拆分的变量

	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		q,
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		modalVisible, //弹出窗口的可见性是true还是false
		modalName: '接口',		//@@@
		moSynState,
		_mngInfoSrc,
		alertType,
		alertMessage,
		moSingleSelect,
		location,
		firstClass,
		secondClass,
		appCategorlist,
	}
	const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
		//q: `firstClass=='NETWORK';secondClass==${location.query.secondClass};thirdClass=='NET_INTF'`,
		q: `firstClass=='NETWORK';secondClass==${secondClass};thirdClass=='NET_INTF'`,
    moTypeTree: moTree,													//把mo类型树形结构数据传给FILTER展现
    dispatch,
	optionSelectAppName,
	modalName:'interfacer',
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
		queryPreProcess (data) {
			if (data.belongsTo.firstSecArea !== undefined) {
					data['belongsTo.firstSecArea'] = data.belongsTo.firstSecArea
					delete data.belongsTo.firstSecArea
			}
			return data
		},
  }

  const listProps = { //这里定义的是表格对应的数据源与配置
    dispatch,
    dataSource: list,
    loading: loading.effects['interfacer/query'],
    pagination,
    secondClass,
    q,
    batchDelete,
    selectedRows,
	key: pageChange,
	sortInfo,
  }

  const buttonZoneProps = { //这里定义的按钮区域需要的配置
    dispatch,
    location,
    batchDelete,
    selectedRows,
  }

  const equipmentModalProps = {
  	dispatch,
  	item: equipment,
  	visible: equipmentVisible,
  	equipmentSecondClass,
  }

	let btZone = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner" id="area">
      <Filter {...filterProps} buttonZone={btZone} />
      <List {...listProps} />
      <Modal {...modalProps} />
      <EquipmentModal {...equipmentModalProps} />
    </div>
  )
}

export default connect(({ interfacer, moSingleSelect, loading }) => ({ interfacer, moSingleSelect, loading }))(interfacer)	//@@@
