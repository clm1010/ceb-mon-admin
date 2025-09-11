export default  [
  {
    key: 'appName',
    title: '关键字',
    placeholder: '请输入',
    dataType: 'varchar',
    showType: 'querySelect',
    options: [],
  },
  {
    key: 'discoverIP',
    title: 'IP地址',
    placeholder: '请输入',
    dataType: 'varchar',
    showType: 'noraml',
    options: [],
  },
  {
    key: 'percent',
    title: '权重占比',
    placeholder: '请选择',
    dataType: 'varchar',
    min: 0,
    max: 100,
    showType: 'inputNumber',
  },
]
