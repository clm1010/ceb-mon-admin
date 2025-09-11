import { Link } from 'dva/router'
export default  [
		{
			title: 'ID',
			dataIndex: 'uuid',
			key: 'uuid',
		}, {
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
			render: (text, record, index) => {
				return <a href="/Object/objectSwitch">{text}</a>
				//return <Link onClick={e => openPolicyModal(record, e)}>{text}</Link>
			},
		}, {
			title: '关联策略实例数量',
			dataIndex: 'policyInstances',
			key: 'policyInstances',
			render: (text, record, index) => {
				return <Link to={`/policy/instanceDescription/${record.uuid}`}>{text}</Link>
			},
		}, {
			title: '关联监控对象数量',
			dataIndex: 'mos',
			key: 'mos',
			render: (text, record, index) => {
				return <Link to="/Object/objectSwitch">{text}</Link>
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
