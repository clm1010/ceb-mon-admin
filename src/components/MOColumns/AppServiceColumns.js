import Fenhang from './fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})
export default  [
  {
    name: 'name', //字段
    displayName: '名称', //字段名称
    tpe: 'String', //字段类型
    application: 'show,create,update,filter,query', //字段应用的场景
    applicationType: 'String',
  }, {
    name: "alias",
    displayName: "别名",
    tpe: "String",
    application: "show,update,create,filter,query",
    applicationType: 'String',
  }, {
    name: 'hostname',
    displayName: '主机名',
    tpe: 'String',
    application: 'show,create,update,filter,query',
    applicationType: 'String',
    isvalidate: false,
  }, {
    name: 'discoveryIP',
    displayName: 'IP',
    tpe: 'String',
    application: 'show,update,create,filter,query',
    applicationType: 'String',
    isvalidate: true,
  }, {
    name: 'branchName',
    displayName: '所属机构',
    tpe: 'String',
    application: 'show,update,create,filter,query',
    //applicationType:'String',
    applicationType: 'select',
    mappedInfos: Fenhangmaps,
    options: Fenhang,
  }, {
    name: 'appName',
    displayName: '应用分类名称',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'description',
    displayName: '描述',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'mngtOrg',
    displayName: '设备管理机构',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'onlineStatus',
    displayName: '在线状态',
    tpe: 'String',
    application: 'show,update,create,filter,query',
    //applicationType:'String',
    applicationType: 'select',
    options: [{ key: '新购待用', value: '新购待用' }, { key: '备件', value: '备件' }, { key: '在线', value: '在线' }, { key: '下线', value: '下线' }],
  }, {
    name: 'managedStatus',
    displayName: '纳管状态',
    tpe: 'String',
    application: 'show,create,update,filter,query',
    //applicationType:'String',
    applicationType: 'select',
    options: [{ key: '纳管', value: '纳管' }, { key: '未纳管', value: '未纳管' }],
  }, {
    name: 'mngInfoSrc',
    displayName: '发现方式',
    tpe: 'String',
    application: 'show,update,create,filter,query',
    //applicationType:'String',
    applicationType: 'select',
    options: [{ key: '手工', value: '手工' }, { key: '自动', value: '自动' }],
  }, {
    name: 'createMethod',
    displayName: '创建方式',
    tpe: 'String',
    application: 'show,update,create,filter,query',
    //applicationType:'String',
    applicationType: 'select',
    options: [{ key: '手工', value: '手工' }, { key: '自动', value: '自动' }],
  }, {
    name: 'room',
    displayName: '机房',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'srcType',
    displayName: 'srcType',
    tpe: 'String',
    application: 'show,update,create',
  }, {
    name: 'logKeyWord',
    displayName: '关键字',
    tpe: 'String',
    application: 'show,update,create',
  }, {
    name: 'path',
    displayName: 'web URL',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'path',
    displayName: '路径',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'port',
    displayName: '端口',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'process',
    displayName: '进程',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'processNum',
    displayName: '进程条件',
    tpe: 'String',
    application: 'show,create,update,filter',
    applicationType: 'String',
    isvalidate: true,
  }, {
    name: 'path',
    displayName: '日志',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'IncludeNames',
    displayName: 'IncludeNames',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  }, {
    name: 'ExcludeNames',
    displayName: 'ExcludeNames',
    tpe: 'String',
    application: 'show,update,create,filter',
    applicationType: 'String',
  },
]
