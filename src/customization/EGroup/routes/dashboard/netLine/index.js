import React from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Table } from 'antd'
import Menus from '../performance/Menus'
import lineCol from './lineCol'
import LineTable from './lineTable'
//netLine  是一个组件  只需要传入数据模板和history的信息
class netLine extends React.Component {
	constructor(props) {
		super(props);
	}
	
	user = JSON.parse(sessionStorage.getItem('user'))
	
	state = {//初始化赋值
		menuProps : { current: 'Line', dispatch: this.props.dispatch, userbranch: this.user.branch },
		lineTableProps : { dispatch: this.props.dispatch, path: 'netLine/query', nums: 10, buttonState: this.props.netLine.buttonState }
	}
	
	componentWillReceiveProps(nextProps) {
		const { Line, dataSource, buttonState } = nextProps.netLine//结构函数
		this.state.lineTableProps = {//外联专线实时延时表格
			colums: lineCol,//列名
			dataSource: dataSource,//数据源
			loading: nextProps.loading.effects['netLine/query'],//异步监控状态
			pagination: Line,//分页函数
			buttonState: buttonState,//定时函数的运行开关
			dispatch: this.props.dispatch,
			nums: 20,//定制刷新时间间隔
			path: 'netLine/query'//请求异步的路径
		}
	}
	
	
	
	render() {
		return(
			<div>
			<Row gutter={6}>
				<Col span={24}>
					<Menus {...this.state.menuProps}/>
				</Col>
			</Row>
			<Row>
				<Col span={24}>
					<div style={{ marginTop: '10px' }}>
						<Card>
							<LineTable {...this.state.lineTableProps}/>
						</Card>
					</div>
				</Col>
			</Row>
			</div>
		)
	}
}

export default connect(({ netLine, loading }) => ({ netLine, loading }))(netLine)