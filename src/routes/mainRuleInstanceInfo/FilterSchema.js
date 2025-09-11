export default  [
  	{
    		key: 'name', // 传递给后端的字段名
    		title: '维护期名',
    		placeholder: '请输入维护期名', // 提示语, 可选
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
  	{
		key: 'isLevel', // 传递给后端的字段名
		title: '高级搜索',
		dataType: 'int',
		showType: 'checkbox',
		options: [{ key: '1', value: '', onchange: 'typeChange' }],
	  },
]
