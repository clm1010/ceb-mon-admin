import { genFilterDictOptsByName } from '../../utils/FunctionTool'

export default  [
  {
    key: 'name',
    title: '任务名',
    placeholder: '请输入任务名',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'userId',
    title: '工号',
    placeholder: '请输入工号',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'submitTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
  {
    key: 'tpe', // 传递给后端的字段名
    title: '任务类型',
    dataType: 'varchar',
    showType: 'select',
    options:[
      {key:'ISSUE_JOB' , value:'下发'},
      {key:'NETWORK_DISCOVERY_JOB' , value:'自服务'}
    ]
  },
  {
    key: 'status', // 传递给后端的字段名
    title: '任务状态',
    dataType: 'varchar',
    showType: 'select',
    options:[
      {key:'NOT_START' , value:'未开始'},
      {key:'RUNNING' , value:'正在运行'},
      {key:'PAUSED' , value:'已暂停'},
      {key:'FINISHED' , value:'已完成'},
      {key:'DISABLED' , value:'已废弃'}
    ]
  },
  {
    key: 'moIp',
    title: '监控对象IP',
    placeholder: '请输入监控对象IP',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'moName',
    title: '监控对象名称',
    placeholder: '请输入监控对象名称',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'branch',
    title: '所属机构',
    placeholder: '请输入所属机构',
    dataType: 'varchar',
    showType: 'select',
    options:genFilterDictOptsByName('branch','string'),
  },
  {
    key: 'moType',
    title: '设备类型',
    placeholder: '请输入设备类型',
    dataType: 'varchar',
    showType: 'select',
    options: [
      {
        key: 'DEVICE', value: '设备'
      },
      {
        key: 'LINE', value: '线路'
      },
      {
        key: 'BRANCH_IP', value: '网点IP'
      },
      {
        key: 'DB', value: '数据库'
      },
      {
        key: 'OS', value: '操作系统'
      },
      {
        key: 'MW', value: '中间件'
      }
    ]
  },
  {
    key: 'changeType',
    title: '变更类型',
    placeholder: '请输入变更类型',
    dataType: 'varchar',
    showType: 'select',
    options: [
      {
        key: 'ON', value: '监控对象上线'
      },
      {
        key: 'OFF', value: '监控对象下线'
      },
      {
        key: 'CHANGE', value: '监控策略调整'
      }
    ]
  }
]
