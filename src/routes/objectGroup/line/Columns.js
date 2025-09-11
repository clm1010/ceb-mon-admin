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
    key: 'mo.lineType',
    dataIndex: 'mo.lineType',
    title: '线路类型',
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
    key: 'relatedPolicyInstances',
    dataIndex: 'relatedPolicyInstances',
    title: '关联策略总数',
  },
  {
    key: 'mo.aaDeviceIP',
    dataIndex: 'mo.aaDeviceIP',
    title: '本端设备IP',
  },
  {
    key: 'mo.aaIntf.ip',
    dataIndex: 'mo.aaIntf.ip',
    title: '本端端口IP',
  },
  {
    key: 'mo.aaPort',
    dataIndex: 'mo.aaPort',
    title: '本端端口',
  },
  {
    key: 'mo.zzDeviceIP',
    dataIndex: 'mo.zzDeviceIP',
    title: '对端设备IP',
  },
  {
    key: 'mo.zzIP',
    dataIndex: 'mo.zzIP',
    title: '对端端口IP',
  },
  {
    key: 'mo.zzPort',
    dataIndex: 'mo.zzPort',
    title: '对端端口',
  },
]
