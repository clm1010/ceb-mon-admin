import React from 'react'
import { Icon, Form, Tabs, Modal, Button } from 'antd'
import PolicyList from './../../components/policyModal/PolicyModalListDesc'
import fenhang from './../../utils/fenhang'

const TabPane = Tabs.TabPane
const TaskModel = ({
	dispatch,
	visible,
	loading,
	onCancel,
	titlename,
	policyObjInfo,
  discovery,
   q,                  timeKey
}) => {

  const confirm = Modal.confirm

  const onEdit = (record) => {
      dispatch({
        type: 'discovery/getTaskById',
        payload: {
          modalType: 'update',
          currentItem: record,
          modalVisible: true,
          isClose: false,
        },
      })
  }

  const onDeletes = (record) => {
    confirm({
      title: '您确定要删除这条记录吗?',
      onOk () {
        let ids = []
        ids.push(record.uuid)
        let branch = record.branch
        dispatch({
          type: 'discovery/delete',
          payload: {
            ids,
            branch
          }
        })
      },
    })
  }

  const onPageChange = (page) => {
    dispatch({
      type: 'discovery/queryTasks',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q: q === undefined ? '' : q,
      },
    })
    dispatch({
      type: 'discovery/showModal',
      payload: {
        pageChange: new Date().getTime(),
        selectedRows: [],
      },
    })
  }

  const columns =  [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },  {
      title: '扫描周期',
      dataIndex: 'scanCycle',
      key: 'scanCycle',
    },  {
      title: '目标域',
      dataIndex: 'ipRange',
      key: 'ipRange',
    },
    {
      title: 'community',
      dataIndex: 'community',
      key: 'community',
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },{
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (text, record, index) => {
        if (text == "0"){
          return "启用"
        }else{
          return "停用"
        }
      },
    },  {
      title: '所属机构',
      dataIndex: 'branch',
      key: 'branch',
      render: (text, record) => {
        let typename = maps.get(text)
        return typename
      },
    },{
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        if (text == "1"){
			return "运行中"
		}else{
			return "未运行"
		}
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<div>
          <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
          <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
        </div>)
      },
    },
  ]

  const modalOpts = {
    title: titlename,
    visible,
    onCancel,
    //onOk,
    wrapClassName: 'vertical-center-modal',
	width: 1150,
	maskClosable: false,
    zIndex:900
  }

  const policyListProps = {
    dispatch,
    loading,
    scroll: 2000,
    columns: columns,
    dataSource: discovery.taskList,
    pagination: discovery.paginationInfos,
    onPageChange (page) {
      dispatch({
        type: 'discovery/queryTasks',
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
            <TabPane tab={<span><Icon type="bulb" /></span>} key="ALL">
            <PolicyList {...policyListProps} />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}

export default Form.create()(TaskModel)
