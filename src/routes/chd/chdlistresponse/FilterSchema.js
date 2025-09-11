export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '请输入发现配置名', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'cfgType',
    title: '类型',
    dataType: 'int',
    showType: 'select', // 下拉框选择, antd版本升级后, option的key要求必须是string, 否则会有个warning, 后端反序列化时要注意
    options: [{ key: '1', value: 'SNMP' }, { key: '2', value: 'Zabbix Agent' }],
    defaultValue: '1', // 这个defaultValue必须和options中的key是对应的
  },
  {
    key: 'ipRange', // 传递给后端的字段名
    title: '地址范围',
    placeholder: '如:6.3.1.0/24', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'status',
    title: '状态',
    dataType: 'int',
    showType: 'select', // 下拉框选择, antd版本升级后, option的key要求必须是string, 否则会有个warning, 后端反序列化时要注意
    options: [{ key: '1', value: '未同步' }, { key: '2', value: '已同步' }],
    defaultValue: '1', // 这个defaultValue必须和options中的key是对应的
  },
  {
    key: 'pollInterval',
    title: '轮询间隔',
    placeholder: '单位为秒',
    dataType: 'int',
    defaultValue: 18,
    // 对于数字类型(int/float), 可以配置max/min
    min: 0,
    max: 99,
  },
  {
    key: 'port',
    title: '端口号',
    placeholder: '',
    dataType: 'int',
    defaultValue: 18,
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
  }, {
    key: 'activated',
    title: '是否激活',
    dataType: 'int',
    showType: 'select', // 下拉框选择, antd版本升级后, option的key要求必须是string, 否则会有个warning, 后端反序列化时要注意
    options: [{ key: '1', value: '已激活' }, { key: '2', value: '未激活' }],
    defaultValue: '1', // 这个defaultValue必须和options中的key是对应的
  },
]
