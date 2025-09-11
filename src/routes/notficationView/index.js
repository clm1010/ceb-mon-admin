import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Filter from '../../components/Filter/Filter'
import NTFilter from '../../components/Filter/NotificationFilter'
import FilterSchema from './FilterSchema'
import FilterSchemaRead from './FilterSchemaRead'
import List from './List'
import Modal from './Modal'
import queryString from "query-string";
import { Icon, Tabs, Alert } from 'antd'
import './index.less'
const TabPane = Tabs.TabPane
const notficationView = ({
	location, loading, notficationView, dispatch, userinfo, app, roles, alarmFrom, alarmSeverity, notifyWay, moSelect, appSelect,
}) => {
	const {
		pagination,
		q,
		dataSource,
		currentItem,
		modalVisible,
		modalType,
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
		filterInfo,
		see,
		TransferState,
		summarize,
		TabPaneType
	} = notficationView

	const filterProps = {
		filterSchema: FilterSchema,
		q,
		dispatch,
		location,
		onSearch(q) {
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

	const listPorps = {
		dispatch,
		pagination,
		dataSource,
		loading: loading.effects['notficationView/query'],
		q,
		summarize,
		TabPaneType
	}

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
		see: 'yes',
		TransferState,
	}

	const filterPropsRead = {
		filterSchema: FilterSchemaRead,
		q,
		dispatch,
		location,
		onSearch(q) {
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

	const onChangerTabPane = (key) => {
		dispatch({
			type: 'notficationView/setState',
			payload: {
				TabPaneType: key,
				q:''
			}
		})
		dispatch({
			type: 'notficationView/query',
			payload: {}
		})
	}
	const tabsOpts = {
		defaultActiveKey: "notification",
		type: 'card'
	}
	return (
		<div className="content-inner" >
			<div className='notfication'>
				<Tabs  {...tabsOpts} onChange={onChangerTabPane}>
					<TabPane tab={<span><Icon type='profile' />通知记录</span>} key="notification">
						<Filter {...filterProps} />
						<List {...listPorps} />
					</TabPane>
					<TabPane tab={<span><Icon type='project' rotate={270} />阅读率查询</span>} key="read">
						<NTFilter {...filterPropsRead} buttonZone={(TabPaneType == 'read' && summarize.success)  ? <Alert message={`三级告警阅读数:${summarize.readNumCustomersSeverity3},三级告警总数:${summarize.totalNumCustomersSeverity3},三级告警阅读率:${summarize.readRateCustomersSeverity3}`} type={'info'} showIcon /> : null}/>
						<List {...listPorps} />
					</TabPane>
				</Tabs>
			</div>
			<Modal {...modalProps} />
		</div>
	)
}

export default connect(({
	notficationView, userinfo, app, roles, alarmFrom, alarmSeverity, notifyWay, moSelect, appSelect, loading,
}) => ({
	notficationView, userinfo, app, roles, alarmFrom, alarmSeverity, notifyWay, moSelect, appSelect, loading,
}))(notficationView)
