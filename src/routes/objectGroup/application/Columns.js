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
    key: 'mo.code',
    dataIndex: 'mo.code',
    title: '对象编码',
  },
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '所属应用分类名称',
  },
  {
    key: 'mo.mngtOrg',
    dataIndex: 'mo.mngtOrg',
    title: '设备管理机构',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '发现 IP',
  },
  {
    key: 'relatedPolicyInstances',
    dataIndex: 'relatedPolicyInstances',
    title: '关联策略总数',
  },
  {
    key: 'issuedPolicyInstances',
    dataIndex: 'issuedPolicyInstances',
    title: '已下发策略数',
  },
  {
    key: 'unissuedPolicyInstances',
    dataIndex: 'unissuedPolicyInstances',
    title: '未下发策略数',
  },
  {
    key: 'issueFailedPolicyInstances',
    dataIndex: 'issueFailedPolicyInstances',
    title: '下发失败策略数',
  },
  {
    key: 'notStdPolicyInstances',
    dataIndex: 'notStdPolicyInstances',
    title: '非标准策略数',
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
