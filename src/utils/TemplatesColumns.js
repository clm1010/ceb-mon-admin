export default  [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '指标',
      dataIndex: 'monitorParams.indicator.name',
      key: 'monitorParams.indicator.name',
    }, {
      title: '告警参数',
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
						params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
					})
				}
				return params
			},
    }, {
      title: '策略类型',
      render: (text, record) => {
      	let typename = '普通'
				if (record.policyType == 'NORMAL') {
					typename = '普通'
				} else {
					typename = record.policyType
				}
				return typename
			},

    },
  ]
