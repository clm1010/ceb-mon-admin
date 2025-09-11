/**
 * @module 监控配置/告警跟踪规则
 * @description
 * URL: <u>/trackTimer</u>
 * ## 跟踪规则操作
 * ##### 新增
 * 添加新的指标，点击弹出新增标准指标窗口。
 *
 * ##### 批量删除
 * 选中多条指标并点击顶部“批量删除“按钮删除多条。
 * 
 * ##### 删除
 * 选中指标并点击顶部或右侧"删除"按钮删除指标。
 * 
 * ##### 查看
 * 点击打开查看标准指标窗口。
 * 
 * ##### 编辑
 * 点击打开编辑标准指标窗口进行编辑。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import ButtonZone from './ButtonZone'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import queryString from "query-string";

const trackTimer = ({
 location, dispatch, trackTimer, loading,
}) => {
	const {
 list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, pageChange, q, timertype, typeValue, timeFileinfo,
} = trackTimer	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量

	const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
    type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															//弹出窗口的可见性是true还是false
    checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		filter: timeFileinfo,
		timertype,
		typeValue,
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
	      query: query,
	    }))
    },
  }

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['trackTimer/query'],
    pagination,
    key: pageChange,
    q,
    batchDelete,
    choosedRows,
  }


	const buttonZoneProps = {
	  	dispatch,
	  	batchDelete,
	  	choosedRows,
	}
	let buton = <ButtonZone {...buttonZoneProps} />

  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={buton} />
      <List {...listProps} />
      <Modal {...modalProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ trackTimer, loading }) => ({ trackTimer, loading }))(trackTimer)
