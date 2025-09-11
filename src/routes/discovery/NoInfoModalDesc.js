import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import PolicyList from './../../components/policyModal/PolicyModalListDesc'
import infoColumns from "./InfosColumns";
import fenhang from './../../utils/fenhang'

const TabPane = Tabs.TabPane
const NoInfoModalDesc = ({
	dispatch,
	visible,
	loading,
	onCancel,
	titlename,
	policyObjInfo,
  discovery,
  q,
  info, infoList,
   form: {
     getFieldsValue,
     resetFields,
   },
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

  const policyListProps = {
    dispatch,
    loading,
    scroll: 2000,
    columns: infoColumns,
    dataSource: discovery.infoList,
    pagination: discovery.paginationInfos,
    onPageChange(page) {
      dispatch({
        type: 'discovery/queryInfos',
        payload: {
          current: page.current - 1,
          page: page.current - 1,
          pageSize: page.pageSize,
         q: q === undefined ? '' : q,
        },
      })
    },
  }

  let maps = new Map()
  fenhang.forEach((obj, index) => {
    let keys = obj.key
    let values = obj.value
    maps.set(keys, values)
  })

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

export default Form.create()(NoInfoModalDesc)
