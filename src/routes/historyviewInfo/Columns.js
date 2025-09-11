export default  [
    {
      key: 'n_CustomerSeverity',
      dataIndex: 'n_CustomerSeverity',
      width: 100,
      title: '告警级别',
    },
    {
      key: 'oz_AlarmID',
      dataIndex: 'oz_AlarmID',
      width: 170,
      title: '原始序列号',
    },
    {
      key: 'n_AppName',
      dataIndex: 'n_AppName',
      width: 200,
      title: '应用系统名称',
    },
	{
    key: 'nodeAlias',
    dataIndex: 'nodeAlias',
    width: 150,
    title: 'IP地址',
  },
  {
    key: 'node',
    dataIndex: 'node',
    width: 150,
    title: '主机名',
  },
  {
    key: 'n_ComponentType',
    dataIndex: 'n_ComponentType',
    width: 70,
    title: '告警大类',
  },
  {
    key: 'alertGroup',
    dataIndex: 'alertGroup',
    width: 160,
    title: '告警组',
  },
  {
    key: 'n_InstanceID',
    dataIndex: 'n_InstanceID',
    width: 200,
    title: '告警实例',
  },
  {
    key: 'n_ObjectDesCr',
    dataIndex: 'n_ObjectDesCr',
    width: 200,
    title: '告警对象描述',
  },
  {
    key: 'n_SumMaryCn',
    dataIndex: 'n_SumMaryCn',
    width: 300,
    title: '告警描述',
  },
  {
    key: 'firstOccurrence',
    dataIndex: 'firstOccurrence',
    width: 150,
    title: '首次发生时间',
    render: (text, record) => {
      let time = record.firstOccurrence
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
    key: 'lastOccurrence',
    dataIndex: 'lastOccurrence',
    width: 150,
    title: '最后发生时间',
    render: (text, record) => {
      let time = record.lastOccurrence
      return new Date(time).format('yyyy-MM-dd hh:mm:ss')
    },
  },
  {
  	key: 'tally',
  	dataIndex: 'tally',
  	title: '重复次数',
    width: 70,
  },
  {
    key: 'n_RecoverType',
    dataIndex: 'n_RecoverType',
    width: 100,
    title: '是否可恢复',
    render: (text, record) => {
    	let info = ''
			if (text === '0') {
				info = '否'
			} else if (text === '1') {
				info = '是'
			}
			return info
	  },
  },
  {
    key: 'n_MgtOrg',
    dataIndex: 'n_MgtOrg',
    width: 70,
    title: '管理机构',
  },
  {
    key: 'n_OrgName',
    dataIndex: 'n_OrgName',
    width: 70,
    title: '所属机构',
  },
]
