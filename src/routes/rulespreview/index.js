import React from 'react'
import { connect } from 'dva'
import { Icon, Modal, Tabs, Row, Col } from 'antd'

import PolicyTable from './List'
import Modalmo from './Modalmo'
import Modalrule from './Modalrule'
import Modaltool from './Modaltool'
import Modaltemp from './Modaltemp'
import ButtonZone from './ButtonZone'
import fenhang from '../../utils/fenhang'
import treeDataApp from '../../utils/treeDataApp'
import OperationModalDesc from '../policy/utils/OperationModalDesc'
// internationalization
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');//指定加载国际化目标
// end internationalization

const TabPane = Tabs.TabPane

const RulesPreview = ({
	location, dispatch, loading, rulesPreview,
}) => {
	const {
		modalMOVisible, modalToolVisible, modalRuleVisible, modalTempVisible, policyList, policyExistList, policyAllList, errorList, currentItem, openPolicyType,
		tabstate, typeValue, stdInfoVal, firstType } = rulesPreview	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
	//document.title = title
	const tabsOpts = {
		activeKey: openPolicyType,
		//defaultActiveKey:"ALL",
	}
	const callback = (key) => {
		/*		dispatch({
					type: 'rulespreview/query',
					payload: {
						uuid: policyInstanceId,
						policyType: key,
					},
				})*/
		dispatch({
			type: 'rulesPreview/updateState',
			payload: {
				openPolicyType: key,
				//moPolicyInfo:{},
			},
		})
	}

	const modalMoProps = {	//这里定义的是弹出窗口要绑定的数据源
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalVisible: modalMOVisible, //弹出窗口的可见性是true还是false
		modalName: 'MO对象详情',		//@@@
	}

	const modalRuleProps = {									//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		citem: currentItem,		//要展示在弹出窗口的选中对象
		visible: modalRuleVisible,									//弹出窗口的可见性是true还是false
		//checkStatus,											//检测状态done,success,fail,checking
		//isClose,
	}

	const modalToolProps = {									//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		visible: modalToolVisible,									//弹出窗口的可见性是true还是false
	}
	const modalTempProps = { //这里定义的是弹出窗口要绑定的数据源
		fenhang,
		dispatch,
		item: currentItem.policyTemplate ? currentItem : {
			policyTemplate: {
				policyType: 'NORMAL',
				collectParams: {},
			},

		}, //要展示在弹出窗口的选中对象
		timeList:rulesPreview.timeList,
		visible: modalTempVisible, //弹出窗口的可见性是true还是false
		tabstate,
		typeValue,
		stdInfoVal,
		treeDataApp,
	}
	const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
		dispatch,
		visible: rulesPreview.operationVisible,
		fileType: 'rulesPreview',
		newOperationItem: rulesPreview.newOperationItem,
		checkStatus: 'done', //检测状态done,success,fail,checking
		tabstate,
		timeList:rulesPreview.timeList,
		operationType: rulesPreview.operationType, //记录操作详情操作状态，add/edit
		filter: {
			filterItems: [{ indicator: { name: '', uuid: '' }, function: 'count', count: '', exprLValue: '', exprOperator: '', exprRValue: '', op: '', threshold: '', index: 0, }],
			filterIndex: [0],
		},
		advancedItem:{},
		resetCalInput:false,
		isDS: (typeValue === 'PROMETHEUS'),
		performanceItem: {}
	}
	/*
		  关联的对象
	  */
	const PolicyListProps = {
		location,
		dispatch,
		loading,
		dataSource: (policyList && policyList.length > 0 ? policyList : []),
		scroll: 1200,
		policyType: openPolicyType,
		//pagination
	}
	const ErrorListProps = {
		location,
		dispatch,
		loading,
		dataSource: (errorList && errorList.length > 0 ? errorList : []),
		scroll: 1200,
		policyType: openPolicyType,
	}

	const PolicyListExistProps = {
		location,
		dispatch,
		loading,
		dataSource: (policyExistList && policyExistList.length > 0 ? policyExistList : []),
		scroll: 1200,
		policyType: openPolicyType,
	}

	const PolicyListAllProps = {
		location,
		dispatch,
		loading,
		dataSource: (policyAllList && policyAllList.length > 0 ? policyAllList : []),
		scroll: 1200,
		policyType: openPolicyType,
	}
	const buttonZoneProps = {
		dispatch,
		dataSource: (policyList && policyList.length > 0 ? policyList : []),
		// batchDelete,
		// choosedRows,
	}
	return (
		<div>
			<ConfigProvider locale={zhCN}>
				<Row gutter={24}>
					<Col className="content-inner6">
						<div style={{ margin: '6px 6px', fontWeight: 'bold' }}>下发预览</div>
						<Tabs size="small" {...tabsOpts} onTabClick={callback}>
							<TabPane tab={<span><Icon type="pause-circle" style={{ color: 'gray' }} />未下发实例</span>} key="UNISSUED">
								<PolicyTable {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="close-circle" style={{ color: 'red' }} />问题实例</span>} key="PROBLEM">
								<PolicyTable {...ErrorListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="check-circle" style={{ color: '#56c22d' }} />已下发实例</span>} key="ISSUED">
								<PolicyTable {...PolicyListExistProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="info-circle" style={{ color: '#2592fc' }} />全量实例</span>} key="ALL">
								<PolicyTable {...PolicyListAllProps} />
							</TabPane>
						</Tabs>
						{
							(openPolicyType == "UNISSUED" && (firstType == 'os' || firstType == 'db' || firstType == 'mw')) ? <ButtonZone {...buttonZoneProps} /> : null
						}
					</Col>
				</Row>
				<Modalmo {...modalMoProps} />
				<Modalrule {...modalRuleProps} />
				<Modaltool {...modalToolProps} />
				<Modaltemp {...modalTempProps} />
				<OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
			</ConfigProvider>
		</div>
	)
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ rulesPreview, loading }) => ({ rulesPreview, loading: loading.models.rulesPreview }))(RulesPreview)
