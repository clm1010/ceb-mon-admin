import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import moTree from '../../utils/moTree/moTree'
import ButtonZone from './ButtonZone'
import fenhang from '../../utils/fenhang'
import DataModalBranchs from './DataModalBranchs'
import queryString from "query-string";
import HelpButton from "../../components/helpButton"

const mo = ({
 location, dispatch, mo, loading,
}) => {
	const {
 timeList, list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, selectedRows, filterSchema, pageChange, q, choosedRows, checkAll, expand, checkedList, indeterminate,
} = mo	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

	const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
    type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															//弹出窗口的可见性是true还是false
    checkStatus,																				//检测状态done,success,fail,checking
    isClose,
    timeList,
  }
  const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
//    q : q,
    moTypeTree: moTree,
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
  }
  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['mo/query'],
    pagination,
    key: pageChange,
    batchDelete,
    selectedRows,
    q,
  }
  const dataModalBranchsProps = {								//这里定义的是弹出窗口要绑定的数据源
		key: `${mo.ruleInstanceKey}_3`,
		dispatch,
		type: mo.branchsType,									//弹出窗口的类型是'创建'还是'编辑'
		visible: mo.branchsVisible, //传入第二个弹出窗口的属性，這就知道你需要打开那个弹出窗												//弹出窗口的可见性是true还是false
		fenhang,
		checkAll,
		checkedList,
		indeterminate,
		user: JSON.parse(sessionStorage.getItem('user')),
		fenhangArr: mo.fenhangArr,
	}
	const buttonZoneProps = {
    dispatch,
    batchDelete,
    checkAll,
  }
  let buton = <ButtonZone {...buttonZoneProps} />
  const hbProps = {
		title:'监控对象',
		tag:'mo'
	}
  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={buton} />
      <List {...listProps} />
	    <HelpButton {...hbProps}/>
      <Modal {...modalProps} />
      <DataModalBranchs {...dataModalBranchsProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ mo, loading }) => ({ mo, loading }))(mo)
