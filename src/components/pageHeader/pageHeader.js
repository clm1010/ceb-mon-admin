import React from 'react'
import { PageHeader, Card, Icon, Tag, Divider, Descriptions, Button } from 'antd'
//title  名称    backIcon 自定义图标在名称前   onBack 图标点击函数   subTitle二级描述信息     tags描述   extra右上角操作区
//Divider 分割线   Descriptions  描述内容    breadcrumb  面包屑   接收JSON数组   headerColor  设置页头背景颜色
//
class pageHead extends React.Component {
	constructor(props) {
    	super(props)
    	this.state.title = this.props.title
    	this.state.backIcon = this.props.backIcon
    	this.state.subTitle = this.props.subTitle
    	this.state.tags = this.props.tags
    	this.state.extra = this.props.extra
    	this.state.dividerVisible = this.props.dividerVisible
    	this.state.content = this.props.content
    	this.state.headerColor = this.props.headerColor
    	this.state.iocnSize = this.props.iocnSize
    	this.state.iconTheme = this.props.iconTheme
    	this.state.twoToneColor = this.props.twoToneColor
    	this.state.footer = this.props.footer
  	}
	
	state = {//初始化参数
		title: {},
		backIcon: {},
		subTitle: {},
		tags: [],
		extra: [],
		dividerVisible: true,
		content:{},
		footer: {},
		headerColor: '#FFFFFF',
		iconTheme: 'twoTone',
		twoToneColor: '#FFBA15',
		iocnSize: '20px'
	}
	
	componentWillReceiveProps(nextProps) {
		this.state.title = nextProps.title
    	this.state.backIcon = nextProps.backIcon
    	this.state.subTitle = nextProps.subTitle
    	this.state.tags = nextProps.tags
    	this.state.extra = nextProps.extra
    	this.state.dividerVisible = nextProps.dividerVisible
    	this.state.content = nextProps.content
    	this.state.headerColor = nextProps.headerColor
    	this.state.iocnSize = nextProps.iocnSize
    	this.state.iconTheme = nextProps.iconTheme
    	this.state.twoToneColor = nextProps.twoToneColor
    	this.state.footer = nextProps.footer
	}
	
	render() {
		return(
			<PageHeader 
				title= {this.state.title}
				backIcon={<Icon type={this.state.backIcon} theme={this.state.iconTheme} twoToneColor={this.state.twoToneColor} style={{ marginTop: '1px',fontSize: `${this.state.iocnSize}`, }}/>}
				onBack={this.props.onBack}
				subTitle={this.state.subTitle}
				tags={this.state.tags} 
				extra={this.state.extra}
				style={{ border: '1px solid rgb(235,237,240)', background: `${this.state.headerColor}` }}
				footer={this.state.footer}
			>
				{this.state.dividerVisible ? <Divider style={{ marginTop: '1px' }}/> : null}
				{this.state.content}
			</PageHeader>
		)
	}
}

export default pageHead