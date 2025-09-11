import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Dynamic extends Component {
  constructor(props) {
    super(props)
  }

	state = {
    setIntervalNum: 0,
    nums: this.props.queryTime
  }

  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
    	if(!this.props.buttonState){//暂停了
    		console.log('暂停')
    	}else{//未开始
    		this.state.nums = this.state.nums - 1
    		if( this.state.nums === 0 ){
    			this.props.dispatch({
           	type: `internetBank/${this.props.queryPath}`,
	          payload:{
	          	path: this.props.path,
	          	vlan_id: this.props.vlan_id
	          }
	        })
    			this.state.nums = this.props.queryTime
    		}
    	}
    }, 1000)
  }

  //初始化完开始调用
  componentDidMount() { 
    this.querys()
  }

  //更新时调用
  componentWillReceiveProps(nextProps) {
		this.option.xAxis[0].data = nextProps.list.time
		this.option.series[0].data = nextProps.list.ins
		this.option.series[1].data = nextProps.list.out
  }


  option = {
    title : {
      text: `${this.props.title}`,
      textStyle:{
        color: '#D3D7DD'
      },
      subtext: 'Kbps'
    },
    tooltip : {
      trigger: 'axis',
    },
    legend: {
      data:['蒸发量','降水量'],
      show: false
    },
    calculable : false,
    xAxis : [
      {
        type : 'category',
        axisPointer: {
          type: 'shadow'
        },
        data : [],
        axisLine: {
          lineStyle: {
            type: 'dotted',
            color: '#FFFFFF',
            width:'2',
            fontSize:10
          }
        },
      }
    ],
    yAxis : [
      {
        type : 'value',
        show: true,
        splitLine:{
          show: false,
          lineStyle:{
            color: [0.08,'#FFFFFF'],
            type: 'solid'
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#D3D7DD',
            width:'1',
            fontSize:10
          }
        },
      }
    ],
    series : [
      {
        name:'接收比特率',
        type:'bar',
        itemStyle: {
          barBorderRadius: 5,
          normal: {
            color: '#77acdd'
          }
        },
        data:[]
      },
      {
        name:'发送比特率',
        type:'bar',
        itemStyle: {
          barBorderRadius: 5,
          normal: {
            color: '#9ebd6c'
          }
        },
        data:[]
      }
    ]
  };


  //关闭页面清理请求函数
  componentWillUnmount() {
    clearInterval(this.state.setIntervalNum)
  }

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.option}
          style={{ position:'absolute', width: '100%', height: '100%' }}
        />
      </div>
    )
  }
}
export default Dynamic
