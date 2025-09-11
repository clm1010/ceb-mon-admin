import fenhang from './../../utils/fenhang'
export default  [
	{
		key: 'appName',
		title: '应用系统',
		placeholder: '请输入应用系统',
		dataType: 'varchar',
		showType: 'transformAsySelect',
	},
	{
		key: 'name', // 传递给后端的字段名
		title: '维护期名',
		placeholder: '请输入维护期名', // 提示语, 可选
		dataType: 'varchar',
		showType: 'normal',
	},
	{
		key: 'uuid', // 传递给后端的字段名
		title: '维护期id',
		placeholder: '请输入维护期uuid', // 提示语, 可选
		dataType: 'varchar',
		showType: 'normal',
	},
	{
		key: 'tpe',
		title: '类型',
		dataType: 'string',
		showType: 'select',
		defaultValue: 'NON_PERIODIC',
		options: [{ key: 'PERIODIC', value: '周期' }, { key: 'NON_PERIODIC', value: '非周期' }],
	},
	{
		key: 'ticket',
		title: '变更号',
		dataType: 'string',
		showType: 'normal',
	},
	{
		key: 'applicant', // 传递给后端的字段名
		title: '申请人',
		placeholder: '申请人工号', // 提示语, 可选
		dataType: 'varchar',
		showType: 'normal',
	},
	{
		key: 'branch', // 传递给后端的字段名
		title: '适用范围',
		placeholder: '', // 提示语, 可选
		dataType: 'string',
		showType: 'select',
		options: fenhang,
	},
	{
		key: 'correlationFeature',
		title: '关联特征',
		dataType: 'string',
		showType: 'normal',
	},
	{
		key: 'createdBy',
		title: '创建人',
		placeholder: '请输入创建人', // 提示语, 可选
		dataType: 'string',
		showType: 'normal',
	},
	{
		key: 'createdTime',
		title: '创建时间',
		dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
		showType: 'between',
	},
	{
		key: 'state', // 传递给后端的字段名
		title: '维护期状态',
		dataType: 'string',
		showType: 'select',
		defaultValue:'ACTIVE',
		options: [{ key: 'TO_REVIEW', value: '待复核' }, { key: 'REVIEW_REJECTED', value: '复核未通过' },
		{ key: 'ACTIVE', value: '生效' }, { key: 'OVERDUE', value: '已过期' },{ key: 'INACTIVE', value: '禁用' }],
	},
	{
		key: 'accurate',
		title: '应用系统精确查找',
		dataType: 'varchar',
		showType: 'radio',
		defaultValue: 'true',
		options: [{ key: 'true', value: '是' }, { key: 'false', value: '否' }],
	},
	{
		key: 'content----',
		title: '条件查询',
		dataType: 'string',
		showType: 'normalCondition',
	},
	{
		key: 'accurate----',
		title: '精确IP查询',
		dataType: 'string',
		showType: 'normal',
	},
]
