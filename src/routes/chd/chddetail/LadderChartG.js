import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Icon, Modal, message } from 'antd'
import { exportExcel } from 'xlsx-oc'

const LadderChart = (ladderChart) => {
	//输出线性回归
	//	var myRegression = ecStat.regression('linear', ladderChart.odata);
	//	myRegression.points.sort(function(a, b) {
	//		return a[0] - b[0];
	//	});
	//	//输入线性回归
	//	var myRegression1 = ecStat.regression('linear', ladderChart.idata);
	//	myRegression1.points.sort(function(a, b) {
	//		return a[0] - b[0];
	//	});
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
			},
		},
		toolbox: {
			show: true,
			x: 'left',
			padding: 15,
			feature: {
				dataView: { show: true, readOnly: true },
			},
		},
		legend: {
			data: ['最小端口输入流量', '最大端口输入流量', '最小端口输出流量', '最大端口输出流量', '端口输入流量平均值', '端口输出流量平均值', '端口输出流量基线', '端口输入流量基线'],
			textStyle: {
				fontSize: 9,
			},
			itemGap: 5,
			itemHeight: 15,
			selected: {
				最小端口输入流量: false, 最大端口输入流量: false, 最小端口输出流量: false, 最大端口输出流量: false, 端口输入流量平均值: true, 端口输出流量平均值: true, 端口输出流量基线: true, 端口输入流量基线: true
			},
		},
		dataZoom: [{
			xAxisIndex: 0,
			filterMode: 'empty',
		},
		{
			yAxisIndex: 0,
			show: false,
			filterMode: 'empty',
		},
		{
			type: 'inside',
			xAxisIndex: 0,
			filterMode: 'empty',
		},
		{
			type: 'inside',
			yAxisIndex: 0,
			filterMode: 'empty',
		},
		],
		grid: {
			top: '25%',
			left: '3%',
			right: '10%',
			bottom: '15%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			splitLine: {
				show: false,
			},
			data: ladderChart.allTime, //时间
		},
		yAxis: {
			type: 'value',
			min: 'dataMin',
			max: 'dataMax',
			axisLabel: {
				formatter: '{value} Gbps',
			},
		},
		series: [{
			name: '最小端口输入流量',
			type: 'line',
			stack: '总量',
			itemStyle: {
				normal: {
					barBorderColor: 'yellow',
					color: 'yellow',
				},
				emphasis: {
					barBorderColor: 'rgba(0,0,0,0)',
					color: 'rgba(0,0,0,0)',
				},
			},
			barGap: '-100%',
			data: ladderChart.imin, //最小值
		},
		{
			name: '最大端口输入流量',
			type: 'line',
			stack: '总量',
			barGap: '-100%',
			data: ladderChart.imax, //最大值
		},
		{
			name: '端口输入流量平均值',
			type: 'line',
			data: ladderChart.iavg, //平均值
		},

		{
			name: '最小端口输出流量',
			type: 'line',
			stack: '总量two',
			itemStyle: {
				normal: {
					barBorderColor: 'green',
					color: 'green',
				},
				emphasis: {
					barBorderColor: 'rgba(0,0,0,0)',
					color: 'rgba(0,0,0,0)',
				},
			},
			data: ladderChart.omin,
		},
		{
			name: '最大端口输出流量',
			type: 'line',
			stack: '总量two',
			data: ladderChart.omax,
		},
		{
			name: '端口输出流量平均值',
			type: 'line',
			data: ladderChart.oavg,
		},
		{
			name: '端口输出流量基线',
			type: 'line',
			data: ladderChart.obase,
		},
		{
			name: '端口输入流量基线',
			type: 'line',
			data: ladderChart.ibase,
		},
		],
	}
	const onDownload = () => {
		Modal.confirm({
			title: '确认需要导出图表数据吗？',
			onOk() {
				let dataSource = []
				let headers = [{ k: 'time', v: '时间' },
				{ k: 'imin', v: '最小端口输入流量' },
				{ k: 'imax', v: '最大端口输入流量' },
				{ k: 'omin', v: '最小端口输出流量' },
				{ k: 'omax', v: '最大端口输出流量' },
				{ k: 'iavg', v: '端口输入流量平均值' },
				{ k: 'oavg', v: '端口输出流量平均值' },
				]
				if (ladderChart.allTime.length > 0) {
					for (let i = 0; i < ladderChart.allTime.length; i++) {
						let info = {}
						info.time = ladderChart.allTime[i]
						info.imin = ladderChart.imin[i]
						info.imax = ladderChart.imax[i]
						info.omin = ladderChart.omin[i]
						info.omax = ladderChart.omax[i]
						info.iavg = ladderChart.iavg[i]
						info.oavg = ladderChart.oavg[i]
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '端口流量统计表.xlsx')
				} else {
					message.info('图表无数据！')
				}
			},
			onCancel() { },
		})
	}
	return (
		<div>
			<div style={{ marginLeft: 17 }}><Icon type="download" style={{ fontSize: 13 }} onClick={() => onDownload()} /></div>
			<ReactEcharts
				option={option}
				style={{ height: '350px', width: '100%' }}
				showLoading={ladderChart.loading.effects['interfaceChart/flowQuery']}
			/>
		</div>
	)
}

export default LadderChart
