import React from 'react'
import { config } from '../../utils'
import { Icon, Button, Badge, Tooltip } from 'antd'
import sound from '../../../public/alarm.mp3' 
import globe_app from './globe_app.png'
import mystyle from './Countdown.less'

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
	this.userBranch = this.props.userBranch
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
	this.userBranch = nextProps.userBranch
    if (this.countState) {
      this.start()
    }
  }

	  stop = () => {
		  window.clearInterval(this.interval)
		  this.dispatch({
  		type: 'oel/updateState',
  		payload: {
  			  countState: false,
  		},
 })
	}

  start = () => {
  // this.stop();
    window.clearInterval(this.interval)
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

genSound = () => {
	let autoPlay = false
	let flag = false
	if(this.userBranch=="XYK"){
		if(this.oelFilter === 'd430fcc3-a734-4a2a-9887-521916d2ad5c'||
		this.oelFilter === '539a9703-bb21-44f1-baf1-b996f6276e19' ||
		this.oelFilter === '5dfad22c-f7c3-4b82-89bd-7a9e795b07de' ||
		this.oelFilter === 'f4f260d0-4bb3-4838-8d6b-db9d1e71d3b5'||
		this.oelFilter === '9a760350-a46a-43c6-b924-2deb4e3de2ec' ||
		this.oelFilter === '7af339c5-962f-4d12-96a6-cc4337b7589b' ){
			flag = true
		}	
	}else{
		if(this.oelFilter === '6054f66b-90ba-43ed-80e0-80e1ae24f01b' ||
		this.oelFilter === '8414df37-77b4-4a6b-9b19-6b7b7dc48ed1' ||
		this.oelFilter === '702fc83e-c0de-49fe-b784-9b1fc5f95eb5' ||
		this.oelFilter === '2046c371-cc1e-40e3-9297-09621a4d6baf' ||
		this.oelFilter === '9c06ced9-65fe-4974-9cdb-a584e62f62e5' ||
		this.oelFilter === '0969cbe8-1e9d-4877-9893-63ea9f3ee260' ||
		this.oelFilter === 'e803f8c2-190a-4300-8b5e-6f89fadb1f2d' ||
		this.oelFilter === 'e0b82fd6-c339-41c6-bac9-7a6a551e3593' ||
		this.oelFilter === '7f473826-8422-4d13-99a5-7ceaa657f310'){
			flag = true
		}
	}
	if ((this.state.count >= 51 && this.state.count <= 60) && flag &&
	this.pagination.total > 0) {
		autoPlay = true
	}
	return <audio autoPlay={autoPlay} src={sound} key={autoPlay} />
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
//dashed 
	  render () {
		  return (<div style={{ height: 30 }}>{ this.genSound() }<span style={{ float: 'left' }}>
  <Button.Group>
    <Button onClick={this.stop.bind(this)} icon="pause" />
    <Button onClick={this.start.bind(this)} icon="caret-right" />
  </Button.Group>
</span>
  <span style={{ float: 'left', marginTop: 7 }}>&nbsp;&nbsp;下一次刷新还剩{this.state.count}秒</span>
  <span className={mystyle.Icon_explain} style={{ float: 'left' }}>  
  	{<img src={globe_app}/>}  表示全局应用系统
	{/* {<Badge status="success" />}表示存在知识库 */}
  </span>
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
