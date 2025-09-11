import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import ButtonZone from './ButtonZone'
import List from './List'
import Modal from './Modal'
import queryString from "query-string";
import HelpButton from '../../components/helpButton'

const periodconfig = ({
 location, dispatch, periodconfig, loading,
}) => {
	const {
 timeList, list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, selectedRows, filterSchema, pageChange, q,
} = periodconfig	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

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
    loading: loading.effects['periodconfig/query'],
    pagination,
    key: pageChange,
    batchDelete,
    selectedRows,
    q,
  }

  const buttonZoneProps = {
		dispatch,
    batchDelete,
    selectedRows,
	}

  const hbProps = {
		title:'周期管理',
		tag:'timePeriods'
	}

  let btZone = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={btZone} />
      <List {...listProps} />
      <HelpButton {...hbProps}/>
      <Modal {...modalProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ periodconfig, loading }) => ({ periodconfig, loading }))(periodconfig)
