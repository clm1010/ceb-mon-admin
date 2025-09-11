import fenhang from '../../utils/fenhang'
export default  [
  {
    key: 'branch', // 传递给后端的字段名
    title: '分支机构',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'select',
    options: fenhang,
}, 
  {
    key: 'servicetype', // 传递给后端的字段名
    title: '业务类型',
    placeholder: '标签健', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'statuskey', // 传递给后端的字段名
    title: '状态信息唯一标识',
    placeholder: '状态信息唯一标识', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'statusinfo', // 传递给后端的字段名
    title: '状态信息',
    placeholder: '状态信息', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
]
