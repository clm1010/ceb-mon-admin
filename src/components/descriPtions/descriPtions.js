import React from "react"
import { Descriptions, Icon, Tag } from 'antd'

class descriPtions extends React.Component {
	constructor(props) {
    	super(props)
    	this.state.title = this.props.title
    	this.state.size = this.props.size
    	this.state.column = this.props.column
    	this.state.bordered = this.props.bordered
    	this.state.layout = this.props.layout
    	this.state.colon = this.props.colon
    	this.state.item = this.props.item
 	}
	
	state = {
		title: {},  //标题
		size: '',	//描述大小   在bordere为true时起作用
		bordere: false,//边框可见性
		layout: '',//布局方式  vertical   horizontal
		colon: true,//冒号可见性
		column: 0,//
		item: []//JSON对象数组   
	}   
	
	componentWillReceiveProps(nextProps) {
		this.state.item = nextProps.item
		this.state.title = nextProps.title
    	this.state.size = nextProps.size
    	this.state.column = nextProps.column
    	this.state.bordered = nextProps.bordered
    	this.state.layout = nextProps.layout
    	this.state.colon = nextProps.colon
	}
	
	render() {
		return(
			<Descriptions 
						title={this.state.title}
						size={this.state.size}
						column={this.state.column}
						bordered={this.state.bordered}
						layout={this.state.layout}
						colon={this.state.colon}
					>
						{
							(this.state.item && this.state.item.length > 0) ?
								this.state.item.map(( item,index )=>{
									return <Descriptions.Item  key={index} label={item.label} span={item.span}><Tag color={item.color}>{item.content}</Tag></Descriptions.Item>
								})
							: 
								null
						}
					 </Descriptions>
		)
	}
}

export default descriPtions