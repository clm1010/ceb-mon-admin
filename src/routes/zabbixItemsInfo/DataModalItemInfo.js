import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree, Table, Row, Col, Input } from 'antd'

const Search = Input.Search

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
	dispatch,
	loading,
	visible,
	type,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	modalType,
	checkStatus,
	isClose,
	treeNodes,
	choosedRows,
	Columns,
	tableList,
	pagination,
	itemgroupUUID,
	expandKeys,

}) => {
	//let selectTreeNodeKeys = []
	let selectItemObj = {}
	let searchobj = {}
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				console.log('errors : ', errors)
				return
			}
			//selectItemObj.uuid = `#${selectItemObj.uuid}#_${new Date().getTime()}`
			selectItemObj.uuid = `#{${selectItemObj.uuid}}_${new Date().getTime()}`
			/*
			此处需要把选择的信息，保存到state中去
			*/
			dispatch({
				type: 'zabbixItemsInfo/controllerModalPlus',
				payload: {
					formulaForFrontend: selectItemObj,
					selectItemVisible: false,
					isClose: true,
				},
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectItemVisible: false,
				isClose: true,
			},
		})
	}


	const onSelect = (selectedKeys, info) => {
		let groupkey = ''
		if (selectedKeys && selectedKeys.length > 0) {
			groupkey = selectedKeys[0]
		}

		if (searchobj && searchobj.input && searchobj.input.refs && searchobj.input.refs.input) {
			searchobj.input.refs.input.value = ''
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'zabbixItemsInfo/queryItemInfo',
			payload: {
				groupUUID: groupkey,
			},
		})

		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				itemgroupUUID: selectedKeys,
			},
		})
	}

	const rowSelection = {
		type: 'radio',
		onChange: (selectedRowKeys, selectedRows) => {
			let obj = {}
			if (selectedRowKeys && selectedRowKeys.length > 0) {
				obj = { uuid: selectedRowKeys[0], name: selectedRows[0].name }
			}
			selectItemObj = obj
		},
	}

	const onSearch = (val) => {
		let groupkey = ''
		if (itemgroupUUID && itemgroupUUID.length > 0) {
			groupkey = itemgroupUUID[0]
		}
		let data = { groupUUID: groupkey }
		if (val) {
			data = { ...data, q: `name=='*${val}*'` }
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'zabbixItemsInfo/queryItemInfo',
			payload: data,
		})
	}

	const onPageChange = (page) => {
		let data = {
				current: page.current - 1,
				page: page.current - 1,
				pageSize: page.pageSize,
}
		if (itemgroupUUID && itemgroupUUID.length > 0) {
			data = { ...data, groupUUID: itemgroupUUID[0] }
		}

		dispatch({
			type: 'zabbixItemsInfo/queryItemInfo',
			payload: data,
		})
	}

	function getChild (child) { //這个就是获取组件对象
		searchobj = child
	}

	const modalOpts = {
		title: 'Item选择器',
		visible,
		onOk,
		okText: '保存',
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 920,
		maskClosable: false,
	}

	return (
  <Modal {...modalOpts} height="600px">
    <Row gutter={12}>
      <Col lg={4} md={5} sm={5} xs={24} className="content-inner">
        <div>指标组
        </div>
        <div>
          <Tree
            showLine
						//defaultSelectedKeys={selectKeys}
            expandedKeys={expandKeys}
            onSelect={onSelect}
            defaultExpandAll
          >
            {treeNodes}
          </Tree>

        </div>

      </Col>
      <Col lg={20} md={19} sm={19} xs={24}>
        <Row gutter={24}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>

            <Search
              id="itemsreach"
              placeholder="请输入Item名称查询"
              style={{ width: '100%', marginBottom: '12px' }}
              onSearch={onSearch}
					//onChange={onInputChange}
              ref={getChild}
            />

          </Col>
        </Row>
        <Row>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              key={new Date()}
              scroll={{ x: 1800 }} //滚动条
              bordered
              columns={Columns} //表结构字段
              simple
              size="small"

              dataSource={tableList} //表数据
              loading={loading} //页面加载

              rowKey={record => record.uuid}
              pagination={pagination} //分页配置
              onChange={onPageChange} //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
              rowSelection={rowSelection}
            />
          </Col>

        </Row>
      </Col>
    </Row>
  </Modal>
	)
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
