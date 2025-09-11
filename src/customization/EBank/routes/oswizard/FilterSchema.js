import fenhang from '../../../../utils/fenhang'

export default [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'branchName', // 传递给后端的字段名
    title: '所属分行',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'select',
    options: fenhang,
  },
  {
    key: 'discoveryIP', // 传递给后端的字段名
    title: '管理IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  }
]
