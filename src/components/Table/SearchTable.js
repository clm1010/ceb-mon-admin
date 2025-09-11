/**
 * FormTable
 * Functions:
 *     1. Sortable column: string
 *     2. Filterable column: fulltext
 * Column configuration:
 * 	{
	    key: 'name',
	    dataIndex: 'name',
	    title: '名称',
	    type: 'String',   // work with isSort for comparison
			width: '13%',
			isSort: true,     // the column is sortable
			isSearch: true,   // the column is filterable
		},
*/

import React from 'react'
import { Form, Table, Row, Col, Button, Input, Icon } from 'antd'

class SearchTable extends React.Component {
	constructor(props) {
		super(props)
		this.state.dispatch = props.dispatch
		this.scrollx = props.scrollx
		this.scrolly = props.scrolly
		//this.state.loading = props.loading
		this.state.data = props.dataSource
		//this.columns = props.columns
		let tabCols = props.columns
		let newCol = {}
		let newCols = []
		for (let column of tabCols) {
			newCol = column
			if ((column.isSort === true) && ('String' === column.type)) {
				newCol = {
					...newCol,
					sorter: (a, b) => this.compareString(a[column.key],b[column.key]),
				}
			}
			if (column.isSearch === true) {
				newCol = {
					...newCol,
					...this.getColumnSearchProps(column.dataIndex)
				}
			}
			newCols.push(newCol)
		}
		this.columns = [...newCols]
  }
  componentWillReceiveProps (props) {
		this.state.dispatch = props.dispatch
		this.state.data = props.dataSource
		
		let i = 1
		for (let item of this.state.data) {
			if ('key' in item) {break}
			else {
		   	item.key = i
			  i++
			}
		}
	}
	
  state = {
		data:[],
		selectedRowKeys: [],
  }

/*Filterable column*/
getColumnSearchProps = dataIndex => ({
	filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
		<div style={{ padding: 8 }}>
			<Input
				ref={node => {
					this.searchInput = node;
				}}
				placeholder={`搜索 ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
				style={{ width: 188, marginBottom: 8, display: 'block' }}
			/>
			<Button
				type="primary"
				onClick={() => this.handleSearch(selectedKeys, confirm)}
				icon="search"
				size="small"
				style={{ width: 90, marginRight: 8 }}
			>
				搜索
			</Button>
			<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
			  重置
			</Button>
		</div>
	),
	filterIcon: filtered => (
		<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
	),
	onFilter: (value, record) =>
		record[dataIndex]
			.toString()
			.toLowerCase()
			.includes(value.toLowerCase()),
	onFilterDropdownVisibleChange: visible => {
		if (visible) {
			setTimeout(() => this.searchInput.select());
		}
	},
});

handleSearch = (selectedKeys, confirm) => {
	confirm();
	this.setState({ searchText: selectedKeys[0] });
};

handleReset = clearFilters => {
	clearFilters();
	this.setState({ searchText: '' });
};
/*Filterable column end*/
/*Sortable column */
compareString(stringA,stringB) {
	if (stringA < stringB) {
		return -1;
	}
	if (stringA > stringB) {
		return 1;
	}
	return 0;
}
/*Sortable column end*/

onSelectChange = selectedRowKeys => {
	//console.log('selectedRowKeys changed: ', selectedRowKeys);
	this.setState({ selectedRowKeys });
	let selectRows = this.state.data.filter(item => selectedRowKeys.includes(item.key) )
	this.props.onSelect(selectedRowKeys, selectRows)
};

	render() {
		
		const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
		};
		
		let scrollx = this.scrollx !== undefined ? this.scrollx: document.body.clientWidth
		let scrolly = this.scrolly !== undefined ? this.scrolly: document.body.clientHeight * 0.5
		return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
					bordered
					size="small"
          dataSource={this.state.data}
					columns={this.columns}
          //rowClassName="editable-row"
          pagination={false}
					scroll={{x: scrollx, y: scrolly}}
					rowSelection={rowSelection}
					rowKey={record => record.key}
        />
      </Col>
    </Row>
	)
	}
}

export default Form.create()(SearchTable)

