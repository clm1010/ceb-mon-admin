import '../chd/alarm.css'
import { Table, Tooltip } from 'antd'

const dashboardAlarm = ({dataSource, paginationAlarm, loading}) => {
	const alarmColumns = [
		{
			key: 'firstOccurrence',
		    dataIndex: 'firstOccurrence',
		    title: '发生时间',
		    width: 320,
		    render: (text, record) => {
		    	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
		    },
		}, {
			key: 'n_CustomerSeverity',
			dataIndex: 'n_CustomerSeverity',
			title: '告警级别',
			width: 200,
			render: (text, record) => {
				let n_CustomerSeverity = '未知'
			  	if (text === 1) {
			  		n_CustomerSeverity = '一级故障'
			  	} else if (text === 2) {
			  		n_CustomerSeverity = '二级告警'
			  	} else if (text === 3) {
			  		n_CustomerSeverity = '三级预警'
			  	} else if (text === 4) {
			  		n_CustomerSeverity = '四级提示'
			  	} else if (text === 100) {
			  		n_CustomerSeverity = '五级信息'
			  	}
			  	return n_CustomerSeverity
			},
		}, {
			key: 'n_SumMaryCn',
		    dataIndex: 'n_SumMaryCn',
		    title: '告警描述',
		    render: (text, record) => {
		    	return <Tooltip title={`最后发生时间：${new Date(record.lastOccurrence).format('yyyy-MM-dd hh:mm:ss')}`}>{(record.severity === '0' ? '恢复: ' : '未恢复: ') + text }</Tooltip>
		    }
		},
	]

	return (
  	<div className="content-inner1">
	    <Table
	      	dataSource={dataSource}
	      	bordered
	      	loading={loading}
	      	columns={alarmColumns}
	      	size="small"
	      	pagination={paginationAlarm}
	      	rowClassName={(record) => {
		        	let bgcolor = 'white test'
						if (record.severity == '0') {
						  	if (record.acknowledged === '1') {
						  	    bgcolor = 'ack_green test'
						  	} else {
								bgcolor = 'green test'
							}
						} else if (record.severity == '1') {
							if (record.acknowledged === '1') {
						  	    bgcolor = 'ack_purple test'
						  	} else {
								bgcolor = 'purple test'
							}
						} else if (record.severity == '2') {
							if (record.acknowledged === '1') {
						  	    bgcolor = 'ack_blue test'
						  	} else {
								bgcolor = 'blue test'
							}
						} else if (record.severity == '3') {
							if (record.acknowledged === '1') {
						  	    bgcolor = 'ack_yellow test'
						  	} else {
								bgcolor = 'yellow test'
							}
						} else if (record.severity == '4') {
							if (record.acknowledged === '1') {
						  	    bgcolor = 'ack_orange test'
						  	} else {
								bgcolor = 'orange test'
							}
						} else if (record.severity == '5') {
							if (record.acknowledged === '1') {
						  	   	bgcolor = 'ack_red test'
						  	} else {
								bgcolor = 'red test'
							}
						}
						return bgcolor
		        }}
	    />
	  	</div>
	)
}

export default dashboardAlarm