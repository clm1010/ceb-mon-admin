import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Select, Tabs } from 'antd'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

let uuid = 0

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 8,
    textAlign: 'right',
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

const FormItemProps = {
  style: {
    margin: 0,
  },
}

const FormItemProps1 = {
	labelCol: {
		xs: { span: 5 },
	},
	wrapperCol: {
		xs: { span: 8 },
	},
  style: {
    margin: 0,
  },
}

class EnrichmentRule extends React.Component {
	add = (k) => {
    uuid++
    const { form } = this.props
    // can use data-binding to get
    const keys1 = form.getFieldValue('keys1')
    //const nextKeys1 = keys1.concat(uuid);
    let nextKeys1 = keys1.slice(0)
    let idx1 = nextKeys1.findIndex((value, index, arr) => { return value === k })
    nextKeys1.splice(idx1 + 1, 0, uuid)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys1: nextKeys1,
    })
  }

	remove = (k) => {
    const { form } = this.props

    const keys1 = form.getFieldValue('keys1')
    if (keys1.length === 1) {
    	return
    }

    form.setFieldsValue({
      keys1: keys1.filter(key => key !== k),
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

	constructor (props) {
    super(props)
    this.state.mode = props.mode
  }

	state = {
		mode: '',
	}

	onChange = (value) => {
		const { form } = this.props
		const keys1 = form.getFieldValue('keys1')

    form.setFieldsValue({
      keys1: [],
    })

		this.setState({
      ...this.state,
      mode: value,
    })
	}

	handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

	switchMode () {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
		getFieldDecorator('keys1', { initialValue: [uuid] })

		const keys1 = getFieldValue('keys1')

		const formItems_basic = keys1.map((k, index) => {
			return (
  <Row gutter={12} key={`row${k}`}>
    <Col {...ColProps} xl={{ span: 7 }} md={{ span: 7 }}>
      <FormItem {...FormItemProps} hasFeedback key={`rule_head${k}`}>
        {getFieldDecorator(`rule_head${k}`, {
				            initialValue: '',
				            rules: [
				              {
				                required: true,
				              },
				            ],
				          })(<Input />)}
      </FormItem>
    </Col>
    <Col key={`col5${k}`} {...ColProps} xl={{ span: 7 }} md={{ span: 7 }}>
      <FormItem {...FormItemProps} hasFeedback key={`rule_body${k}`}>
        {getFieldDecorator(`rule_body${k}`, {
						      	initialValue: '',
						      })(<Select>
  <Select.Option value="@timestamp">@timestamp</Select.Option>
  <Select.Option value="Identifier">Identifier</Select.Option>
  <Select.Option value="Serial">Serial</Select.Option>
  <Select.Option value="Node">Node</Select.Option>
  <Select.Option value="NodeAlias">NodeAlias</Select.Option>
  <Select.Option value="Manager">Manager</Select.Option>
  <Select.Option value="Agent">Agent</Select.Option>
  <Select.Option value="AlertGroup">AlertGroup</Select.Option>
  <Select.Option value="AlertKey">AlertKey</Select.Option>
  <Select.Option value="Severity">Severity</Select.Option>
  <Select.Option value="Summary">Summary</Select.Option>
  <Select.Option value="StateChange">StateChange</Select.Option>
  <Select.Option value="FirstOccurrence">FirstOccurrence</Select.Option>
  <Select.Option value="LastOccurrence">LastOccurrence</Select.Option>
  <Select.Option value="InternalLast">InternalLast</Select.Option>
  <Select.Option value="Poll">Poll</Select.Option>
  <Select.Option value="Type">Type</Select.Option>
  <Select.Option value="Tally">Tally</Select.Option>
  <Select.Option value="Class">Class</Select.Option>
  <Select.Option value="Grade">Grade</Select.Option>
  <Select.Option value="Location">Location</Select.Option>
  <Select.Option value="OwnerUID">OwnerUID</Select.Option>
  <Select.Option value="OwnerGID">OwnerGID</Select.Option>
  <Select.Option value="Acknowledged">Acknowledged</Select.Option>
  <Select.Option value="Flash">Flash</Select.Option>
  <Select.Option value="EventId">EventId</Select.Option>
  <Select.Option value="ExpireTime">ExpireTime</Select.Option>
  <Select.Option value="ProcessReq">ProcessReq</Select.Option>
  <Select.Option value="SuppressEscl">SuppressEscl</Select.Option>
  <Select.Option value="Customer">Customer</Select.Option>
  <Select.Option value="Service">Service</Select.Option>
  <Select.Option value="PhysicalSlot">PhysicalSlot</Select.Option>
  <Select.Option value="PhysicalPort">PhysicalPort</Select.Option>
  <Select.Option value="PhysicalCard">PhysicalCard</Select.Option>
  <Select.Option value="TaskList">TaskList</Select.Option>
  <Select.Option value="NmosSerial">NmosSerial</Select.Option>
  <Select.Option value="NmosObjInst">NmosObjInst</Select.Option>
  <Select.Option value="NmosCauseType">NmosCauseType</Select.Option>
  <Select.Option value="NmosDomainName">NmosDomainName</Select.Option>
  <Select.Option value="NmosEntityId">NmosEntityId</Select.Option>
  <Select.Option value="NmosManagedStatus">NmosManagedStatus</Select.Option>
  <Select.Option value="NmosEventMap">NmosEventMap</Select.Option>
  <Select.Option value="LocalNodeAlias">LocalNodeAlias</Select.Option>
  <Select.Option value="LocalPriObj">LocalPriObj</Select.Option>
  <Select.Option value="LocalSecObj">LocalSecObj</Select.Option>
  <Select.Option value="LocalRootObj">LocalRootObj</Select.Option>
  <Select.Option value="RemoteNodeAlias">RemoteNodeAlias</Select.Option>
  <Select.Option value="RemotePriObj">RemotePriObj</Select.Option>
  <Select.Option value="RemoteSecObj">RemoteSecObj</Select.Option>
  <Select.Option value="RemoteRootObj">RemoteRootObj</Select.Option>
  <Select.Option value="X733EventType">X733EventType</Select.Option>
  <Select.Option value="X733ProbableCause">X733ProbableCause</Select.Option>
  <Select.Option value="X733SpecificProb">X733SpecificProb</Select.Option>
  <Select.Option value="X733CorrNotif">X733CorrNotif</Select.Option>
  <Select.Option value="ServerName">ServerName</Select.Option>
  <Select.Option value="ServerSerial">ServerSerial</Select.Option>
  <Select.Option value="URL">URL</Select.Option>
  <Select.Option value="ExtendedAttr">ExtendedAttr</Select.Option>
  <Select.Option value="OldRow">OldRow</Select.Option>
  <Select.Option value="ProbeSubSecondId">ProbeSubSecondId</Select.Option>
  <Select.Option value="BSM_Identity">BSM_Identity</Select.Option>
  <Select.Option value="N_NodeName">N_NodeName</Select.Option>
  <Select.Option value="N_ComponentType">N_ComponentType</Select.Option>
  <Select.Option value="N_Component">N_Component</Select.Option>
  <Select.Option value="N_SubComponent">N_SubComponent</Select.Option>
  <Select.Option value="N_InstanceId">N_InstanceId</Select.Option>
  <Select.Option value="N_InstanceValue">N_InstanceValue</Select.Option>
  <Select.Option value="N_InstanceSituation">N_InstanceSituation</Select.Option>
  <Select.Option value="N_ResourceId">N_ResourceId</Select.Option>
  <Select.Option value="N_ResourceUsage">N_ResourceUsage</Select.Option>
  <Select.Option value="N_LifecycleState">N_LifecycleState</Select.Option>
  <Select.Option value="N_HWType">N_HWType</Select.Option>
  <Select.Option value="N_MachineType">N_MachineType</Select.Option>
  <Select.Option value="N_OSType">N_OSType</Select.Option>
  <Select.Option value="N_Factory">N_Factory</Select.Option>
  <Select.Option value="N_SupportOrg">N_SupportOrg</Select.Option>
  <Select.Option value="N_ZProcessState">N_ZProcessState</Select.Option>
  <Select.Option value="N_MgtOrg">N_MgtOrg</Select.Option>
  <Select.Option value="N_MgtOrgId">N_MgtOrgId</Select.Option>
  <Select.Option value="N_OrgName">N_OrgName</Select.Option>
  <Select.Option value="N_OrgId">N_OrgId</Select.Option>
  <Select.Option value="N_Contact">N_Contact</Select.Option>
  <Select.Option value="N_Phone">N_Phone</Select.Option>
  <Select.Option value="N_MailBox">N_MailBox</Select.Option>
  <Select.Option value="N_BizName">N_BizName</Select.Option>
  <Select.Option value="N_Function">N_Function</Select.Option>
  <Select.Option value="N_BizArea">N_BizArea</Select.Option>
  <Select.Option value="N_TicketId">N_TicketId</Select.Option>
  <Select.Option value="N_TicketStatus">N_TicketStatus</Select.Option>
  <Select.Option value="N_MailFlag">N_MailFlag</Select.Option>
  <Select.Option value="N_SoundFlag">N_SoundFlag</Select.Option>
  <Select.Option value="N_SMSFlag">N_SMSFlag</Select.Option>
  <Select.Option value="N_SummaryCN">N_SummaryCN</Select.Option>
  <Select.Option value="N_CustomerSeverity">N_CustomerSeverity</Select.Option>
  <Select.Option value="N_PreSeverity">N_PreSeverity</Select.Option>
  <Select.Option value="N_AckTime">N_AckTime</Select.Option>
  <Select.Option value="N_AckMode">N_AckMode</Select.Option>
  <Select.Option value="N_AckedBy">N_AckedBy</Select.Option>
  <Select.Option value="N_EventStatus">N_EventStatus</Select.Option>
  <Select.Option value="N_ClearTime">N_ClearTime</Select.Option>
  <Select.Option value="N_CloseTime">N_CloseTime</Select.Option>
  <Select.Option value="N_Close">N_Close</Select.Option>
  <Select.Option value="N_Duration">N_Duration</Select.Option>
  <Select.Option value="N_MaintainBTime">N_MaintainBTime</Select.Option>
  <Select.Option value="N_MaintainETime">N_MaintainETime</Select.Option>
  <Select.Option value="N_MaintainDuration">N_MaintainDuration</Select.Option>
  <Select.Option value="N_MaintainId">N_MaintainId</Select.Option>
  <Select.Option value="N_MaintainStatus">N_MaintainStatus</Select.Option>
  <Select.Option value="N_PeerNode">N_PeerNode</Select.Option>
  <Select.Option value="N_PeerPort">N_PeerPort</Select.Option>
  <Select.Option value="N_PolicyName">N_PolicyName</Select.Option>
  <Select.Option value="N_SuppressFirstOccurrence">N_SuppressFirstOccurrence</Select.Option>
  <Select.Option value="N_ISMMonitorType">N_ISMMonitorType</Select.Option>
  <Select.Option value="N_ISMThresholdTally">N_ISMThresholdTally</Select.Option>
  <Select.Option value="N_ProviderName">N_ProviderName</Select.Option>
  <Select.Option value="N_ProviderPhone">N_ProviderPhone</Select.Option>
  <Select.Option value="N_LineId">N_LineId</Select.Option>
  <Select.Option value="N_PassedByGw">N_PassedByGw</Select.Option>
  <Select.Option value="N_ObjectDescr">N_ObjectDescr</Select.Option>
  <Select.Option value="N_ManageByCenter">N_ManageByCenter</Select.Option>
  <Select.Option value="LocalTertObj">LocalTertObj</Select.Option>
  <Select.Option value="LocalObjRelate">LocalObjRelate</Select.Option>
  <Select.Option value="RemoteTertObj">RemoteTertObj</Select.Option>
  <Select.Option value="RemoteObjRelate">RemoteObjRelate</Select.Option>
  <Select.Option value="CorrScore">CorrScore</Select.Option>
  <Select.Option value="CauseType">CauseType</Select.Option>
  <Select.Option value="AdvCorrCauseType">AdvCorrCauseType</Select.Option>
  <Select.Option value="AdvCorrServerName">AdvCorrServerName</Select.Option>
  <Select.Option value="AdvCorrServerSerial">AdvCorrServerSerial</Select.Option>
  <Select.Option value="N_MessageID">N_MessageID</Select.Option>
  <Select.Option value="N_Repository">N_Repository</Select.Option>
  <Select.Option value="N_RecoverType">N_RecoverType</Select.Option>
  <Select.Option value="N_AppCode">N_AppCode</Select.Option>
  <Select.Option value="N_AppName">N_AppName</Select.Option>
  <Select.Option value="N_BizCode">N_BizCode</Select.Option>
  <Select.Option value="TECHostname">TECHostname</Select.Option>
  <Select.Option value="TECFQHostname">TECFQHostname</Select.Option>
  <Select.Option value="TECDate">TECDate</Select.Option>
  <Select.Option value="TECRepeatCount">TECRepeatCount</Select.Option>
  <Select.Option value="ITMStatus">ITMStatus</Select.Option>
  <Select.Option value="ITMDisplayItem">ITMDisplayItem</Select.Option>
  <Select.Option value="ITMEventData">ITMEventData</Select.Option>
  <Select.Option value="ITMTime">ITMTime</Select.Option>
  <Select.Option value="ITMHostname">ITMHostname</Select.Option>
  <Select.Option value="ITMPort">ITMPort</Select.Option>
  <Select.Option value="ITMIntType">ITMIntType</Select.Option>
  <Select.Option value="ITMResetFlag">ITMResetFlag</Select.Option>
  <Select.Option value="ITMSitType">ITMSitType</Select.Option>
  <Select.Option value="ITMThruNode">ITMThruNode</Select.Option>
  <Select.Option value="ITMSitGroup">ITMSitGroup</Select.Option>
  <Select.Option value="ITMSitFullName">ITMSitFullName</Select.Option>
  <Select.Option value="ITMApplLabel">ITMApplLabel</Select.Option>
  <Select.Option value="N_OriginalSeverity">N_OriginalSeverity</Select.Option>
  <Select.Option value="N_AckOverTime">N_AckOverTime</Select.Option>
  <Select.Option value="N_CloseOverTime">N_CloseOverTime</Select.Option>
  <Select.Option value="N_EventRemark">N_EventRemark</Select.Option>
  <Select.Option value="N_ComponentTypeId">N_ComponentTypeId</Select.Option>
  <Select.Option value="N_ComponentId">N_ComponentId</Select.Option>
  <Select.Option value="N_SubComponentId">N_SubComponentId</Select.Option>
  <Select.Option value="N_CloseBy">N_CloseBy</Select.Option>
  <Select.Option value="N_EventId">N_EventId</Select.Option>
  <Select.Option value="N_EventName">N_EventName</Select.Option>
  <Select.Option value="N_CiType">N_CiType</Select.Option>
  <Select.Option value="N_MainRelatedSerial">N_MainRelatedSerial</Select.Option>
  <Select.Option value="N_Processed">N_Processed</Select.Option>
  <Select.Option value="N_ParentSerial">N_ParentSerial</Select.Option>
  <Select.Option value="N_EsclStartTime">N_EsclStartTime</Select.Option>
  <Select.Option value="N_ESCALATIONBYTIME">N_ESCALATIONBYTIME</Select.Option>
  <Select.Option value="N_AlertGroup">N_AlertGroup</Select.Option>
  <Select.Option value="N_TRIGGERNAME">N_TRIGGERNAME</Select.Option>
  <Select.Option value="N_SITRCA_FLAG">N_SITRCA_FLAG</Select.Option>
  <Select.Option value="N_SITRCA_SERIAL">N_SITRCA_SERIAL</Select.Option>
  <Select.Option value="N_SITRCA_RULEID">N_SITRCA_RULEID</Select.Option>
  <Select.Option value="N_SITRCA_IFRCA">N_SITRCA_IFRCA</Select.Option>
  <Select.Option value="N_CIGROUP">N_CIGROUP</Select.Option>
  <Select.Option value="N_CIKEY">N_CIKEY</Select.Option>
  <Select.Option value="N_CIKEY_SUP">N_CIKEY_SUP</Select.Option>
  <Select.Option value="N_BEGIN_PORTNAME">N_BEGIN_PORTNAME</Select.Option>
  <Select.Option value="N_KPI_NAME">N_KPI_NAME</Select.Option>
  <Select.Option value="N_KPI_CODE">N_KPI_CODE</Select.Option>
  <Select.Option value="N_KPI_PATH">N_KPI_PATH</Select.Option>
  <Select.Option value="N_DIAGNOSE_CODE">N_DIAGNOSE_CODE</Select.Option>
  <Select.Option value="N_DIAGNOSE_PARAMETER">N_DIAGNOSE_PARAMETER</Select.Option>
  <Select.Option value="N_DIAGNOSE_CALL_CYCLE">N_DIAGNOSE_CALL_CYCLE</Select.Option>
               </Select>)}
      </FormItem>
    </Col>
    <Col {...ColProps} xl={8} md={7}>
      <FormItem {...FormItemProps} hasFeedback key={`rule_tail${k}`}>
        {getFieldDecorator(`rule_tail${k}`, {
				            initialValue: '',
				            rules: [
				              {
				                required: true,
				              },
				            ],
				          })(<Input />)}
      </FormItem>
    </Col>
    <Col key={`col3${k}`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
      <Button.Group>
        <Button type="default" icon="minus" onClick={() => this.remove(k)} disabled={keys1.length === 1} />
        <Button type="default" icon="plus" onClick={() => this.add(k)} />
      </Button.Group>
    </Col>
  </Row>
		      )
		    })
		return (
  <Tabs size="small" type="line">
    <TabPane tab="丰富规则" key="1">
      {formItems_basic}
      {/*<Row>
				        <Col {...ColProps} xl={{ span: 23 }} md={{ span: 23 }}>
				        	<FormItem {...FormItemProps} hasFeedback>
					          <Button type="dashed" size="small" onClick={this.add} style={{width:'100%'}}>
					            <Icon type="plus" /> 增加丰富规则
					          </Button>
					        </FormItem>
				        </Col>
			        </Row>*/}
    </TabPane>
  </Tabs>
		    )
		}

	render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }

		const children = this.switchMode()
		const { form } = this.props

    return (
      <div>
        {children}
      </div>
		)
	}
}

export default EnrichmentRule
