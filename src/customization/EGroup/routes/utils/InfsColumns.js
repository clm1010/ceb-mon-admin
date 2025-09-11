import {ozr} from '../../../../utils/clientSetting'
export default  [
    {
      title: 'SNMP索引号',
      dataIndex: 'snmpIndex',
      key: 'snmpIndex',
    }, {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '发现IP',
      dataIndex: 'discoveryIP',
      key: 'discoveryIP',
    }, {
    		title: '端口名称',
    		dataIndex: 'portName',
    		key: 'portName',
    }, {
    		title: '端口IP',
    		dataIndex: 'ip',
    		key: 'ip',
    }, {
    		title: '管理状态',
    		dataIndex: 'status',
    		key: 'status',
    }, {
    		title: '物理状态',
    		dataIndex: 'protocolStatus',
    		key: 'protocolStatus',
    }, {
    		title: 'MAC地址',
    		dataIndex: 'mac',
    		key: 'mac',
    }, {
      title: '采集带宽',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
    }, {
      title: '分行名字',
      dataIndex: 'branchName',
      key: 'branchName',

    }, {
      title: '互联接口数',
      dataIndex: 'connectedIntfs',
      key: 'connectedIntfs',
	  render: (text, record) => {
		  let count = 0
		  if (text && text.length > 0) {
			  count = text.length > 0
		  }
      	return count
      },

    }, {
      title: '一级专业分类',
      dataIndex: 'firstClass',
      key: 'firstClass',

    }, {
      title: '二级专业分类',
      dataIndex: 'secondClass',
      key: 'secondClass',

    }, {
      title: '三级专业分类',
      dataIndex: 'thirdClass',
      key: 'thirdClass',

    }, {
      title: '是否主备',
      dataIndex: 'haRole',
      key: 'haRole',
      render: (text, record) => {
		  let val = '否'
		  if (text) {
			  val = '是'
		  }
      	return val
      },
    }, {
      title: '接口类型',
      dataIndex: 'intfType',
      key: 'intfType',
    }, {
      title: '是否'+ozr('shortName'),
      dataIndex: 'isCenter',
      key: 'isCenter',
      render: (text, record) => {
		  let val = '否'
		  if (text) {
			  val = '是'
		  }
      	return val
      },
    }, {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus ',
    }, {
      title: '实际带宽 ',
      dataIndex: 'realBandwidth',
      key: 'realBandwidth',
    }, {
      title: '关联指标实例状态',
      dataIndex: 'relatedIndicatorStatus',
      key: 'relatedIndicatorStatus',
	  render: (text, record) => {
		  let val = '否'
		  if (text) {
			  val = '是'
		  }
      	return val
      },
    }, {
      title: '关联策略实例状态',
      dataIndex: 'relatedPolicyStatus',
      key: 'relatedPolicyStatus',
	  render: (text, record) => {
		  let val = '否'
		  if (text) {
			  val = '是'
		  }
      	return val
      },
    }, {
      title: '创建方式',
      dataIndex: 'createMethod',
      key: 'createMethod',
    }, {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    }, {
      title: '激活者',
      dataIndex: 'activatedBy',
      key: 'activatedBy',
    }, {
      title: '删除时间',
      dataIndex: 'deleteTime',
      key: 'deleteTime',
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    }, {
      title: '删除者',
      dataIndex: 'deletedBy',
      key: 'deletedBy',
    }, {
      title: '更新历史',
      dataIndex: 'updateHistory',
      key: 'updateHistory',
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    }, {
      title: '最后更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    }, {
	  title: '纳管状态',
      dataIndex: 'managedStatus',
      key: 'managedStatus',
    }, {
	  title: 'ObjectID',
      dataIndex: 'objectID',
      key: 'objectID',
    }, {
	  title: 'MTU',
      dataIndex: 'mtu',
      key: 'mtu',
    }, {
	  title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ]
