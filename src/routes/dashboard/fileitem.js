import { genFilterDictOptsByName,genDictArrToTreeByName } from "../../utils/FunctionTool"
export default  [
  {
    key: 'component', // 传递给后端的字段名
    title: '设备类型',
    dataType: 'varchar',
    showType: 'select',
    defaultValue:'ALL',
    options:[
      {
        key:'ALL',
        value:'全部',
      },
      {
        key:'路由器',
        value:'路由器',
      },
      {
        key:'交换机',
        value:'交换机',
      },
      {
        key:'防火墙',
        value:'防火墙',
      },
      {
        key:'负载均衡',
        value:'负载均衡',
      },
      {
        key:'线路',
        value:'线路',
      },
      {
        key:'网点',
        value:'网点',
      },
    ]
  },
  {
    key: 'vendor', // 传递给后端的字段名
    title: '厂商',
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('networkVendor'),
  },
  {
    key: 'netDomain', // 传递给后端的字段名
    title: '网络域',
    dataType: 'varchar',
    showType: 'treeSelect',
    children: genDictArrToTreeByName('netdomin-appname'),
  },
]