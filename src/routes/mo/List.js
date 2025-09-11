import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col } from 'antd'
import Fenhang from '../../utils/fenhang'

const confirm = Modal.confirm 

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, selectedRows, q,
}) {
	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	const onAdd = () => {
		dispatch({
			type: 'periodconfig/setState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
				timeList: [
					{
						index: 1,
						checked: true,
    		    week: '一',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 2,
						checked: true,
    		    week: '二',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 3,
						checked: true,
    		    week: '三',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 4,
						checked: true,
    		    week: '四',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 5,
						checked: true,
    		    week: '五',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 6,
						checked: true,
    		    week: '六',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 7,
						checked: true,
    		    week: '日',
    		    stime: '',
    		    etime: '',
					},
				],
			},
		})
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'mo/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q,
      	},
      })
      dispatch({
      	type: 'mo/setState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
        	let ids = []
        	selectedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'periodconfig/delete',
		        payload: ids,
		      })
        },
      })
	}
	function getIndex (week) {
		if (week === '一') {
			return 1
		}
		if (week === '二') {
			return 2
		}
		if (week === '三') {
			return 3
		}
		if (week === '四') {
			return 4
		}
		if (week === '五') {
			return 5
		}
		if (week === '六') {
			return 6
		}
		if (week === '日') {
			return 7
		}
	}
	function getWeek (index) {
		if (index === 1) {
			return '一'
		}
		if (index === 2) {
			return '二'
		}
		if (index === 3) {
			return '三'
		}
		if (index === 4) {
			return '四'
		}
		if (index === 5) {
			return '五'
		}
		if (index === 6) {
			return '六'
		}
		if (index === 7) {
			return '日'
		}
	}
	const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      dispatch({
        type: 'periodconfig/findById',
			  payload: {
				//  modalType: 'update',
				  currentItem: record,
				//  modalVisible: true,
				 // timeList:timeList,
			  },
      })
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
        	let ids = []
        	ids.push(record.uuid)
          dispatch({
		        type: 'periodconfig/delete',
		        payload: ids,
		      })
        },
      })
    }
  }

	const columns = [
    {
      title: '发现IP',
      dataIndex: 'discoveryIP',
      key: 'discoveryIP',
    }, {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
		}, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
		}, {
      title: '对象关键字',
      dataIndex: 'keyword',
      key: 'keyword',
    }, {
      title: '所属应用分类名称',
      dataIndex: 'appName',
      key: 'appName',
    }, {
      title: '所属机构',
      dataIndex: 'branchName',
      key: 'branchName',
      render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
    }, {
      title: '管理机构',
      dataIndex: 'mngtOrgCode',
      key: 'mngtOrgCode',
      render: (text, record) => {
  		return Fenhangmaps.get(text)
  	},
    }, {
      title: '一级专业分类',
      dataIndex: 'firstClass',
      key: 'firstClass',
    }, {
      title: '二级专业分类',
      dataIndex: 'secondClass',
      key: 'secondClass',
		}, {
      title: '三级专业分类',
      dataIndex: 'thirdClass',
      key: 'thirdClass',
    }, {
      title: '厂商',
      dataIndex: 'vendor',
      key: 'vendor',
    }, {
      title: '应用容量特征',
      dataIndex: 'capType',
      key: 'capType',
    }, {
      title: '类别',
      dataIndex: 'typ',
      key: 'typ',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '一级安全域',
      dataIndex: 'firstSecArea',
      key: 'firstSecArea',
    }, {
      title: '二级安全域',
      dataIndex: 'secondSecArea',
      key: 'secondSecArea',
    }, {
      title: '区域',
      dataIndex: 'location',
      key: 'location',
    }, {
      title: 'objectID',
      dataIndex: 'objectID',
      key: 'objectID',
    }, {
      title: '搜索代码',
      dataIndex: 'searchCode',
      key: 'searchCode',
    }, {
      title: 'SNMP团体串',
      dataIndex: 'snmpCommunity',
      key: 'snmpCommunity',
    }, {
      title: 'SNMP写团体串',
      dataIndex: 'snmpWriteCommunity',
      key: 'snmpWriteCommunity',
    }, {
      title: 'SNMP版本',
      dataIndex: 'snmpVer',
      key: 'snmpVer',
    }, {
      title: 'srcType',
      dataIndex: 'srcType',
      key: 'srcType',
    }, {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
    }, {
      title: '纳管状态',
      dataIndex: 'managedStatus',
      key: 'managedStatus',
    }, {
      title: '监控状态',
      dataIndex: 'monitorStatus',
      key: 'monitorStatus',
    }, {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
    }, {
      title: '同步时间',
      dataIndex: 'syncTime',
			key: 'syncTime',
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
    }, {
      title: '创建方式',
      dataIndex: 'createMethod',
      key: 'createMethod',
    }, {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    }, {
      title: '由工具创建',
      dataIndex: 'createdByTool',
      key: 'createdByTool',
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
			key: 'createdTime',
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    }, {
      title: '最后更新时间',
      dataIndex: 'updatedTime',
			key: 'updatedTime',
			render: (text, record) => {
				return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
			},
		},
		/*
		{
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },*/
  ]

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
	  		})
	  	//console.log(selectedRows)
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'periodconfig/setState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'periodconfig/setState',
					payload: {
						batchDelete: false,
						selectedRows,
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
          scroll={{ x: 4000 }}
        />
      </Col>
    </Row>
  )
}

export default list
