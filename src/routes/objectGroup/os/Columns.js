import Fenhang from '../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

export default  [
	{
		key: 'mo.appName',
		dataIndex: 'mo.appName',
		title: '应用系统',
	},
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
    key: 'mo.mngtOrg',
    dataIndex: 'mo.mngtOrg',
    title: '设备管理机构',
  },
  {
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '管理IP',
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
		key: 'mngInfoSrc',
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
  {
  	key: 'mo.usage',
  	dataIndex: 'mo.usage',
  	title: '用途',
  },
  {
  	key: 'mo.secondClass',
  	dataIndex: 'mo.secondClass',
  	title: '系统类型',
  },
  {
  	key: 'mo.softwareVersion',
  	dataIndex: 'mo.softwareVersion',
  	title: '软件版本',
  },
  {
  	key: 'mo.allIps',
  	dataIndex: 'mo.allIps',
  	title: '所有IP',
  },
  {
  	key: 'mo.virtualIp',
  	dataIndex: 'mo.virtualIp',
  	title: '虚拟IP',
  },
  {
  	key: 'mo.mappingIP',
  	dataIndex: 'mo.mappingIP',
  	title: '映射IP',
  },
  {
  	key: 'mo.appMode',
  	dataIndex: 'mo.appMode',
  	title: '应用模式',
  },
  {
  	key: 'mo.disasterType',
  	dataIndex: 'mo.disasterType',
  	title: '故障类型',
  },
  {
  	key: 'mo.appRoleGroup',
  	dataIndex: 'mo.appRoleGroup',
  	title: '模式组子类',
  },
  {
  	key: 'mo.oracleInstalled',
  	dataIndex: 'mo.oracleInstalled',
  	title: 'Oracle',
  	render: (text, record) => {
  		let info = ''
  		if (text === '0') {
  			info = '未安装'
  		} else if (text === '1') {
  			info = '已安装'
  		}
  		return info
  	},
  },
  {
  	key: 'mo.weblogicInstalled',
  	dataIndex: 'mo.weblogicInstalled',
  	title: 'Weblogic',
  	render: (text, record) => {
  		let info = ''
  		if (text === '0') {
  			info = '未安装'
  		} else if (text === '1') {
  			info = '已安装'
  		}
  		return info
  	},
  },
  {
  	key: 'mo.asminstalled',
  	dataIndex: 'mo.asminstalled',
  	title: 'ASM',
  	render: (text, record) => {
  		let info = ''
  		if (text === '0') {
  			info = '未安装'
  		} else if (text === '1') {
  			info = '已安装'
  		}
  		return info
  	},
  },
  {
  	key: 'mo.tuxedoInstalled',
  	dataIndex: 'mo.tuxedoInstalled',
  	title: 'Tuxedo',
  	render: (text, record) => {
  		let info = ''
  		if (text === '0') {
  			info = '未安装'
  		} else if (text === '1') {
  			info = '已安装'
  		}
  		return info
  	},
  },
  {
  	key: 'mo.vcsinstalled',
  	dataIndex: 'mo.vcsinstalled',
  	title: 'VCS',
  	render: (text, record) => {
  		let info = ''
  		if (text === '0') {
  			info = '未安装'
  		} else if (text === '1') {
  			info = '已安装'
  		}
  		return info
  	},
  },
]
