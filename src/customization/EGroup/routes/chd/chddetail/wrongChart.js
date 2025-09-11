import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Icon, Modal, message } from 'antd'
import { exportExcel } from 'xlsx-oc'

const wrongChart = (wrong) => {
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
			data: ['端口输入错包数', '端口输出错包数'],
		},
		xAxis: {
			type: 'category',
			data: wrong.wrongChart.y,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				name: '端口输入错包数',
				data: wrong.wrongChart.inx,
				type: 'line',
			},
			{
				name: '端口输出错包数',
				data: wrong.wrongChart.outx,
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
							   { k: 'inx', v: '端口输入错包数' },
							   { k: 'outx', v: '端口输出错包数' },
							  ]
				if (wrong.wrongChart.y.length > 0) {
					for (let i = 0; i < wrong.wrongChart.y.length; i++) {
						let info = {}
						info.time = wrong.wrongChart.y[i]
						info.inx = wrong.wrongChart.inx[i]
						info.outx = wrong.wrongChart.outx[i]
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '端口错包数.xlsx')
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
      showLoading={wrong.wrongChart.loading.effects['interfaceChart/queryWrong']}
    />
  </div>
	)
}

export default wrongChart
