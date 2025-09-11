import React from 'react'
import { Form, Table, Row, Col, Button, Checkbox, Input, Popconfirm, Icon, Select } from 'antd'
//import Highlighter from 'react-highlight-words';
import Fenhang from '../../../utils/fenhang'
import { genFilterDictOptsByName } from "../../../utils/FunctionTool"
let interFace = genFilterDictOptsByName("interfaceType", "string")
const { Option } = Select;

let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})
let options = []
let ifType = {}
interFace.forEach((option) => {
	options.push(<Option key={option.key} value={option.key}>{option.value}</Option>);
	ifType[option.key] = option.value
})
const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
			? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			: value
		}
	</div>
);

const EditableCheck = ({ editable, value, onChange }) => (
	<div>
		<Checkbox style={{ margin: '-5px 0' }} checked={value} onChange={e => { if (editable) { onChange(e.target.checked) } }} />

	</div>
);

const EditableSelect = ({ editable, value, onChange }) => (
	<div>
		{editable ?
			<Select style={{ margin: '-5px 0' }} checked={value} onChange={e => { if (editable) { onChange(e) } }} >
				{options}
			</Select>
			: ifType[value]
		}


	</div>
);
class interfaceTable extends React.Component {
	constructor(props) {
		super(props)
		this.state.dispatch = props.dispatch
		//this.state.loading = props.loading
		this.state.data = props.dataSource
		const statusFilters = [
			{
				text: 'UP',
				value: '1',
			},
			{
				text: 'DOWN',
				value: '2',
			},
		];
		this.columns = [
			{
				key: 'status',
				dataIndex: 'status',
				title: '端口状态',
				//sorter: (a, b) => b.status - a.status,
				render: (text, record) => {
					if ('1' === text) return (<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />)
					else return (<Icon type="stop" theme="twoTone" twoToneColor="red" />)
				},
				filters: statusFilters,
				onFilter: (v, r) => r.status === v,
			},
			{
				key: 'name',
				dataIndex: 'name',
				title: '名称',
				type: 'String',
				application: 'show,create,update,filter,query',
				applicationType: 'String',
				isvalidate: true,
				//sorter: (a, b) => this.compareString(a.name,b.name),
				...this.getColumnSearchProps('name'),
			},
			{
				key: 'alias',
				dataIndex: 'alias',
				title: '别名',
				type: 'String',
				applicationType: 'String',
				isvalidate: true,
				//sorter: (a, b) => this.compareString(a.alias,b.alias),
				...this.getColumnSearchProps('alias'),
			},
			{
				key: 'description',
				dataIndex: 'description',
				title: '接口描述',
				type: 'description',
				applicationType: 'description',
				isvalidate: true,
				//sorter: (a, b) => this.compareString(a.alias,b.alias),
				...this.getColumnSearchProps('description'),
			},
			{
				key: 'portName',
				dataIndex: 'portName',
				title: '物理名称',
				type: 'String',
				//applicationType: 'String',
				//isvalidate: true,
				//sorter: (a, b) => this.compareString(a.portName,b.portName),
				...this.getColumnSearchProps('portName'),
			},
			{
				key: 'ip',
				dataIndex: 'ip',
				title: '接口IP',
				//sorter: (a, b) => this.compareString(a.ip,b.ip),
				...this.getColumnSearchProps('ip'),
			},
			{
				key: 'bandwidth',
				dataIndex: 'bandwidth',
				title: '采集带宽',
				sorter: (a, b) => a.bandwidth - b.bandwidth,
				//render: (text, record) => this.renderColumns(text, record, 'bandwidth'),
			},
			{
				key: 'realBandwidth',
				dataIndex: 'realBandwidth',
				title: '实际带宽',
				sorter: (a, b) => a.realBandwidth - b.realBandwidth,
				render: (text, record) => this.renderColumns(text, record, 'realBandwidth'),
			},
			{
				key: 'performanceCollect',
				dataIndex: 'performanceCollect',
				title: '性能采集',
				sorter: (a,b)=>{
					if(a.performanceCollect){
						a.performanceCollect = 1
					}else{
						a.performanceCollect = 0
					}
					if(b.performanceCollect){
						b.performanceCollect = 1
					}else{
						b.performanceCollect = 0
					}
					return a.performanceCollect-b.performanceCollect
				},
				render: (text, record) => this.renderCheckColumns(text, record, 'performanceCollect'),
				width: 100,
			},
			{
				key: 'iisreset',
				dataIndex: 'iisreset',
				title: '性能监控',
				sorter: (a,b)=>{
					if(a.performanceCollect){
						a.performanceCollect = 1
					}else{
						a.performanceCollect = 0
					}
					if(b.performanceCollect){
						b.performanceCollect = 1
					}else{
						b.performanceCollect = 0
					}
					return a.performanceCollect-b.performanceCollect
				},
				render: (text, record) => this.renderCheckColumns(text, record, 'iisreset'),
				width: 100,
			},
			{
				key: 'syslogMonitoring',
				dataIndex: 'syslogMonitoring',
				title: 'syslog监控',
				sorter: (a,b)=>{
					if(a.performanceCollect){
						a.performanceCollect = 1
					}else{
						a.performanceCollect = 0
					}
					if(b.performanceCollect){
						b.performanceCollect = 1
					}else{
						b.performanceCollect = 0
					}
					return a.performanceCollect-b.performanceCollect
				},
				render: (text, record) => this.renderCheckColumns(text, record, 'syslogMonitoring'),
				width: 120,
			},
			{
				key: 'typ',
				dataIndex: 'typ',
				title: '接口类型',
				sorter: false,
				render: (text, record) => this.renderSelectColumns(text, record, 'typ'),
				width: 150,
			},

			{
				title: '操作',
				dataIndex: 'operation',
				width: 150,
				// fixed: 'right',
				render: (text, record) => {
					const { editable } = record;
					return (
						<div className="editable-row-operations">
							{
								editable ?
									<span>

										<Button style={{ margin:10 }} size="small" type="ghost" shape="circle" icon="check" onClick={() => this.save(record.id)} />
										<Popconfirm title="取消编辑吗?" onConfirm={() => this.cancel(record.id)}>
											<Button style={{ margin:10 }} size="small" type="ghost" shape="circle" icon="close" />

										</Popconfirm>
									</span>
									:
									<span>
									<Button style={{ float: 'left' }} size="small" type="ghost" icon="edit" onClick={() => this.edit(record.id)} >修改</Button>
									<Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record.id)}>
									<Button style={{ float: 'left' }} size="small" type="ghost" icon="edit" >删除</Button>
								  </Popconfirm>
								  </span>
							}
						</div>
					);
				},
			}
		];
	}
	//<a onClick={() => this.edit(record.id)}>Edit</a>
	//<a onClick={() => this.save(record.id)}>Save</a>
	//<a>Cancel</a>
	componentWillReceiveProps(props) {
		this.state.dispatch = props.dispatch
		this.state.data = props.dataSource
		/*
		let selRows = props.dataSource.filter(item => (item.performanceCollect || item.iisreset || item.syslogMonitoring))*/
		//console.log("in componentWillReceiveProps")
		//console.dir(props.selectedRows)
		let selKeys = []
		props.selectedRows.forEach(item => selKeys.push(item.id))
		this.state.selectedRowKeys = selKeys
	}

	state = {
		data: [],
		datasource: [],
		selectedRowKeys: [],
	}
	/* filtercolumn*/
	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
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
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
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
		/*render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		),*/
	});

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};
	/*filtercolumn end*/

	renderColumns(text, record, column) {
		return (
			<EditableCell
				editable={record.editable}
				//editable={true}
				value={text}
				onChange={value => this.handleChange(value, record.id, column)}
			/>
		);
	}
	renderCheckColumns(text, record, column) {
		return (
			<EditableCheck
				editable={record.editable}
				//editable={true}
				value={text}
				onChange={value => this.handleChange(value, record.id, column)}
			/>
		);
	}
	renderSelectColumns(text, record, column) {
		//console.log(text,record)
		return (
			<EditableSelect
				editable={record.editable}
				//editable={true}
				value={text}
				onChange={value => this.handleChange(value, record.id, column)}
			/>
		);
	}
	handleChange(value, key, column) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.id)[0];
		if (target) {
			target[column] = value;
			this.setState({ data: newData });
		}
	}
	handleCheckChange(value, key, column) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.id)[0];
		if (target) {
			target[column] = value;
			this.setState({ data: newData });
		}
	}
	edit(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.id)[0];
		if (target) {
			target.editable = true;
			this.setState({ data: newData });
			this.cacheData = newData.map(item => ({ ...item }));
		}
		console.dir(this.cacheData)
		/*if(!this.cacheData){
			this.cacheData = newData.map(item => ({ ...item }));
		}*/
	}
	save(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.id)[0];
		//console.dir(target)
		if (target) {
			delete target.editable;
			this.setState({ data: newData });
			this.cacheData = newData.map(item => ({ ...item }));
			// change selectRows

			let selKeys = [...this.state.selectedRowKeys];
			if (target.iisreset || target.performanceCollect || target.syslogMonitoring) {
				if (selKeys.indexOf(target.id) === -1) {
					selKeys.push(target.id)
					this.handleRowChange(selKeys, target)
					this.setState({ selectedRowKeys: selKeys });
				}
			} else if (!target.iisreset && !target.performanceCollect && !target.syslogMonitoring) {
				let i = selKeys.indexOf(target.id)
				if (i > -1) {
					selKeys.splice(i, 1)
					this.handleRowChange(selKeys)
					this.setState({ selectedRowKeys: selKeys });
				}
			}
		}
	}
	cancel(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.id)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
			delete target.editable;
			this.setState({ data: newData });
		}
	}

	handleDelete = key => {
		const newData = [...this.state.data];
		const delData = newData.filter(item => item.id !== key)
		this.setState({ data: delData });
		this.state.dispatch({
			type: 'mowizard/setState',
			payload: {
				ifList: delData,
			},
		})
	};

	handleRowChange(selectedRowKeys, selectedRow) {
		//console.dir(selectedRow)
		let isAdd = false
		let isDel = false
		let oldKeys = [...this.state.selectedRowKeys]
		let newKeys = selectedRowKeys
		let changeData = [...this.state.data]

		if (oldKeys.length > newKeys.length) isDel = true
		else if (oldKeys.length < newKeys.length) isAdd = true

		if (isAdd) {
			//let tmp = newKeys.filter(item => oldKeys.indexOf(item) === -1)[0]
			//console.log(tmp)
			let target = newKeys.filter(item => oldKeys.indexOf(item) === -1)

			if (target) {
				//changeData.filter(item => item.id === target).forEach(item => {
				changeData.filter(item => target.includes(item.id)).forEach(item => {
					if (selectedRow === undefined) {
						item.performanceCollect = true
						item.iisreset = true
						item.syslogMonitoring = true
					}
				})
			}
		}
		if (isDel) {
			let target = oldKeys.filter(item => newKeys.indexOf(item) === -1)
			if (target) {
				changeData.filter(item => target.includes(item.id)).forEach(item => {
					item.performanceCollect = false
					item.iisreset = false
					item.syslogMonitoring = false
				})
			}
		}

		this.setState({ data: changeData });
		let changeRows = changeData.filter(item => newKeys.indexOf(item.id) > -1)
		//console.dir(changeRows)
		this.state.dispatch({
			type: 'mowizard/setState',
			payload: {
				selectedRows: changeRows,

			},
		})
	}

	compareString(stringA, stringB) {
		if (stringA < stringB) {
			return -1;
		}
		if (stringA > stringB) {
			return 1;
		}
		return 0;
	}

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.handleRowChange(selectedRowKeys)

				/*
				let isAdd = false
				let isDel = false
				let oldKeys = [...this.state.selectedRowKeys]
				let newKeys = selectedRowKeys
				let changeData = [...this.state.data]

				if (oldKeys.length > newKeys.length) isDel = true
				else if (oldKeys.length < newKeys.length) isAdd = true

				if (isAdd) {
					let target = newKeys.filter(item => oldKeys.indexOf(item) === -1)[0]
					if (target) {
					  changeData.filter(item => item.id === target).forEach(item => {
						  item.performanceCollect = true
						  item.iisreset = true
						  item.syslogMonitoring = true
						})
					}
				}
				if (isDel) {
					let target = oldKeys.filter(item => newKeys.indexOf(item) === -1)[0]
					if (target) {
					  changeData.filter(item => item.id === target).forEach(item => {
						  item.performanceCollect = false
						  item.iisreset = false
						  item.syslogMonitoring = false
						})
					}
				}

				this.setState({ data: changeData });
				let changeRows = changeData.filter(item => newKeys.indexOf(item.id) > -1)
				//console.dir(changeRows)

				this.state.dispatch({
					type: 'mowizard/setState',
					payload: {
						selectedRows:changeRows,

					},
				})*/

			},
		}

		const onRowClick = (record, index, event) => {
			let newKeys = [...this.state.selectedRowKeys];
			let newData = [...this.state.data];
			let i = newKeys.indexOf(record.id);
			let change = false;
			if (record.performanceCollect || record.iisreset || record.syslogMonitoring) { // insert key
				//console.log("original Keys is")
				//console.dir(this.state.selectedRowKeys)
				//console.log("i is")
				//console.log(i)
				if (i < 0) { newKeys.push(record.id); change = true }

				//console.log("new Keys is")
				//console.dir(newKeys)
			} else { //delete key
				if (i > -1) { newKeys.splice(i, 1); change = true }
			}

			if (change) {
				let newRows = newData.filter(item => newKeys.indexOf(item.id) > -1)
				//console.log("select rows is")
				//console.dir(newRows)
				//this.setState({ selectedRowKeys: newKeys });
				rowSelection.onChange(newKeys, newRows)
			}
		}

		return (
			<Row gutter={24}>
				<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
					<Table
						bordered
						columns={this.columns}
						dataSource={this.state.data}
						//loading={this.state.loading}
						//pagination={false}
						pagination={{ pageSize: 100 }}
						simple
						rowKey={record => record.id}
						size="small"
						rowSelection={rowSelection}
						//scroll={{ x: 1800, y: 350 }}
						//scroll={{ x:'max-content', y: 350 }}
						scroll={{ y: 350 }}
					//onRowClick = {onRowClick}
					/>
				</Col>
			</Row>
		)
	}
}

export default Form.create()(interfaceTable)
