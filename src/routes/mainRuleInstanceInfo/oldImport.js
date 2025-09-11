import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Row, Col, Table } from 'antd'

const modal = ({
	dispatch,
	visible,
	dataSource,
}) => {
	const columns = [
		{
			title: 'failedRawRows',
			dataIndex: 'dataSource.failedRawRows',
			key: 'failedRawRows',
		},
		{
			title: 'failedU2MtNum',
			dataIndex: 'dataSource.failedU2MtNum',
			key: 'failedU2MtNum',
		},
		{
			title: 'successRawRows',
			dataIndex: 'dataSource.successRawRows',
			key: 'successRawRows',
		},
		{
			title: 'successU2MtNum',
			dataIndex: 'dataSource.successU2MtNum',
			key: 'successU2MtNum',
		},
		{
			title: 'totalRawRows',
			dataIndex: 'dataSource.totalRawRows',
			key: 'totalRawRows',
		},
		{
			title: 'totalU2MtNum',
			dataIndex: 'dataSource.totalU2MtNum',
			key: 'totalU2MtNum',
		},
	]


	const onCancel = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				oldVisible: false,
				oldImportSource: [],
			},
		})
	}

	const modalOpts = {
	    title: '模板',
	    visible,
	    onCancel,
	    wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	return (
  <Modal {...modalOpts}>
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 450 }} //滚动条
          bordered
          columns={columns} //表结构字段
          dataSource={dataSource} //表数据
						//onChange={onPageChange}  //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
          pagination={false} //分页配置
          simple
          size="small"
          rowKey={record => record.name}
        />
      </Col>
    </Row>
  </Modal>
	)
}

export default Form.create()(modal)
