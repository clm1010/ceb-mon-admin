import React from 'react'
import { Table, Row, Col } from 'antd'
import './List.css'

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, scroll,
}) {
	const openTempletModal = (record) => {
		dispatch({
			type: 'policyList/findPolicyTemplet',
			payload: {
				record,
			},
		})
	}

	const columns = [
		{
	  	title: '监控实例名称',
	  	dataIndex: 'name',
	  	key: 'name',
		  width: 300,
		}, {
			title: '模板名称',
			dataIndex: 'template.name',
			key: 'template.name',
			width: 300,
			render: (text, record) => {
				let typename = ''
				if (record && record.template && record.template.name) {
					typename = record.template.name
				}
				return <a onClick={e => openTempletModal(record)}>{typename}</a>
			},
		}, {
			title: '指标',
			dataIndex: 'monitorParams.indicator.name',
			key: 'monitorParams.indicator.name',
		  render: (text, record) => {
				let typename = ''
				if (record && record.template && record.template.monitorParams) {
					typename = record.template.monitorParams.indicator.name
				}
				return typename
		   },
		}, {
			title: '告警参数',
		  dataIndex: 'alarmParamsCount',
			key: 'alarmParamsCount',
		  width: 150,
			render: (text, record) => {
				let params = ''
				if (record.monitorParams === undefined) {
					return ''
				}
				if (record.monitorParams.ops === undefined) {
					return ''
				}
				let ops = record.monitorParams.ops
				if (ops !== undefined) {
					ops.forEach((op) => {
						let fuhao = ''
						if (op.condition.op === '>') {
							fuhao = '高于'
						} else {
							fuhao = '低于'
						}
						if (record.policyType === 'SYSLOG') {
							params += `${op.actions.namingAction.naming};`
						} else {
							params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
						}
					})
				}
				if (record.policyType === 'SYSLOG') {
					const typeStyle = <div className="ellipsis" title={params}>{params}</div>
					return typeStyle
				}
					return params
			},
		}, {
	  	title: '监控实例类型',
		  dataIndex: 'policyType',
	  	key: 'policyType',
	  	width: 65,
	  	render: (text, record) => {
				let typename = '普通'
					if (record.policyType == 'NORMAL') {
						typename = '普通'
					} else {
						typename = record.policyType
					}
				return typename
			},
		},
		/*  {
	  	title: '监控工具实例',
		  dataIndex: 'toolPolicys',
			key: 'toolPolicys',
		  width: '10%',
			render: (text, record) => {
				let toolname = ''
				let myset = new Set()
				record.forEach((bean, index) => {
			   	if (index === 0) {
				   	toolname = bean.name
				   	myset.add(bean.name)
			   	} else if (!myset.has(bean.name)) {
					   	toolname = `${toolname},${bean.name}`
					   	myset.add(bean.name)
				   	}
				})
				return toolname
			},
		},  */
		
		
		{
			title: '是否标准监控实例',
			dataIndex: 'isStd',
			key: 'isStd',
			width: 90,
			render: (text, record) => {
				let typename = '是'
				if (record.isStd == true) {
					typename = '是'
				} else {
					typename = '否'
				}
				return typename
			},
		}, {
			title: '策略来源',
			dataIndex: 'createdFrom',
			key: 'createdFrom',
			width: 65,
			render: (text, record) => {
				let typename = '实例化'
				if (record.createdFrom === 'FROM_TEMPLATE') {
					typename = '实例化'
				} else if (record.createdFrom === 'MANUAL') {
					typename = '手工'
				} else {
					typename = '未知'
				}
				return typename
			},
		},
	]
  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={false}
          rowKey={record => record.uuid}
          size="small"
        />
      </Col>
    </Row>
  )
}

export default list
