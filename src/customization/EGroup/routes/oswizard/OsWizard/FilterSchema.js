import { genDictOptsByName, genFilterDictOptsByName } from '../../../../../utils/FunctionTool'
export default [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
    options: genFilterDictOptsByName('name', 'string'),
  },
  {
    key: 'branchName', // 传递给后端的字段名
    title: '机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch', 'string'),
  },
  {
    key: 'discoveryIP', // 传递给后端的字段名
    title: '管理IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'cabinet', //机柜
    title: '机柜',
    placeholder: '',//提示语
    dataType: 'varchar',
    showType: 'normal',
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
]
