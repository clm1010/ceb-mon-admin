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
    key: 'mngtOrg',
    dataIndex: 'mngtOrg',
    title: '设备管理机构',
  },
  {
    key: 'discoveryIP',
    dataIndex: 'discoveryIP',
    title: '管理IP',
  },
  {
    key: 'code',
    dataIndex: 'code',
    title: '对象编码',
  },
  {
    key: 'createMethod',
    dataIndex: 'createMethod',
    title: '创建方式',
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
  {
  	key: 'appName',
  	dataIndex: 'appName',
  	title: '应用系统',
  },
  {
  	key: 'usage',
  	dataIndex: 'usage',
  	title: '用途',
  },
  {
  	key: 'secondClass',
  	dataIndex: 'secondClass',
  	title: '系统类型',
  },
  {
  	key: 'softwareVersion',
  	dataIndex: 'softwareVersion',
  	title: '软件版本',
  },
  {
  	key: 'allIps',
  	dataIndex: 'allIps',
  	title: '所有IP',
  },
]
