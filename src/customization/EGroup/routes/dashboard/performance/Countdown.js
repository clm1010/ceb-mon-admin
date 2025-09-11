import React from 'react'
import { routerRedux } from 'dva/router'
import { Button, Select } from 'antd'

class Countdown extends React.Component {
	constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
    this.initValue = this.props.initValue
    this.state = { count: this.initValue }
    this.interval = 0
    this.step = this.props.step || 1
//  this.filteredSeverityMap = this.props.filteredSeverityMap;
    this.location = this.props.location
//  this.pagination = this.props.pagination;
//  this.oelDatasource = this.props.oelDatasource;
//  this.oelViewer = this.props.oelViewer;
//  this.oelFilter = this.props.oelFilter;
//  this.orderBy = this.props.orderBy;
  }

  componentWillReceiveProps (nextProps) {
  	this.dispatch = nextProps.dispatch
    this.initValue = nextProps.initValue
    this.state = { count: this.initValue }
//  this.step      = nextProps.step || 1;
//  this.filteredSeverityMap = nextProps.filteredSeverityMap;
    this.location = nextProps.location
//  this.pagination = nextProps.pagination;
//  this.oelDatasource = nextProps.oelDatasource;
//  this.oelViewer = nextProps.oelViewer;
//  this.oelFilter = nextProps.oelFilter;
//  this.orderBy = nextProps.orderBy;
		if (this.countState) {
			this.start()
		}
  }
	handleUpload = (value) => {
		this.state.count = parseInt(value)
	}
	stop = () => {
		clearInterval(this.interval)
		this.dispatch({
  		type: 'performance/updateState',
  		payload: {
  			countState: false,
  		},
  	})
	}

	start = () => {
		//this.stop();
		clearInterval(this.interval)

		this.interval = setInterval(() => {
  	  let count = this.state.count - this.step
  	  if (this.props.onStep) {
  	  	this.props.onStep(count)
  	  }
  	  if (count == 0) {
  	  	this.dispatch({
  	  		type: 'performance/querySuccess',
  	  		payload: {
  	  			availPortState: true, //利用率最高的10条端口
			   	top20CpuState: true, ////Top 20  响应时间表 / Top 20 丢包率表
			   	flowPortState: true, //流量总量最高的10条端口(两个小时内数据)
			   	respnsLosSatet: true, //Top 20 CPU使用率表 / 内存使用率表
  	  		},
  	  	})
  	  	 this.dispatch(routerRedux.push('/dashboard/performance'))
  	  } else {
  	      this.setState({ count })
  	  }
  	}, 1000)
  }

  componentDidMount () {
		this.start()
	}

	componentWillUnmount () {
		this.stop()
	}

  /*restart = () => {
  	this.stop();
  	this.setState({count: this.initValue});
  	this.start();
  }*/

	render () {
		return (
  <div style={{ height: 30, float: 'right', marginTop: '9px' }}>
    <span style={{ float: 'left' }}>
      <Button.Group>
        <Button onClick={this.stop.bind(this)} icon="pause" />
        <Button onClick={this.start.bind(this)} icon="caret-right" />
      </Button.Group>
    </span>
    <span style={{ float: 'left' }}>
      <Select defaultValue="60" style={{ width: 80, height: 28, float: 'left' }} onChange={this.handleUpload.bind(this)}>
        <Select.Option value="60">1分钟</Select.Option>
        <Select.Option value="120">2分钟</Select.Option>
        <Select.Option value="300">5分钟</Select.Option>
      </Select>
    </span>
    <span style={{ float: 'left', marginTop: 7 }}>&nbsp;&nbsp;下一次刷新还剩{this.state.count}秒</span>
  </div>
		)
	}
}

export default Countdown
