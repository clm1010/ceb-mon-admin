export default  [
	{
	  title: '应用系统名称',
	  dataIndex: 'affectSystem',
	  key: 'affectSystem',
	}, {
	  title: '应用管理员A',
	  dataIndex: 'applicateManagerA',
	  key: 'applicateManagerA',
	}, {
	  title: '应用管理员A工号',
	  dataIndex: 'applicateManagerAID',
	  key: 'applicateManagerAID',
	},
		{
	  title: '应用管理员B',
	  dataIndex: 'applicateManagerB',
	  key: 'applicateManagerB',
	}, {
	  title: '应用管理员B工号',
	  dataIndex: 'applicateManagerBID',
	  key: 'applicateManagerBID',
	}, {
	  title: '机构信息',
	  dataIndex: 'branch',
	  key: 'branch',
	},
		{
	  title: '业务部门',
	  dataIndex: 'businessDepartment',
	  key: 'businessDepartment',
	}, {
	  title: '业务部门ID',
	  dataIndex: 'businessDepartmentID',
	  key: 'businessDepartmentID',
	},{
		title: '应用联系人',
		dataIndex: 'appContacts',
		key: 'appContacts',
	  }, {
	  title: '业务功能介绍',
	  dataIndex: 'businessIntroduction',
		key: 'businessIntroduction',
		width: 1000,
	},	{
	  title: '业务管理员',
	  dataIndex: 'businessManager',
	  key: 'businessManager',
	}, {
	  title: '业务管理员工号',
	  dataIndex: 'businessManagerID',
	  key: 'businessManagerID',
	}, {
	  title: '应用系统ID',
	  dataIndex: 'c1',
	  key: 'c1',
	}, {
	  title: '容量类型',
	  dataIndex: 'capType',
	  key: 'capType',
	},
	{
	  title: '创建人',
	  dataIndex: 'createdBy',
	  key: 'createdBy',
	}, {
	  title: '创建时间',
	  dataIndex: 'createdTime',
		key: 'createdTime',
		render: (text, record) => {
    	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
	}, {
	  title: 'DBA',
	  dataIndex: 'dba',
	  key: 'dba',
	},
		{
	  title: 'DBAB',
	  dataIndex: 'dbaB',
	  key: 'dbaB',
	}, {
	  title: 'DBAB工号',
	  dataIndex: 'dbaBID',
	  key: 'dbaBID',
	}, {
	  title: 'DBA工号',
	  dataIndex: 'dbaID',
	  key: 'dbaID',
	},	{
	  title: '应用系统编码',
	  dataIndex: 'englishCode',
	  key: 'englishCode',
	}, {
	  title: '是否核心系统',
	  dataIndex: 'isCoreSystem',
	  key: 'isCoreSystem',
	}, {
	  title: '是否重要系统',
	  dataIndex: 'isImportant',
	  key: 'isImportant',
	}, {
	  title: '是否关键系统',
	  dataIndex: 'isKey',
	  key: 'isKey',
	},
	{
	  title: '中间件管理员',
	  dataIndex: 'middlewareManager',
	  key: 'middlewareManager',
	}, {
	  title: '中间件管理员B',
	  dataIndex: 'middlewareManagerB',
	  key: 'middlewareManagerB',
	}, {
	  title: '中间件管理员B工号',
	  dataIndex: 'middlewareManagerBID',
	  key: 'middlewareManagerBID',
	},
		{
	  title: '中间件管理员工号',
	  dataIndex: 'middlewareManagerID',
	  key: 'middlewareManagerID',
	}, {
	  title: '网络域',
	  dataIndex: 'networkDomain',
	  key: 'networkDomain',
	}, {
	  title: '上线时间',
	  dataIndex: 'onlineDate',
		key: 'onlineDate',
		render: (text, record) => {
			if(text){
				let onData = Number( text + "000" ) 
				return new Date(onData).format('yyyy-MM-dd hh:mm:ss')
			}
    },
	},	{
	  title: '操作管理员',
	  dataIndex: 'operateManager',
	  key: 'operateManager',
	}, {
	  title: '操作管理员工号',
	  dataIndex: 'operateManagerID',
	  key: 'operateManagerID',
	}, {
	  title: '项目经理',
	  dataIndex: 'pm',
	  key: 'pm',
	}, {
	  title: '项目经理工号',
	  dataIndex: 'pmID',
	  key: 'pmID',
	},
	{
	  title: '质量管理员',
	  dataIndex: 'qualityManager',
	  key: 'qualityManager',
	}, {
	  title: '质量管理员ID',
	  dataIndex: 'qualityManagerID',
	  key: 'qualityManagerID',
	}, {
	  title: '系统使用范围',
	  dataIndex: 'scope',
	  key: 'scope',
	},
		{
	  title: '安全等级',
	  dataIndex: 'securityLevel',
	  key: 'securityLevel',
	}, {
	  title: '服务器等级',
	  dataIndex: 'serverLevel',
	  key: 'serverLevel',
	}, {
	  title: '使用状态',
	  dataIndex: 'status',
	  key: 'status',
	},	{
	  title: '存储管理员',
	  dataIndex: 'storeManager',
	  key: 'storeManager',
	}, {
	  title: '存储管理员工号',
	  dataIndex: 'storeManagerID',
	  key: 'storeManagerID',
	}, {
	  title: '系统编码',
	  dataIndex: 'systemCode',
	  key: 'systemCode',
	}, {
	  title: '系统等级',
	  dataIndex: 'systemLevel',
	  key: 'systemLevel',
	},
	{
	  title: '测试系统管理员',
	  dataIndex: 'systemManager',
	  key: 'systemManager',
	}, {
	  title: '系统管理员A',
	  dataIndex: 'systemManagerA',
	  key: 'systemManagerA',
	}, {
	  title: '系统管理员A工号',
	  dataIndex: 'systemManagerAID',
	  key: 'systemManagerAID',
	},
		{
	  title: '系统管理员B',
	  dataIndex: 'systemManagerB',
	  key: 'systemManagerB',
	}, {
	  title: '系统管理员B工号',
	  dataIndex: 'systemManagerBID',
	  key: 'systemManagerBID',
	}, {
	  title: '系统管理员工号',
	  dataIndex: 'systemManagerID',
	  key: 'systemManagerID',
	},	{
	  title: '系统名称',
	  dataIndex: 'systemName',
	  key: 'systemName',
	}, {
	  title: '功能表转化系数',
	  dataIndex: 'transferCoefficient',
	  key: 'transferCoefficient',
	}, {
	  title: '更新人',
	  dataIndex: 'updatedBy',
	  key: 'updatedBy',
	}, {
	  title: '更新时间',
	  dataIndex: 'updatedTime',
		key: 'updatedTime',
		render: (text, record) => {
    	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
    },
	},

]
