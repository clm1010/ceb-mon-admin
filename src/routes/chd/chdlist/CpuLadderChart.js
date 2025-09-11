//CPU使用率图表
import React from 'react'
import ReactEcharts from 'echarts-for-react'

const CpuLadderChart = (ladderChart) => {
		const option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: { // 坐标轴指示器，坐标轴触发有效
		            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
		        },
		    },
		    toolbox: {
				show: true,
				x: 'left',
				padding: 35,
				feature: {
					dataView: { show: true, readOnly: true },
				},
			},
		    legend: {
		        data: ladderChart.showLine,
		        textStyle: {
		        	fontSize: 9,
		        },
		        itemGap: 2,
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
		        max: 100,
				    splitLine: {
		        	show: false,
		        },
		        axisLabel: {
		        	formatter: '{value} %',
		        },
		    },
		    series:ladderChart.dataSource
		}
		    return (
  <ReactEcharts
    option={option}
    style={{ height: '280px', width: '100%' }}
  />
    )
	}

export default CpuLadderChart
