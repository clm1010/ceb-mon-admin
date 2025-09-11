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
    key: 'moClass', // 传递给后端的字段名
    title: 'MO类型',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'treeSelect',
    /*
		*因为路由器、交换机、防火墙的接口没有唯一key
		*所以这里根据树的父节点，以减号做分隔符，拼装装唯一key，例：
		*/
    defaultValue: 'MO', //@@@
    placeholder: '请选择MO类型',
  },
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
