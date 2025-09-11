import React from 'react'
import ReactEcharts from 'echarts-for-react'

const LineChart = (cpuLineChart) => {
  const option = {
    backgroundColor: '#EFEFEF',
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: cpuLineChart.data.categories,
        show: false
    },
    yAxis: {
        type: 'value',
        boundaryGap: false,
        show: false,
    },
    grid: {
      show: false,
      borderWidth: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: [{
        data: cpuLineChart.data.values,
        showSymbol: false,
        type: 'line',
        areaStyle: {
          color: 'rgba(0, 136, 212, 0.5)'
        },
    }],
	}

  return (
    <div>
      <ReactEcharts style={{ height:'20px', width:'100%' }}
          option={option}
        />
    </div>
  )
}

export default LineChart
