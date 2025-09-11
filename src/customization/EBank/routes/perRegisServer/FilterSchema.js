import {genFilterDictOptsByName} from "../../../../utils/FunctionTool";

export default [
  {
    key: 'name', // 传递给后端的字段名
    title: '服务名',
    placeholder: '服务名', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
    defaultValue:'CDAMT-SUBNOA-MS-cdamt-df'
  }, {
    key: 'tags', // 传递给后端的字段名
    title: '标签',
    dataType: 'varchar',
    showType: 'select',
    defaultValue:'metrics-exporter',
    options: genFilterDictOptsByName('service_tags','string'),
  }, {
    key: 'address',
    title: '地址',
    dataType: 'string',
    showType: 'normal',
  }, {
    key: 'registerStatus',
    title: '注册状态',
    dataType: 'string',
    showType: 'select',
    options: [
      {
        key: 'UNREGISTERED',
        value: '未注册'
      }, {
        key: 'REGISTERED',
        value: '已注册'
      }, {
        key: 'DEREGISTERED',
        value: '已注销'
      }
    ]
  }, {
    key: 'id',
    title: 'ID',
    dataType: 'string',
    showType: 'normal',
  }, {
    key: 'namespace',
    title: '命名空间',
    dataType: 'string',
    showType: 'normal',
  }
]
