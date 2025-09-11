import {genFilterDictOptsByName} from "../../utils/FunctionTool"
export default  [
  {
    key: 'alarmId', // 传递给后端的字段名
    title: '告警ID',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'content', // 传递给后端的字段名
    title: '发送内容',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'notificationType',
    title: '通知方式',
    placeholder: '',
    dataType: 'varchar',
    showType: 'multiSelect',
    options:genFilterDictOptsByName('notificationType','string'),
    //   [
    //   { key: 'SMS', value: '短信' },
    //   { key: 'APP', value: '手机APP' },
    //   { key: 'TICKET', value: '工单' },
    //   { key: 'MAOP', value: 'MAOP' },
    // ],
  },
  {
    key: 'branch', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch','string'),
  },
  {
    key: 'receiverUserName', // 传递给后端的字段名
    title: '接收人',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
   key:'n_CustomerSeverity',
   title:'告警级别',
   placeholder: '', // 提示语, 可选
   dataType: 'varchar',
   showType: 'select',
   options: genFilterDictOptsByName('alertLevel','int'),
  },
  {
    key: 'firstOccurrence',
    title: '告警起止时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'sendTime',
    title: '通知发送时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'receiver', // 传递给后端的字段名
    title: '联系人电话',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
  key: 'isRead', // 传递给后端的字段名
  title: '是否阅读',
  placeholder: '', // 提示语, 可选
  dataType: 'boolean',
  showType: 'select',
  options:[
    {key:'false',value:'否'},
    {key:'true',value:'是'}
  ]
  },
  {
  key: 'result', // 传递给后端的字段名
  title: '是否发送成功',
  placeholder: '', // 提示语, 可选
  dataType: 'varchar',
  showType: 'select',
  options:[
    {key:'Failure',value:'否'},
    {key:'Successful',value:'是'}
  ]
  }
]
