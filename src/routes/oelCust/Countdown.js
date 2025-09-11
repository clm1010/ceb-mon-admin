import React from 'react'
import { config } from '../../utils'
import { Button, Badge, Tooltip } from 'antd'

class Countdown extends React.Component {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
    this.initValue = this.props.initValue
    this.state = { count: this.initValue }
    this.interval = 0
    this.step = this.props.step || 1
    this.filteredSeverityMap = this.props.filteredSeverityMap
    this.location = this.props.location
    this.pagination = this.props.pagination
    this.oelDatasource = this.props.oelDatasource
    this.oelViewer = this.props.oelViewer
    this.oelFilter = this.props.oelFilter
	this.orderBy = this.props.orderBy
	this.tagFilters = this.props.tagFilters
  }

  componentWillReceiveProps (nextProps) {
    this.dispatch = nextProps.dispatch
    this.initValue = nextProps.initValue
    this.state = { count: this.initValue }
    this.step = nextProps.step || 1
    this.filteredSeverityMap = nextProps.filteredSeverityMap
    this.location = nextProps.location
    this.pagination = nextProps.pagination
    this.oelDatasource = nextProps.oelDatasource
    this.oelViewer = nextProps.oelViewer
    this.oelFilter = nextProps.oelFilter
	this.orderBy = nextProps.orderBy
	this.tagFilters = nextProps.tagFilters
    if (this.countState) {
      this.start()
    }
  }

	  stop = () => {
		  clearInterval(this.interval)
		  this.dispatch({
  		type: 'oel/updateState',
  		payload: {
  			  countState: false,
  		},
 })
	}

  start = () => {
  // this.stop();
    clearInterval(this.interval)
	this.interval = setInterval(() => {
      let count = this.state.count - this.step
  	  if (this.props.onStep) {
  	  	  this.props.onStep(count)
  	  }
  	  if (count === 0) {
    		this.setState({ count: config.countdown })

        this.dispatch({
	        type: 'oel/query',
	        payload: {
	        current: this.pagination.current || '0',
				  pageSize: this.pagination.pageSize || '100',
				  oelDatasource: this.oelDatasource,
				  oelViewer: this.oelViewer,
	        oelFilter: this.oelFilter,
				  orderBy: this.orderBy,
	       },
			  })
  	  } else {
  	    this.setState({ count })
  	  }
 }, 1000)
}

handleChange = (value) => {
	// 删掉nav里的标签
	if (this.tagFilters.has('N_CustomerSeverity')) {
		this.tagFilters.delete('N_CustomerSeverity')
	}

	// 删掉nav里的标签
	if (this.tagFilters.has('n_CustomerSeverity')) {
		this.tagFilters.delete('n_CustomerSeverity')
	}

	// 删掉nav里的标签
	if (this.tagFilters.has('Severity')) {
		this.tagFilters.delete('Severity')
	}

	// 删掉nav里的标签
	if (this.tagFilters.has('severity')) {
		this.tagFilters.delete('severity')
	}

	// 如果是all
	if (value === '0') {
		this.tagFilters.set('Severity', { name: 'Severity', op: '=', value: String(value) })
	} else if (value !== 'all') {
		this.tagFilters.set('N_CustomerSeverity', { name: 'N_CustomerSeverity', op: '=', value: String(value) })
	}
	this.dispatch({
		type: 'oel/query',
		payload: {
			tagFilters: this.tagFilters,
			currentSelected: value,
			oelFilter: this.oelFilter,
			oelDatasource: this.oelDatasource,
			oelViewer: this.oelViewer,
			orderBy: this.orderBy,
		},
	})
}

  componentDidMount () {
		    this.start()
	  }

	  componentWillUnmount () {
		  this.stop()
	}

  /* restart = () => {
  	this.stop();
  	this.setState({count: this.initValue});
  	this.start();
  }*/

	  render () {
		  return (<div style={{ height: 30 }}><span style={{ float: 'left' }}>
  <Button.Group>
    <Button onClick={this.stop.bind(this)} icon="pause" />
    <Button onClick={this.start.bind(this)} icon="caret-right" />
  </Button.Group>
</span>
  <span style={{ float: 'left', marginTop: 7 }}>&nbsp;&nbsp;下一次刷新还剩{this.state.count}秒</span>
  <span style={{ float: 'right', marginTop: 7 }}>
    <Tooltip title="所有告警">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('all')} style={{ backgroundColor: 'black' }} showZero />
    </Tooltip>&nbsp;：&nbsp;
    <Tooltip title="N_CustomerSeverity : 1">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s1')} style={{ backgroundColor: '#ed433c' }} showZero />&nbsp;
    </Tooltip>
    <Tooltip title="N_CustomerSeverity : 2">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s2')} style={{ backgroundColor: '#f56a00' }} showZero />&nbsp;
    </Tooltip>
    <Tooltip title="N_CustomerSeverity : 3">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s3')} style={{ backgroundColor: '#febe2d' }} showZero />&nbsp;
    </Tooltip>
    <Tooltip title="N_CustomerSeverity : 4">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s4')} style={{ backgroundColor: '#1f90e6' }} showZero />&nbsp;
    </Tooltip>
    <Tooltip title="N_CustomerSeverity : 100">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s100')} style={{ backgroundColor: 'purple' }} showZero />&nbsp;
    </Tooltip>：
    <Tooltip title="已恢复告警">
      <Badge overflowCount={99999} count={this.filteredSeverityMap.get('s0')} style={{ backgroundColor: '#52c41a' }} showZero />&nbsp;
    </Tooltip>&nbsp;&nbsp;&nbsp;
  </span>
</div>)
	}
}

export default Countdown
