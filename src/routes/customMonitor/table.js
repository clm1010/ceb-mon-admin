import { Table } from 'antd'
import columns from './columns'
const table = ({ location, dispatch, dataSource, pagination,batchDelete, selectedRows, q, loading }) => {

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let choosed = []
      selectedRows.forEach((object) => {
        choosed.push({branch: object.branchName, ips: object.discoveryIP})
      })
      if (selectedRows.length > 0) {
        dispatch({
          type: 'customMonitor/setState',
          payload: {
            batchDelete: false,
            selectedRows:choosed,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'customMonitor/setState',
          payload: {
            batchDelete: true,
            selectedRows: choosed,
          },
        })
      }
    },
  }


  const onChange = (page) =>{
      dispatch({
        type: 'customMonitor/query',
        payload: {
          page: page.current - 1,
          pageSize: page.pageSize,
          q: q === undefined ? '' : q ,
        },
      })
      dispatch({
        type: 'customMonitor/setState',
        payload: {
          batchDelete: false,
          selectedRows: [],
        },
      })
  }


  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      rowSelection={rowSelection}
      onChange={onChange}
      loading={loading}
      rowKey={record => record.uuid}
      scroll={{ x: 830, y: 660 }}
    />
  )
}

export default table
