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
  	let seriesData = []

  	for (let _data of this.data) {
  		switch (_data.level) {
  			case '5':
  				seriesData.push({
			        value: _data.number,
			        severity: 5,
			        name: '一级',
			        dispatch: this.dispatch,
			        itemStyle: {
			            normal: {
			            	color: '#ed433c',
			            	label: {
				            	show: true,
				            	textStyle: {
				            		color: '#000000',
				            	},
				            	position: 'top',
				            },
			            },
			        },
			    })
			    break
				case '4':
  				seriesData.push({
			        value: _data.number,
			        severity: 4,
			        name: '二级',
			        dispatch: this.dispatch,
			        itemStyle: {
			            normal: {
			            	color: '#f56a00',
			            	label: {
				            	show: true,
				            	textStyle: {
				            		color: '#000000',
				            	},
				            	position: 'top',
				            },
			            },
			        },
			    })
			    break
			  case '3':
  				seriesData.push({
			        value: _data.number,
			        severity: 3,
			        name: '三级',
			        dispatch: this.dispatch,
			        itemStyle: {
			            normal: {
			            	color: '#febe2d',
			            	label: {
				            	show: true,
				            	textStyle: {
				            		color: '#000000',
				            	},
				            	position: 'top',
				            },
			            },
			        },
			    })
			    break
			  case '2':
  				seriesData.push({
			        value: _data.number,
			        severity: 2,
			        name: '四级',
			        dispatch: this.dispatch,
			        itemStyle: {
			            normal: {
			            	color: '#1f90e6',
			            	label: {
				            	show: true,
				            	textStyle: {
				            		color: '#000000',
				            	},
				            	position: 'top',
				            },
			            },
			        },
			    })
			    break
			   case '1':
  				seriesData.push({
			        value: _data.number,
			        severity: 1,
			        name: '五级',
			        dispatch: this.dispatch,
			        itemStyle: {
			            normal: {
			            	color: 'purple',
			            	label: {
				            	show: true,
				            	textStyle: {
				            		color: '#000000',
				            	},
				            	position: 'top',
				            },
			            },
			        },
			    })
			    break
  		}
  	}

    const option = {
    	title: {
    		text: this.title,
    		left: 'center',
    		textStyle: {
    			color: '#333',
    			fontSize: 12,
    		},
    	},
	    grid: {
	    		top: 20,
	        left: '0%',
	        right: '0%',
	        bottom: '0%',
	        containLabel: true,
	    },
	    series: [{
        type: 'pie',
        data: seriesData,
        center: ['50%', '60%'],
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
        style={{ height: '150px', width: '100%' }}
        onEvents={onEvents}
      />
    )
  }
}

export default Barchart
