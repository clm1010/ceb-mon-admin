export default  [

    {
      title: '机构',
      dataIndex: 'ne.branchName',
      key: 'branchName',
    }, {
      title: '发现ip',
      dataIndex: 'ne.discoveryIP',
      key: 'ne.discoveryIP',
    }, {
      title: '一级专业分类',
      dataIndex: 'ne.firstClass',
      key: 'ne.firstClass',
    }, {
      title: '创建时间',
      dataIndex: 'ne.createdTime',
      key: 'ne.createdTime',
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '接口总数',
      dataIndex: 'ne.intfs',
      key: 'ne.intfs',
      render: (text, record) => {
		  let count = 0
		  if (text && text.length > 0) {
			  count = text.length
		  }
      	return count
      },
    }, {
      title: '关联策略总数',
      dataIndex: 'relatedPolicyInstances',
      key: 'relatedPolicyInstances',

    }, {
      title: '已下发策略数',
      dataIndex: 'issuedPolicyInstances',
      key: 'issuedPolicyInstances',

    }, {
      title: '未下发策略数',
      dataIndex: 'unissuedPolicyInstances',
      key: 'unissuedPolicyInstances',

    }, {
      title: '下发失败策略数',
      dataIndex: 'issueFailedPolicyInstances',
      key: 'issueFailedPolicyInstances',

    }, {
      title: '非标准策略数',
      dataIndex: 'notStdPolicyInstances',
      key: 'notStdPolicyInstances',
    }, {
      title: '临时策略数',
      dataIndex: 'tmpPolicyInstances',
      key: 'tmpPolicyInstances',
    }, {
      title: '激活者',
      dataIndex: 'activatedBy',
      key: 'activatedBy',
    }, {
      title: '机柜',
      dataIndex: 'ne.cabinet',
      key: 'ne.cabinet',
    }, {
      title: '物理互联设备对象集合',
      dataIndex: 'connectedDevices',
      key: 'connectedDevices',
    }, {
      title: 'CPU集合',
      dataIndex: 'ne.cpus',
      key: 'ne.cpus',
    }, {
      title: '创建方式',
      dataIndex: 'ne.createMethod',
      key: 'ne.createMethod',
    }, {
      title: '创建者',
      dataIndex: 'ne.createdBy',
      key: 'ne.createdBy',
    }, {
      title: '去激活者',
      dataIndex: 'ne.deactivatedBy',
      key: 'ne.deactivatedBy',
    }, {
      title: '删除时间',
      dataIndex: 'ne.deleteTime',
      key: 'ne.deleteTime',
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '删除者',
      dataIndex: 'ne.deletedBy',
      key: 'ne.deletedBy',
    }, {
      title: '描述',
      dataIndex: 'ne.description',
      key: 'ne.description',
    }, {
      title: '设备编号',
      dataIndex: 'ne.deviceCode',
      key: 'ne.deviceCode',
    }, {
      title: '包含的风扇集合',
      dataIndex: 'ne.fans',
      key: 'ne.fans',
    }, {
      title: '一级安全域',
      dataIndex: 'ne.firstSecurityArea',
      key: 'ne.firstSecurityArea',
    }, {
      title: '主备集群网元列表',
      dataIndex: 'ne.haNes',
      key: 'ne.haNes',
    }, {
      title: '主备地位',
      dataIndex: 'ne.haRole',
      key: 'ne.haRole',
    }, {
      title: '接口集合',
      dataIndex: 'ne.interfaces',
      key: 'ne.interfaces',
    }, {
      title: 'IP对象集合',
      dataIndex: 'ne.ips',
      key: 'ne.ips',
    }, {
      title: '总分行标识',
      dataIndex: 'ne.isCenter',
      key: 'ne.isCenter',
    }, {
      title: '型号',
      dataIndex: 'ne.model',
      key: 'ne.model',
    }, {
      title: '在线状态',
      dataIndex: 'ne.onlineStatus',
      key: 'ne.onlineStatus',
    }, {
      title: '关联指标模板集合',
      dataIndex: 'relatedIndicatorTemplates',
      key: 'relatedIndicatorTemplates',
    }, {
      title: '关联策略实例状态',
      dataIndex: 'relatedPolicyStatus',
      key: 'relatedPolicyStatus',
    }, {
      title: '关联策略模板集合',
      dataIndex: 'relatedPolicyTemplates',
      key: 'relatedPolicyTemplates',
    }, {
      title: '机房',
      dataIndex: 'ne.room',
      key: 'ne.room',
    }, {
      title: '二级专业分类',
      dataIndex: 'ne.secondClass',
      key: 'ne.secondClass',
    }, {
      title: '二级安全域',
      dataIndex: 'ne.secondSecurityArea',
      key: 'ne.secondSecurityArea',
    }, {
      title: '序列号',
      dataIndex: 'ne.serialNum',
      key: 'ne.serialNum',
    }, {
      title: '主机名',
      dataIndex: 'ne.serverName',
      key: 'ne.serverName',
    }, {
      title: '系统版本',
      dataIndex: 'ne.softwareVersion',
      key: 'ne.softwareVersion',
    }, {
      title: '同步状态',
      dataIndex: 'ne.syncStatus',
      key: 'ne.syncStatus',
    }, {
      title: '同步时间',
      dataIndex: 'ne.syncTime',
      key: 'ne.syncTime',
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '温度传感器',
      dataIndex: 'temperatureSensors',
      key: 'temperatureSensors',
    }, {
      title: '三级专业分类',
      dataIndex: 'ne.thirdClass',
      key: 'ne.thirdClass',
    }, {
      title: '更新历史',
      dataIndex: 'ne.updateHistory',
      key: 'ne.updateHistory',
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    }, {
      title: '最后更新时间',
      dataIndex: 'ne.updatedTime',
      key: 'ne.updatedTime',
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
      },
    }, {
      title: '厂商',
      dataIndex: 'ne.vendor',
      key: 'ne.vendor',
    },
  ]
