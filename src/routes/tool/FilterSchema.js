export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: 'Zabbix实例名', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'url', // 传递给后端的字段名
    title: 'URL',
    placeholder: 'URL', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'username', // 传递给后端的字段名
    title: '用户名',
    placeholder: '用户名', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'tags_name', // 传递给后端的字段名
    title: '标签',
    placeholder: '标签', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'toolType', // 传递给后端的字段名
    title: '工具类型',
    placeholder: '工具类型', // 提示语, 可选
    showType: 'select',
    options: [{ key: 'ZABBIX', value: 'Zabbix' }, { key: 'NANTIAN_ZABBIX', value: '非网络域Zabbix' },
     { key: 'ITM', value: 'ITM' }, { key: 'OVO', value: 'OVO' }, 
     { key: 'NAGIOS', value: 'Nagios' }, { key: 'PROMETHEUS', value: 'Prometheus' }, { key: 'ZABBIX_PROXY', value: '主机监控代理' }],
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
    key: 'updatedTime',
    title: '修改时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
]
