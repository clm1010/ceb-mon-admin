import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import PolicyList from './../../components/policyModal/PolicyModalListDesc'
import infoColumns from "./InfosColumns";
import fenhang from './../../utils/fenhang'

const TabPane = Tabs.TabPane
const InfoModalDesc = ({
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
  let newCol = [...infoColumns]
  newCol.push(
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return (<div>
          <Button size="large" type="primary" disabled={record.retCode != '0'} onClick={() => sx(record)}>上线</Button>
        </div>)
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return (<div>
          <Button size="large" type="primary" onClick={() => invalidInfo(record)}>移入无效设备清单</Button>
        </div>)
      },
    }
    // {
    //   title: '操作',
    //   key: 'operation',
    //   width: 120,
    //   fixed: 'right',
    //   render: (text, record) => {
    //     return (<div>
    //       <Button size="default" type="primary" onClick={() => onlineInfo(record)}>移入已上线设备清单</Button>
    //     </div>)
    //   },
    // }
  )

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
    columns: newCol,
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

  const sx = (record) => {
    const data = {
      discoveryIP: record.looIp,
      branchName: record.branch,
    }
    dispatch({
      type: 'mowizard/neCreate',
      payload: {
        wizardVisible: true,
        modalType: 'create',
        currentStep: 0,
        selectedRows: [],
        neitem: data,
        isMon: true,
        infoBody:record,
        state:"online"
      },
    })
  }

  const onlineInfo = (record) => {
      dispatch({
        type: `discovery/changeDicoveryInfo`,
        payload: {
          record,
          state:"online"
        }
      })
  }
  const invalidInfo = (record) => {
    dispatch({
      type: `discovery/changeDicoveryInfo`,
      payload: {
        record,
        state:"invalid"
      }
    })
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

export default Form.create()(InfoModalDesc)
