import React, { useEffect } from "react"
import { connect } from 'dva'
import { Col, Row, Card, Table } from 'antd'
import Menus from '../dashboard/performance/Menus'
import { Link } from 'dva/router'
import Search from './Search.js'
import { genDictArrToTreeByName } from "../../utils/FunctionTool"

const singleSSL = ({ dispatch, location, singleSSL, loading }) => {

	const { dataSource, pagination, ipSource, monameSource } = singleSSL

	useEffect(() => {
		const time = setInterval(() => {
			dispatch({
				type: 'singleSSL/query',
				payload: {
				}
			})
		}, 60000)
		return () => clearInterval(time)
	}, [])

	//菜单组件
	const menuProps = {
		current: 'singleSSL',
		dispatch
	}

	const monameOp = monameSource.map((item, index) => {
		return { key: item, value: item }
	})

	const ipOp = ipSource.map((item, index) => {
		return { key: item, value: item }
	})

	const columns = [
		{
			title: 'SSL名称',
			dataIndex: 'moname',
			key: 'moname',
			width: '350px',
			render: (text, record) => {
				return <div style={{ textAlign: 'left' }} title={text}><Link to={`/singleSSLChar?q==${record.hostip};${record.keyword};${record.branchname}`} target='_blank'>{text}</Link></div>
			},
		}, {
			title: '所属服务域',
			dataIndex: 'appname',
			width: '300px',
			key: 'appname',
			render: (text, record) => {
				return <div style={{ textAlign: 'left' }} title={text}>{text}</div>
			}
		}, {
			title: 'IP地址',
			dataIndex: 'hostip',
			key: 'hostip',
			render: (text, record) => {
				return <div style={{ textAlign: 'left' }}>{text}</div>
			},
		}, {
			title: '设备启动时间',
			dataIndex: 'beginTime',
			key: 'beginTime',
			sorter: (a, b) => a.beginTimeNum - b.beginTimeNum,
		  },{
			title: 'SSL-VS并发',
			dataIndex: 'vs',
			sorter: (a, b) => a.vs - b.vs,
			key: 'vs',
		},
		{
			title: 'SSL每秒连接',
			dataIndex: 'conn',
			sorter: (a, b) => a.conn - b.conn,
			key: 'conn',
		}, {
			title: 'cpu利用率',
			dataIndex: 'cpu',
			sorter: (a, b) => a.cpu - b.cpu,
			key: 'cpu',
		},
		{
			title: '内存利用率',
			dataIndex: 'memory',
			sorter: (a, b) => a.memory - b.memory,
			key: 'memory',
		}
	]

	const filterSchema = [
		{
			key: 'moname', // 传递给后端的字段名
			title: 'SSL名称',
			dataType: 'varchar',
			showType: 'select',
			defaultValue: '',
			options: monameOp,
		},
		{
			key: 'hostip', // 传递给后端的字段名
			title: 'IP地址',
			dataType: 'varchar',
			showType: 'select',
			options: ipOp,
		},
		{
			key: 'netDomain', // 传递给后端的字段名
			title: '网络域',
			dataType: 'varchar',
			showType: 'treeSelect',
			children: genDictArrToTreeByName('netdomin-appname'),
		},
	]
	const filterProps = {
		filterSchema: filterSchema,
		dispatch,
		onSearch(queryTerms) {
			dispatch({
				type: 'singleSSL/query',
				payload: {
					queryTerms: queryTerms
				}
			})
		},
	}
	return (
		<div>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<Menus {...menuProps} />
				</Col>
			</Row>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<Search {...filterProps} />
				</Col>
			</Row>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<div style={{ marginTop: '10px' }}>
						<Card>
							<Table
								columns={columns}
								dataSource={dataSource}
								bordered
								scroll={{ x: 1400 }}
								loading={loading.effects['singleSSL/query']}
								size="small"
								pagination={pagination}
							/>
						</Card>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default connect(({ singleSSL, loading }) => ({ singleSSL, loading: loading }))(singleSSL)