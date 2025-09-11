//响应时间图表
import React from 'react'
import ReactEcharts from 'echarts-for-react'

const ResponseLadderChart = (ladderChart) => {
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
				padding: 35,
				feature: {
					dataView: { show: true, readOnly: true },
				},
			},
		    legend: {
		        data: ['最小响应时间', '最大响应时间', '平均响应时间'],
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
		    series: [
		        {
		            name: '最小响应时间',
		            type: 'bar',
		            stack: '总量',
		            itemStyle: {
		                normal: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)',
		                },
		                emphasis: {
		                    barBorderColor: 'rgba(0,0,0,0)',
		                    color: 'rgba(0,0,0,0)',
		                },
		            },
				        barGap: '-100%',
		            data: ladderChart.min, //最小值
		        },
		        {
		            name: '最大响应时间',
		            type: 'bar',
		            stack: '总量',
		            barGap: '-100%',
		            data: ladderChart.max, //最大值
		        },
		        {
		        		name: '平均响应时间',
		        		type: 'line',
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
		    return (
  <ReactEcharts
    option={option}
    style={{ height: '280px', width: '100%' }}
  />
    )
	}

export default ResponseLadderChart
