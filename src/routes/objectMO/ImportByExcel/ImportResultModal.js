import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Row, Col, Table } from 'antd'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const tailFormItemLayout = {
	wrapperCol: {
  	xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
  labelCol: {
    span: 6,
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
  dataSource = [],
  queryPath,
}) => {
	const onOk = () => {
      dispatch({
			type: `${queryPath}`,
			payload: {
				moImportFileList: [],
				showUploadList: false,
				moImportResultVisible: false,
				moImportResultdataSource: [],
				moImportResultType: '',
			},
		})
	}

	const onCancel = () => {
		dispatch({
			type: `${queryPath}`,
			payload: {
				moImportFileList: [],
				showUploadList: false,
				moImportResultVisible: false,
				moImportResultdataSource: [],
				moImportResultType: '',
			},
		})
	}

  const columns	= [
  	{
		title: '导入类型',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '导入成功数',
		dataIndex: 'success',
		key: 'success',
	},
	{
		title: '导入失败数',
		dataIndex: 'fail',
		key: 'fail',
	},
	{
		title: '导入失败行号',
		dataIndex: 'failRows',
		key: 'failRows',
	},
	{
		title: '已存在MO的数量',
		dataIndex: 'moexist',
		key: 'moexist',
	},
	{
		title: '已存在MO的行数',
		dataIndex: 'moexistrows',
		key: 'moexistrows',
	},
	{
		title: '数据异常行号',
		dataIndex: 'dataerrorrow',
		key: 'dataerrorrow',
	},
	{
		title: '数据异常数量',
		dataIndex: 'dataerror',
		key: 'dataerror',
	},
	{
		title: '错误描述',
		dataIndex: 'errrordescs',
		key: 'errrordescs',
	},
  ]

/*   const columns	= [
  	{
		title: '导入类型',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '导入成功数',
		dataIndex: 'success',
		key: 'success',
	},
	{
		title: '导入失败数',
		dataIndex: 'fail',
		key: 'fail',
	},
	{
		title: '已经存在监控对象数',
		dataIndex: 'moexist',
		key: 'moexist',
	},
	{
		title: '应用系统不存在数量',
		dataIndex: 'appcategory',
		key: 'appcategory',
	},
	{
		title: '导入数据异常数量',
		dataIndex: 'dataerror',
		key: 'dataerror',
	}, {
		title: '导入失败行号',
		dataIndex: 'failrows',
		key: 'failrows',
	}, {
		title: '已经存在监控对象行号',
		dataIndex: 'moexistrows',
		key: 'moexistrows',
	},
	{
		title: '应用系统不存在行号',
		dataIndex: 'appcategoryrows',
		key: 'appcategoryrows',
	},
	{
		title: '数据异常行号',
		dataIndex: 'dataerrorrow',
		key: 'dataerrorrow',
	}, {
		title: '错误描述',
		dataIndex: 'errrordescs',
		key: 'errrordescs',
	},
  ]
 */
  const modalOpts = {
    title: `导入完成`,//`${type === 'success' ? '导入成功' : '导入失败'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    width: 1100,

  }

  return (
    <Modal {...modalOpts} height="600px" footer={[<Button key="submit" type="primary" loading={loading} onClick={onOk}>确定</Button>]} >
      <Row gutter={24}>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <Table
            scroll={{ x: 1200, y: 300 }} //滚动条
            bordered
            columns={columns} //表结构字段
            dataSource={dataSource} //表数据
            loading={loading} //页面加载
            expandedRowRender={record => <p style={{ margin: 0 }}>{record.errorDesc}</p>}
            defaultExpandAllRows
					//onChange={onPageChange}  //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
            pagination={false} //分页配置
            simple
            showExpandColumn
            size="small"
            rowKey={record => record.name}
          />

        </Col>
      </Row>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
