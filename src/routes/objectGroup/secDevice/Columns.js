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
    key: 'mo.discoveryIP',
    dataIndex: 'mo.discoveryIP',
    title: '管理IP',
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
  {
    key: 'mo.snmpVer',
    dataIndex: 'mo.snmpVer',
    title: 'SNMP 版本 ',
  },
  {
    key: 'mo.snmpCommunity',
    dataIndex: 'mo.snmpCommunity',
    title: 'SNMP 团体串',
  },
  {
    key: 'mo.snmpWriteCommunity',
    dataIndex: 'mo.snmpWriteCommunity',
    title: 'SNMP 写团体串',
  },
  {
    key: 'mo.mngInfoSrc',
    dataIndex: 'mo.mngInfoSrc',
    title: '发现方式',
  },
  {
    key: 'mo.hostname',
    dataIndex: 'mo.hostname',
    title: '主机名',
  },
  {
  	key: 'mo.location',
  	dataIndex: 'mo.location',
    title: '区域',
  },
  {
    key: 'mo.objectID',
    dataIndex: 'mo.objectID',
    title: 'ObjectID',
  },
  {
    key: 'intfNum',
    dataIndex: 'intfNum',
    title: '接口总数',
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
    key: 'mo.firstClass',
    dataIndex: 'mo.firstClass',
    title: '一级专业分类',
  },
  {
    key: 'mo.secondClass',
    dataIndex: 'mo.secondClass',
    title: '二级专业分类',
  },
  {
    key: 'mo.thirdClass',
    dataIndex: 'mo.thirdClass',
    title: '三级专业分类',
  },
  {
    key: 'mo.activatedBy',
    dataIndex: 'mo.activatedBy',
    title: '激活者',
  },
  {
    key: 'mo.cabinet',
    dataIndex: 'mo.cabinet',
    title: '机柜',
  },
  {
    key: 'mo.code',
    dataIndex: 'mo.code',
    title: '对象编码',
  },
  {
    key: 'mo.description',
    dataIndex: 'mo.description',
    title: '描述',
  },
  {
    key: 'mo.deviceCode',
    dataIndex: 'mo.deviceCode',
    title: '设备编号',
  },
	{
    key: 'mo.secondSecArea',
    dataIndex: 'mo.secondSecArea',
    title: '二级安全域',
  },
  {
    key: 'mo.haCollectTime',
    dataIndex: 'mo.haCollectTime',
    title: 'HA 状态采集时间',
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
    },
  },
  {
    key: 'mo.haMode',
    dataIndex: 'mo.haMode',
    title: '主备模式',
  },
  {
    key: 'mo.haRole',
    dataIndex: 'mo.haRole',
    title: '主备地位',
  },
  {
    key: 'mo.keyword',
    dataIndex: 'mo.keyword',
    title: '对象关键字',
  },
  {
    key: 'mo.mngtOrg',
    dataIndex: 'mo.mngtOrg',
    title: '设备管理机构',
  },
  {
    key: 'mo.mngtOrgCode',
    dataIndex: 'mo.mngtOrgCode',
    title: '设备管理机构编码',
  },
  {
    key: 'mo.model',
    dataIndex: 'mo.model',
    title: '型号',
  },
  {
    key: 'mo.monitorStatus',
    dataIndex: 'mo.monitorStatus',
    title: '监控状态',
  },
  {
    key: 'mo.onlineStatus',
    dataIndex: 'mo.onlineStatus',
    title: '在线状态',
  },
  {
    key: 'mo.managedStatus',
    dataIndex: 'mo.managedStatus',
    title: '纳管状态',
  },
  {
    key: 'mo.deviceType',
    dataIndex: 'mo.deviceType',
    title: '设备类型',
  },
  {
    key: 'mo.org',
    dataIndex: 'mo.org',
    title: '设备所属机构',
  },
  {
    key: 'mo.orgCode',
    dataIndex: 'mo.orgCode',
    title: '设备所属机构编码',
  },
  {
    key: 'mo.room',
    dataIndex: 'mo.room',
    title: '机房',
  },
  {
    key: 'mo.serialNum',
    dataIndex: 'mo.serialNum',
    title: '序列号',
  },
  {
    key: 'mo.softwareVersion',
    dataIndex: 'mo.softwareVersion',
    title: '系统版本',
  },
	{
    key: 'mo.appCode',
    dataIndex: 'mo.appCode',
    title: '所属应用分类编码',
  },
  {
    key: 'mo.appName',
    dataIndex: 'mo.appName',
    title: '所属应用分类名称',
  },
  {
    key: 'mo.syncStatus',
    dataIndex: 'mo.syncStatus',
    title: '同步状态',
    render: (text, record) => {
    	let info = ''
    	if (text === 'success') {
    		info = '成功'
    	} else {
    		info = '失败'
    	}
    	return info
    },
  },
  {
    key: 'mo.syncTime',
    dataIndex: 'mo.syncTime',
    title: '同步时间',
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
    },
  }, {
    key: 'mo.updateHistory',
    dataIndex: 'mo.updateHistory',
    title: '更新历史',
  },
  {
    key: 'mo.usage',
    dataIndex: 'mo.usage',
    title: '资源用途',
  },
  {
    key: 'mo.createdBy',
    dataIndex: 'mo.createdBy',
    title: '创建者',
  },
  {
    key: 'mo.createdTime',
    dataIndex: 'mo.createdTime',
    title: '创建时间',
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
    },
  },
  {
    key: 'mo.deactivatedBy',
    dataIndex: 'mo.deactivatedBy',
    title: '去激活者',
  },
  {
    key: 'mo.deleteTime',
    dataIndex: 'mo.deleteTime',
    title: '删除时间',
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString //toLocaleDateString
    },
  },
  {
    key: 'mo.deletedBy',
    dataIndex: 'mo.deletedBy',
    title: '删除者',
  },
	{
    key: 'mo.updatedBy',
    dataIndex: 'mo.updatedBy',
    title: '最后更新者',
  },
  {
    key: 'mo.updatedTime',
    dataIndex: 'mo.updatedTime',
    title: '最后更新时间',
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString //toLocaleDateString
    },
  },
  {
		key: 'mo.srcType',
		dataIndex: 'mo.srcType',
    title: 'srcType',
	},
	{
		key: 'mo.contact',
		dataIndex: 'mo.contact',
    title: '联系人',
	},
	/*{
		key: "mo.syncStatus",
		dataIndex: "mo.syncStatus",
    title: "发现状态",
    width: 200,
    application: "create, update",
	 	applicationType:'select',
	 	options:[{key: 'unsync', value: '尚未同步'}, {key: 'success', value: '成功'},{key: 'failed', value: '失败'},{key: 'syncing', value: '同步中'}],
	 	defaultValue: 'unsync',
	 	isdisabled:true,
	},
	{
		key: "mo.syncTime",
		dataIndex: "mo.syncTime",
    title: "发现时间",
    render: (text, record) => {
    	return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString //toLocaleDateString
    },
    width: 200,
    type: "long",
	 	application: "create, update",
	 	applicationType:'date',
	 	isdisabled:true,
	}*/
]
