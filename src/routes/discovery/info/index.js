import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva/index'
import ButtonZone from '../ButtonZone'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from '../FilterSchema'
import List from './infoList'
import NoList from './infoNoList'
import Modal from '../Modal'

import queryString from "query-string/index";

const discoveryInfoShow = ({
 location, dispatch, discoveryInfoShow, loading,
}) => {
	const {
 list,infoList, pagination, currentItem, modalVisible,  infoVisible,modalType, checkStatus, choosedRows, filterSchema, pageChange, q,} = discoveryInfoShow	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['discoveryInfoShow/queryTotal'],
    pagination,
    q,
    choosedRows,
  }

  const infolistProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: infoList,
    loading: loading.effects['discoveryInfoShow/queryNo'],
    pagination,
    q,
    choosedRows,
  }

  return (
    <div className="content-inner">
      <List {...listProps} />
      <NoList {...infolistProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ discoveryInfoShow, loading, }) => ({ discoveryInfoShow, loading:loading,}))(discoveryInfoShow)
