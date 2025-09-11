import React from 'react'
import { Table } from 'antd'
class lineTable extends React.Component {
  constructor(props){
    super(props)
  }
  
  componentWillReceiveProps(nextProps) {
		this.state.dataSource = nextProps.dataSource
		this.state.colums = nextProps.colums
		this.state.loading = nextProps.loading
		this.state.nums = this.props.nums
    this.state.buttonState = this.props.buttonState
	}
  
  state = {
    setIntervalNum: 0,
    nums: 10,
    dataSource: [],
    colums: [],
    loading: true,
    buttonState: true
  }
  
  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
    	if(!this.state.buttonState){//暂停了
    		console.log('暂停')
    	}else{//未开始
    		this.state.nums = this.state.nums - 1
    		if( this.state.nums === 0 ){
    			this.props.dispatch({
           	type: `${this.props.path}`,
	          payload:{
	          	
	          }
	        })
    			this.state.nums = this.props.nums
    		}
    	}
    }, 1000)
  }
  
  componentDidMount() {
    this.querys()
  }
  
  componentWillUnmount() {
    clearInterval(this.state.setIntervalNum)
  }
  
  render(){
    return (
      <Table
				columns={this.state.colums}
				dataSource={this.state.dataSource}
				bordered
				loading={this.state.loading}
				size="small"
				pagination={this.props.pagination}
			/>
    )
  }
}

export default lineTable
