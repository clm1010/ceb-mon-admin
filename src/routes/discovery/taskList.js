import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import fenhang from '../../../../utils/fenhang'

import './ellipsis.css'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,visible,titlename,onCancel
}) {

  const modalOpts = {
    title: titlename,
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    // width: 1150,
    maskClosable: false,
  }

	const onAdd = () => {
		dispatch({
			type: 'tool/showModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'discovery/query',
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
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'discovery/delete',
		        payload: choosedRows,
		      })
        },
      })
	}

  let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})


	const onEdit = (record) => {
    dispatch({
      type: 'discovery/queryAllToolsURL',
      payload: {},
    }),
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
					dispatch({
						type: 'discovery/delete',
						payload: ids,
					})
				},
			})
		}

  const columns = [
    {
		title: '任务ID',
		dataIndex: 'taskId',
		key: 'taskId',
		sorter: (a, b) => a.taskId - b.taskId,
	  },
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
    },  {
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
    }, {
      key: 'targetHost', // 传递给后端的字段名
      title: '目标主机',
      dataIndex: 'targetHost',
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
        if (text == "0"){
          return "未运行"
        }else{
          return "运行中"
        }
      },
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

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push(object.uuid)
	  		})
	  	console.log(`choosed:${choosed}`)
		  dispatch({
		  	type: 'tool/switchBatchDelete',
				payload: {
					choosedRows: choosed,
					batchDelete: choosed.length > 0,
				},
			})
	  },
	}


  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 980 }} //滚动条
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
