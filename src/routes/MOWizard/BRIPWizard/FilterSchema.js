import { genDictOptsByName } from '../../../utils/FunctionTool'
let ooo = genDictOptsByName('branch')
let options = []
ooo.forEach((obj, index) => {
  let Fenhangmaps = {}
  Fenhangmaps.key = obj.key
  Fenhangmaps.value = obj.props.children

  options.push(Fenhangmaps)
})

export default  [
  {
    key: 'discoveryIP', // 传递给后端的字段名
    title: '管理IP',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'appName', // 传递给后端的字段名
    title: '应用系统',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'branchName', // 传递给后端的字段名
    title: '所属机构',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options: options,
  },
  {
    key: 'createdBy', // 传递给后端的字段名
    title: '创建者',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'updatedBy', // 传递给后端的字段名
    title: '最后更新者',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
]
