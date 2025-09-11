import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree } from 'antd'
const TreeNode = Tree.TreeNode

const group = ({
	dispatch,
  visible,
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  cfgType,
  isClose,
  detail,
}) => {
	function onOk () {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.parentId = detail.id
      dispatch({
				type: `cfg/${type}`,											//抛一个事件给监听这个type的监听器
				payload: data,
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyTemplet/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				  //modalVisible: true,
    			groupVisible: false,
    			//kpiVisible: false,
			},
		})
	}

  const modalOpts = {
    title: '选择策略组',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    type,
    maskClosable: false,
  }

	const onSelect = (selectedKeys, info) => {
  }
  const onCheck = (checkedKeys, info) => {
  }


  return (
    <Modal {...modalOpts} width="300px">
      <Form layout="horizontal">
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onSelect={onSelect}
          onCheck={onCheck}
        >
          <TreeNode title="对象" key="0-0">
            <TreeNode title="网路设备" key="0-0-0" >
              <TreeNode title="交换机" key="0-0-0-0" 	 />
              <TreeNode title="路由器" key="0-0-0-1" />
            </TreeNode>
          </TreeNode>
        </Tree>

      </Form>
    </Modal>
  )
}

group.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(group)
