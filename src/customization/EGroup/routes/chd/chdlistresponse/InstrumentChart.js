import React from 'react'
import ReactEcharts from 'echarts-for-react'
//import './theme/macarons.js'

const InstrumentChart = (instrumentChart) => {
  const option = {
    	tooltip: {
        formatter: '{a} <br/>{b} : {c}',
    	},

   	 	series: [
        {
           name: '响应时间 毫秒',
           type: 'gauge',
           center: ['25%', '39%'], // 默认全局居中
           radius: '65%',
           axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    width: 5,
                },
            },
            axisTick: { // 坐标轴小标记
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                },
            },
            splitLine: { // 分隔线
                length: 20, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto',
                },
            },
            axisLabel: {
            		fontSize: 9,
            },
            detail: {
            		fontSize: 15,
            		formatter: '{value}ms',
            },
           data: [{ value: instrumentChart.avgResTime, name: '' }],
        },
        {
           name: '丢包率 %',
           type: 'gauge',
           center: ['75%', '39%'],
           radius: '65%',
           axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    width: 5,
                },
            },
            axisTick: { // 坐标轴小标记
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                },
            },
            splitLine: { // 分隔线
                length: 20, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto',
                },
            },
            axisLabel: {
            		fontSize: 9,
            },
            detail: {
            		fontSize: 15,
            		formatter: '{value}%',
            },
           data: [{ value: instrumentChart.avgLosRate, name: '' }],
        },
    	],
		}

  return (
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={option}
          style={{ height: '190px', width: '100%' }}
        />
      </div>
    </div>
  )
}


export default InstrumentChart
