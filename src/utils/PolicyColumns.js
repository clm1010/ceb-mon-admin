//import '../policy/templet/List.css'
export default  [
    {
      title: '策略实例名称',
      dataIndex: 'name',
      key: 'name',

    }, {
      title: '模板名称',
      dataIndex: 'template.name',
      key: 'template.name',
     render: (text, record) => {
		let typename = ''
		if (record.template !== undefined && record.template.name !== undefined && record.template.name !== '') {
			typename = record.template.name
		} else {
			typename = '无'
		}
			return typename
	},

    }, {
      title: '指标',
      dataIndex: 'monitorParams.indicator.name',
      key: 'monitorParams.indicator.name',
      width: 70,

    }, {
      	title: '告警参数',
	  	dataIndex: 'alertParams',
	  	key: 'alertParams',
	  	width: 150,
		render: (text, record) => {
	  		let params = ''
	  		if (record.monitorParams === undefined) {
	  			return ''
	  		}
	  		if (record.monitorParams.ops === undefined) {
	  			return ''
	  		}
	  		let ops = record.monitorParams.ops
			if (ops !== undefined) {
				ops.forEach((op) => {
					let fuhao = ''
					if (op.condition.op === '>') {
						fuhao = '高于'
					} else {
						fuhao = '低于'
					}
					if (record.policyType === 'SYSLOG') {
						params += `${op.actions.namingAction.naming};`
					} else {
						params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
					}
	//						params+="连续"+op.condition.count+"次"+fuhao+op.condition.threshold+";"+op.actions.gradingAction.oriSeverity+"级告警;"+op.actions.namingAction.naming+";"
				})
			}
			if (record.policyType === 'SYSLOG') {
				const typeStyle = <div className="ellipsis" title={params}>{params}</div>

				return typeStyle
			}
				return params
		},

    }, {
      title: '策略类型',
      width: 70,
        render: (text, record) => {
      	let typename = '普通'
				if (record.policyType == 'NORMAL') {
					typename = '普通'
				} else {
					typename = record.policyType
				}
				return typename
			},

    }, {
      title: '监控工具实例',
	  dataIndex: 'toolPolicys',
      key: 'toolPolicys',
	  width: 90,
        render: (text, record) => {
      	let toolsname = ''
		if (text && text.length > 0) {
			let myset = new Set()
			text.forEach((item, index) => {
				if (index === 0) {
					toolsname = item.name
					myset.add(item.name)
				} else if (!myset.has(item.name)) {
						toolsname = `${toolsname},${item.name}`
						myset.add(item.name)
					}
			})
		}
		return toolsname
		},
    }, {
      title: '下发状态',
      dataIndex: 'issueStatus',
      key: 'issueStatus',
      width: 70,
        render: (text, record) => {
      	let typename = '已下发'
				if (record.issueStatus == 'SUCCESS') {
					typename = '已下发'
				} else {
					typename = '未下发'
				}
				return typename
			},
    },
   {
      title: '是否标准策略',
      dataIndex: 'isStd',
      key: 'isStd',
      render: (text, record) => {
      	let typename = '是'
				if (record.isStd == true) {
					typename = '是'
				} else {
					typename = '否'
				}
				return typename
			},
    }, {
      title: '监控对象数',
      dataIndex: 'mos',
      key: 'mos',

    }, {
      title: '策略来源',
      dataIndex: 'createdFrom',
      key: 'createdFrom',
      width: 70,
      render: (text, record) => {
      	let typename = '实例化'
				if (record.createdFrom == 'FROM_TEMPLATE') {
					typename = '实例化'
				} else {
					typename = '手工'
				}
				return typename
			},

    },
  ]
