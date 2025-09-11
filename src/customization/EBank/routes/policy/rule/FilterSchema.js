import fenhang from '../../../../../utils/fenhang'
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
  }, 
  {
    key: 'ruleType', // 传递给后端的字段名
    title: '规则类型',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'select',
    options: [{ key: 'ORDINARY', value: '普通' },{ key: 'DISTRIBUTE', value: '分布式' }],
  }, 
  {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'tags_name', // 传递给后端的字段名
    title: '标签',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'normal',
  }, 
  
]
