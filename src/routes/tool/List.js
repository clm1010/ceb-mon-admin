import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import { Link } from 'dva/router'
import fenhang from '../../utils/fenhang'

import './ellipsis.css'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
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
      	type: 'tool/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'tool/showModal',
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
		        type: 'tool/delete',
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

  const openMosModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.uuid
			policyCount = record.discoveredMONum
		}

		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'tool/queryMos',
			payload: {
				uuid,
				relatedType: 'TOOL_INST',
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'tool/showModal',
			payload: {
				toolInstUUIDMos: uuid,
				toolMosNumber: policyCount,
				mosVisible: true,
			},
		})
	}
	const onEdit = (record) => {
		dispatch({
			type: 'tool/getToolById',
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
						type: 'tool/delete',
						payload: ids,
					})
				},
			})
		}
  // render: (text, record) => <Link to={`cfglist/${record.uuid}`}>{text}</Link>,
  //
  const columns = [
    {
		title: '工具实例',
		dataIndex: 'name',
		key: 'name',
		render: (text, record) => <div title={text}>{text}</div>,
		sorter: (a, b) => a.name - b.name,
	  },
	  {
		title: '工具类型',
		dataIndex: 'toolType',
		key: 'toolType',
	  }, {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 200,
      //文本过长，溢出省略 -- start
      render: (text, record) => {
        //<div title={text}>{text}</div>
        let rlt = <div title={text}>{text}</div>
        if (record.toolType === "SKYWALKING") { // for SkyWalking
          let hf = `//${text}`
          rlt = <a href={hf} target="_blank">{text} </a>
        }
        return rlt
      },
      className: 'ellipsis',
      //end
    }, {
      title: '发现设备数',
      dataIndex: 'discoveredDeviceNum',
      key: 'discoveryDeviceNum',
    }, {
      title: '发现MO数',
      dataIndex: 'discoveredMONum',
      key: 'discoveryMONum',
	  render: (text, record, index) => {
      return <a onClick={e => openMosModal(record, e)}>{text}</a>
	  },

    }, {
    	title: '所属机构',
    	dataIndex: 'branch',
    	key: 'branch',
    	render: (text, record) => {
			let typename = maps.get(text)
  			return typename
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
