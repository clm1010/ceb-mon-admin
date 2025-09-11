import React from "react"
import { connect } from 'dva'
import { Col, Row, Card, Select, Button } from 'antd'
import LineTable from '../dashboard/netLine/lineTable'
import Menus from '../dashboard/performance/Menus'
import f5Col from './f5Col'
import queryString from "query-string"
import { routerRedux } from 'dva/router'
import Search from './Search.js'
import { genFilterDictOptsByName,genDictArrToTreeByName } from "../../utils/FunctionTool"
const { Option } = Select
const f5Monitoring = ({ dispatch, location, f5Monitoring, loading }) => {
	
	const { dataSource, pagination, buttonState, f5Source, bizareaSource,bizarea, ipSource, f5Name, bizareaName, hostipName } = f5Monitoring
	//菜单组件
	const menuProps = {
	    current: 'f5Monitoring',
	    dispatch
	}
	
	const firewallOp = f5Source.map((item, index) => {
		//return <Option key={index} value={item}>{item}</Option>
		return {key:item,value:item}
	})
	
	const bizareaOp = bizareaSource.map((item, index) => {
		return <Option key={index} value={item}>{item}</Option>
	})
	
	const ipOp = ipSource.map((item, index) => {
		// return <Option key={index} value={item}>{item}</Option>
		return {key:item,value:item}
	})
	
	//列表组件
	const lineTableProps = {
		colums: f5Col,//列名
		dataSource: dataSource,//数据源
		loading: loading.effects['f5Monitoring/query'],//异步监控状态
		pagination: pagination,//分页函数
		buttonState: buttonState,//定时函数的运行开关
		dispatch: dispatch,
		nums: 60,//定制刷新时间间隔
		path: 'f5Monitoring/query',//请求异步的路径
        bizarea:bizarea
	}
	
	const filterSchema = [
		{
			key: 'moname', // 传递给后端的字段名
			title: '设备名称',
			dataType: 'varchar',
			showType: 'select',
			defaultValue:'',
			options:firewallOp,
		  },
		  {
			key: 'hostip', // 传递给后端的字段名
			title: 'IP地址',
			dataType: 'varchar',
			showType: 'select',
			options:ipOp,
		  },
		  {
			key: 'netDomain', // 传递给后端的字段名
			title: '网络域',
			dataType: 'varchar',
			showType: 'treeSelect',
			children: genDictArrToTreeByName('netdomin-appname'),
		  },
	]
	const filterProps = {
        filterSchema: filterSchema,
        dispatch,
        onSearch(queryTerms) {
            const { search, pathname } = location
            const query = queryString.parse(search);
            query.queryTerms = queryTerms
            dispatch(routerRedux.push({
                pathname,
                query,
            }))
        },
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
			
					<Search {...filterProps} />
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

export default connect(({ f5Monitoring, loading }) => ({ f5Monitoring, loading: loading }))(f5Monitoring)