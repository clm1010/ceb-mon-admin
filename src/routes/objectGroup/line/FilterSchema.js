import { genFilterDictOptsByName, genDictArrByName } from "../../../utils/FunctionTool"
export default [
  {
    key: 'moClass', // 传递给后端的字段名
    title: 'MO类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'treeSelect',
    /*
    *因为路由器、交换机、防火墙的接口没有唯一key
    *所以这里根据树的父节点，以减号做分隔符，拼装装唯一key，例：
    *NETWORK-ROUTER:路由器
    *NETWORK-ROUTER-NET_INTF:路由器接口
    */
    defaultValue: 'NETWORK-HA_LINE', //@@@
    placeholder: '请选择MO类型',
  },
  {
    key: 'branchName', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('branch', 'string'),
  },
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'mo.aaIntf.ip', // 传递给后端的字段名
    title: '本端端口IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'zzIP', // 传递给后端的字段名
    title: '对端IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'cabinet', // 传递给后端的字段名
    title: '机柜',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'onlineStatus', // 传递给后端的字段名
    title: '在线状态',
    dataType: 'varchar',
    showType: 'select',
    options: genDictArrByName('onlineStatus'),
  },
  {
    key: 'aaDeviceIP', // 传递给后端的字段名
    title: '本端设备IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'lineType', // 传递给后端的字段名
    title: '线路类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: genDictArrByName('lineType')
  },
  {
    key: 'appName',
    title: '应用系统',
    placeholder: '请输入应用系统',
    dataType: 'varchar',
    showType: 'transformAsySelect',
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
