import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import fenhang from './../../utils/fenhang'

import './ellipsis.css'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, q,onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows,
}) {

	const onPageChange = (page) => {
      dispatch({
      	type: 'discovery/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'discovery/showModal',
      	payload: {
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }
    const openNoInfoModal = (record, e) => {
		let branch = ''
    let noInfoNum = 0
		if (record) {
      branch = record.branch
      noInfoNum = record.noInfoNum
		}

		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'discovery/queryInfos',
			payload: {
        q: "branch == " + branch + " and retCode != '0'",
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'discovery/showModal',
			payload: {
        branch: branch,
        noInfoNum: noInfoNum,
				noInfoVisible: true,
			},
		})
	}

  let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

  const openInfoModal = (record, e) => {
		let branch = ''
    let infoNum = 0
		if (record) {
      branch = record.branch
      infoNum = record.infoNum
		}

		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'discovery/queryInfos',
			payload: {
        q: "branch == " + branch,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'discovery/showModal',
			payload: {
        branch: branch,
        infoNum: infoNum,
				mosVisible: true,
			},
		})
	}

  const openOnInfoModal = (record, e) => {
    let branch = ''
    let onInfoNum = 0
    if (record) {
      branch = record.branch
      onInfoNum = record.onInfoNum
    }

    /*
            获取关联实例的数据
        */
    dispatch({
      type: 'discovery/queryOnInfos',
      payload: {
        q: "branch == " + branch,
      },
    })

    /*
            打开弹出框
        */
    dispatch({
      type: 'discovery/showModal',
      payload: {
        branch: branch,
        onInfoNum: onInfoNum,
        onInfoVisible: true,
      },
    })
  }

  const openInInfoModal = (record, e) => {
    let branch = ''
    let inInfoNum = 0
    if (record) {
      branch = record.branch
      inInfoNum = record.inInfoNum
    }

    /*
            获取关联实例的数据
        */
    dispatch({
      type: 'discovery/queryInInfos',
      payload: {
        q: "branch == " + branch,

      },
    })

    /*
            打开弹出框
        */
    dispatch({
      type: 'discovery/showModal',
      payload: {
        branch: branch,
        inInfoNum: inInfoNum,
        inInfoVisible: true,
      },
    })
  }

  const onTask = (record) => {
      dispatch({
        type: 'discovery/queryTasks',
        payload: {
          currentItem: record,
          taskVisible: true,
          isClose: false,
          q: "branch == " + record.branch
        },
      })

    dispatch({
      type: 'discovery/showModal',
      payload: {
        branch: record.branch,
        taskVisible: true,
      },
    })
  }


  const columns = [
    {
      title: '所属机构',
      dataIndex: 'branch',
      key: 'branch',
      render: (text, record) => {
        let typename = maps.get(text)
        return typename
      },
    },
    {
      title: '发现设备',
      dataIndex: 'infoNum',
      key: 'infoNum',
	  render: (text, record, index) => {
      return <a onClick={e => openInfoModal(record, e)}>{text}</a>
	    },
    },
    {
      title: '配置不规范设备',
      dataIndex: 'noInfoNum',
      key: 'noInfoNum',
	  render: (text, record, index) => {
      return <a onClick={e => openNoInfoModal(record, e)}>{text}</a>
	    },
    },
    {
      title: '上线设备',
      dataIndex: 'onInfoNum',
      key: 'onInfoNum',
      render: (text, record, index) => {
        return <a onClick={e => openOnInfoModal(record, e)}>{text}</a>
      },
    },
    {
      title: '无效设备',
      dataIndex: 'inInfoNum',
      key: 'inInfoNum',
      render: (text, record, index) => {
        return <a onClick={e => openInInfoModal(record, e)}>{text}</a>
      },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<div>
          <Button size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onTask(record)} />
        </div>)
      },
    },
  ]

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push(object.uuid)
	  		})
	  	console.log(`choosed:${choosed}`)
		  dispatch({
		  	type: 'tool/switchBatchDelete',
				payload: {
					choosedRows: choosed,
					batchDelete: choosed.length > 0,
				},
			})
	  },
	}


  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 980 }} //滚动条
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
