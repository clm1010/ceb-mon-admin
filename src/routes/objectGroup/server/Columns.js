
import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '所属应用分类名称',
  },
	{
    key: 'mo.name',
    dataIndex: 'mo.name',
    title: '名称',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '管理 IP',
  },
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '所属应用分类名称',
  },
  {
    key: 'relatedPolicyInstances',
    dataIndex: 'relatedPolicyInstances',
    title: '关联策略总数',
  },
  {
    key: 'mo.branchName',
    dataIndex: 'mo.branchName',
    title: '所属行名称',
    render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
  },
  {
    key: 'mo.firstSecArea',
    dataIndex: 'mo.firstSecArea',
    title: '一级安全域',
  },
  {
    key: 'mo.vendor',
    dataIndex: 'mo.vendor',
    title: '厂商',
  },
]
