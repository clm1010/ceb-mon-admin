import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class eChart extends Component {
  	constructor(props) {
    	super(props)
    	this.state.xAxis = {type : 'category',data : []}//初始化坐标项
    	this.state.yAxis = {type : 'value',show: true},
		  this.state.series = [{name:'',type:'line',data:[]}]
      this.state.legend = { data:['',''], show: true }
		  this.state.loading = false
  	}

	//更新时调用
  	componentWillReceiveProps(nextProps) {
		this.state.xAxis = nextProps.xAxis
		this.state.yAxis = nextProps.yAxis
		this.state.series = nextProps.series
    this.state.legend = nextProps.legend
		this.state.loading = nextProps.loading
  	}

  	state = {

   	}

  	render() {
	    return (
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
			    legend: this.state.legend,
			    //calculable : false,
			    toolbox: this.props.toolbox,
			    dataZoom:this.props.dataZoom,
			    xAxis : this.state.xAxis,
			    yAxis : this.state.yAxis,
			    series : this.state.series
			  }}
	          showLoading={this.state.loading}
	        />
	    )
	  }
}
export default eChart
