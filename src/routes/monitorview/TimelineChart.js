import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'

class Barchart extends React.Component {
	constructor (props) {
    super(props)
    this.data = this.props.data
    this.title = this.props.title
    this.dispatch = this.props.dispatch
    this.loading = this.props.loading
  }

  getOtion () {
  	let data = []
		let dataCount = 10
		let startTime = +new Date()
		let categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		let types = [
		    { name: 'JS Heap', color: '#7b9ce1' },
		    { name: 'Documents', color: '#bd6d6c' },
		    { name: 'Nodes', color: '#75d874' },
		    { name: 'Listeners', color: '#e0bc78' },
		    { name: 'GPU Memory', color: '#dc77dc' },
		    { name: 'GPU', color: '#72b362' },
		]

		// Generate mock data
		echarts.util.each(categories, (category, index) => {
		    let baseTime = startTime
		    for (let i = 0; i < dataCount; i++) {
		        let typeItem = types[Math.round(Math.random() * (types.length - 1))]
		        let duration = Math.round(Math.random() * 10000)
		        data.push({
		            name: typeItem.name,
		            value: [
		                index,
		                baseTime,
		                baseTime += duration,
		                duration,
		            ],
		            itemStyle: {
		                normal: {
		                    color: typeItem.color,
		                },
		            },
		        })
		        baseTime += Math.round(Math.random() * 2000)
		    }
		})

		function renderItem (params, api) {
		    let categoryIndex = api.value(0)
		    let start = api.coord([api.value(1), categoryIndex])
		    let end = api.coord([api.value(2), categoryIndex])
		    let height = api.size([0, 1])[1] * 0.6

		    return {
		        type: 'rect',
		        shape: echarts.graphic.clipRectByRect({
		            x: start[0],
		            y: start[1] - height / 2,
		            width: end[0] - start[0],
		            height,
		        }, {
		            x: params.coordSys.x,
		            y: params.coordSys.y,
		            width: params.coordSys.width,
		            height: params.coordSys.height,
		        }),
		        style: api.style(),
		    }
		}

    const option = {
    tooltip: {
        formatter (params) {
            return `${params.marker + params.name}: ${params.value[3]} ms`
        },
    },
    title: {
        text: 'Profile',
        left: 'center',
    },
    legend: {
        data: ['bar', 'error'],
    },
    dataZoom: [{
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 400,
        height: 10,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa',
        },
        labelFormatter: '',
    }, {
        type: 'inside',
        filterMode: 'weakFilter',
    }],
    grid: {
        height: 300,
    },
    xAxis: {
        min: startTime,
        scale: true,
    },
    yAxis: {
        data: categories,
    },
    series: [{
        type: 'custom',
        renderItem,
        itemStyle: {
            normal: {
                opacity: 0.8,
            },
        },
        encode: {
            x: [1, 2],
            y: 0,
        },
        data,
    }],
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
        style={{ height: '600px', width: '100%' }}
        onEvents={onEvents}
      />
    )
  }
}

export default Barchart
