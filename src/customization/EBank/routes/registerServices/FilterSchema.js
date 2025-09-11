import genDictArrToCascader from './FunctionTool'
import {genFilterDictOptsByName} from "../../../../utils/FunctionTool";

export default [
  {
    key: 'name', // 传递给后端的字段名
    title: '服务名',
    placeholder: '服务名', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }, {
    key: 'tags', // 传递给后端的字段名
    title: '标签',
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('service_tags','string'),
  }, {
    key: 'address',
    title: '地址',
    dataType: 'string',
    showType: 'normal',
  },
  //  {
  //   key: 'domain',
  //   title: '部门',
  //   dataType: 'varchar',
  //   showType: 'cascader',
  //   options: genDictArrToCascader('userDomain'),
  // }, 
  {
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
    key: 'serviceArea',
    title: '服务域',
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('prom_serviceArea','string'),
  },{
    key: 'id',
    title: 'ID',
    dataType: 'string',
    showType: 'normal',
  },{
    key: 'project',
    title: '项目',
    dataType: 'string',
    showType: 'normal',
  }, {
    key: 'createdTime',
    title: '创建时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
    defaultValueBegin: '2016-01-01 12:34:56', // 注意日期类型defaultValue的格式
    defaultValueEnd: '2016-12-01 22:33:44',
  },
]
