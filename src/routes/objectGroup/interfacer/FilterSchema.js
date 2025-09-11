import {genFilterDictOptsByName} from "../../../utils/FunctionTool"
import { firstSecurityZone } from '../../../utils/SecurityZone'
export default  [
  {
    key: 'moClass', // 传递给后端的字段名
    title: 'MO类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'treeSelect',
    /*
		*因为路由器、交换机、防火墙的接口没有唯一key
		*所以这里根据树的父节点，以减号做分隔符，拼装装唯一key，例：
		*NETWORK-ROUTER:路由器
		*NETWORK-ROUTER-NET_INTF:路由器接口
		*/
    defaultValue: 'NETWORK-SWITCH-NET_INTF',				//@@@
    placeholder: '请选择MO类型',
  },
  {
    key: 'branchName', // 传递给后端的字段名
    title: '机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch','string'),
  },
  {
    key: 'belongsTo.firstSecArea', // 传递给后端的字段名
    title: '一级安全域',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: firstSecurityZone,
  },
  {
    key: 'syncStatus', // 传递给后端的字段名
    title: '同步状态',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 'failed', value: '失败' },
      { key: 'success', value: '成功' },
      { key: 'unsync', value: '未同步' },
      { key: 'syncing', value: '同步中' },
    ],
  },
  {
    key: 'discoveryIP', // 传递给后端的字段名
    title: '发现IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'cabinet', // 传递给后端的字段名
    title: '机柜',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'ip', // 传递给后端的字段名
    title: '接口IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
		key: 'appName',
		title: '应用系统',
		placeholder: '请输入应用系统',
		dataType: 'varchar',
		showType: 'transformAsySelect',
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
  {
    key: 'iisreset', // 传递给后端的字段名
    title: '性能监控',
    placeholder: '', // 提示语, 可选
    dataType: 'boolean',
    showType: 'select',
    options: [
      { key: 'true', value: '监控' },
      { key: 'false', value: '未监控' },
    ],
  },
  {
    key: 'performanceCollect', // 传递给后端的字段名
    title: '性能采集',
    placeholder: '', // 提示语, 可选
    dataType: 'boolean',
    showType: 'select',
    options: [
      { key: 'true', value: '监控' },
      { key: 'false', value: '未监控' },
    ],
  },
  {
    key: 'syslogMonitoring', // 传递给后端的字段名
    title: 'SYSLOG监控',
    placeholder: '', // 提示语, 可选
    dataType: 'boolean',
    showType: 'select',
    options: [
      { key: 'true', value: '监控' },
      { key: 'false', value: '未监控' },
    ],
  },
]
