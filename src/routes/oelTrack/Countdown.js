import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import queryString from "query-string";
class Countdown extends React.Component {
	constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
    this.initValue = this.props.initValue
    this.state = { count: this.initValue }
    this.interval = 0
	this.step = this.props.step || 1
	this.countState = this.props.countState
  }

  componentWillReceiveProps (nextProps) {
  	this.dispatch = nextProps.dispatch
    this.initValue = nextProps.initValue
    this.state = { count: this.initValue }
	this.step = nextProps.step || 1
	this.countState = nextProps.countState
		if (this.countState) {
			this.start()
		}else{
			clearInterval(this.interval)
		}
  }

	stop = () => {
		clearInterval(this.interval)
		this.dispatch({
  		type: 'oelTrack/setState',
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
  	  	this.props.onComplete && this.props.onComplete()
  	  	//this.stop();
		this.queryInfo()
		/*//1023
  	  	this.dispatch({
  	  		type: 'oelTrack/query',
  	  		payload: {},
  	  	})*/
  	  } else {
  	      this.setState({ count })
  	  }
  	}, 1000)
  }
  queryInfo = () => {
  	
	var query = queryString.parse(location.search);
	if (query.q === undefined) {
		query.q=''
	}
  	this.dispatch({
  	  	type: 'oelTrack/query',
  	  	payload: {...query},
  	})
  }

  componentDidMount () {
	if (this.countState) {
		this.start()
	}
	}

	componentWillUnmount () {
		this.stop()
	}

	render () {
		return (<div><span style={{ float: 'right' }} ><span>
  <Button.Group>
    <Button onClick={this.queryInfo.bind(this)} icon="sync" />
    <Button onClick={this.stop.bind(this)} icon="pause" />
    <Button onClick={this.start.bind(this)} icon="caret-right" />
  </Button.Group>
                                                 </span>
  <span style={{ float: 'right', marginTop: 5, fontSize: 12 }}>&nbsp;&nbsp;下一次刷新还剩{this.state.count}秒</span>
</span>
</div>)
	}
}

export default Countdown
