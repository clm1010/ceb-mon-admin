	export default  [
		//{
		//	title: 'ID',
		//	dataIndex: 'uuid',
		//	key: 'uuid',
		//},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',
		}, {
			title: '指标',
			dataIndex: 'stdIndicator ',
			key: 'stdIndicator ',
			render: (text, record, index) => {
				let val = ''
				if (record.stdIndicator && record.stdIndicator.name) {
					val = record.stdIndicator.name
				}
				return val
			},
		}, /*{
			title: '对象特征',
			dataIndex: 'moFilter',
			key: 'moFilter',
		},*/{
			title: 'Item 类型',
			dataIndex: 'itemType',
			key: 'itemType',
		}, /*{

			title: '公式',
			dataIndex: 'formula',
			key: 'formula'
		},*/{
			title: '分组',
			dataIndex: 'group',
			key: 'group',
			render: (text, record, index) => {
				let tempval = ''
				if (text && text.length > 0) {
					text.forEach((val) => {
						if (tempval === '') {
							tempval = val.name
						} else {
							tempval = `${tempval},${val.name}`
						}
					})
				}
				return tempval
			},
		}, {
			title: '创建者',
			dataIndex: 'createdBy',
			key: 'createdBy',
		}, {
			title: '创建时间',
			dataIndex: 'createdTime',
			key: 'createdTime',
			render: (text, record, index) => {
				return new Date(text).format('yyyy-MM-dd hh:mm:ss')
			},
		}, {
			title: '最后更新者',
			dataIndex: 'updatedBy',
			key: 'updatedBy',
		}, {
			title: '最后更新时间',
			dataIndex: 'updatedTime',
			key: 'updatedTime',
			render: (text, record, index) => {
				return new Date(text).format('yyyy-MM-dd hh:mm:ss')
			},
		}, /*{
			title: '操作',
			key: 'operation',
			fixed: 'right',
			width: 30,
			render: (text, record) => {
				return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
			},
		},*/
	]
