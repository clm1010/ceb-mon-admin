export default  [
//		{
//			title: 'ID',
//			dataIndex: 'uuid',
//			key: 'uuid',
//		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '值类型',
			dataIndex: 'dataType',
			key: 'dataType',
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',
		}, {
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
			title: '单位',
			dataIndex: 'unit',
			key: 'unit',
		}, {
			title: '关联策略模板数量',
			dataIndex: 'policyTemplates',
			key: 'policyTemplates',
		}, {
			title: '关联策略实例数量',
			dataIndex: 'policyInstances',
			key: 'policyInstances',
		}, {
			title: '关联监控对象数量',
			dataIndex: 'mos',
			key: 'mos',
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
		},
	]
