import React from 'react'
import { connect } from 'dva'
import { Icon, Modal, Tabs } from 'antd'
import PolicyTable from './policyTable'

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
}) => {
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
    title: '查看对象关联的策略实例',
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
	return (
  <Modal {...modalOpts} width="1200px">
    <div>
      <Tabs size="small" {...tabsOpts} onTabClick={callback}>
        <TabPane tab={<span><Icon type="info-circle" style={{ color: '#2592fc' }} />总策略实例数 {moPolicyInfo.relatedPolicyInstances}</span>} key="ALL">
          <PolicyTable {...PolicyListProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="exclamation-circle" style={{ color: 'orange' }} />非标准实例数 {moPolicyInfo.notStdPolicyInstances}</span>} key="NOT_STD">
          <PolicyTable {...PolicyListProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="check-circle" style={{ color: '#56c22d' }} />已下发实例数 {moPolicyInfo.issuedPolicyInstances}</span>} key="ISSUED">
          <PolicyTable {...PolicyListProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="pause-circle" style={{ color: 'gray' }} />未下发实例数 {moPolicyInfo.unissuedPolicyInstances}</span>} key="UNISSUED">
          <PolicyTable {...PolicyListProps} />
        </TabPane>
        <TabPane tab={<span><Icon type="close-circle" style={{ color: 'red' }} />下发失败实例数 {moPolicyInfo.issueFailedPolicyInstances}</span>} key="ISSUE_FAILED">
          <PolicyTable {...PolicyListProps} />
        </TabPane>
      </Tabs>
    </div>
  </Modal>
	)
}

export default connect(({ policyList, loading }) => ({ policyList, loading: loading.models.policyList }))(policyListModalComp)
