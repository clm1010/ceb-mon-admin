import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree, message } from 'antd'

const modal = ({
	dispatch,
	visible,
	type,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	treeNodes,
	choosedRows,
}) => {
	let selectTreeNodeKeys = []
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			if (selectTreeNodeKeys === undefined || selectTreeNodeKeys.length === 0) {
				message.error('请选择分组！')
			}
			let keys = []
			choosedRows.forEach((item) => {
				keys.push(item.policyTemplate.uuid)
			})
			const data = {
				targetGroupUUIDs: selectTreeNodeKeys,
				targetUUIDs: keys,
			}
			dispatch({
				type: `policyTemplet/${type}`,
				payload: data,
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				copyOrMoveModal: false,
				isClose: true,
			},
		})
	}

	const onCheck = (selectedKeys, info) => {
		selectTreeNodeKeys = selectedKeys
		//alert(selectedKeys)
	}

	const modalOpts = {
		title: `${type === 'copy' ? '批量复制' : '批量移动'}`,
		visible,
		onOk,
		onCancel,
		maskClosable: false,
		wrapClassName: 'vertical-center-modal',
		width: 420,
		maskClosable: false,
	}

	return (
  <Modal {...modalOpts}>
    <Tree
      showLine //连接线
      checkable //复选框
      defaultExpandAll
      onCheck={onCheck}
    >
      {treeNodes}
    </Tree>
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
