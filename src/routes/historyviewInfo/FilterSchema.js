import moment from 'moment'
import { genFilterDictOptsByName } from "../../utils/FunctionTool";
export default [
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
    options: genFilterDictOptsByName('isRecovery', 'string'),
    //   [
    // 		{ key: '0', value: '已恢复告警' },
    // 		{ key: '1', value: '未恢复告警' },
    // ],
  },
  {
    key: 'n_MgtOrgID', // 传递给后端的字段名
    title: '管理机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('branch', 'string'),
  },
  {
    key: 'n_OrgID', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('branch', 'string'),
  },
  {
    key: 'n_CustomerSeverity', // 传递给后端的字段名
    title: '告警级别',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('alertLevel', 'string'),
  },
  {
    key: 'nodeAlias', // 传递给后端的字段名
    title: 'IP',
    placeholder: '输入IP', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'oz_AlarmID', // 传递给后端的字段名
    title: '告警序列号',
    placeholder: '查询序列号将忽略所有条件', // 提示语, 可选
    dataType: 'varchar',
    showType: 'clean',
  }, {
    key: 'n_SumMaryCn', // 传递给后端的字段名
    title: '告警描述',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'n_ComponentType', // 传递给后端的字段名
    title: '分类告警',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: genFilterDictOptsByName('appType', 'string'),
    // options: [
    //   { key: '操作系统', value: '操作系统' },
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
    options: genFilterDictOptsByName('maintenance', 'string'),
  },
  {
    key: 'deleteDat', // 传递给后端的字段名
    title: '告警状态',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      {
        key: '0', value: '未关闭',
      }, {
        key: '1', value: '已关闭',
      },
    ],
  }, {
    key: 'n_PeerPort',
    title: '监控工具',
    placeholder: '',
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('monitor-tools', 'string'),
  },
  {
    key: 'alertGroup', // 传递给后端的字段名
    title: '告警组',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'n_ZprocessState',  // 传递给后端的字段名
    title: '是否丰富',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: '0', value: '未丰富' },
      { key: '1', value: '已丰富' },
    ],
  },
  {
    key: 'agent', // 传递给后端的字段名
    title: '监控代理',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'n_AppName_1',  // 传递给后端的字段名
    title: '网络域',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'cascader',
    options: [
      {
        label: '分行云服务域',
        value: '分行云服务域',
        key: '分行云服务域',
        children: [
          { label: '网络|分行云服务域', value: '网络|分行云服务域', key: '网络|分行云服务域' },
          { label: '网络|分行云中间业务DMZ区', value: '网络|分行云中间业务DMZ区', key: '网络|分行云中间业务DMZ区', },
        ],
      }, {
        label: '互联网服务域',
        value: '互联网服务域',
        key: '互联网服务域',
        children: [
          { label: '网络|互联网服务域邮件接入区', value: '网络|互联网服务域邮件接入区', key: '网络|互联网服务域邮件接入区' },
          { label: '网络|互联网服务域互联网DMZ区', value: '网络|互联网服务域互联网DMZ区', key: '网络|互联网服务域互联网DMZ区' },
          { label: '网络|互联网服务域公众服务区', value: '网络|互联网服务域公众服务区', key: '网络|互联网服务域公众服务区' },
          { label: '网络|互联网服务域办公DMZ区', value: '网络|互联网服务域办公DMZ区', key: '网络|互联网服务域办公DMZ区' },
        ],
      }, {
        label: '办公服务域',
        value: '办公服务域',
        key: '办公服务域',
        children: [
          { label: '网络|办公服务域城域网接入区', value: '网络|办公服务域城域网接入区', key: '网络|办公服务域城域网接入区' },
          { label: '网络|办公服务域办公服务器区', value: '网络|办公服务域办公服务器区', key: '网络|办公服务域办公服务器区' },
        ],
      }, {
        label: '核心交换域',
        value: '核心交换域',
        key: '核心交换域',
        children: [
          { label: '网络|核心交换域光传输区', value: '网络|核心交换域光传输区', key: '网络|核心交换域光传输区' },
          { label: '网络|核心交换域核心交换区', value: '网络|核心交换域核心交换区', key: '网络|核心交换域核心交换区' },
          { label: '网络|核心交换域数据中心互联区', value: '网络|核心交换域数据中心互联区', key: '网络|核心交换域数据中心互联区' },
        ],
      }, {
        label: '生产服务域',
        value: '生产服务域',
        key: '生产服务域',
        children: [
          { label: '网络|生产服务域生产A区', value: '网络|生产服务域生产A区', key: '网络|生产服务域生产A区' },
          { label: '网络|生产服务域生产B区', value: '网络|生产服务域生产B区', key: '网络|生产服务域生产B区' },
        ],
      }, {
        label: '开发测试域',
        value: '开发测试域',
        key: '开发测试域',
        children: [
          { label: '网络|开发测试域', value: '网络|开发测试域', key: '网络|开发测试域' },
          { label: '网络|开发测试域投产准备区', value: '网络|开发测试域投产准备区', key: '网络|开发测试域投产准备区' },
        ],
      }, {
        label: '容器云服务域',
        value: '容器云服务域',
        key: '容器云服务域',
        children: [
          { label: '网络|容器云服务域', value: '网络|容器云服务域', key: '网络|容器云服务域' },
        ],
      }, {
        label: '海外分行域',
        value: '海外分行域',
        key: '海外分行域',
        children: [
          { label: '网络|海外分行域海外接入区', value: '网络|海外分行域海外接入区', key: '网络|海外分行域海外接入区' },
          { label: '网络|海外分行域海外服务器区', value: '网络|海外分行域海外服务器区', key: '网络|海外分行域海外服务器区' },
        ],
      }, {
        label: '业务服务域',
        value: '业务服务域',
        key: '业务服务域',
        children: [
          { label: '网络|业务服务域', value: '网络|业务服务域', key: '网络|业务服务域' },
        ],
      }, {
        label: '第三方服务域',
        value: '第三方服务域',
        key: '第三方服务域',
        children: [
          { label: '网络|第三方服务域中间业务区', value: '网络|第三方服务域中间业务区', key: '网络|第三方服务域中间业务区' },
          { label: '网络|第三方服务域集团接入区', value: '网络|第三方服务域集团接入区', key: '网络|第三方服务域集团接入区' },
        ],
      }, {
        label: '数据域',
        value: '数据域',
        key: '数据域',
        children: [
          { label: '网络|数据域专属备份区', value: '网络|数据域专属备份区', key: '网络|数据域专属备份区' },
          { label: '网络|数据域大数据区', value: '网络|数据域大数据区', key: '网络|数据域大数据区' },
          { label: '网络|数据域专属存储区', value: '网络|数据域专属存储区', key: '网络|数据域专属存储区' },
          { label: '网络|数据域专属分布式存储区', value: '网络|数据域专属分布式存储区', key: '网络|数据域专属分布式存储区' },
        ],
      },
      {
        label: 'IT管理域',
        value: 'IT管理域',
        key: 'IT管理域',
        children: [
          { label: '网络|IT管理域', value: '网络|IT管理域', key: '网络|IT管理域' },
        ],
      },
      {
        label: '骨干网络域',
        value: '骨干网络域',
        key: '骨干网络域',
        children: [
          { label: '网络|骨干网络域', value: '网络|骨干网络域', key: '网络|骨干网络域' },
        ],
      },
      {
        label: '总行云服务域',
        value: '总行云服务域',
        key: '总行云服务域',
        children: [
          { label: '网络|总行云服务域', value: '网络|总行云服务域', key: '网络|总行云服务域' },
        ],
      }, {
        label: '总行办公网',
        value: '总行办公网',
        key: '总行办公网',
        children: [
          { label: '总行办公网', value: '总行办公网', key: '总行办公网' },
        ],
      },
      {
        label: '未纳入14域管理的区域',
        value: '未纳入14域管理的区域',
        key: '未纳入14域管理的区域',
        children: [
          { label: '网络|天津后台中心', value: '网络|天津后台中心', key: '网络|天津后台中心' },
          { label: '网络|武汉客户满意中心', value: '网络|武汉客户满意中心', key: '网络|武汉客户满意中心' },
          { label: '网络|武汉灾备中心', value: '网络|武汉灾备中心', key: '网络|武汉灾备中心' },
          { label: '网络流量采集系统（NTC-GM）', value: '网络流量采集系统（NTC-GM）', key: '网络流量采集系统（NTC-GM）' },
          { label: '信用卡中心-网络|信用卡中心网络', value: '信用卡中心-网络|信用卡中心网络', key: '信用卡中心-网络|信用卡中心网络' },
          { label: '理财子公司-理财子公司青岛办公网', value: '理财子公司-理财子公司青岛办公网', key: '理财子公司-理财子公司青岛办公网' },
          { label: '网络|网银武汉异地接入区', value: '网络|网银武汉异地接入区', key: '网络|网银武汉异地接入区' },
        ],
      }
    ],
  },
  {
    key: 'oz_Service_Impact',  // 传递给后端的字段名
    title: '业务影响',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('Service_Impact', 'string'),
  },
  {
    key: 'oz_global_app_flag',  // 传递给后端的字段名
    title: '全局应用系统',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 0, value: '否' },
      { key: 1, value: '是' },
    ]
  },
  {
    key: 'n_Note',  // 传递给后端的字段名
    title: '备注',
    placeholder: '',  // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 0, value: '全部' },
      { key: 1, value: '空值' },
      { key: 2, value: '非空' },
    ]
  },
  // {
  //   key: 'oz_temporary_process', // 传递给后端的字段名
  //   title: '告警延迟',
  //   placeholder: '告警延迟', // 提示语, 可选
  //   dataType: 'int',
  //   showType: 'select',
  //   options: [
  //     { key: 0, value: '未延迟处理' },
  //     { key: 1, value: '延迟处理' },
  //     { key: 2, value: '延迟处理超时' },
  //   ],
  // },
  {
    key: 'oz_invalid_alert', // 传递给后端的字段名
    title: '无效告警',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'multiSelect',
    options: [
      { key: '通知业务', value: '通知业务' },
      { key: '通知运维二线，未作处置', value: '通知运维二线，未作处置' },
      { key: '连续告警无影响，有预案', value: '连续告警无影响，有预案' },
      { key: '连续告警无影响，无预案', value: '连续告警无影响，无预案' },
      { key: '等到投产日/变更窗口处理', value: '等到投产日/变更窗口处理' },
      { key: '建议管理员屏蔽', value: '建议管理员屏蔽' },
      { key: '运维安全类告警', value: '运维安全类告警' },
    ],
  },
  {
    key: 'oz_physicalmachine', // 传递给后端的字段名
    title: '宿主机信息',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'n_factory', // 传递给后端的字段名
    title: '所属栈',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 'A栈', value: 'A栈' },
      { key: 'B栈', value: 'B栈' },
    ],
  },
  {
    key: 'oz_dcs_az_information_name', // 传递给后端的字段名
    title: 'AZ信息',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: [
      { key: 'A栈生产AZ1', value: 'A栈生产AZ1' },
      { key: 'A栈生产AZ2', value: 'A栈生产AZ2' },
      { key: 'A栈生产AZ3', value: 'A栈生产AZ3' },
      { key: 'A栈武汉生产AZ1', value: 'A栈武汉生产AZ1' },
      { key: 'B栈生产AZ1', value: 'B栈生产AZ1' },
      { key: 'B栈生产AZ2', value: 'B栈生产AZ2' },
      { key: 'B栈管理AZ', value: 'B栈管理AZ' },
    ],
  },
  {
		key: 'n_TicketID',
		title: '工单号',
		dataType: 'string',
		showType: 'normal',
	},
]
