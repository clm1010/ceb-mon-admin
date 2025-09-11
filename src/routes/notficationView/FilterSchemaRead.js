
export default [
  {
    key: 'receiverUserID', // 传递给后端的字段名
    title: '接收人工号',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'AlarmTimeRange',
    title: '告警时间',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    defaultValue:'This',
    options: [
      { key: 'This', value: '本周' },
      { key: 'Last', value: '上周' },
      { key: 'Before-last', value: '上上周' }
    ]
  },
  {
    key: 'isRead', // 传递给后端的字段名
    title: '是否阅读',
    placeholder: '', // 提示语, 可选
    dataType: 'boolean',
    showType: 'select',
    options: [
      { key: 'false', value: '否' },
      { key: 'true', value: '是' }
    ]
  },
  {
    key: 'readChannel', // 传递给后端的字段名
    title: '阅读渠道',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 'UIMP', value: '光大通' },
      { key: 'MUMP', value: '光大家' }
    ]
  }
]
