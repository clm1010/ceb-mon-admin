import React from 'react'
import { Table } from 'antd'
import styles from "./TableChangeDom.less"
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
	          	bizarea: this.props.bizarea
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

  getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? styles.oddRow : styles.evenRow;
    return className;

  }
  
  render(){
    return (
      <div className={styles.root}>
	      <Table
					columns={this.state.colums}
					dataSource={this.state.dataSource}
					bordered
          scroll={{ x: 1400 }}
					loading={this.state.loading}
					size="small"
					pagination={this.props.pagination}
          rowClassName={this.getRowClassName}
				/>
      </div>
    )
  }
}

export default lineTable
