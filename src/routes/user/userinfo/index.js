import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import Modal from './Modal'
import UpdateModal from './UpdateModal'
import ButtonZone from './ButtonZone'
import queryString from "query-string";
const userinfo = ({
 location, dispatch, userinfo, loading, app,
}) => {
	const {
 roleUUIDs, treeData, timeList, list, pagination, currentItem, modalVisible, batchDelete, selectedRows, createKey, pageChange, q,changeValue
} = userinfo
	const modalProps = {	//新增弹出窗口要绑定的数据源
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
	    type: userinfo.modalType,	//弹出窗口的类型是'创建'
	    visible: userinfo.modalVisible, //弹出窗口的可见性是true还是false
	    timeList,
	    treeData,
	    roleUUIDs,
		user: app.user,
		changeValue,
	    key: createKey,
  }
	const UpdateModalProps = {
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
	    type: userinfo.modalType,
	    visible: userinfo.UpdatemodalVisible, //弹出窗口的可见性
	    timeList,
	    treeData,
		roleUUIDs,
		changeValue,
	    user: app.user,
	}
  const filterProps = { //这里定义的是查询页面要绑定的数据源
    expand: false,
    filterSchema: FilterSchema,
    onSearch (q) {
    	const { search, pathname } = location
			const query = queryString.parse(search);
				query.q = q
				query.page = 0
	    dispatch(routerRedux.push({
				pathname,
				search: search,
	      query: query,
	    }))
    },
	queryPreProcess (data) {
		if (data.roles_name !== undefined) {
			data['roles.name'] = data.roles_name
			delete data.roles_name
		}
		return data
	},
  }

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading,
    pagination,
    batchDelete,
    selectedRows,
    q
  }

  const buttonZoneProps = {
  	dispatch,
  	batchDelete,
  	selectedRows,
  }
  let buton = <ButtonZone {...buttonZoneProps} />

  return (
    <div className="content-inner">
      <Filter {...filterProps} buttonZone={buton} />

      <List {...listProps} />
      <Modal {...modalProps} />
      <UpdateModal {...UpdateModalProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ userinfo, loading, app }) => ({ userinfo, app, loading: loading.models.userinfo }))(userinfo)
