export default [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'category', // 传递给后端的字段名category
    title: '类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    dataType: 'string',
    showType: 'select',
    options: [
      { key: 'STANDARD', value: '标准指标' },
      { key: 'SPECIAL', value: '个性化指标' },
      { key: 'RATIO', value: '同环指标' },
      { key: 'AGGREGATION', value: '全域指标汇聚' }
    ],
  }, 
  {
    key: 'namespace', // 传递给后端的字段名
    title: '命名空间',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'service', // 传递给后端的字段名
    title: '服务',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'indicator', // 传递给后端的字段名
    title: '指标',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }
]
