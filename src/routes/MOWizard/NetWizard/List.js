import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button, Icon } from 'antd'
import Fenhang from '../../../utils/fenhang'

let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
})


const confirm = Modal.confirm

function list ({
 dispatch, 
 loading, 
 dataSource, 
 pagination, 
 batchDelete, 
 batchSelect, 
 q, // 翻页时的查询参数
 neType,
}) {

	const columns = [
    {
      title: '发现IP',
      dataIndex: 'discoveryIP',
      key: 'discoveryIP',
      width: 120,
    }, {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: 120,
      filterIcon: <Icon type="search" style={{ fontSize: 16, color: '#08c' }} />,
      filters: [
         
      ],
	}, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    }, {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
      width: 200,
	}, {
      title: '对象关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 150,
    }, {
      title: '所属应用分类名称',
      dataIndex: 'appName',
      key: 'appName',
      width: 150,
    }, {
      title: '所属机构',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 80,
      render: (text, record) => {
  		return Fenhangmaps.get(text)
  	  },
    }, {
      title: '管理机构',
      dataIndex: 'mngtOrgCode',
      key: 'mngtOrgCode',
      width: 80,
      render: (text, record) => {
  		return Fenhangmaps.get(text)
  	  },
    }, {
      title: '一级专业分类',
      dataIndex: 'firstClass',
      key: 'firstClass',
      width: 100,
    }, {
      title: '二级专业分类',
      dataIndex: 'secondClass',
      key: 'secondClass',
      width: 100,
	}, {
      title: '三级专业分类',
      dataIndex: 'thirdClass',
      key: 'thirdClass',
      width: 100,
    }, {
      title: '厂商',
      dataIndex: 'vendor',
      key: 'vendor',
      width: 100,
    }, {
      title: '应用容量特征',
      dataIndex: 'capType',
      key: 'capType',
      width: 100,
    }, {
      title: '类别',
      dataIndex: 'typ',
      key: 'typ',
      width: 80,
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    }, {
      title: '一级安全域',
      dataIndex: 'firstSecArea',
      key: 'firstSecArea',
      width: 100,
    }, {
      title: '二级安全域',
      dataIndex: 'secondSecArea',
      key: 'secondSecArea',
      width: 100,
    }, {
      title: '区域',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    }, {
      title: 'objectID',
      dataIndex: 'objectID',
      key: 'objectID',
      width: 200,
    }, {
      title: '搜索代码',
      dataIndex: 'searchCode',
      key: 'searchCode',
      width: 100,
    }, {
      title: 'SNMP团体串',
      dataIndex: 'snmpCommunity',
      key: 'snmpCommunity',
      width: 120,
    }, {
      title: 'SNMP写团体串',
      dataIndex: 'snmpWriteCommunity',
      key: 'snmpWriteCommunity',
      width: 200,
    }, {
      title: 'SNMP版本',
      dataIndex: 'snmpVer',
      key: 'snmpVer',
      width: 100,
    }, {
      title: 'srcType',
      dataIndex: 'srcType',
      key: 'srcType',
      width: 100,
    }, {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
      width: 80,
    }, {
      title: '纳管状态',
      dataIndex: 'managedStatus',
      key: 'managedStatus',
      width: 80,
    }, {
      title: '监控状态',
      dataIndex: 'monitorStatus',
      key: 'monitorStatus',
      width: 80,
    }, {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      width: 80,
    }, {
      title: '同步时间',
      dataIndex: 'syncTime',
      key: 'syncTime',
      width: 150,
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
    }, {
      title: '创建方式',
      dataIndex: 'createMethod',
      key: 'createMethod',
      width: 100,
    }, {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    }, {
      title: '由工具创建',
      dataIndex: 'createdByTool',
      key: 'createdByTool',
      width: 150,
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 150,
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100,
    }, {
      title: '最后更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 150,
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
		},
		
  ]

	columns.push({
    title: '操作',
    width: 80,
    fixed: 'right',
    render: (text, record) => {
          return (<div>
<Button style={{ float: 'left' }} size="small" type="ghost" icon="retweet" onClick={() => onEdit(record)} disabled={(record && record.onlineStatus=== "已下线") ? true:false}>变更</Button>
      </div>)
    },
  })
//<Button style={{ float: 'right' }} size="default" type="ghost" shape="circle" icon="arrow-down" onClick={() => onDelete(record)} />

	const onPageChange = (page) => {
      dispatch({
      	type: 'mowizard/queryMOs',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'mowizard/setState',
      	payload: {
      		batchDelete: false,
      		batchSelect: [],
      	},
      })
    }

	const onEdit = (record) => {
    //console.dir(record)
			dispatch({
				type: 'mowizard/findMOById',				//@@@
				payload: {
					uuid: record.uuid,
				},
      })      
	}

	const onDelete = (record) => {
    let titles = '您确定要将设备下线吗？'
    /*
		if (record.intfNum && record.intfNum !== 0) {
			titles = `该设备绑定了${record.intfNum}个接口，是否删除？`
    }*/
    let params = []
    params.push(record.uuid)
		confirm({
    	title: titles,
    	onOk () {
		    dispatch({
					type: 'mowizard/deleteNe',				//@@@
		      payload: {
            uuids:params,
            q: q === undefined ? '' : q,
          }
				})
    	},
    })
	}

	/*
	const onBatchDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
        	let ids = []
        	selectedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'mowizard/delete',
		        payload: ids,
		      })
        },
      })
	}*/

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
      //console.log(selectedRows)
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'mowizard/setState',
					payload: {
						batchDelete: true,
						batchSelect: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'mowizard/setState',
					payload: {
						batchDelete: false,
						batchSelect: selectedRows,
					},
				})
			}
	  },
	}


  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
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
          scroll={{ x: 4000, y: 400 }}
        />
      </Col>
    </Row>
  )
}

export default list
