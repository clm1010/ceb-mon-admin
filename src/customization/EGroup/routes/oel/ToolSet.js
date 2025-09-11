import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Table, Row, Col } from 'antd'
import { DropOption } from '../../../../components'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}


const modal = ({
	dispatch,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  dataSource,
  loading,
}) => {
	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      dispatch({
				type: 'oel/updateState',
				payload: {
					toolsetVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'oel/updateState',
				payload: {
					toolsetVisible: false,
				},
		})
	}

	const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }, { key: '3', name: '克隆' }]} />
      },
    },
  ]
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
		dispatch({
			type: 'oel/updateState',
			payload: {
				tooleditVisible: true,
			},
		})
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {

        },
      })
    } else if (e.key === '3') {
      dispatch({
				type: 'oel/updateState',
				payload: {
					copytoolVisible: true,
				},
		})
    }
  }
  const modalOpts = {
    title: '工具配置',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

	const selectChange = () => {															//弹出窗口中点击取消按钮触发的函数

	}
	const addTool = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'oel/updateState',
			payload: {
				tooleditVisible: true,

			},
		})
  }

  return (
    <Modal {...modalOpts} width="300px">
      <Form >
        <Row>
          <Col span={8} />
          <Col span={10} />
          <Col span={6}>
            <Button type="primary" onClick={addTool}>新建</Button>
          </Col>
        </Row>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          simple
          rowKey={record => record.uuid}
          size="small"
          loading={loading.effects['oelToolset/queryTool']}
        />
      </Form>

    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
