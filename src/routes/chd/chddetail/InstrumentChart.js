import React from 'react'
import ReactEcharts from 'echarts-for-react'
//import './theme/macarons.js'

const InstrumentChart = (instrumentChart) => {
  const option = {
    	tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
    	},

   	 	series: [
        {
           name: '出利用率',
           type: 'gauge',
           center: ['25%', '30%'], // 默认全局居中
           radius: '55%',
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
           data: [{ value: instrumentChart.avgTranRate, name: '' }],
        },
        {
           name: '入利用率',
           type: 'gauge',
           center: ['75%', '30%'],
           radius: '55%',
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
           data: [{ value: instrumentChart.avgRecRate, name: '' }],
        },
    	],
		}

  return (
    <div className="examples">
      <div className="parent">
        <ReactEcharts
          option={option}
          style={{ height: '280px', width: '100%' }}
        />
      </div>
    </div>
  )
}


export default InstrumentChart
