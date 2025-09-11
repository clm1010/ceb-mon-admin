import React from "react"
import { connect } from 'dva'
import { Col, Row, Card, Select, Button } from 'antd'
import LineTable from '../dashboard/netLine/lineTable'
import Menus from '../dashboard/performance/Menus'
import fireWallCol from './fireWallCol'
const { Option } = Select
const netBizareaFirewall = ({ dispatch, location, netBizareaFirewall, loading }) => {
	
	const { dataSource, pagination, buttonState, firewallSource, bizareaSource, ipSource, firewallName, bizareaName, hostipName } = netBizareaFirewall
	//菜单组件
	const menuProps = {
	    current: 'bizarea',
	    dispatch
	}
	
	const firewallOp = firewallSource.map((item, index) => {
		return <Option key={index} value={item}>{item}</Option>
	})
	
	const bizareaOp = bizareaSource.map((item, index) => {
		return <Option key={index} value={item}>{item}</Option>
	})
	
	const ipOp = ipSource.map((item, index) => {
		return <Option key={index} value={item}>{item}</Option>
	})
	
	//列表组件
	const lineTableProps = {
		colums: fireWallCol,//列名
		dataSource: dataSource,//数据源
		loading: loading.effects['netBizareaFirewall/query'],//异步监控状态
		pagination: pagination,//分页函数
		buttonState: buttonState,//定时函数的运行开关
		dispatch: dispatch,
		nums: 20,//定制刷新时间间隔
		path: 'netBizareaFirewall/query'//请求异步的路径
	}
	
	const onfirewall = (value) => {
		dispatch({
			type: 'netBizareaFirewall/setState',
			payload:{
				firewallName: value ? {term: { moname: value } } : ''
			}
		})
	}
	
	const onBizarea = (value) => {
		dispatch({
			type: 'netBizareaFirewall/setState',
			payload:{
				bizareaName: value ? {term: { bizarea: value } } : ''
			}
		})
	}
	
	const onIp = (value) => {
		dispatch({
			type: 'netBizareaFirewall/setState',
			payload:{
				hostipName: value ? {term: { hostip: value } } : ''
			}
		})
	}
	
	const onSub = () => {
		dispatch({
			type: "netBizareaFirewall/setState",
			payload:{
				firewallSource: [],
				bizareaSource: [], 
				ipSource: []
			}
		})
		dispatch({
			type: 'netBizareaFirewall/query',
			payload:{
				firewallName: firewallName,
				bizareaName: bizareaName,
				hostipName: hostipName
			}
		})
	}
	
	return (
		<div>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<Menus {...menuProps}/>
				</Col>
			</Row>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<div style={{ marginTop: '10px', minHeight: '30px' }}>
						<Card>
							防火墙名称:&nbsp;<Select style={{ width: 160 }} optionFilterProp="children" showSearch allowClear={true} onChange={onfirewall}>
								{firewallOp}
							</Select>&nbsp;&nbsp;&nbsp;
							服务域:&nbsp;<Select style={{ width: 180 }} optionFilterProp="children" showSearch allowClear={true} onChange={onBizarea}>
								{bizareaOp}
							</Select>&nbsp;&nbsp;&nbsp;
							IP地址:&nbsp;<Select style={{ width: 120 }} optionFilterProp="children" showSearch allowClear={true} onChange={onIp}>
								{ipOp}
							</Select>&nbsp;&nbsp;&nbsp;
							<Button type="primary" shape='circle' icon='search' onClick={onSub}/>
						</Card>
					</div>
				</Col>
			</Row>
			<Row gutter={6}>
				<Col md={24} lg={24} xl={24}>
					<div style={{ marginTop: '10px' }}>
						<Card>
							<LineTable {...lineTableProps}/>
						</Card>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default connect(({ netBizareaFirewall, loading }) => ({ netBizareaFirewall, loading: loading }))(netBizareaFirewall)