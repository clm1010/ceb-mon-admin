import React from 'react'
import ReactEcharts from 'echarts-for-react'
import ecStat from 'echarts-stat'
import { exportExcel } from 'xlsx-oc'
import { Icon, Modal, message } from 'antd'

const ScatterChart = (scatterChart) => {
	let myRegressionscatter = ecStat.regression('linear', scatterChart.oodata)
	myRegressionscatter.points.sort((a, b) => {
		return a[0] - b[0]
	})
	let myRegressionscattertwo = ecStat.regression('linear', scatterChart.iidata)

	myRegressionscattertwo.points.sort((a, b) => {
		return a[0] - b[0]
	})
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
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
			data: ['端口输入流量带宽利用率', '端口输出流量带宽利用率','端口输出流量带宽利用率基线','端口输入流量带宽利用率基线'],
			textStyle: {
				fontSize: 9,
			},
			itemGap: 5,
			itemHeight: 15,
		},
		xAxis: {
			type: 'category',
			data: scatterChart.oorgcode.x,
		},
		yAxis: {
			type: 'value',
			min: 'dataMin',
        		max: 'dataMax',
			axisLabel: {
				formatter: '{value} %',
			},
			axisPointer: {
				snap: true,
			},
		},
		grid: {
			left: '3%',
			right: '10%',
			bottom: '15%',
			containLabel: true,
		},
		series: [{
				name: '端口输出流量带宽利用率',
				type: 'line',
				label: {
					emphasis: {
						show: true,
						position: 'left',
						textStyle: {
							color: 'blue',
							fontSize: 10,
						},
					},
				},
				data: scatterChart.oorgcode.y,
			},

			{
				name: '端口输入流量带宽利用率',
				type: 'line',
				label: {
					emphasis: {
						show: true,
						position: 'left',
						textStyle: {
							color: 'blue',
							fontSize: 10,
						},
					},
				},
				data: scatterChart.iorgcode.y,
			},
			{
				name: '端口输出流量带宽利用率基线',
				type: 'line',
				label: {
					emphasis: {
						show: true,
						position: 'left',
						textStyle: {
							color: 'blue',
							fontSize: 10,
						},
					},
				},
				data: scatterChart.iorgcode.y,
			},
			{
				name: '端口输入流量带宽利用率基线',
				type: 'line',
				label: {
					emphasis: {
						show: true,
						position: 'left',
						textStyle: {
							color: 'blue',
							fontSize: 10,
						},
					},
				},
				data: scatterChart.ibaseLine.y,
			},
		],
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
	}
	const onDownload = () => {
		Modal.confirm({
			title: '确认需要导出图表数据吗？',
			onOk () {
				let dataSource = []
				let headers = [{ k: 'time', v: '时间' },
							   { k: 'iorgcode', v: '端口输入流量带宽利用率' },
							   { k: 'oorgcode', v: '端口输出流量带宽利用率' },
							  ]
				if (scatterChart.oorgcode.y.length > 0) {
					for (let i = 0; i < scatterChart.oorgcode.y.length; i++) {
						let info = {}
						info.time = scatterChart.oorgcode.x[i]
						info.iorgcode = scatterChart.iorgcode.y[i]
						info.oorgcode = scatterChart.oorgcode.y[i]
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '端口利用率.xlsx')
				} else {
					message.info('图表无数据！')
				}
			},
			onCancel () {},
		})
	}
	return (
  <div>
    <div style={{ marginLeft: 17 }}><Icon type="download" style={{ fontSize: 13 }} onClick={() => onDownload()} /></div>
    <ReactEcharts
      option={option}
      style={{ height: '350px', width: '100%' }}
      showLoading={scatterChart.loading.effects['interfaceChart/usageQuerys']}
    />
  </div>
	)
}

export default ScatterChart
