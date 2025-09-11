import React from 'react'
import { Tooltip } from 'antd'

export default [
	{
		title: '序列号',
		dataIndex: 'alarmId',
		key: '1',
	}, {
		title: '发送人',
		dataIndex: 'sender',
		key: '2',
	}, {
		key: 'receiverUserName',
		dataIndex: 'receiverUserName',
		title: '接收人',
	},
	{
		key: 'notificationType',
		dataIndex: 'notificationType',
		title: '通知方式',
		width: 75,
	},
	{
		key: 'receiver',
		dataIndex: 'receiver',
		title: '联系电话',
	}, {
		title: '创建时间',
		dataIndex: 'createdTime',
		key: '4',
		render: (text, record) => {
			let time = record.createdTime
			let createdTimes = new Date(time).format('yyyy-MM-dd hh:mm:ss')
			return createdTimes
		},
	}, {
		title: '内容',
		dataIndex: 'content',
		key: '5',
		width: 660,
		render: (text, record) => {
			return <Tooltip title={text}>{text}</Tooltip>
		},
	},
]
