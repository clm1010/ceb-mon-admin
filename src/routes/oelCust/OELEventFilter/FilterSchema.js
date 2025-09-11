export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'isGlobal', // 传递给后端的字段名
    title: '类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
	options: [{ key: 'true', value: 'Global' }, { key: 'false', value: 'Private' }],
  },
]
