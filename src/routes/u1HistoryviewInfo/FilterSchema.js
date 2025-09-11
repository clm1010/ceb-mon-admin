import {genFilterDictOptsByName} from "../../utils/FunctionTool";

export default  [
	{
    key: 'hiscope',
    title: '时间范围',
    dataType: 'varchar',
    showType: 'select',
    options: [
      {
        key: 'hour',
        value: '最近1小时',
      }, {
        key: 'day',
        value: '最近24小时',
      }, {
        key: 'today',
        value: '今天',
      },
    ],
  },
	{
    key: 'firstOccurrence----',
    title: '起止时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
 //   defaultValue: [moment(Date.parse(new Date())).add(-1, 'hour'), moment(Date.parse(new Date()))],  // 注意日期类型defaultValue的格式
  },
  {
	key: 'isClear',
	title: '告警恢复状态',
	dataType: 'varchar',
	showType: 'select',
	options:genFilterDictOptsByName('isRecovery','string'),
  //   [
	//     { key: '0', value: '已恢复告警' },
  //   	{ key: '1', value: '未恢复告警' },
	// ],
  },
  {
    key: 'n_MgtOrgID', // 传递给后端的字段名
    title: '管理机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('branch','string'),
	},
	{
    key: 'n_OrgID', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('branch','string'),
    //   [
    // 	  { key: 'ZH', value: '总行(ZH)' },
		//   { key: 'BJ', value: '北京分行(BJ)' },
		//   { key: 'CC', value: '长春分行(CC)' },
		//   { key: 'CS', value: '长沙分行(CS)' },
		//   { key: 'CQ', value: '重庆分行(CQ)' },
		//   { key: 'CD', value: '成都分行(CD)' },
		//   { key: 'DL', value: '大连分行(DL)' },
		//   { key: 'FZ', value: '福州分行(FZ)' },
		//   { key: 'GZ', value: '广州分行(GZ)' },
		//   { key: 'GY', value: '贵阳分行(GY)' },
		//   { key: 'HK', value: '海口分行(HK)' },
		//   { key: 'HZ', value: '杭州分行(HZ)' },
		//   { key: 'HF', value: '合肥分行(HF)' },
		//   { key: 'HLJ', value: '黑龙江分行(HLJ)' },
		//   { key: 'HHHT', value: '呼和浩特分行(HHHT)' },
		//   { key: 'JN', value: '济南分行(JN)' },
		//   { key: 'KM', value: '昆明分行(KM)' },
		//   { key: 'LZ', value: '兰州分行(LZ)' },
		//   { key: 'NC', value: '南昌分行(NC)' },
		//   { key: 'NJ', value: '南京分行(NJ)' },
		//   { key: 'NN', value: '南宁分行(NN)' },
		//   { key: 'NB', value: '宁波分行(NB)' },
		//   { key: 'QD', value: '青岛分行(QD)' },
		//   { key: 'SH', value: '上海分行(SH)' },
		//   { key: 'SHZ', value: '深圳分行(SHZ)' },
		//   { key: 'SY', value: '沈阳分行(SY)' },
		//   { key: 'SJZ', value: '石家庄分行(SJZ)' },
		//   { key: 'SZ', value: '苏州分行(SZ)' },
		//   { key: 'TY', value: '太原分行(TY)' },
		//   { key: 'TJ', value: '天津分行(TJ)' },
		//   { key: 'WLMQ', value: '乌鲁木齐分行(WLMQ)' },
		//   { key: 'WX', value: '无锡分行(WX)' },
		//   { key: 'WH', value: '武汉分行(WH)' },
		//   { key: 'XA', value: '西安分行(XA)' },
		//   { key: 'XM', value: '厦门分行(XM)' },
		//   { key: 'YT', value: '烟台分行(YT)' },
		//   { key: 'YC', value: '银川分行(YC)' },
		//   { key: 'ZZ', value: '郑州分行(ZZ)' },
		//   { key: 'XN', value: '西宁分行(XN)' },
		//   { key: 'LS', value: '拉萨分行(LS)' },
		//   { key: 'LUB', value: '卢森堡分行(LUB)' },
		//   { key: 'SOL', value: '首尔分行(SOL)' },
		//   { key: 'HKG', value: '香港分行(HKG)' },
		//   { key: 'SYD', value: '悉尼分行(SYD)' },
		//   { key: 'XYK', value: '信用卡(XYK)' },
    // ],
  },
  {
    key: 'n_CustomerSeverity', // 传递给后端的字段名
    title: '告警级别',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options:genFilterDictOptsByName('alertLevel','string'),
      // [
    	// 	{ key: '1', value: '一级' },
    	// 	{ key: '2', value: '二级' },
    	// 	{ key: '3', value: '三级' },
    	// 	{ key: '4', value: '四级' },
    	// 	{ key: '100', value: '五级' },
    	// 	],
  },
   {
    key: 'nodeAlias', // 传递给后端的字段名
    title: 'IP',
    placeholder: '输入IP,回车录入', // 提示语, 可选
    dataType: 'varchar',
    showType: 'tags',
  }, {
    key: 'serial', // 传递给后端的字段名
    title: '告警序列号',
    placeholder: '查询序列号将忽略所有条件', // 提示语, 可选
    dataType: 'varchar',
    showType: 'clean',
  }, {
  	key: 'n_SumMaryCn', // 传递给后端的字段名
    title: '摘要',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'n_ComponentType', // 传递给后端的字段名
    title: '分类告警',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [
    		{ key: '操作系统', value: '操作系统' },
    		{ key: '数据库', value: '数据库' },
    		{ key: '中间件', value: '中间件' },
    		{ key: '存储', value: '存储' },
    		{ key: '硬件', value: '硬件' },
    		{ key: '应用', value: '应用' },
    		{ key: '安全', value: '安全' },
    		{ key: '网络', value: '网络' },
    		{ key: '自检', value: '自检' },
    		{ key: '机房环境', value: '机房环境' },
    		{ key: '私有云', value: '私有云' },
    		{ key: '桌面云', value: '桌面云' },
    ],
  },
 {
  	key: 'acknowledged',
  	title: '接管状态',
  	dataType: 'varchar',
    showType: 'select',
    options: [
    {
	  	key: '0',
	  	value: '未接管',
	  }, {
	  	key: '1',
	  	value: '已接管',
	  },
		],
  },
  {
    key: 'n_MaintainStatus', // 传递给后端的字段名
    title: '是否维护期',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options:genFilterDictOptsByName('maintenance','string'),
      // [
    	// 	{ key: '0', value: '非维护期' },
    	// 	{ key: '1', value: '在维护期' },
    	// 	{ key: '2', value: '出维护期' },
    	// 	],
  },
  {
    key: 'n_EventStatus', // 传递给后端的字段名
    title: '告警状态',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [
    	{
    		key: '0', value: '新告警',
    	}, {
    		key: '2', value: '已恢复未关闭',
    	}, {
    		key: '1', value: '已恢复并关闭',
    	}, {
    		key: '3', value: '已关闭',
    	}, {
    		key: '4', value: '已强制关闭',
    	}, {
    		key: '5', value: '已接管',
    	},
    ],
  }, {
  	key: 'n_PeerPort',
  	title: '监控工具',
  	placeholder: '',
  	dataType: 'varchar',
    showType: 'select',
    options: [
    	{ key: '私有云监控集成', value: '私有云监控集成' },
    	{ key: 'NAGIOS', value: 'NAGIOS' },
    	{ key: 'OMS监控集成', value: 'OMS监控集成' },
    	{ key: 'IBM小型机监控集成', value: 'IBM小型机监控集成' },
    	{ key: 'HP', value: 'HP' },
		{ key: 'OVO', value: 'OVO' },
		{ key: 'TIVOLI_ITM监控', value: 'TIVOLI_ITM监控' },
		{ key: '存储监控集成', value: '存储监控集成' },
		{ key: '通用集成', value: '通用集成' },
		{ key: 'BPC监控集成', value: 'BPC监控集成' },
		{ key: 'Avaya监控集成', value: 'Avaya监控集成' },
		{ key: 'BPC', value: 'BPC' },
		{ key: '批量自动化监控集成', value: '批量自动化监控集成' },
		{ key: 'SYSLOG_EPP网络监控', value: 'SYSLOG_EPP网络监控' },
		{ key: 'Syslog_网络监控', value: 'Syslog_网络监控' },
		{ key: 'HP刀片监控集成', value: 'HP刀片监控集成' },
		{ key: '门禁监控集成', value: '门禁监控集成' },
		{ key: '网控器监控集成', value: '网控器监控集成' },
		{ key: '机房环境监控集成', value: '机房环境监控集成' },
		{ key: '防病毒监控集成', value: '防病毒监控集成' },
		{ key: 'TIVOLI_网络监控', value: 'TIVOLI_网络监控' },
		{ key: '华为服务器监控集成', value: '华为服务器监控集成' },
		{ key: 'TIVOLI_ITM', value: 'TIVOLI_ITM' },
		{ key: 'NBU监控集成', value: 'NBU监控集成' },
		{ key: 'Zabbix_监控', value: 'Zabbix_监控' },
    ],
  },
]
