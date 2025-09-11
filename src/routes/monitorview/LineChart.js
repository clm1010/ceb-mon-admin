import React from 'react'
import ReactEcharts from 'echarts-for-react'

class Barchart extends React.Component {
	constructor (props) {
    super(props)
    this.data = this.props.data
    this.title = this.props.title
    this.dispatch = this.props.dispatch
    this.loading = this.props.loading
  }

  getOtion () {
    const option = {
    	title: {
	        text: '上地电信支付宝专线流量带宽大小和占用率',
	    },
	    tooltip: {
	        trigger: 'axis',
	    },
	    legend: {
	        data: ['流量入向', '流量出向'],
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true,
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {},
	        },
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
	    },
	    yAxis: {
	        type: 'value',
	    },
	    series: [
	        {
	            name: '流量入向',
	            type: 'line',
	            stack: '总量',
	            data: [120, 132, 101, 134, 90, 230, 210],
	        },
	        {
	            name: '流量出向',
	            type: 'line',
	            stack: '总量',
	            data: [220, 182, 191, 234, 290, 330, 310],
	        },
	    	],
			}

    return option
  }

  onChartClick (event) {
  	let tagFilters = new Map()
  	tagFilters.set('severity', { name: 'severity', op: '=', value: event.data.severity })

  	//触发查询展示oel报表
		event.data.dispatch({
      type: 'oel/query',
      payload: {
        tagFilters,
        currentSelected: event.data.severity,
      },
    })

    //显示弹出窗口
    event.data.dispatch({
      type: 'charts/updateState',
      payload: {
        modalVisible: true,
      },
    })
  }

  render () {
		let onEvents = {
			click: this.onChartClick,
		}

    return (
      <ReactEcharts
        option={this.getOtion()}
        style={{ height: '300px', width: '100%' }}
        onEvents={onEvents}
      />
    )
  }
}

export default Barchart
