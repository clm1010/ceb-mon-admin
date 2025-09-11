import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import PolicyList from './../../components/policyModal/PolicyModalListDesc'
import infoColumns from "./InfosColumns";
import fenhang from './../../utils/fenhang'

const TabPane = Tabs.TabPane
const InInfoModalDesc = ({
	dispatch,
	visible,
	loading,
	onCancel,
	titlename,isRepeat,currentId,
	policyObjInfo,
  discovery,q
}) => {

  const confirm = Modal.confirm

  let newCol = [...infoColumns]
  newCol.push(
    {
      title: '操作',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        let isRe = false
        if (currentId == record.uuid && isRepeat){
          isRe = true
        }
        return (<div>
          <Button size="large" type="primary" disabled={!isRe} onClick={() => onDelete(record)}>删除</Button>
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
          <Button size="default" type="primary" onClick={() => discoveryInfo(record)}>移入发现设备清单</Button>
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
          <Button size="large" type="primary" onClick={() => checkRepeat(record)}>MO重复检测</Button>
        </div>)
      },
    },
  )

   const checkRepeat = (record) => {
    const ip = record.retCode == 0 ? record.looIp : record.discoveryIp
    dispatch({
      type: 'discovery/checkRepeat',
      payload: {
        uuid:record.uuid,
        q:"branchName == " + record.branch + " and discoveryIP == " + ip
      },
    })
  }

  const onDelete = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        let ids = []
        ids.push(record.uuid)
        let branch = record.branch
        dispatch({
          type: 'discovery/deleteInvalidInfo',
          payload: {
            ids,
            branch
          }
        })
      },
    })
  }

  const discoveryInfo = (record) => {
    dispatch({
      type: `discovery/changeInvalidInfo`,
      payload: {
        record,
        state:"discovery"
      }
    })
  }

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
    onPageChange (page) {
      dispatch({
        type: 'discovery/queryInInfos',
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
      branchName: maps.get('HLJ'),
    }
    dispatch({
       type: 'mowizard/neCreate',
       payload: {
         wizardVisible: true,
         modalType: 'create',
         currentStep: 0,
         selectedRows:[],
         neitem:data,
       },
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

export default Form.create()(InInfoModalDesc)
