import fenhang from '../../utils/fenhang'
export default  [
  {
    key: 'eppKey', // 传递给后端的字段名
    title: 'epp_key',
    placeholder: 'epp实例的键值', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
		key: 'branch', // 传递给后端的字段名
		title: '机构',
		placeholder: '', // 提示语, 可选
		dataType: 'string',
		showType: 'select',
		options: fenhang,
	},
  {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2024-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2024-12-01 22:33:44',
  },
  {
    key: 'updatedTime',
    title: '修改时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2024-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2024-12-01 22:33:44',
  },
]
