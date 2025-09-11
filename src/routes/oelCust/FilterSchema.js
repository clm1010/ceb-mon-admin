import {genFilterDictOptsByName} from "../../utils/FunctionTool";

export default  [
  /*
  {
    key: 'FirstOccurrence',
    title: '发生时间',
    dataType: 'datetime',  // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56',  // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  */
 {
  key: 'NodeAlias', // 传递给后端的字段名
  title: 'IP',
  placeholder: '请输入IP', // 提示语, 可选
  dataType: 'varchar',
  showType: 'normal',
},
{
  key: 'N_AppName', // 传递给后端的字段名
  title: '系统名称',
  placeholder: '系统名称', // 提示语, 可选
  dataType: 'varchar',
  showType: 'normal',
},
  {
    key: 'N_RecoverType', // 传递给后端的字段名
    title: '可恢复',
    placeholder: '状态', // 提示语, 可选
    dataType: 'int',
    showType: 'select',
    options: genFilterDictOptsByName('alarmRecoveryStatus','int'),
      // { key: 0, value: '不可恢复' },
      // { key: 1, value: '可恢复' },

  },
  /*
  {
    key: 'Acknowledged',  // 传递给后端的字段名
    title: '状态',
    placeholder: '状态',  // 提示语, 可选
    dataType: 'int',
    showType: 'select',
    options: [
      { key: 0, value: '未接管' },
      { key: 1, value: '已接管' },
    ]
  },
  */
  {
    key: 'N_MaintainStatus', // 传递给后端的字段名
    title: '维护期',
    placeholder: '维护期', // 提示语, 可选
    dataType: 'number',
    showType: 'multiSelect',
    options:genFilterDictOptsByName('maintenance','int'),
    //   [
		// 	{ key: 0, value: '维护期无关' },
    // 	{ key: 1, value: '在维护期' },
    // 	{ key: 2, value: '出维护期' },
    // ],
  },
  {
    key: 'ISRECOVER', // 传递给后端的字段名
    title: '是否恢复',
    placeholder: '状态', // 提示语, 可选
    dataType: 'int',
    showType: 'select',
    options: genFilterDictOptsByName('isRecovery','int'),
    //   [
    //   { key: 0, value: '已恢复' },
    //   { key: 1, value: '未恢复' },
    // ],
  },
  /*
  {
    key: 'Severity',  // 传递给后端的字段名
    title: '是否恢复',
    placeholder: '未恢复告警',  // 提示语, 可选
    dataType: 'number',
    showType: 'multiSelect',
    options: [
      {key:0, value: '已恢复'},
			{key:1, value: '五级未恢复'},
		  {key:2, value: '四级未恢复'},
		  {key:3, value: '三级未恢复'},
		  {key:4, value: '二级未恢复'},
		  {key:5, value: '一级未恢复'},
    ]
  },
  */
  {
    key: 'N_CustomerSeverity', // 传递给后端的字段名
    title: '事件级别',
    placeholder: '事件级别', // 提示语, 可选
    dataType: 'number',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('alertLevel','int'),
    //   [
		// 	{ key: 1, value: '一级故障' },
		//   { key: 2, value: '二级告警' },
		//   { key: 3, value: '三级预警' },
		//   { key: 4, value: '四级提示' },
		//   { key: 100, value: '五级信息' },
    // ],
  },
  {
    key: 'N_ComponentType', // 传递给后端的字段名
    title: '告警分类',
    placeholder: '告警分类', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('appType','string'),
    //   [
		// 	{ key: '操作系统', value: '操作系统' },
		//   { key: '数据库', value: '数据库' },
		//   { key: '中间件', value: '中间件' },
		//   { key: '存储', value: '存储' },
    //   { key: '硬件', value: '硬件' },
    //   { key: '应用', value: '应用' },
		//   { key: '安全', value: '安全' },
		//   { key: '网络', value: '网络' },
		//   { key: '自检', value: '自检' },
    //   { key: '机房环境', value: '机房环境' },
    //   { key: '私有云', value: '私有云' },
		//   { key: '桌面云', value: '桌面云' },
    // ],
  },
  /*
  {
    key: 'N_EventStatus',  // 传递给后端的字段名
    title: '告警状态',
    placeholder: '告警状态',  // 提示语, 可选
    dataType: 'number',
    showType: 'multiSelect',
    options: [
    	{
    		key: 0, value: '新告警'
    	},{
    		key: 2, value: '已恢复未关闭'
    	},{
    		key: 1, value: '已恢复并关闭'
    	},{
    		key: 3, value: '已关闭'
    	},{
    		key: 4, value: '已强制关闭'
    	},{
    		key: 5, value: '已接管'
    	}
    ]
  },
  */

  {
    key: 'OZ_AlarmID', // 传递给后端的字段名
    title: '告警序列号',
    placeholder: '告警序列号', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'N_SummaryCN', // 传递给后端的字段名
    title: '告警描述',
    placeholder: '告警描述', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'oz_temporary_process', // 传递给后端的字段名
    title: '告警延迟',
    placeholder: '告警延迟', // 提示语, 可选
    dataType: 'int',
    showType: 'select',
    options: [
      { key: 0, value: '未延迟处理' },
      { key: 1, value: '延迟处理' },
      { key: 2, value: '延迟处理超时' },
    ],
  },
]
