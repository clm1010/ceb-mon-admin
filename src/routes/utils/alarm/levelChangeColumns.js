import React from 'react'
import { Badge } from 'antd'

export default  [
	{
		title: '开始时间',
	  	dataIndex: 'startDate',
	  	key: '1',
	  	render: (text, record) => {
	      	let time = record.startDate
			let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
			return createdTime
		},
	}, {
		title: '结束时间',
	  	dataIndex: 'endDate',
	  	key: '2',
	  	render: (text, record) => {
	  		if (record.endDate === undefined) {
	  			return '至今'
	  		}
	  			let time = record.endDate
				let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
				return createdTime
		},
	}, {
		title: '状态',
	  	dataIndex: 'severity',
	  	key: '3',
	  	render: (text, record) => {
	  		let info = ''
	  		if (text === '0') {
	  			info = <div><Badge status="success" />恢复</div>
	  		} else {
	  			info = <div><Badge status="error" />故障</div>
	  		}
	  		return info
	  	},
	},
]
