import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class eChart extends Component {
	constructor(props) {
		super(props)
		this.state.xAxis = { type: 'category', data: [] }//初始化坐标项
		this.state.yAxis = { type: 'value', show: true },
		this.state.seriesDay = [{ name: '', type: 'line', data: [] }]
		this.state.seriesMonth = [{ name: '', type: 'line', data: [] }]
		this.state.loading = false
		this.state.loadingM = false
		this.state.dispatch = props.dispatch
		this.state.EffectName = props.EffectName
		this.state.name = props.name
	}

	//更新时调用
	componentWillReceiveProps(nextProps) {
		this.state.xAxis = nextProps.xAxis
		this.state.yAxis = nextProps.yAxis
		this.state.seriesDay = nextProps.seriesDay
		this.state.seriesMonth = nextProps.seriesMonth
		this.state.loading = nextProps.loading
		this.state.loadingM = nextProps.loadingM
		this.state.dispatch = nextProps.dispatch
		this.state.EffectName = nextProps.EffectName
		this.state.name = nextProps.name
	}

	state = {

	}

	onChangeTabs = (value) => {
		if (value == 'day') {
			this.state.dispatch({
				type: `dataCenterTransaction/query_pre`,
				payload: {
					name:this.state.name
				},
			})
			this.state.dispatch({
				type: `dataCenterTransaction/setState`,
				payload: {
					[`state_${this.state.EffectName}`]:'day',
					[`loading_${this.state.EffectName}`]:true
				},
			})
		} else if (value == 'month') {
			this.state.dispatch({
				type: `dataCenterTransaction/setState`,
				payload: {
					[`loading_${this.state.EffectName}`]:true
				},
			})
			this.state.dispatch({
				type: `dataCenterTransaction/query_Month`,
				payload: {
					EffectName:this.state.EffectName,
					[`state_${this.state.EffectName}`]:'month',
				},
			})
		}

	}

	render() {
		return (
			<div>
				<Tabs defaultActiveKey="day" type="card" onChange={this.onChangeTabs}>
					<TabPane tab="天" key="day">
						<ReactEcharts
							option={{
								title: {
									text: `${this.props.title}`,
									textStyle: {
										color: `${this.props.titleColor}`,//'#D3D7DD'//主标题颜色
									},
									subtext: `${this.props.subtext}`//描述
								},
								tooltip: this.props.tooltip,
								legend: this.props.legend ? this.props.legend : {//标识
									data: ['', ''],
									show: false
								},
								//calculable : false,
								toolbox: this.props.toolbox,
								dataZoom: this.props.dataZoom,
								xAxis: this.state.xAxis,
								yAxis: this.state.yAxis,
								series: this.state.seriesDay
							}}
							style={{ height: this.props.minHeight }}
							showLoading={this.state.loading}
						/>
					</TabPane>
					<TabPane tab="月" key="month">
						<ReactEcharts
							option={{
								title: {
									text: `${this.props.title}`,
									textStyle: {
										color: `${this.props.titleColor}`,//'#D3D7DD'//主标题颜色
									},
									subtext: `${this.props.subtext}`//描述
								},
								tooltip: this.props.tooltip,
								legend: {//标识
									data: ['总行端口输入流量平均值', '总行端口输入流量最大值','总行端口输入流量最小值','总行端口输出流量平均值','总行端口输出流量最大值','总行端口输出流量最小值'],
									show: true
								},
								//calculable : false,
								toolbox: this.props.toolbox,
								dataZoom: this.props.dataZoom,
								xAxis: this.state.xAxis,
								yAxis: this.state.yAxis,
								series: this.state.seriesMonth
							}}
							style={{ height: this.props.minHeight }}
							showLoading={this.state.loading}
						/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
export default eChart
