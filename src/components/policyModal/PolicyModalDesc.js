import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import PolicyList from './PolicyModalListDesc'

const TabPane = Tabs.TabPane
const PolicyModalDesc = ({
	dispatch,
	visible,
	policyListProps,
	loading,
	onCancel,
	titlename,
	policyObjInfo,
}) => {
  const modalOpts = {
    title: titlename,
    visible,
    onCancel,
    //onOk,
    wrapClassName: 'vertical-center-modal',
	width: 1150,
	maskClosable: false,
  }


  return (
    <Modal {...modalOpts} height="600" footer={[<Button key="back" size="default" type="primary" onClick={onCancel}>确定</Button>]}>
      <div>
        <Tabs size="small">
          <TabPane tab={<span><Icon type="bulb" />{policyObjInfo}</span>} key="ALL">
            <PolicyList {...policyListProps} />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}

export default Form.create()(PolicyModalDesc)
