import React from 'react'
import echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import chinaJs from '../../utils/map/china.json'

class Barchart extends React.Component {
	constructor (props) {
    super(props)
    this.data = this.props.data
    this.dispatch = this.props.dispatch
    this.loading = this.props.loading
  }

  getOtion () {
  	let data = [
     	{ name: '拉萨', value: 24 },
     	{ name: '上海', value: 25 },
     	{ name: '厦门', value: 26 },
     	{ name: '福州', value: 29 },
     { name: '广州', value: 38 },
     { name: '太原', value: 39 },
     { name: '深圳', value: 41 },
     { name: '珠海', value: 42 },
     { name: '海口', value: 44 },
     { name: '沈阳', value: 50 },
     { name: '苏州', value: 50 },
     { name: '南昌', value: 54 },
     { name: '吉林', value: 56 },
     { name: '西宁', value: 57 },
     { name: '成都', value: 58 },
     { name: '西安', value: 61 },
     { name: '重庆', value: 66 },
     { name: '南京', value: 67 },
     { name: '贵阳', value: 71 },
     { name: '北京', value: 79 },
     { name: '乌鲁木齐', value: 84 },
     { name: '杭州', value: 84 },
     { name: '济南', value: 92 },
     { name: '兰州', value: 99 },
     { name: '天津', value: 105 },
     { name: '郑州', value: 113 },
     { name: '哈尔滨', value: 114 },
     { name: '石家庄', value: 147 },
     { name: '长沙', value: 175 },
     { name: '武汉', value: 273 },
		]
		let geoCoordMap = {
    拉萨: [91.11, 29.97],
    上海: [121.48, 31.22],
    厦门: [118.1, 24.46],
    福州: [119.3, 26.08],
    瓦房店: [121.979603, 39.627114],
    广州: [113.23, 23.16],
    太原: [112.53, 37.87],
    昆明: [102.73, 25.04],
    深圳: [114.07, 22.62],
    珠海: [113.52, 22.3],
    海口: [110.35, 20.02],
    沈阳: [123.38, 41.8],
    苏州: [120.62, 31.32],
    南昌: [115.89, 28.68],
    吉林: [126.57, 43.87],
    阳江: [111.95, 21.85],
    呼和浩特: [111.65, 40.82],
    成都: [104.06, 30.67],
    西安: [108.95, 34.27],
    重庆: [106.54, 29.59],
    南京: [118.78, 32.04],
    贵阳: [106.71, 26.57],
    北京: [116.46, 39.92],
    乌鲁木齐: [87.68, 43.77],
    杭州: [120.19, 30.26],
    济南: [117, 36.65],
    兰州: [103.73, 36.03],
    天津: [117.2, 39.13],
    哈尔滨: [126.63, 45.75],
    石家庄: [114.48, 38.03],
    长沙: [113, 28.21],
    武汉: [114.31, 30.52],
}
	let myData = [
		{ name: '海门', value: [121.15, 31.89, 90] },
	  { name: '鄂尔多斯', value: [109.781327, 39.608266, 120] },
	  { name: '招远', value: [120.38, 37.35, 142] },
	  { name: '舟山', value: [122.207216, 29.985295, 123] },
	]

  	let seriesData = []

  	echarts.registerMap('china', chinaJs)

    const option = {
	    geo: {
	    	map: 'china',
	    	zoom: 1.2,
	    	itemStyle: {					// 定义样式
            normal: {					// 普通状态下的样式
                areaColor: '#CCCCCC',
                borderColor: '#fff',
            },
            emphasis: {					// 高亮状态下的样式
                areaColor: '#EEEEEE',
            },
        },
        label: {
        	normal: {
        		color: '#000',
        	},
        },
	    },
	    series: [
	    	{
	    		name: '告警',
	    		type: 'effectScatter',
	    		coordinateSystem: 'geo',
	    		data: myData,
	    	},
	    ],
    }
    return option
  }

  render () {
    return (
      <ReactEcharts
        option={this.getOtion()}
        style={{ height: '375px', width: '100%' }}
        className="react_for_echarts"
      />
    )
  }
}

export default Barchart
