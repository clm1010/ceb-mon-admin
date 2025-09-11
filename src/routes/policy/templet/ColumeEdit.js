import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Tree, Icon, Checkbox, Select, InputNumber, Row, Col } from 'antd'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
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
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
	columeList,
	columeInfo,
	selectKey1,
	selectKey2,
}) => {
	let treeNodes1 = []
	let treeNodes2 = []
	let treeNode1 = {}
	let treeNode2 = {}

	if (columeList !== undefined && columeList.length > 0) {
		columeList.forEach((item) => {
			  let treeNode = <TreeNode title={item.name} key={item.key} isLeaf />
			  if (item.isSelected) {
			  	treeNodes2.push(treeNode)
			  } else {
			  	treeNodes1.push(treeNode)
			  }
		})
		treeNode1 = <TreeNode title="备选列" key="00" isLeaf={false}>{treeNodes1}</TreeNode>
		treeNode2 = <TreeNode title="已选列" key="01" isLeaf={false}>{treeNodes2}</TreeNode>
	}
	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					columeVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'policyTemplet/updateState',
				payload: {
					columeVisible: false,
				},
		})
	}

  const modalOpts = {
    title: `${type === 'create' ? '新增策略模板' : '编辑策略模板'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }
	const onSelect1 = (selectedKeys, info) => {
    let selectKey1 = selectedKeys[0]
    let columeInfo = {
    	key: '',
   		name: '',
   		width: '',
   		lockecd: false,
   		sort: 'asc',
    }
    columeList.forEach((item) => {
			  if (item.key === selectedKeys[0]) {
			  	columeInfo.key = item.key
			  	columeInfo.name = item.name
			  	columeInfo.width = item.width
			  	columeInfo.locked = item.locked
			  	columeInfo.sort = item.sort
			  }
		})
		dispatch({
				type: 'policyTemplet/updateState',
			  payload: {
					columeInfo,
					selectKey1,
				},
		})
  }
  const onSelect2 = (selectedKeys, info) => {
    let selectKey2 = selectedKeys[0]
    let columeInfo = {
    	key: '',
   		name: '',
   		width: '',
   		lockecd: false,
   		sort: 'asc',
    }
    columeList.forEach((item) => {
			  if (item.key === selectedKeys[0]) {
			  	columeInfo.key = item.key
			  	columeInfo.name = item.name
			  	columeInfo.width = item.width
			  	columeInfo.locked = item.locked
			  	columeInfo.sort = item.sort
			  }
		})
		dispatch({
				type: 'policyTemplet/updateState',
			  payload: {
					columeInfo,
					selectKey2,
				},
		})
  }
  const toRight = () => {
  	if (selectKey1 !== undefined && selectKey1 !== '') {
  			columeList.forEach((item0) => {
  				  if (item0.key === selectKey1) {
  							item0.isSelected = true
  					}
  			})
  	}
  	dispatch({
				type: 'policyTemplet/updateState',
			  payload: {
					columeList,
				},
		})
  }
  const toLeft = () => {
  	if (selectKey2 !== undefined && selectKey2 !== '') {
  			columeList.forEach((item0) => {
  				  if (item0.key === selectKey2) {
  							item0.isSelected = false
  					}
  			})
  	}
  	dispatch({
				type: 'policyTemplet/updateState',
			  payload: {
					columeList,
				},
		})
  }

  return (

    <Modal {...modalOpts} width="400px">
      <Form >
        <Row>
          <Col span={8}>
            <Tree
              showLine
      					  //checkable
              defaultExpandedKeys={['00']}
              onSelect={onSelect1}
            >
              {treeNode1}
            </Tree>
          </Col>
          <Col span={8}>
            <Row>
              <Button
                style={{ float: 'right', margin: 5 }}
                onClick={toRight}
              >
                <Icon type="right" />
              </Button>
            </Row>
            <Row>
              <Button
                style={{ float: 'right', margin: 5 }}
                onClick={toLeft}
              >
                <Icon type="left" />
              </Button>
            </Row>
          </Col>
          <Col span={8}>
            <Tree
              showLine
      					  //checkable
              defaultExpandedKeys={['01']}
              onSelect={onSelect2}
            >
              {treeNode2}
            </Tree>
          </Col>
        </Row>

        <Button
          style={{ float: 'right', margin: 5 }}
          onClick={toLeft}
          size="small"
        >
          <Icon type="left" />
        </Button>


        <FormItem label="列名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: columeInfo.name,
          })(<Input />)}
        </FormItem>
        <FormItem label="列宽" hasFeedback {...formItemLayout}>
          {getFieldDecorator('width', {
            initialValue: columeInfo.width,
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="是否锁定" hasFeedback {...formItemLayout}>
          			{getFieldDecorator('lockecd', {
            			initialValue: columeInfo.locked,
            			valuePropName: 'checked',
                })(<Checkbox >周期内</Checkbox>)}
        </FormItem>
        <div style={{ position: 'relative' }} id="area1" />
        <FormItem label="排序" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sort', {
            initialValue: columeInfo.sort,
          })(<Select
  					  //onChange={typeChange}
            getPopupContainer={() => document.getElementById('area1')}
          >
            <Select.Option value="desc">降序</Select.Option>
            <Select.Option value="asc">升序</Select.Option>
             </Select>)}
        </FormItem>
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
