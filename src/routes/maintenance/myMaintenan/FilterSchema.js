import fenhang from '../../../utils/fenhang'
export default  [
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
		key: 'state', // 传递给后端的字段名
		title: '维护期状态',
		dataType: 'string',
		showType: 'select',
		options: [{ key: 'TO_REVIEW', value: '待复核' }, { key: 'REVIEW_REJECTED', value: '复核未通过' },
		{ key: 'ACTIVE', value: '生效' }, { key: 'OVERDUE', value: '已过期' },],
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
		key: 'createdBy',
		title: '创建人',
		placeholder: '请输入创建人', // 提示语, 可选
		dataType: 'string',
		showType: 'normal',
	},
]
