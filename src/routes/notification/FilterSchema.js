import fenhang from '../../utils/fenhang'
import {genFilterDictOptsByName} from "../../utils/FunctionTool";
export default  [
  {
    key: 'name', // 传递给后端的字段名
    title: '名称',
    placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'normal',
  },
  {
    key: 'appCategory', // 传递给后端的字段名
    title: '应用',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'normal',
  },
  {
    key: 'users', // 传递给后端的字段名
    title: '告警处理人',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'normal',
  },
  {
  	key: 'branch',
  	title: '分行',
  	dataType: 'string',
    showType: 'select',
    options: fenhang,
  },
  {
  	key: 'informType',
  	title: '通知类型',
  	placeholder: '', // 提示语, 可选
    dataType: 'varchar',
    showType: 'select',
    options:genFilterDictOptsByName('informType','string')
  }, {
  	key: 'role',
  	title: '告警处理角色',
  	dataType: 'varchar',
    showType: 'select',
    options: genFilterDictOptsByName('mRole','string')
  },
  {
    key: 'froms', // 传递给后端的字段名
    title: '告警来源',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'select',
    options: genFilterDictOptsByName('appType','string')
  },
  {
    key: 'severity', // 传递给后端的字段名
    title: '告警级别',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'select',
    options: genFilterDictOptsByName('alertLevel','string')
  },
  {
    key: 'user', // 传递给后端的字段名
    title: '处理人电话',
    placeholder: '', // 提示语, 可选
    dataType: 'string',
    showType: 'normal',
  },
]
