import React from 'react'
import { connect } from 'dva'
import { Icon, Modal, Tabs } from 'antd'
import PolicyTableEBank from './policyTableEBank'
import {ozr} from '../../../../utils/clientSetting'
import PolicyTableEGroup from './policyTableEGroup'
import treeDataApp from '../../../../utils/treeDataApp'
import fenhang from '../../../../utils/fenhang'
import PolicyTempletModal from '../../../../customization/EBank/routes/policy/templet/Modal'
import OperationModalDesc from '../../../../customization/EBank/routes/utils/OperationModalDesc'
const TabPane = Tabs.TabPane

const policyListModalComp = ({
	dispatch,
	loading,
	modalPolicyVisible,
	moPolicyInfo,
	openPolicyType,
	policyInstanceId,
	pagination,
	onPageChange,
	policyList,
}) => {
	const { tabstate, modalType, currentItem, modalVisible, isClose, typeValue, stdInfoVal, timeList, operationVisible, newOperationItem, fields, filterMode, operationType, CheckboxSate1 } = policyList
	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyList/setState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalPolicyVisible: false,
				openPolicyType: '',
				policyInstanceId: '',
				moPolicyInfo: {},
			},
		})
	}

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		dispatch({
			type: 'policyList/setState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalPolicyVisible: false,
				openPolicyType: '',
				policyInstanceId: '',
				moPolicyInfo: {},
			},
		})
	}

	const modalOpts = {
		title: '查看对象关联的监控实例',
		visible: modalPolicyVisible,
		onCancel,
		onOk,
		wrapClassName: 'vertical-center-modal',
	}

	const tabsOpts = {
		activeKey: openPolicyType,
	}

	const callback = (key) => {
		dispatch({
			type: 'policyList/queryPolicy',
			payload: {
				uuid: policyInstanceId,
				policyType: key,
				page: 0,
				pageSize: 100,
			},
		})
		dispatch({
			type: 'policyList/setState',
			payload: {
				openPolicyType: key,
				moPolicyInfo: {},
			},
		})
	}

	const PolicyListProps = {
		dispatch,
		loading,
		dataSource: (moPolicyInfo && moPolicyInfo.content && moPolicyInfo.content.length > 0 ? moPolicyInfo.content : []),
		pagination,
		onPageChange,
		scroll: 1200,
	}

	const modalProps = { //这里定义的是弹出窗口要绑定的数据源
		modalType,
		fenhang,
		dispatch,
		item: currentItem.policyTemplate ? currentItem : {
			policyTemplate: {
				policyType: 'NORMAL',
				collectParams: {},
			},

		}, //要展示在弹出窗口的选中对象
		type: modalType, //弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible, //弹出窗口的可见性是true还是false
		checkStatus: 'success', //检测状态done,success,fail,checking
		isClose,
		tabstate,
		typeValue,
		stdInfoVal,
		timeList,
		//treeNodes: policyTempletGroup.treeDatas.length > 0 ? loopSelect(policyTempletGroup.treeDatas) : [],
		treeDataApp,
		see: 'yes',
		modalName: 'policyList'
	}
	const operationModalDescProps = {	//新增策略模板-操作详情部分功能代码----start
		dispatch,
		visible: operationVisible,//
		newOperationItem: newOperationItem,//
		tabstate,//
		timeList,//
		CheckboxSate1,//
		operationType, //记录操作详情操作状态，add/edit//
		filterMode,//
		fields,//
		preview:'',
		flag:false,
		expr:'',
		option1:[],
		content: [],
		xyAais:[],
		legend:[],
		endtime:'',
		statrtime:'',
		selectValue:'1800',
		promApiReq:{
			end: '',
			query: '',
			start: '',
			step: '',
			timeout: ''
		},
		fileType: 'policyList'
	}
	return (<div>
		{
			ozr('id') === 'EBank' ?
				<Modal {...modalOpts} width="1200px">
					<div>
						<Tabs size="small" {...tabsOpts} onTabClick={callback}>
							<TabPane tab={<span><Icon type="info-circle" style={{ color: '#2592fc' }} />总监控实例数 {moPolicyInfo.relatedPolicyInstances}</span>} key="ALL">
								<PolicyTableEBank {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="exclamation-circle" style={{ color: 'orange' }} />非标准实例数 {moPolicyInfo.notStdPolicyInstances}</span>} key="NOT_STD">
								<PolicyTableEBank {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="check-circle" style={{ color: '#56c22d' }} />已下发实例数 {moPolicyInfo.issuedPolicyInstances}</span>} key="ISSUED">
								<PolicyTableEBank {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="pause-circle" style={{ color: 'gray' }} />未下发实例数 {moPolicyInfo.unissuedPolicyInstances}</span>} key="UNISSUED">
								<PolicyTableEBank {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="close-circle" style={{ color: 'red' }} />下发失败实例数 {moPolicyInfo.issueFailedPolicyInstances}</span>} key="ISSUE_FAILED">
								<PolicyTableEBank {...PolicyListProps} />
							</TabPane>
						</Tabs>
					</div>
				</Modal>
				:
				<Modal {...modalOpts} width="1200px">
					<div>
						<Tabs size="small" {...tabsOpts} onTabClick={callback}>
							<TabPane tab={<span><Icon type="info-circle" style={{ color: '#2592fc' }} />总监控实例数 {moPolicyInfo.relatedPolicyInstances}</span>} key="ALL">
								<PolicyTableEGroup {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="exclamation-circle" style={{ color: 'orange' }} />非标准实例数 {moPolicyInfo.notStdPolicyInstances}</span>} key="NOT_STD">
								<PolicyTableEGroup {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="check-circle" style={{ color: '#56c22d' }} />已下发实例数 {moPolicyInfo.issuedPolicyInstances}</span>} key="ISSUED">
								<PolicyTableEGroup {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="pause-circle" style={{ color: 'gray' }} />未下发实例数 {moPolicyInfo.unissuedPolicyInstances}</span>} key="UNISSUED">
								<PolicyTableEGroup {...PolicyListProps} />
							</TabPane>
							<TabPane tab={<span><Icon type="close-circle" style={{ color: 'red' }} />下发失败实例数 {moPolicyInfo.issueFailedPolicyInstances}</span>} key="ISSUE_FAILED">
								<PolicyTableEGroup {...PolicyListProps} />
							</TabPane>
						</Tabs>
					</div>
				</Modal>
		}
		<PolicyTempletModal {...modalProps} />
		<OperationModalDesc {...operationModalDescProps} />{/*新增策略模板-操作详情部分功能代码*/}
	</div>
	)
}

export default connect(({ policyList, loading }) => ({ policyList, loading: loading.models.policyList }))(policyListModalComp)
