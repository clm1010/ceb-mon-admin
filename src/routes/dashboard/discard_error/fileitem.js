import { genDictArrToTreeByName } from "../../../utils/FunctionTool"
export default  [
  {
    key: 'netDomain', // 传递给后端的字段名
    title: '网络域',
    dataType: 'varchar',
    showType: 'treeSelect',
    children: genDictArrToTreeByName('netdomin-appname'),
  },{
    key: 'createdTime',
    title: '查询时间',
    dataType: 'datetime', // 日期范围查询, 日期范围查询占用的显示空间会很大, 注意排版
    showType: 'between',
  }
]