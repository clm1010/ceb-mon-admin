import { genFilterDictOptsByName } from "../../../utils/FunctionTool";
export default [

  {
    key: 'name', // 传递给后端的字段名
    title: '用户名称',
    placeholder: '用户名称', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'username', // 传递给后端的字段名
    title: '用户ID',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'branch', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch', 'string'),
  },
  {
    key: 'domain', // 传递给后端的字段名
    title: '部门',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'extAuth', // 传递给后端的字段名
    title: '光大家权限',
    dataType: 'varchar',
    showType: 'select',
    options: [{ key: true, value: '是' }, { key: false, value: '否' }]
  },
  {
    key: 'roles_name', // 传递给后端的字段名
    title: '角色',
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
]
