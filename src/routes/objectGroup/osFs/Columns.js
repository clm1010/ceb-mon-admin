import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
    key: 'name',
    dataIndex: 'name',
    title: '名称',
  },
  {
    key: 'hostname',
    dataIndex: 'hostname',
    title: '主机名',
  },
  {
    key: 'appCode',
    dataIndex: 'appCode',
    title: '对象编码',
  },
  {
    key: 'appName',
    dataIndex: 'appName',
    title: '应用名称',
  },
  {
    key: 'mngtOrg',
    dataIndex: 'mngtOrg',
    title: '管理机构',
  },
  {
    key: 'discoveryIP',
    dataIndex: 'discoveryIP',
    title: 'IP',
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
    key: 'mngInfoSrc',
    dataIndex: 'mngInfoSrc',
    title: '发现方式',
  },
  {
    key: 'vendor',
    dataIndex: 'vendor',
    title: '厂商',
  },
  {
    key: 'location',
    dataIndex: 'location',
    title: '区域',
  },
]
