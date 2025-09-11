export default  [
	{
     	title: '监控实例',
     	dataIndex: 'name',
     	key: 'name',
		width: '20%',
    }, {
      	title: '策略规则',
      	dataIndex: 'rule.name',
      	key: 'rule.name',
    }, {
      	title: '对象',
      	dataIndex: 'mo.serverName',
      	key: 'mo.serverName',
    }, {
      	title: '监控工具实例',
	  	dataIndex: 'toolInst.name',
      	key: 'toolInst.name',
    }, {
      	title: '策略实例',
		dataIndex: 'policy.name',
      	key: 'policy.name',
		width: '20%',
    }, {
      	title: '下发状态',
		dataIndex: 'issueStatus',
      	key: 'issueStatus',
		render: (text, record) => {
      	let typename = '已下发'
			if (text == 'SUCCESS') {
				typename = '已下发'
			} else if (text == 'FAILURE') {
				typename = '下发失败'
			} else if (text == 'UNISSUED') {
				typename = '未下发'
			} else if (text == 'OTHER') {
				typename = '其他'
			} else {
				typename = '未知'
			}
			return typename
		},
    }, {
      title: '是否标准',
      dataIndex: 'policy.isStd',
      key: 'policy.isStd',
      render: (text, record) => {
      	  let typename = '是'
			    if (record.policy.isStd == true) {
				    typename = '是'
			    } else {
				    typename = '否'
			    }
			    return typename
		   },
    }, {
      	title: '来源',
      	dataIndex: 'policy.createdFrom',
      	key: 'policy.createdFrom',
      	render: (text, record) => {
      	  let typename = ''
			    if (record.policy.createdFrom === 'MANUAL') {
				    typename = '手工'
			    } else if (record.policy.createdFrom === 'FROM_TEMPLATE') {
				    typename = '实例化'
			    } else {
			    	typename = '未知'
			    }
			    return typename
		   },
    },
  ]
