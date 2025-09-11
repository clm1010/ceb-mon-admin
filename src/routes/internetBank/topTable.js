import React from 'react'
import { Tag } from 'antd'
import style from './indexs.css'
class topTable extends React.Component {
  constructor(props){
    super(props)
  }

  state = {
    setIntervalNum: 0,
    nums: 10,
    list: []
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
	          	vlan_id: this.props.vlan_id,
	          }
	        })
    			this.state.nums = 10
    		}
    	}
    }, 1000)
  }

  componentDidMount() {
    this.querys()
  }

  componentWillReceiveProps(nextProps) {
		this.state.list = nextProps.uiList
  }

  render(){
    return (
      <div className={style.cardHeight}>
      <div className={style.InterfaceStyle}>
        <div>
          <p style={{ fontSize: 18 , fontWeight: 'bold', color: '#D3D7DD' }}>&nbsp;{this.props.title}</p>
        </div>
        <ul>
          <li>
            <p style={{ textAlign: 'center', color: '#D3D7DD' }}>进出IP</p>
            <p style={{ textAlign: 'center', color: '#D3D7DD' }}>时间</p>
            <p style={{ textAlign: 'center', color: '#D3D7DD' }}>TCP同步包</p>
          </li>
          {this.state.list}
        </ul>
      </div>
      </div>
    )
  }
}

export default topTable
