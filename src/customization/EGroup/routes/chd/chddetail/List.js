import React from 'react'
import { Table, Modal, Tag, Row, Col, Button } from 'antd'
import { DropOption } from '../../../../../components'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, selectedRowKeys, isSynching, detail, batchDelete, choosedRows, location,
}) {
	const onAdd = () => {
		dispatch({
			type: 'cfg/showModal',
			payload: {
				modalType: 'create',
				modalVisible: true,
				isClose: false,
				cfgType: 'Zabbix Agent',
			},
		})
	}

	const onSyncStart = () => {
		dispatch({
			type: 'cfg/syncStart',
			payload: {
				isSynching: true,
			},
		})
	}

	const onSyncCancel = () => {
		dispatch({
			type: 'cfg/syncCancel',
			payload: {
				isSynching: false,
			},
		})
	}

	const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      dispatch({
        type: 'cfg/showModal',
        payload: {
        	modalType: 'update',
        	currentItem: record,
        	modalVisible: true,
        	isClose: false,
        },
      })
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
          dispatch({
		        type: 'cfg/delete',
		        payload: {
					uuid: record.uuid,
					parentId: detail.uuid,
				},
		      })
        },
      })
    } else if (e.key === '3') {
      dispatch({
        type: 'cfg/query',
        payload: record.uuid,
      })
    }
  }

  const columns = [
    {
      title: '发现配置名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '类型',
      dataIndex: 'cfgType',
      key: 'cfgType',
      render: (text, record) => {
      	let bgcolor = 'default'
				if (record.cfgType == 'SNMP') {
					bgcolor = '#108ee9'
				} else {
					bgcolor = '#87d068'
				}
				return <Tag color={bgcolor}>{text}</Tag>
			},
    }, {
      title: '地址范围',
      dataIndex: 'ipRange',
      key: 'ipRange',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '操作',
      key: 'operation',
      width: 40,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
			let newselectKeys = []
			selectedRows.forEach((item) => {
				newselectKeys.push(item.uuid)
			})
			if (selectedRows.length > 0) {
				dispatch({
					type: 'cfg/showModal',
						payload: {
							batchDelete: true, //控制删除按钮
							choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
						},
					})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'cfg/showModal',
					payload: {
						batchDelete: false,
						choosedRows: [],
					},
				})
			}
	  },
	}

	const alldelete = () => {
		confirm({
        title: '您确定要删除选中的记录吗?',
        onOk () {
          dispatch({
		        type: 'cfg/alldelete',
		        payload: {
					toolId: detail.uuid,
					ids: choosedRows,
				},
		      })
			},
		})
	}

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ float: 'right', marginTop: 8, marginBottom: 8 }}>
          <Button.Group>
            { isSynching === false ?
              <Button value="default" onClick={onSyncStart} icon="sync" />
		          	:
              <Button value="default" icon="loading" disabled />
		        	}
            <Button value="default" onClick={onSyncCancel}>取消</Button>
          </Button.Group>
          <Button style={{ marginLeft: 8 }} disabled={!batchDelete} size="default" type="ghost" onClick={alldelete}>删除</Button>
          <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增发现配置</Button>
          <Button style={{ marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting" />
        </div>
      </Col>
      <Col xl={{ span: 24 }} md={{ span: 24 }}>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          size="small"
          rowKey={record => record.uuid}
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
