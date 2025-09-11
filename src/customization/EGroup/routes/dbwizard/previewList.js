import React from 'react'
import { Table, Row, Col, Button } from 'antd'
import Fenhang from '../../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})
function list({
	dispatch,
	loading,
	dataSource,
	policyType,
}) {
	const columnsdef = [
		{//0
			title: '对象名称',
			dataIndex: 'mo.name',
			key: 'mo.name',
			width: 100,
		}, {//1
			title: '管理IP',
			dataIndex: 'mo.discoveryIP',
			key: 'mo.discoveryIP',
			width: 100,
		}, {//2
			title: '管理机构',
			dataIndex: 'mo.branchName',
			key: 'mo.branchName',
			width: 80,
			render: (text, record) => {
				return Fenhangmaps.get(text)
			},
		}, {//3
			title: '策略规则',
			dataIndex: 'rule.name',
			key: 'rule.name',
			width: 100,
		}, {//4
			title: '策略模板',
			dataIndex: 'template.name',
			key: 'template.name',
			width: 100,
		}, {//5
			title: '监控工具',
			dataIndex: 'toolInst.toolType',
			key: 'toolInst.toolType',
			width: 100,
		}, {//6
			title: '工具实例',
			dataIndex: 'toolInst.name',
			key: 'toolInst.name',
			width: 100,
		},
		{//7
			title: '操作',
			//fixed: 'right',
			dataIndex: 'online',
			key: 'online',
			width: 40,
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
			width: 40,
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
			width: 100,
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
		width: 40,
	}
	if (policyType === 'ISSUED') columns.push(issStatusCol)
	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<Table
					bordered
					columns={columns}
					dataSource={dataSource}
					loading={loading}
					pagination={false}
					simple
					rowKey={record => record.id}
					size="small"
					scroll={{ x: 1200, y: 350 }}
				/>
			</Col>
		</Row>
	)
}
export default list
