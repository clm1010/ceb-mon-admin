/**
 * @module 维护期管理/我的维护期
 * @description
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs, Icon } from 'antd'
import queryString from "query-string";
import Filter from '../../mainRuleInstanceInfo/Filter'
import FilterSchema from './FilterSchema'
import DataList from './DataList'
import fenhang from '../../../utils/fenhang'
import DataModal from '../../mainRuleInstanceInfo/DataModal'
import './index.css'
const { TabPane } = Tabs

const myMaintenan = ({
	location, dispatch, mainRuleInstanceInfo, loading, userSelect, appSelect,
}) => {
	const {
		list,
		pagination,
		currentItem,
		modalVisible,
		modalType,
		pageChange,
		q,
		optionSelectAppName,
		activeKey,
		activeKey1,
	} = mainRuleInstanceInfo

	const user = JSON.parse(sessionStorage.getItem('user'))

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
		optionSelectAppName,
		dispatch,
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search)
			query.q = q
			query.page = 0
			query.pageType = activeKey1
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({
				pathname,
				search: stringified,
				query,
			}))
		},
	}
	const callback = (key) => {
		dispatch({
			type: 'mainRuleInstanceInfo/myQuery',
			payload: {
				pageType: key
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				activeKey: key,
				activeKey1: key
			}
		})
	}

	const callback1 = (key) => {
		dispatch({
			type: 'mainRuleInstanceInfo/myQuery',
			payload: {
				pageType: key
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				activeKey1: key
			}
		})
	}

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		fenhang,
		dataSource: list,
		loading: loading.effects['mainRuleInstanceInfo/myQuery'],
		pagination,
		key: pageChange,
		user: user, //权限判断
		q,
		activeKey1,
		activeKey,
	}
	const dataModalProps = {	//这里定义的是弹出窗口要绑定的数据源
		...mainRuleInstanceInfo,
		key: `${mainRuleInstanceInfo.ruleInstanceKey}_1`,
		loading: loading.effects['mainRuleInstanceInfo/myQuery'],
		dispatch,
		item: currentItem || {},		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		fenhang,
		list,
		user: user, //权限判断
		alarmApplyFilter: JSON.parse(sessionStorage.getItem('alarmApplyFilter')),
		userSelect,
		appSelect,
		activeKey,
	}
	return (
		<div className="content-inner">
			<Tabs onTabClick={callback} activeKey={activeKey} type="card" tabPosition="left">
				<TabPane tab="我的创建" key="CREAATED_BY">
					<Filter {...filterProps} />
					<DataList {...dataListProps} />
				</TabPane>
				<TabPane tab="我的申请" key="APPLICANT_TO_REVIEW">
					<Filter {...filterProps} />
					<div className='card-container'>
						<Tabs tabPosition="top" onTabClick={callback1} activeKey={activeKey1}>
							<TabPane key="APPLICANT_TO_REVIEW" tab={<span> <Icon type="meh" style={{ fontSize: 18 }} />申请待复核</span>}>
								<DataList {...dataListProps} />
							</TabPane>
							<TabPane key="APPLICANT_REJECTED" tab={<span> <Icon type="frown" style={{ fontSize: 18 }} />申请未通过</span>}>
								<DataList {...dataListProps} />
							</TabPane>
							<TabPane key="APPLICANT_PASS" tab={<span> <Icon type="smile" style={{ fontSize: 18 }} />申请通过</span>}>
								<DataList {...dataListProps} />
							</TabPane>
							<TabPane key="APPLICANT" tab={<span> <Icon type="user" style={{ fontSize: 18 }} />申请</span>}>
								<DataList {...dataListProps} />
							</TabPane>
						</Tabs>
					</div>
				</TabPane>
				<TabPane tab="我的复核" key="TO_REVIEW" >
					<Filter {...filterProps} />
					<div className='card-container'>
						<Tabs tabPosition="top" onTabClick={callback1} activeKey={activeKey1}>
							<TabPane key="TO_REVIEW" tab={<span> <Icon type="meh" style={{ fontSize: 18 }} />待复核</span>}>
								<DataList {...dataListProps} />
							</TabPane>
							<TabPane key="REVIEW_PASS" tab={<span> <Icon type="smile" style={{ fontSize: 18 }} />复核通过</span>}>
								<DataList {...dataListProps} />
							</TabPane>
							<TabPane key="REVIEW_REJECTED" tab={<span> <Icon type="frown" style={{ fontSize: 18 }} />复核未通过</span>}>
								<DataList {...dataListProps} />
							</TabPane>
						</Tabs>
					</div>
				</TabPane>
			</Tabs>
			<DataModal {...dataModalProps} />
		</div>
	)
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ mainRuleInstanceInfo, userSelect, appSelect, loading }) => ({ mainRuleInstanceInfo, userSelect, appSelect, loading: loading }))(myMaintenan)
