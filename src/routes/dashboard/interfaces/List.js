import React from 'react'
import { Table, Spin } from 'antd'
const list = ({
 dispatch, loading, location, list, pagination, sql, tableState,
}) => {
	const columns = [
		{
			title: '设备名称',
			dataIndex: 'name',
			width: 150,
			key: 'name',
			render: (text, record) => {
				return <div title={text} style={{ float: 'left' }}>{text}</div>
			},
		}, {
			title: '设备类型',
			dataIndex: 'type',
			width: 60,
			key: 'type',
			render: (text, record) => {
				let secondClass = '未知'
				if (record.secondClass === 'ROUTER') {
					secondClass = '路由器'
				} else if (record.secondClass === 'SWITCH') {
					secondClass = '交换机'
				} else if (record.secondClass === 'FIREWALL') {
					secondClass = '防火墙'
				} else if (record.secondClass === 'F5') {
					secondClass = '负载均衡'
				}
				return <div style={{ float: 'left' }}>{secondClass}</div>
			},
		}, {
			title: '基础信息',
			dataIndex: 'details',
			width: 240,
			key: 'details',
			render: (text, record) => {
				return <div title={`${record.mngtOrg}_${record.appName}_${record.discoveryIP}_${record.firstSecArea}_${record.vendor}`} style={{ float: 'left' }}>{`${record.mngtOrg}_${record.appName}_${record.discoveryIP}_${record.firstSecArea}_${record.vendor}`}</div>
			},
		},
	]
	const onRowDoubleClick = (record) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				currentItem: record,
			},
		})
		dispatch({
			type: 'interfaces/queryInterfaceNums',
			payload: {
				keyword: record.keyword,
				uuid: record.uuid,
			},
		})
	}
	const onPageChangeList = (page) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				tableState: true,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q: sql,
			},
		})
	}
	return (
  <Spin size="default" tip="正在为您加载表格数据,请稍后..." spinning={tableState}>
    <Table
      showHeader
      columns={columns}
      onRowDoubleClick={onRowDoubleClick}
      bordered
      dataSource={list}
      size="small"
      loading={loading}
      onChange={onPageChangeList}
      pagination={pagination}
      rowKey={record => record.uuid}
    />
  </Spin>
	)
}
export default list
