import React from 'react'
import { Table, Typography } from 'antd'
const { Paragraph } = Typography
class alarmsTable extends React.Component {
  constructor(props){
    super(props)
    this.state.dataSource = this.props.dataSource
    this.state.loading = this.props.loading
    this.state.buttonState = this.props.buttonState
    this.state.colums = this.props.colums
  }

  componentWillReceiveProps(nextProps) {
    this.state.dataSource = nextProps.dataSource
    this.state.colums = nextProps.colums
    this.state.loading = nextProps.loading
    this.state.buttonState = this.props.buttonState
  }

  state = {
    setIntervalNum: 0,
    dataSource: [],
    colums: [],
    loading: true,
    buttonState: true,
    payload: {},

  }

  querys = () => {
    this.state.setIntervalNum = setInterval(() => {
      if(!this.state.buttonState){//暂停了
        console.log('暂停')
      }else{
        this.props.dispatch({
          type: `${this.props.path}`,
          payload: this.state.payload
        })
      }
    }, 10000)
  }

  componentDidMount() {
    this.querys()
  }

  componentWillUnmount() {
    clearInterval(this.state.setIntervalNum)
  }

  onPageChange = (page) => {
    this.props.dispatch({
      type: `${this.props.path}`,
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize
      }
    })
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let choosed = []
      selectedRows.forEach((object) => {
        choosed.push(object.NodeAlias)
      })
      if (selectedRows.length > 0) {
        this.props.dispatch({
          type: `${this.props.path2}`,
          payload: {
            batchDelete: false,
            selectedRowsAlarms: choosed,
          },
        })
      } else if (selectedRows.length === 0) {
        this.props.dispatch({
          type: `${this.props.path2}`,
          payload: {
            batchDelete: true,
            selectedRowsAlarms: choosed,
          },
        })
      }
    },
  }

  render(){
    return (
      <Table
        columns={this.state.colums}
        dataSource={this.state.dataSource}
        bordered
        loading={this.state.loading}
        size="small"
        scroll={{ x: 830, y: 490 }}
        pagination={this.props.pagination}
        onChange={this.onPageChange}
        rowKey={record => record.uuid}
        rowSelection={this.rowSelection}
      />
    )
  }
}

export default alarmsTable
