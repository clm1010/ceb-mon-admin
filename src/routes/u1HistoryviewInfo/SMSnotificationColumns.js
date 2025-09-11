export default  [
	{
		title: '序列号',
	  	dataIndex: 'alarmId',
	  	width: 150,
	  	key: '1',
	}, {
		title: '发送人',
	  	dataIndex: 'sender',
	  	width: 100,
	  	key: '2',
	}, {
		title: '接收人',
	  	dataIndex: 'receiverUserName',
	  	width: 100,
	  	key: '2',
	}, {
		title: '发送手机号',
	  	dataIndex: 'receiver',
	  	width: 100,
	  	key: '3',
	}, {
		title: '创建时间',
	  	dataIndex: 'createdTime',
	  	width: 201,
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
	},
]
