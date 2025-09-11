import React from 'react'
import { Table, Modal, Row, Col, Button, Badge, Tag } from 'antd'
import { Link } from 'dva/router'
import Fenhang from '../../../utils/fenhang'

let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
})

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, batchDelete, batchSelect, controllerNumber, q,
}) {
	//每次都会重新复制一套列配置，然后追加操作列。避免重复追加
	let columns = [
		{
			key: 'mo.name',
			dataIndex: 'mo.name',
			title: '名称',
			width: 250,
		},
		{
			key: 'mo.lineType',
			dataIndex: 'mo.lineType',
			title: '线路类型',
			width: 120,
		},
		{
			key: 'mo.branchName',
			dataIndex: 'mo.branchName',
			title: '所属行名称',
			render: (text, record) => {
				return Fenhangmaps.get(text)
			},
			width: 120,
		},/*
		{
			key: 'relatedPolicyInstances',
			dataIndex: 'relatedPolicyInstances',
			title: '关联策略总数',
		},*/
		{
			key: 'mo.aaDeviceIP',
			dataIndex: 'mo.aaDeviceIP',
			title: '本端设备IP',
			width: 150,
		},
		{
			key: 'mo.aaIntf.ip',
			dataIndex: 'mo.aaIntf.ip',
			title: '本端端口IP',
			width: 150,
		},
		{
			key: 'mo.aaPort',
			dataIndex: 'mo.aaPort',
			title: '本端端口',
			width: 150,
		},
		{
			key: 'mo.zzDeviceIP',
			dataIndex: 'mo.zzDeviceIP',
			title: '对端设备IP',
			width: 150,
		},
		{
			key: 'mo.zzIP',
			dataIndex: 'mo.zzIP',
			title: '对端端口IP',
			width: 150,
		},
		{
			key: 'mo.zzPort',
			dataIndex: 'mo.zzPort',
			title: '对端端口',
			width: 150,
		},
		{
			key: 'mo.onlineStatus',
			dataIndex: 'mo.onlineStatus',
			title: '在线状态',
			width: 150,
		},
	]

	for (let column of columns) {
		
		/*
		if (column.key === 'relatedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
	    }
		} else if (column.key === 'issuedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'ISSUED')}><Badge count={text} style={{ backgroundColor: '#52c41a' }} showZero /></a>
	    }
		} else if (column.key === 'unissuedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'UNISSUED')}><Badge count={text} style={{ backgroundColor: 'gray' }} showZero /></a>
	    }
		} else if (column.key === 'issueFailedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'ISSUE_FAILED')}><Badge count={text} style={{ backgroundColor: '#f22735' }} showZero /></a>
	    }
		} else if (column.key === 'notStdPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'NOT_STD')}><Badge count={text} style={{ backgroundColor: '#f8ac30' }} showZero /></a>
	    }
		} else if (column.key === 'intfNum') {
			column.render = (text, record) => {
	    	return <a onClick={e => openInfsModal(record, e)}><Badge count={text} style={{ backgroundColor: '#000' }} showZero /></a>
	    }
		}*/

		if (column.key === 'mo.lineType') {
			column.render = (text, record) => {
	    	if (text === 'EXTERNAL') {
	    		return <Tag color="orange">第三方线路</Tag>
	    	}
	    		return <Tag color="green">行内线路</Tag>
	    }
		}
	}

	columns.push({
	  	title: '操作',
	  	width: 80,
	  	fixed: 'right',
	  	render: (text, record) => {
				return (<div>
  <Button style={{ float: 'left' }} size="small" type="ghost" icon="retweet" onClick={() => onEdit(record)}   disabled={(record.mo && record.mo.onlineStatus=== "已下线") ? true:false}>变更</Button>
            </div>)
	  	},
		})
//  <Button style={{ float: 'right' }} size="default" type="ghost" shape="circle" icon="arrow-down" onClick={() => onDeletes(record)} />

	const onDeletes = (record) => {
		let params = []
    params.push(record.mo.uuid)
		confirm({
    	title: '您确定要将线路下线吗?',
    	onOk () {
		    dispatch({
					type: 'mowizard/deleteLine',				//@@@
		      payload: {
						uuids:params,
						q: q === undefined ? '' : q,
					}
				})
    	},
    })
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'mowizard/queryLines',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'mowizard/setState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		batchSelect: [],
      	},
      })
    }

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		
		dispatch({
			type: 'mowizard/findLineById',				//@@@
			payload: {
				currentItem: record.mo,
				
			//	secondClass: 'HA_LINE',				//@@@
			//	createMethodValue: '自动',
			//	alertType: 'info',
			//	alertMessage: '请输入线路信息',				//@@@
			},
		})
		dispatch({
			type: 'mowizard/setState',
			payload: {
				lineWizardVisible: true,
				modalType: 'update',
				q: q === undefined ? '' : q,
			//	createMethodValue: '自动',
			//	alertType: 'info',
			//	alertMessage: '请输入线路信息',				//@@@
			},
		})
	}


	const openPolicyModal = (record, e, type) => {
		dispatch({
			type: 'policyList/queryPolicy',
			payload: {
				uuid: record.mo.uuid,
				policyType: type,

			},
		})
		dispatch({
			type: 'policyList/setState',
			payload: {
				modalPolicyVisible: true,
				openPolicyType: type,
				policyInstanceId: record.mo.uuid,
			},
		})
	}

	const openInfsModal = (record, e) => {
		const currentItem = { uuid: record.mo.uuid }

		dispatch({
			type: 'interfaceList/setState',
			payload: {
				infsVisible: true,
			},
		})
		dispatch({
			type: 'interfacer/getInterfacesById',
			payload: {
				currentItem,
			},
		})
	}

	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	//console.log(selectedRows)
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'mowizard/setState',
					payload: {
						batchDelete: true,
						batchSelect: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'mowizard/setState',
					payload: {
						batchDelete: false,
						batchSelect: selectedRows,
					},
				})
			}
	  },
	}

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 1200, y: 400 }}
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.mo.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
