import React from 'react'
import PropTypes from 'prop-types'
import Syslog_Epp from './Syslog_Epp'
import Zabbix_SNMP from './Zabbix_SNMP'
import Zabbix_Agent from './Zabbix_Agent'
import Zabbix_Calculated from './Zabbix_Calculated'
import Zabbix_Prometheus from './Zabbix_ Prometheus'

const FormItemProps = {
  style: {
    margin: 0,
  },
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const ColProps = {
  style: {
    marginBottom: 8,
    textAlign: 'right',
  },
}

function formulaZone ({
 dispatch, type, form, item, itemType, resetCalInput,chooseWay,
}) {
	const ontest = () => {
		/*
			获取列表
		*/
		dispatch({
			type: 'zabbixItemsInfo/queryItemInfo',
			payload: {
				groupUUID: '',
			},
		})

		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectItemVisible: true,
				isClose: false,
			},
		})
	}

	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	let this_child = null

		function genJson () {
			//return this_child.genJson()
	  }

		function getChild (child) {
			this_child = child
		}

	const switchType = (item, type, itemType) => {
		switch (itemType) {
			/*
			case 'ZABBIX_SNMP':
				const zabbix_snmp_props = {
					form : form,
					item : item,
					itemType : itemType,
				}
				return <Zabbix_SNMP {...zabbix_snmp_props}/>
				break
			*/
			case 'SYSLOG_EPP':
				const syslog_epp_props = {
					form,
					item,
					type,
					itemType,
				}
				return <Syslog_Epp {...syslog_epp_props} />
				break
			case 'ZABBIX_AGENT':
			case 'ZABBIX_AGENT_ACTIVE':
			case 'ZABBIX_TRAPPER':
			case 'ZABBIX_JMX':
			case 'ZABBIX_IPMI':
				const zabbix_agent_props = {
					form,
					item,
					itemType,
					resetCalInput,
					dispatch,
					chooseWay,
				}
				return <Zabbix_Agent {...zabbix_agent_props} />
				break
			case 'ZABBIX_CALCULATED':
				const zabbix_calculated_props = {
					form,
					item,
					itemType,
					resetCalInput,
					dispatch,
				}
				return <Zabbix_Calculated {...zabbix_calculated_props} ref={getChild} />
				break
			   case 'PROMETHEUS': case 'PROMETHEUS_RECORD': case 'SKYWALKING_OAL':
				   const zabbix_prometheus_props = {
					   form,
					   item,
					   itemType,
				   }
				   return <Zabbix_Prometheus {...zabbix_prometheus_props} />
			default:
			   const zabbix_snmp_props = {
					form,
					item,
					itemType,
				}
				return <Zabbix_SNMP {...zabbix_snmp_props} />
				break
		}
	}

	const children = switchType(item, type, itemType)

	return (
  <div>{children}</div>
	)
}

export default formulaZone
//<div>{children}<Button onClick={() => genJson()}>FormulaZone</Button></div>
