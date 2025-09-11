import { Table } from 'antd'

class table extends React.Component {
	constructor (props) {
    	super(props)
	}

	render () {
		return (
  <Table
    dataSource={this.props.dataSource}
    columns={this.props.columns}
    scroll={{ y: this.props.height, x: 16000 }}
    size="small"
    bordered
    simple
    pagination={false}
  />
		)
	}
}

export default table
