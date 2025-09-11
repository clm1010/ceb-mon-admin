//内存使用率图表
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { exportExcel } from 'xlsx-oc'
import { Icon, Modal, message } from 'antd'

const MemLadderChart = (ladderChart) => {
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
	        data: ['最小内存使用率', '最大内存使用率', '内存平均使用率'],
	        textStyle: {
	        		fontSize: 9,
	        },
	        itemGap: 5,
	        itemHeight: 15,
	    },
	    dataZoom: [
        {
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
	        left: '3%',
	        right: '4%',
	        bottom: '15%',
	        containLabel: true,
	    },
	    xAxis: {
	        type: 'category',
	        splitLine: { show: false },
	        data: ladderChart.allTime, //时间
	    },
	    yAxis: {
	        type: 'value',
	        min: 'dataMin',
   			max: 'dataMax',
			splitLine: {
	        		show: false,
	        },
	        axisLabel: {
	        		formatter: '{value} %',
	        },
	    },
	    series: [
        {
            name: '最小内存使用率',
            type: 'bar',
            stack: '总量',
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(192,249,151,1)',
                    color: 'rgba(192,249,151,1)',
                },
                emphasis: {
                    barBorderColor: 'rgba(192,249,151,1)',
                    color: 'rgba(192,249,151,1)',
                },
            },
	        barGap: '-100%',
	        axisLabel: {
	        		formatter: '{value} %',
	        },
            data: ladderChart.min, //最小值
        },
        {
            name: '最大内存使用率',
            type: 'bar',
            stack: '总量',
            barGap: '-100%',
            axisLabel: {
	        		formatter: '{value} %',
	        },
            data: ladderChart.max, //最大值
        },
        {
        		name: '内存平均使用率',
        		type: 'line',
        		axisLabel: {
	        		formatter: '{value} %',
	        },
           	data: ladderChart.avg, //平均值
        },
        {
	        name: 'line',
	        type: 'line',
	        showSymbol: false,
	        data: '', //线性回归
	    	},
	    ],
	}
	const onDownload = () => {
		Modal.confirm({
			title: '确认需要导出图表数据吗？',
			onOk () {
				let dataSource = []
				let headers = [{ k: 'time', v: '时间' }, //ladderChart.allTime
							   { k: 'min', v: '最小内存使用率' }, //ladderChart.min
							   { k: 'max', v: '最大内存使用率' }, //ladderChart.max
							   { k: 'avg', v: '内存平均使用率' }, //ladderChart.avg
							  ]
				if (ladderChart.allTime.length > 0) {
					for (let i = 0; i < ladderChart.allTime.length; i++) {
						let info = {}
						info.time = ladderChart.allTime[i]
						info.min = ladderChart.min[i]
						info.max = ladderChart.max[i]
						info.avg = ladderChart.avg[i]
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '内存使用率.xlsx')
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
      style={{ height: '280px', width: '100%' }}
      showLoading={ladderChart.loading.effects['chd/queryMem']}
    />
  </div>
    )
}

export default MemLadderChart
