import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col } from 'antd'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'
import queryString from "query-string";
import Countdown from './Countdown'
const zookeeper = ({
	location, dispatch, zookeeper, loading, app,
}) => {
	const {
		pagination,
		modalVisible,
		// currentStep,
		modalType,
		batchDelete,
		pageChange,
		q,
		qFilter,
		errorMessage,
		list,
		currentItem,
		initValue,
		selectedRows,
		// dubboData,
		dubboType,
		dubboMsg,
	} = zookeeper	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
		dispatch,
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.q = q
			query.page = 0
			console.log(33,query)
			dispatch(routerRedux.push({
				pathname,
				search: search,
				query: query,
			}))
			// dispatch({
			// 	type: 'zookeeper/dubbo',
			// 	payload: {},
			// })
		},
	}
	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading,//.effects['zookeeper/queryLines'],
		pagination,
		key: pageChange,
		batchDelete,
		q,
	}
	const buttonZoneProps = {
		dispatch,
		dataSource: list,
		batchDelete,
		q,
		selectedRows,
	}
	const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		type: modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible, //弹出窗口的可见性是true还是false
		errorMessage,
		q,
		// dubboData,
		dubboType,
		dubboMsg,
	}
	const countdownProps = {	//这里获取dubbo服务可用状态要绑定的数据源
		dispatch,
		initValue,
		dubboType,
		dubboMsg,
		q,
	}
	let Buton = <ButtonZone {...buttonZoneProps} />
	return (
		<div className="content-inner">
			<Row gutter={24}>
				<Col>
					<Filter {...filterProps} buttonZone={Buton} />
					<Countdown {...countdownProps} />
					<List {...listProps} />
					<Modal {...modalProps} />
				</Col>
			</Row>
		</div>
	)
}
//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
	zookeeper, loading, app,
}) => ({
	zookeeper, loading: loading.models.zookeeper, app,
}))(zookeeper)
