import { Table } from 'antd'
import './List.css'
const List = ({
 dispatch, dataSource, pagination, q, loading,
}) => {
	const columns = [
		{
			key: 'firstOccurrence',
		    dataIndex: 'firstOccurrence',
		    title: '发生时间',
		    width: 320,
		    render: (text, record) => {
		    	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
		    },
		}, {
			key: 'n_SumMaryCn',
		    dataIndex: 'n_SumMaryCn',
		    title: '告警描述',
		},
	]

	const onPageChange = (page) => {
      	dispatch({
	      	type: 'faultList/query',
	      	payload: {
	      		page: page.current - 1,
	        	pageSize: page.pageSize,
	        	q: q === undefined ? '' : q,
	      	},
      	})
	}
	return (
  <Table
    bordered
    columns={columns}
    dataSource={dataSource}
    loading={loading}
    onChange={onPageChange}
    pagination={pagination}
    simple
    rowKey={record => record.oz_AlarmID}
    size="small"
		/>
	)
}

export default List
