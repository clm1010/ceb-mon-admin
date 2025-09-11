//import { firstSecurityZone } from '../../../../utils/SecurityZone'
import {genFilterDictOptsByName} from "../../utils/FunctionTool";
export default  [
  {
    key: 'mo_name', // 传递给后端的字段名
    title: '对象名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'mo_discoveryIP', // 传递给后端的字段名
    title: '管理IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'policy_alarmSettings_conditions_indicator_name', // 传递给后端的字段名
    title: '指标',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'branch', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch','string'),
    //   [
    // 	{ key: 'ZH', value: '总行(ZH)' },
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
    // ],
  },
  {
    key: 'rule_name', // 传递给后端的字段名
    title: '策略规则',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
		key: 'toolInst.toolType',
		title: '监控工具',
		dataType: 'varchar',
		showType: 'select',
		options: [
				{ key: 'ITM', value: 'ITM' },
        { key: 'NANTIAN_ZABBIX', value: '南天Zabbix' },
        { key: 'Zabbix', value: 'Zabbix' },
        { key: 'OVO', value: 'OVO' },
        { key: 'NAGIOS', value: 'NAGIOS' },
		],
  },
  {
    key: 'toolInst_name', // 传递给后端的字段名
    title: '工具实例',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'policy_name', // 传递给后端的字段名
    title: '策略模板',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'issueStatus', // 传递给后端的字段名
    title: '状态',
		dataType: 'varchar',
		showType: 'select',
		options: [
				{ key: 'UNISSUED', value: '未下发' },
        { key: 'SUCCESS', value: '成功' },
        { key: 'FAILURE', value: '失败' },
        { key: 'OTHER', value: '其他' },
		],
  },
]
