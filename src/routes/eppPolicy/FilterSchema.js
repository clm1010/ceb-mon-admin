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
		key: 'policyName', // 传递给后端的字段名
    title: '策略名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
	},
  {
    key: 'policyType', // 传递给后端的字段名
    title: '策略类型',
    placeholder: '', // 提示语, 可选
    showType: 'select',
    options: [{ key: '1', value: '字符串类型' }, { key: '2', value: '正则类型' }],
  },
  {
    key: 'createdTime',
    title: '是否过期',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'descr', // 传递给后端的字段名
    title: '描述',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
]
