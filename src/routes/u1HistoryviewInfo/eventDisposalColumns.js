export default  [
	{
		title: '处理时间',
	  	dataIndex: 'chrOno',
	  	key: '1',
	  	render: (text, record) => {
      	let time = record.chrOno
		let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
		return createdTime
	},
	}, {
		title: '描述',
	  	dataIndex: 'text1',
	  	key: '2',
	},
]
