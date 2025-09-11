import React from "react"
import { Card, Icon, Tag } from 'antd'

class cards extends React.Component {
	constructor(props) {
    	super(props)
    	this.state.loading = true
    }

	componentWillReceiveProps(nextProps) {
		this.state.loading = nextProps.loading
	}

	state={
		loading: true
	}

	render(){
		return(
			<Card
				title={this.props.title}
				style={{ height: `${this.props.minHeight}`, position: 'relative' }}
				actions={this.props.actions}
				extra={this.props.extra}
				loading={this.state.loading}
				size={this.props.size}
			>
        {this.props.con}
			</Card>
		)
	}
}

export default cards
