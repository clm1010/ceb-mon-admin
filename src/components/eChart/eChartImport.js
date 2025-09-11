import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { exportExcel } from 'xlsx-oc'
import { Icon, Modal, message } from 'antd'

class eChart extends Component {
  	constructor(props) {
    	super(props)
    	this.state.xAxis = {type : 'category',data : []}//初始化坐标项
    	this.state.yAxis = {type : 'value',show: true},
		this.state.series = [{name:'',type:'line',data:[]}]
		this.state.loading = false
  	}

	//更新时调用
  	componentWillReceiveProps(nextProps) {
		this.state.xAxis = nextProps.xAxis
		this.state.yAxis = nextProps.yAxis
		this.state.series = nextProps.series
		this.state.loading = nextProps.loading
  	}

  	state = {
  		
   	}
	onDownload = (xValue,yValue) => {
		Modal.confirm({
			title: '确认需要导出图表数据吗？',
			onOk() {
				let dataSource = []
				let headers = [{ k: 'time', v: '时间' },{k:'value', v:'值'}]//ladderChart.allTime
				let num = []
				let x = xValue[0].data
				let y = yValue[0].data
				if (x.length > 0) {
					for (let i = 0; i < x.length; i++) {
						let info = {}
						info.time = x[i]
						info.value = y[i]
						console.log(info)
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '性能数据.xlsx')
				} else {
					message.info('图表无数据！')
				}
			},
			onCancel() { },
		})
	}
  	render() {
	    return (
	      <div>
	        <ReactEcharts
	          option={{
			    title : {
			      text: `${this.props.title}`,
			      textStyle:{
			        color: `${this.props.titleColor}`,//'#D3D7DD'//主标题颜色
			      },
			      subtext: `${this.props.subtext}`//描述
			    },
			    tooltip : this.props.tooltip,
			    legend: this.props.legend ? this.props.legend : {//标识
			      data:['',''],
			      show: false
			    },			
			    //calculable : false,
			    toolbox: {feature:{myDown:{show:true,title:'导出',
						icon:'path://M518.72 128a32 32 0 0 1 32 32v440.768l160-156.416a32 32 0 1 1 44.8 45.76l-214.464 209.6a32 32 0 0 1-45.12-0.384L288 489.792a32 32 0 0 1 45.44-45.056l153.28 154.432V160a32 32 0 0 1 32-32z M160 575.872a32 32 0 0 1 32 32v192a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-192a32 32 0 0 1 64 0v192a96 96 0 0 1-96 96h-576a96 96 0 0 1-96-96v-192a32 32 0 0 1 32-32z',
					 	onclick:() => this.onDownload(this.state.xAxis,this.state.series)}}},
			    dataZoom:this.props.dataZoom,
			    xAxis : this.state.xAxis,
			    yAxis : this.state.yAxis,
			    series : this.state.series
			  }}
	          style={{ height: this.props.minHeight }}
	          showLoading={this.state.loading}
	        />
	      </div>
	    )
	  }
}
export default eChart
