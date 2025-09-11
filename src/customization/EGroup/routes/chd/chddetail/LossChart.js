import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { exportExcel } from 'xlsx-oc'
import { Icon, Modal, message } from 'antd'

const LossChart = (lossChart) => {
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
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
			data: ['端口输入丢包数', '端口输出丢包数'],
		},
		xAxis: {
			type: 'category',
			data: lossChart.lossChart.y,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '端口输入丢包数',
				data: lossChart.lossChart.inx,
				type: 'line',
			},
			{
				name: '端口输出丢包数',
				data: lossChart.lossChart.outx,
				type: 'line',
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
							   { k: 'inx', v: '端口输入丢包数' },
							   { k: 'outx', v: '端口输出丢包数' },
							  ]
				if (lossChart.lossChart.y.length > 0) {
					for (let i = 0; i < lossChart.lossChart.y.length; i++) {
						let info = {}
						info.time = lossChart.lossChart.y[i]
						info.inx = lossChart.lossChart.inx[i]
						info.outx = lossChart.lossChart.outx[i]
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '端口丢包数.xlsx')
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
      showLoading={lossChart.lossChart.loading.effects['interfaceChart/queryLoss']}
    />
  </div>
	)
}

export default LossChart
