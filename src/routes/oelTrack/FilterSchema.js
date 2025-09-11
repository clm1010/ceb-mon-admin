export default  [
  {
    key: 'n_CustomerSeverity', // 传递给后端的字段名
    title: '级别',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'nodeAlias', // 传递给后端的字段名
    title: 'IP地址',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'n_AppName',
    title: '应用系统',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'n_ComponentType',
    title: '告警大类',
    dataType: 'varchar',
    showType: 'normal',
  },
]
