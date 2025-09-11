export default  [
  /*{
    key: 'uuid',  // 传递给后端的字段名
    title: 'ID',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },*/
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'filters.filterItems.value', // 传递给后端的字段名
    title: 'objbectID',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'formula', // 传递给后端的字段名
    title: 'SNMP OID',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'moFilter', // 传递给后端的字段名
    title: '对象特征',
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'createdBy', // 传递给后端的字段名
    title: '创建者',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'itemType', // 传递给后端的字段名
    title: 'Item 类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
  options: [{ key: 'ZABBIX_SNMP', value: 'Zabbix SNMP' },
            { key: 'ZABBIX_AGENT', value: 'Zabbix Agent' }, 
            { key: 'ZABBIX_CALCULATED', value: 'Zabbix Calculated' },
            { key: 'ZABBIX_AGENT_ACTIVE', value: 'Zabbix Agent Active' },
            { key: 'ZABBIX_TRAPPER', value: 'Zabbix Trapper' },
            { key: 'ZABBIX_JMX', value: 'Zabbix JMX' },
            { key: 'ZABBIX_IPMI', value: 'Zabbix IPMI' },
            { key: 'SYSLOG_EPP', value: 'Syslog Epp' },
            { key: 'PROMETHEUS', value: 'PROMETHEUS' },
            { key: 'PROMETHEUS_RECORD', value: 'Prometheus Record Rule' }],
  }, 
  {
    key: 'filters_filterItems_value---', // 传递给后端的字段名
    title: 'objbectID(精确)',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },{
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  }, {
    key: 'updatedTime',
    title: '修改时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'stdIndicator_name', // 传递给后端的字段名
    title: '指标名',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
]
