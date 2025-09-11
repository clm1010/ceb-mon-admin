export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '模板名称', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
]
