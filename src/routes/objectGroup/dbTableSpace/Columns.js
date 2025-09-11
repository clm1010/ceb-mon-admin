import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
    key: 'mo.name',
    dataIndex: 'mo.name',
    title: '名称',
  },
  {
    key: 'mo.hostname',
    dataIndex: 'mo.hostname',
    title: '主机名',
  },
  {
    key: 'database.code',
    dataIndex: 'mo.code',
    title: '对象编码',
  },
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '应用名称',
  },
  {
    key: 'mo.mngtOrg',
    dataIndex: 'mo.mngtOrg',
    title: '管理机构',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: 'IP',
  },
  {
    key: 'issueFailedPolicyInstances',
    dataIndex: 'issueFailedPolicyInstances',
    title: '下发失败的策略实例数量',
  },
  {
    key: 'issuedPolicyInstances',
    dataIndex: 'issuedPolicyInstances',
    title: '已下发的策略实例数量',
  },
  {
    key: 'notStdPolicyInstances',
    dataIndex: 'notStdPolicyInstances',
    title: '非标准的策略实例数量',
  },
  {
    key: 'relatedPolicyInstances',
    dataIndex: 'relatedPolicyInstances',
    title: '总关联策略实例数量',
  },
  {
    key: 'unissuedPolicyInstances',
    dataIndex: 'unissuedPolicyInstances',
    title: '未下发的策略实例数量',
  },
  {
    key: 'mo.code',
    dataIndex: 'mo.code',
    title: '对象编码',
  },
  {
    key: 'mo.mngInfoSrc',
    dataIndex: 'mo.mngInfoSrc',
    title: '发现方式',
  },
  {
    key: 'mo.vendor',
    dataIndex: 'mo.vendor',
    title: '厂商',
  },
  {
    key: 'mo.location',
    dataIndex: 'mo.location',
    title: '区域',
  },
]
