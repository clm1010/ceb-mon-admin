import React from 'react'
import ReactEcharts from 'echarts-for-react'

class HeatChart extends React.Component {
	constructor (props) {
    super(props)
    this.data = this.props.data
    this.title = this.props.title
    this.dispatch = this.props.dispatch
    this.loading = this.props.loading
  }

  getOtion () {
		let xData = ['', '', '', '', '', '', '']
		// y坐标
		let yData = ['DWDM', '存储设备', '网络相关', '主机', '数据库', '中间件', '应用可用性', '应用系统']
		// 随机数a-b
		function random (a, b) {
		   return Math.round(Math.random() * Math.abs(b - a) + Math.min(a, b))
		}
		let seriesData = [
			{
 name: '线路质量', type: 'heatmap', data: [[0, 0, 2]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '线路状态', type: 'heatmap', data: [[1, 0, 3]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[2, 0, 4]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '存储状态', type: 'heatmap', data: [[0, 1, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '磁盘', type: 'heatmap', data: [[1, 1, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '链路', type: 'heatmap', data: [[2, 1, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '性能', type: 'heatmap', data: [[3, 1, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[4, 1, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '关键区域', type: 'heatmap', data: [[0, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '关键链路', type: 'heatmap', data: [[1, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: 'F5', type: 'heatmap', data: [[2, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '防火墙', type: 'heatmap', data: [[3, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '协议加速器', type: 'heatmap', data: [[4, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[4, 2, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '状态', type: 'heatmap', data: [[0, 3, 5]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '硬件', type: 'heatmap', data: [[1, 3, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: 'CPU', type: 'heatmap', data: [[2, 3, 2]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '文件系统', type: 'heatmap', data: [[3, 3, 3]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '内核', type: 'heatmap', data: [[4, 3, 5]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '内存和交换空间', type: 'heatmap', data: [[5, 3, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[6, 3, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '状态', type: 'heatmap', data: [[0, 4, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '锁', type: 'heatmap', data: [[1, 4, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '表空间', type: 'heatmap', data: [[2, 4, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '归档日志', type: 'heatmap', data: [[3, 4, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[4, 4, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '状态', type: 'heatmap', data: [[0, 5, 5]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: 'JVM', type: 'heatmap', data: [[1, 5, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '线程', type: 'heatmap', data: [[2, 5, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: 'JDBC', type: 'heatmap', data: [[3, 5, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '队列深度', type: 'heatmap', data: [[4, 5, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[5, 5, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '进程', type: 'heatmap', data: [[0, 6, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '端口', type: 'heatmap', data: [[1, 6, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '链路', type: 'heatmap', data: [[2, 6, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '批量', type: 'heatmap', data: [[3, 6, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '会话', type: 'heatmap', data: [[4, 6, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '交易', type: 'heatmap', data: [[5, 6, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他', type: 'heatmap', data: [[6, 6, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},

			{
 name: '核心系统', type: 'heatmap', data: [[0, 7, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '总前系统', type: 'heatmap', data: [[1, 7, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '中间业务系统', type: 'heatmap', data: [[2, 7, 2]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '电子渠道系统', type: 'heatmap', data: [[3, 7, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '实体渠道系统', type: 'heatmap', data: [[4, 7, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: 'CCS IFTS GOLD', type: 'heatmap', data: [[5, 7, 1]], itemStyle: { normal: { borderColor: '#fff' } },
},
			{
 name: '其他系统', type: 'heatmap', data: [[6, 7, 0]], itemStyle: { normal: { borderColor: '#fff' } },
},
		]


		let colorData = ['#ed433c', '#f56a00', '#febe2d', '#1f90e6', '#7e0080', '#18a658']

		const option = {
	  title: {
        text: '接管顺序',
    },
    xAxis: {
        type: 'category',
        data: xData,
    },
    yAxis: {
        type: 'category',
        data: yData,
    },
    visualMap: {
        color: colorData,
        min: 0,
        max: 5,
        calculable: true,
        orient: 'vertical',
        left: 'left',
        bottom: '15%',
    },
    series: seriesData,
    label: {
    	normal: {
      	show: true,
      	formatter (v) {
        	return v.seriesName
        },
    	},
    },
    itemStyle: {
        emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
    },
	}
	return option
}

  render () {
    return (
      <ReactEcharts
        option={this.getOtion()}
        style={{ height: '400px', width: '100%' }}
      />
    )
  }
}

export default HeatChart
