export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '标签名称',
    placeholder: '标签名称', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, 
  {
    key: 'key', // 传递给后端的字段名
    title: '标签健',
    placeholder: '标签健', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'value', // 传递给后端的字段名
    title: '标签值',
    placeholder: '标签值', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'enabled',
    title: '是否启用',
    dataType: 'boolean',
    showType: 'radio',
    options: [{ key: 'true', value: '是' }, { key: 'false', value: '否' }],
    defaultValue: 'true',
  },
]
