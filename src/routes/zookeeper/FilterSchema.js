import { genFilterDictOptsByName } from "../../utils/FunctionTool";
export default  [

  {
    key: 'address', // 传递给后端的字段名
    title: '集群地址',
    // placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'groupInfo', // 传递给后端的字段名
    title: '分组信息',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'restfulAddress',
    title: '集群接口地址',
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'mainCluster',
    title: '主备状态',
    dataType: 'boolean',
    showType: 'radio',
    options: [{ key: 'true', value: '主' }, { key: 'false', value: '备' }],
    // defaultValue: 'true',
  },
  {
    key: 'isverify',
    title: '是否验证',
    dataType: 'boolean',
    showType: 'radio',
    options: [{ key: 'true', value: '是' }, { key: 'false', value: '否' }],
  },
]
