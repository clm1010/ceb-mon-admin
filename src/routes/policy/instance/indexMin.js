import React from 'react'
import { connect } from 'dva'
import List from './ListMin'
import Kpi from './Kpi'

const policyInstance = ({
 location, dispatch, policyInstance, loading,
}) => {
	const {
 indicators, timeList, kpiid, kpiname, kpiVisible, groupVisible, list, pagination, pagination1, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, tabstate, typeValue,
} = policyInstance	//这里把入参tool做了拆分，后面代码可以直接调用拆分的变量

	const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
	  modalType,
		dispatch,
		item: modalType === 'create' ? {
				policy: {
					template: {
					  policyType: 'NORMAL',
					},
					collectParams: {
					},
				},

			} : currentItem,		//要展示在弹出窗口的选中对象
    type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															//弹出窗口的可见性是true还是false
    checkStatus,																				//检测状态done,success,fail,checking
    isClose,
    tabstate,
    typeValue,
    kpiid,
    kpiname,
    timeList,
  }
  const kpiModalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
    visible: kpiVisible,
    indicators,
    pagination1,															//弹出窗口的可见性是true还是false
  }

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['policyInstance/query'],
    pagination,
    location,
	onPageChange (page) {
		dispatch({
			type: 'policyInstance/getPoliciesById',
			payload: {
				policyInstanceId: policyInstance.policyInstanceId,
				policyType: policyInstance.policyType,
				current: page.current - 1,
				page: page.current - 1,
				pageSize: page.pageSize,
			},
		})
	},
	/*
    onPageChange (page) {
		alert(1)

      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
          pageSize: page.pageSize,
        },
      }))
    },
	*/
    batchDelete,
    choosedRows,
  }

  return (
    <div>
      <List {...listProps} />
      <Kpi {...kpiModalProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ policyInstance, loading }) => ({ policyInstance, loading }))(policyInstance)
