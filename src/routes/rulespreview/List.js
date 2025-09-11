import React from 'react'
import { Table, Modal, Row, Col } from 'antd'
import { Link } from 'dva/router'
import './List.css'

import Fenhang from '../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})


function list({
	dispatch, loading, dataSource, policyType,
}) {

	const pagination = {													//分页对象
		showTotal: total => `共 ${dataSource.length} 条`,					 //用于显示数据总量	
		defaultPageSize:200,
		disabled:true	
	}

	const openMosModal = (record, e) => {
		console.log('in openMosModal')
		console.log(policyType)
		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'rulesPreview/getMoById',
			payload: {
				currentItem: record,
				modalMOVisible: true,
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'rulesPreview/showModal',
			payload: {
				//toolInstUUIDMos:uuid,
				//toolMosNumber:policyCount,
				modalMOVisible: true,
			},
		})
	}

	const openRuleModal = (record, e) => {
		dispatch({
			type: 'rulesPreview/getPolicyRuleById',
			payload: {
				currentItem: record,
			},
		})
		dispatch({
			type: 'rulesPreview/showModal',
			payload: {
				modalRuleVisible: true,
			},
		})
	}

	const openTempModal = (record, e) => {
		dispatch({
			type: 'rulesPreview/getTemplateById',
			payload: {
				currentItem: record,
			},
		})
		dispatch({
			type: 'rulesPreview/showModal',
			payload: {
				modalTempVisible: true,
			},
		})
	}

	const openToolModal = (record, e) => {
		dispatch({
			type: 'rulesPreview/getToolById',
			payload: {
				currentItem: record,
			},
		})
		dispatch({
			type: 'rulesPreview/showModal',
			payload: {
				modalToolVisible: true,
			},
		})
	}

	const columnsdef = [
		{//0
			title: '对象名称',
			dataIndex: 'mo.name',
			key: 'mo.name',
			render: (text, record) => <a onClick={e => openMosModal(record, e)}>{text}</a>,
			//sorter: (a, b) => a.mo.name - b.mo.name,
		}, {//1
			title: '管理IP',
			dataIndex: 'mo.discoveryIP',
			key: 'mo.discoveryIP',
		}, {//2
			title: '管理机构',
			dataIndex: 'mo.branchName',
			key: 'mo.branchName',
			render: (text, record) => {
				return Fenhangmaps.get(text)
			},
		}, {//3
			title: '策略规则',
			dataIndex: 'rule.name',
			key: 'rule.name',
			render: (text, record, index) => {
				return <a onClick={e => openRuleModal(record, e)}>{text}</a>
			},
		}, {//4
			title: '策略模板',
			dataIndex: 'template.name',
			key: 'template.name',
			render: (text, record, index) => {
				return <a onClick={e => openTempModal(record, e)}>{text}</a>
			},
		}, {//5
			title: '监控工具',
			dataIndex: 'toolInst.toolType',
			key: 'toolInst.toolType',
		}, {//6
			title: '工具实例',
			dataIndex: 'toolInst.name',
			key: 'toolInst.name',
			render: (text, record) => {
				return <a onClick={e => openToolModal(record, e)}>{text}</a>
			},
		},
		{//7
			title: '操作',
			//fixed: 'right',
			dataIndex: 'online',
			key: 'online',
			render: (text) => {
				let op = ''
				if (text) {
					if (text.toLowerCase() === 'online') op = '上线'
					else if (text.toLowerCase() === 'offline') op = '下线'
				}
				return op
			},
		},
		{// 8
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				let status = ''
				if (text) status = '正常'
				else status = '异常'
				return status
			},
		},
		{// 9 for problem
			title: '异常原因',
			dataIndex: 'detail',
			key: 'detail',
		},
	]

	let columns = columnsdef
	if ((policyType === 'ISSUED') || (policyType === 'ALL')) {
		delete columns[columns.length - 1]
		delete columns[7]
	} else if (policyType === 'UNISSUED') {
		delete columns[columns.length - 1]
	}

	// new column
	let issStatusCol = { // for existing
		title: '下发状态',
		dataIndex: 'issueStatus',
		key: 'issueStatus',
		/*
		render: (text, record) => {
			let status = ''
			if (text) {
				if (text.toLowerCase() === 'success') status = '正常'
				else status = '异常'
			}
			return status
		}*/
	}

	if (policyType === 'ISSUED') columns.push(issStatusCol)

	const customPanelStyle1 = {
		background: '#fff',
		borderRadius: 4,
		border: 0,
		overflow: 'auto', //'hidden',
		borderBottom: '1px solid #E9E9E9',
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 12,
		paddingTop: 12,
		fontSize: 14,
		//		height: '600px',
	}
	//pagination={{pageSize: 15}}
	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>

				<div style={customPanelStyle1}>
				<Table
						scroll={{ x: 980 , y:600}} //滚动条
						bordered
						columns={columns}
						dataSource={dataSource}
						loading={loading}
						pagination={pagination}
						simple
						rowKey={record => (record.mo ? record.mo.uuid : '') + (record.template ? record.template.uuid : '')
						+ (record.rule ? record.rule.uuid : '') + (record.toolInst ? record.toolInst.uuid : '')}
						size="small"
					/>
				</div>
			</Col>
		</Row>
	)
}

export default list
