import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import RuleList from './RuleModalListDesc'

const TabPane = Tabs.TabPane

const RuleModalDesc = ({
	dispatch,
	visible,
	ruleListProps,
	loading,
	onCancel,
	titlename,
	ruleObjInfo,
	choosedRows,
	batchDeletes,
	choosedRowslist,
}) => {
  	const modalOpts = {
    		title: titlename,
    		visible,
    		onCancel,
    		//onOk,
    		wrapClassName: 'vertical-center-modal',
		width: 950,
		maskClosable: false,
  	}

  	return (
    		<Modal {...modalOpts} height="600" footer={[<Button key="back" size="default" type="primary" onClick={onCancel}>确定</Button>]}>
      <div>
        <Tabs size="small">
          <TabPane tab={<span><Icon type="bulb" />{ruleObjInfo}</span>} key="ALL">
            <RuleList {...ruleListProps} />
          </TabPane>
        </Tabs>
      </div>
    		</Modal>
  	)
}
export default Form.create()(RuleModalDesc)
