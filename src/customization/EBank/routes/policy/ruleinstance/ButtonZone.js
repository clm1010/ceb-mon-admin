import React from 'react'
import fenhang from '../../../../../utils/fenhang'
import { Modal, Row, Col, Icon, Button, Checkbox} from 'antd'

const confirm = Modal.confirm

const buttonZone = ({
 dispatch, batchDelete, choosedRows, checkAll, expand,onIssueForbid,disItem
}) => {
	const user = JSON.parse(sessionStorage.getItem('user'))
	let onPower = user.roles
	let disPower = true
	for(let a=0 ; a<onPower.length; a++){
		if(onPower[a].name == '超级管理员'){
			disPower=false
		}
	}
	const onAdd = () => {
		dispatch({
			type: 'ruleInstance/addInstance',
			payload: {
				monitorInstanceType: 'create',
				MonitorInstanceItem: {
					name: '',
					policyType: 'NORMAL',
					collectParams: {
						collectInterval: '',
						timeout: '',
						retries: '',
						pktSize: '',
						pktNum: '',
						srcDeviceTimeout: '',
						srcDeviceRetries: '',
					},
				},

				tabstate: {
					activeKey: 'n1',
						panes: [
						  {
 							title: '新操作1',
							key: 'n1',
							content: {
								uuid: '',
								period: '',
								times: '',
								foward: '>',
								value: '',
								originalLevel: '',
								innderLevel: '',
								outerLevel: '',
								discard_innder: false,
								discard_outer: false,
								alarmName: '',
								recoverType: '1',
								actionsuuid: '',
								aDiscardActionuuid: '',
								aGradingActionuuid: '',
								aNamingActionuuid: '',
								conditionuuid: '',
								timePerioduuid: '',
								useExt: false, //是否使用扩展条件
								extOp: '<', //扩展条件
								extThreshold: '', //扩展阈值
							},
						 },
					 ],
					newTabIndex: 1,
				},

			},

		})
	}

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'ruleInstance/delete',
		        payload: choosedRows,
		      })
        },
      })
	}

	const onIssue = () => {

		let criteriaArr = []
		fenhang.forEach((item) => {
			criteriaArr.push(item.key)
		})
		//查询所有分行下发状态
		dispatch({
			type: 'ruleInstance/status',
			payload: {
				criteriaArr,
			},
		})

		dispatch({
			type: 'ruleInstance/showRuleModal',
			payload: {
				branchsType: 'edit',
				branchsVisible: true,
				checkAll,
				checkedList: [],
				ruleInstanceKey: `${new Date().getTime()}`,
			},
		})
	}
	const onTerrissue = () => {
		dispatch({
			type: 'ruleInstance/queryDCSlevel',
			payload: {
			},
		})
		dispatch({
			type: 'ruleInstance/showTerrRuleModal',
			payload: {
				terrType: 'edit',
				terrVisible: true,
				checkedTerrList: [],
			},
		})
	}
	const toggle = () => {
		dispatch({
			type: 'ruleInstance/showRuleModal',
			payload: {
				expand: !expand,
			},
		})
	}

	const onforbid = (e)=>{
		if(e.target.checked){
			disItem.disable =true
		}else{
			disItem.disable =false
		}
		dispatch({
			type: 'ruleInstance/onforbid',
			payload: disItem
		})
	}
	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <a onClick={toggle}>
        <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
      </a>
      <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增监控实例</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onIssue} disabled={onIssueForbid}>下发</Button>
	  <Checkbox  style={{ marginLeft: 8 }} size="default" onChange={onforbid} checked={onIssueForbid} disabled={disPower}>下发禁用</Checkbox>
	  <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onTerrissue} disabled={onIssueForbid}>分布式监控下发</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
