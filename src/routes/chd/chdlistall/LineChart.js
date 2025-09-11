import React from 'react'
import ReactEcharts from 'echarts-for-react'

const LineChart = (cpuLineChart) => {
  const option = {
    xAxis: {
        type: 'category',
        data: cpuLineChart.x,
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
    series: [{
        data: cpuLineChart.y,
        type: 'line',
        areaStyle: {},
    }],
    toolbox: {
				show: true,
				x: 'left',
				padding: 35,
				feature: {
					dataView: { show: true, readOnly: true },
				},
			},
    dataZoom: [
        {
            xAxisIndex: 0,
            filterMode: 'empty',
        },
        {
            yAxisIndex: 0,
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

  return (
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={option}
          style={{ height: '280px', width: '100%', padding: 0 }}
        />
      </div>
    </div>
  )
}

export default LineChart
