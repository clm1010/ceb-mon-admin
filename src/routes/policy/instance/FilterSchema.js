import fenhang from '../../../utils/fenhang'
export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '策略名称', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
			key: 'branch', // 传递给后端的字段名
			title: '分支机构',
			placeholder: '', // 提示语, 可选
			dataType: 'string',
			showType: 'select',
			options: fenhang,
	}, {
    key: 'policyType',
    title: '策略类型',
    dataType: 'string',
    showType: 'select',
    options: [{ key: 'NORMAL', value: 'NORMAL' }, { key: 'PING', value: 'PING' }, { key: 'RPING', value: 'RPING' }, { key: 'SYSLOG', value: 'SYSLOG' }, { key: 'OTHER', value: 'OTHER' }],
  }, {
    key: 'createdFrom',
    title: '策略来源',
    dataType: 'string',
    showType: 'select',
    options: [{ key: 'FROM_TEMPLATE', value: '实例化' }, { key: 'MANUAL', value: '手工' }, { key: 'ITM', value: 'ITM' }, { key: 'OVO', value: 'OVO' }, { key: 'NAGIOS', value: 'NAGIOS' }, { key: 'OTHER', value: '其他' }],
  }, {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  }, {
    key: 'isStd',
    title: '是否标准',
    dataType: 'boolean',
    showType: 'radio',
    options: [{ key: 'true', value: '是' }, { key: 'false', value: '否' }],
    defaultValue: '是',
  },

]
