
export default [
  {
    key: 'clusters', // 传递给后端的字段名
    title: '集群名',
    placeholder: '集群名', // 提示语, 可选
    dataType: 'string',
    showType: 'normal'
  }, {
    key: 'operator',
    title: '操作',
    dataType: 'string',
    showType: 'select',
    options: [
      { key: 'EQUAL', value: '=' },
      { key: 'NOT_EQUAL', value: '!=' },
      { key: 'GREATER_THAN', value: '>' },
      { key: 'GREATER_THAN_OR_EQUAL', value: '>=' },
      { key: 'LESS_THAN', value: '<' },
      { key: 'LESS_THAN_OR_EQUAL', value: '<=' },
    ],
  }, {
    key: 'ruleStatus',
    title: '规则状态',
    dataType: 'string',
    showType: 'select',
    options: [
      { key: 'ISSUED', value: '下发' },
      { key: 'CREATE', value: '新增' },
      { key: 'OFFLINE', value: '下线' },
    ],
  }, {
    key: 'serviceType',
    title: '服务类型',
    dataType: 'string',
    showType: 'normal',
  }

]
