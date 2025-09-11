import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import { DropOption } from '../../../components'
const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, listUUID, pagination, onPageChange, columns, scroll, choosedRows, batchDeletes, choosedRowslist,
}) {
	const onDeletes = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'ruleInstance/delete',
		        payload: choosedRowslist,
		      })
        },
      })
	}
	const handleMenuClick3 = (record, e) => {
    		if (e.key === '1') {
      		dispatch({
				type: 'ruleInstance/queryMonitorInstanceById',													//抛一个事件给监听这个type的监听器
				payload: {
					uuid: record.uuid,
				},
			})
    		} else if (e.key === '2') {
      		confirm({
        			title: '您确定要删除这条记录吗?',
        			onOk () {
        				let ids = []
        				ids.push(record.uuid)
          			dispatch({
	        				type: 'ruleInstance/delete',
		        			payload: ids,
		      		})

          			dispatch({
						type: 'ruleInstance/queryInfsrule',
						payload: {
							uuid: listUUID,
						},
					})

					dispatch({
						type: 'ruleInstance/showRuleModal',
						payload: {
							ruleUUID: listUUID,
							ruleInfsVisible: true,
						},
					})
        			},
      		})
    		}
  	}
	const columns1 = [
		{
     		title: '监控实例',
     		dataIndex: 'name',
     		key: 'name',
			width: '20%',
    		},
    		{
      		title: '策略规则',
      		dataIndex: 'rule.name',
      		key: 'rule.name',
    		},
    		{
      		title: '对象',
      		dataIndex: 'mo.name',
      		key: 'mo.name',
    		},
    		{
      		title: '监控工具实例',
	  		dataIndex: 'toolInst.name',
      		key: 'toolInst.name',
    		},
    		{
      		title: '策略实例',
			dataIndex: 'policy.name',
      		key: 'policy.name',
			width: '20%',
    		},
    		{
      		title: '下发状态',
			dataIndex: 'issueStatus',
      		key: 'issueStatus',
			render: (text, record) => {
      			let typename = '已下发'
				if (text == 'SUCCESS') {
					typename = '已下发'
				} else if (text == 'FAILURE') {
					typename = '下发失败'
				} else if (text == 'UNISSUED') {
					typename = '未下发'
				} else if (text == 'OTHER') {
					typename = '其他'
				} else {
					typename = '未知'
				}
				return typename
			},
    		},
    		{
      		title: '是否标准',
      		dataIndex: 'policy.isStd',
      		key: 'policy.isStd',
      		render: (text, record) => {
      	  		let typename = '是'
			    if (record.policy.isStd == true) {
				    typename = '是'
			    } else {
				    typename = '否'
			    }
			    return typename
		   },
      	},
      	{
			title: '来源',
      		dataIndex: 'policy.createdFrom',
      		key: 'policy.createdFrom',
      		render: (text, record) => {
      			let typename = ''
				if (record.policy.createdFrom === 'MANUAL') {
					typename = '手工'
				} else if (record.policy.createdFrom === 'FROM_TEMPLATE') {
					typename = '实例化'
				} else {
					typename = '未知'
				}
			    return typename
		   	},
    		},
    		{
      		title: '操作',
      		key: 'operation',
      		width: '5%',
      		render: (text, record) => {
				let arrs = [{ key: '1', name: '编辑' }]
				if (record && record.policy) {
					if (!record.policy.isStd) {
						arrs.push({ key: '2', name: '删除' })
					}
				} else {
					arrs.push({ key: '2', name: '删除' })
				}
				return <DropOption onMenuClick={e => handleMenuClick3(record, e)} menuOptions={arrs} />
      		},
    		},
	]
	const rowSelection = {
	  	onChange: (selectedRowKeys, selectedRows) => {
	  		let choosed = []
	  		selectedRows.forEach((object) => {
	  				choosed.push(object.uuid)
	  			})
		  	dispatch({
		  		type: 'ruleInstance/updateState',
				  payload: {
					  choosedRowslist: choosed,
					  batchDeletes: choosed.length > 0,
				  },
			})
	  	},
		 //根据每一行记录的结果，来判断是否可以选
		  getCheckboxProps: record => ({
			  disabled: (!!record.policy.isStd),
			  defaultChecked: false,
		  }),
	  }

  	return (

    <Row gutter={24}>
      <Button style={{ float: 'right', marginRight: 13, marginBottom: 10 }} size="default" type="ghost" onClick={onDeletes} disabled={!batchDeletes}>删除</Button>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          columns={columns1}
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
