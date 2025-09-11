import fenhang from '../../../../../utils/fenhang'
export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '实例名称',
    dataType: 'varchar',
    showType: 'normal',
  }, {
  	key: 'rule_name', //instance.rule.name
    title: '策略规则名称',
    dataType: 'string',
    showType: 'normal',
  }, {
  	key: 'policy_name', //instance.mo.name
    title: '策略实例名称',
    dataType: 'string',
    showType: 'normal',
  }, {
  	key: 'mo_name', //instance.mo.name
    title: '监控对象名称',
    dataType: 'string',
    showType: 'normal',
  }, {
  	key: 'mo_ip', //instance.mo.name
    title: '监控对象IP',
    dataType: 'string',
    showType: 'normal',
  }, {
			key: 'branch', // 传递给后端的字段名
			title: '分支机构',
			placeholder: '', // 提示语, 可选
			dataType: 'string',
			showType: 'select',
			options: fenhang,
	}, {
    key: 'issueStatus',
    title: '下发状态',
    dataType: 'string',
    showType: 'select',
    options: [{ key: 'SUCCESS', value: '已下发' }, { key: 'FAILURE', value: '下发失败' }, { key: 'UNISSUED', value: '未下发' }, { key: 'OTHER', value: '其他' }],
  }, {
    key: 'createdFrom',
    title: '创建方式',
    dataType: 'string',
    showType: 'select',
    options: [{ key: 'MANUAL', value: '手工' }, { key: 'INSTANTIATION', value: '实例化' }, { key: 'OTHER', value: '其他' }],
  }, {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },

//{
//  key: 'updatedTime',
//  title: '修改时间',
//  dataType: 'datetime',  // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
//  showType: 'between',
//  defaultValueBegin: '2016-01-01 12:34:56',  // 注意日期类型defaultValue的格式
//  defaultValueEnd: '2016-12-01 22:33:44',
//},
]
