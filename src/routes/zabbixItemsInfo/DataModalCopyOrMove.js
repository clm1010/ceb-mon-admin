import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree } from 'antd'

const modal = ({
	dispatch,
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
	selectTreeNodeKeys,
}) => {
	let selectTreeNode = []
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				targetGroupUUIDs: selectTreeNodeKeys,
				targetUUIDs: choosedRows,
			}
			dispatch({
				type: `zabbixItemsInfo/${type}`,
				payload: data,
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalVisibleCopyOrMove: false,
				isClose: true,
			},
		})
	}

	const onCheck = (selectedKeys, info) => {
		selectTreeNode.push(selectedKeys[0])
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectTreeNodeKeys: selectTreeNode,
			},
		})
	}

	const modalOpts = {
		title: `${type === 'copy' ? '批量复制' : '批量移动'}`,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 420,
		maskClosable: false,
	}

	return (
		isClose ? null :
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
