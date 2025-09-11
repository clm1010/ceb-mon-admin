import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

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
			    toolbox: this.props.toolbox,
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
