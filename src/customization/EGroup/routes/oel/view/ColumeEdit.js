import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Tree, Checkbox, Select, InputNumber, Row, Col, Tabs, Icon, Tooltip } from 'antd'
import './col.css'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}


const modal = ({
	dispatch,
	modaltype,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  checkStatus,
	columeList,
	columeInfo,
	selectKey1,
	selectKey2,
	currentView,
}) => {
	let treeNodes1 = []
	let treeNodes2 = []
	let treeNode1 = {}
	let treeNode2 = {}

	if (columeList !== undefined && columeList.length > 0) {
		columeList.forEach((item) => {
			  let treeNode = <TreeNode title={<Tooltip title={item.key} placement="left">{item.name}</Tooltip>} key={item.key} isLeaf />
			  if (item.isSelected) {
			  	if (item.locked === true) {
			  		let sorts = item.sort
			  		switch (sorts) {
						case 'no':
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf><Icon type="lock" style={{ marginTop: '2px' }} /></TreeNode>
  							break
						case 'desc':
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf><Icon type="lock" style={{ marginTop: '2px' }} /></TreeNode>
  							break
						default:
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf><Icon type="lock" style={{ marginTop: '2px' }} /></TreeNode>
					}
			  		treeNodes2.push(treeNode)
			  	} else {
			  		let sorts = item.sort
			  		switch (sorts) {
						case 'no':
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf />
  							break
						case 'desc':
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf />
  							break
						default:
  							treeNode = <TreeNode title={<Tooltip title={item.key} placement="right">{item.name}</Tooltip>} key={item.key} isLeaf />
					}
			  		treeNodes2.push(treeNode)
			  	}
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

      columeList.forEach((item) => {
    		if (item.key === columeInfo.key) {
    			item.name = data.alias
    			item.width = data.width
    			item.locked = data.locked
    			item.sort = data.sort
    			item.alias = data.alias
    		}
    })


			let unselectedCols = ''
			let selectedCols = ''
			let colume1 = '['
			let colume2 = '['
			columeList.forEach((item) => {
				let sorter = true
				let sortOrder = 'ascend'
				if (item.sort === 'asc') {
					 sorter = true
					 sortOrder = 'ascend'
				} else {
					 sorter = false
					 sortOrder = 'descend'
				}
				if (item.width === undefined || item.width === '') {
					item.width = 0
				}
				let colume0 = ''
				if (item.sort === 'no') {
					if (item.name === undefined || item.name === '') {
						colume0 = `{"alias":"${item.alias}","width":${item.width},"dataIndex":"${item.key}","key":"${item.name}`
					} else {
						colume0 = `{"alias":"${item.alias}","title":"${item.alias}","width":${item.width},"dataIndex":"${item.key}","key":"${item.name}`
					}
				} else if (item.name === undefined || item.name === '') {
						colume0 = `{"alias":"${item.alias}","width":${item.width},"dataIndex":"${item.key}","sorter":${sorter},"key":"${item.name}`
					} else {
						colume0 = `{"alias":"${item.alias}","title":"${item.alias}","width":${item.width},"dataIndex":"${item.key}","sorter":${sorter},"key":"${item.name}`
					}

				if (item.locked) {
					colume0 += '","fixed":"left"}'
				} else {
					colume0 += '"}'
				}
				if (item.isSelected) {
					if (colume1 === '[') {
						colume1 += colume0
					} else {
						colume1 = `${colume1},${colume0}`
					}
				} else if (colume2 === '[') {
						colume2 += colume0
					} else {
						colume2 = `${colume2},${colume0}`
					}
			})
			colume1 += ']'
			colume2 += ']'
			selectedCols = colume1
			unselectedCols = colume2
			let isGlobal = true
			let type = data.type
			if (type === 'true') {
				isGlobal = true
			} else {
				isGlobal = false
			}
			let url = 'eventviews/create'
			if (modaltype === 'create') {
				url = 'eventviews/create'
			} else {
				url = 'eventviews/update'
			}
			resetFields()
			let payload = {
					isGlobal,
					name: data.viewName,
					selectedCols,
					unselectedCols,
			}

      dispatch({
				type: url,
				payload,
			})

			dispatch({
				type: 'eventviews/updateState',
				payload: {
					columeInfo: {},
					selectKey2: '',
					selectKey1: '',
				},
			})
    })
	}

	const onCancel = () => {
		resetFields()
		dispatch({
				type: 'eventviews/updateState',
				payload: {
					columeVisible: false,
					columeInfo: {},
					selectKey2: '',
					selectKey1: '',
				},
		})
	}

  const modalOpts = {
    title: '视图编辑',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }
	const onSelect1 = (selectedKeys, info) => {
    let selectKey1 = selectedKeys[0]

		dispatch({
				type: 'eventviews/updateState',
			  payload: {
					selectKey1,
				},
		})
  }
  const onSelect2 = (selectedKeys, info) => {
   const data = {
        ...getFieldsValue(),
    }

    columeList.forEach((item) => {
    		if (item.key === columeInfo.key) {
    			item.width = data.width
    			item.locked = data.locked
    			item.sort = data.sort
    			item.alias = data.alias
    		}
    })

		resetFields(['alias', 'width', 'locked', 'sort'])


   let columeInfo0 = {
    	key: '',
   		name: '',
   		width: '',
   		locked: false,
   		sort: 'no',
   		alias: '',
    }

    let selectKey2 = selectedKeys[0]
    columeList.forEach((item) => {
			  if (item.key === selectedKeys[0]) {
			  	columeInfo0.key = item.key
			  	columeInfo0.name = item.name
			  	columeInfo0.width = item.width
			  	columeInfo0.locked = item.locked
			  	columeInfo0.sort = item.sort
			  	columeInfo0.alias = item.alias
			  }
		})
		dispatch({
				type: 'eventviews/updateState',
			  payload: {
					columeInfo: columeInfo0,
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
				type: 'eventviews/updateState',
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
				type: 'eventviews/updateState',
			  payload: {
					columeList,
				},
		})
  }
  const up = () => {
  	let currentIndex
  	let currentItem
  	let preKey
  	let result = []
  	if (selectKey2 !== undefined && selectKey2 !== '') {
  		for (let i = 0; i < columeList.length; i++) {
  			if (columeList[i].key === selectKey2) {
  					currentIndex = i
  					currentItem = columeList[i]
  			}
  		}

  		for (let ii = currentIndex - 1; ii >= 0; ii--) {
  			if (columeList[ii].isSelected === true) {
  					preKey = columeList[ii].key
  					break
  			}
  		}
  		if (preKey !== undefined) {
  			for (let j = 0; j < columeList.length; j++) {
  				if (columeList[j].key !== selectKey2 && columeList[j].key !== preKey) {
  						result.push(columeList[j])
  				} else if (columeList[j].key === preKey) {
  					result.push(currentItem)
  					result.push(columeList[j])
  				}
  		  }
  		}
  	}
  	if (result.length > 0) {
  		 dispatch({
			  	type: 'eventviews/updateState',
			    payload: {
				  	columeList: result,
				  },
		  })
  	}
  }
  const down = () => {
  	let currentIndex
  	let currentItem
  	let nextItem
  	let result = []
  	if (selectKey2 !== undefined && selectKey2 !== '') {
  		for (let i = 0; i < columeList.length; i++) {
  			if (columeList[i].key === selectKey2) {
  					currentIndex = i
  					currentItem = columeList[i]
  			}
  		}

  		for (let ii = currentIndex + 1; ii <= columeList.length; ii++) {
  			if (columeList[ii].isSelected === true) {
  				  nextItem = columeList[ii]
  					break
  			}
  		}

  		if (nextItem !== undefined) {
  			for (let j = 0; j < columeList.length; j++) {
  				if (columeList[j].key !== selectKey2 && columeList[j].key !== nextItem.key) {
  						result.push(columeList[j])
  				} else if (columeList[j].key === currentItem.key) {
  					result.push(nextItem)
  					result.push(currentItem)
  				}
  		  }
  		}
  	}
  	if (result.length > 0) {
  		 dispatch({
			  	type: 'eventviews/updateState',
			    payload: {
				  	columeList: result,
				  },
		  })
  	}
  }
  const upTop = () => {
  	let currentItem
  	let result = []
  	if (selectKey2 !== undefined && selectKey2 !== '') {
  		for (let i = 0; i < columeList.length; i++) {
  			if (columeList[i].key === selectKey2) {
  					currentItem = columeList[i]
  			}
  		}
			result.push(currentItem)
  	  for (let j = 0; j < columeList.length; j++) {
  				if (columeList[j].key !== selectKey2) {
  						result.push(columeList[j])
  				}
  	  }
  	}
  	if (result.length > 0) {
  		 dispatch({
			  	type: 'eventviews/updateState',
			    payload: {
				  	columeList: result,
				  },
		  })
  	}
  }
  const downTop = () => {
  	let currentItem
  	let result = []
  	if (selectKey2 !== undefined && selectKey2 !== '') {
  		for (let i = 0; i < columeList.length; i++) {
  			if (columeList[i].key === selectKey2) {
  					currentItem = columeList[i]
  			}
  		}
  	  for (let j = 0; j < columeList.length; j++) {
  				if (columeList[j].key !== selectKey2) {
  						result.push(columeList[j])
  				}
  	  }
  	  result.push(currentItem)
  	}
  	if (result.length > 0) {
  		 dispatch({
			  	type: 'eventviews/updateState',
			    payload: {
				  	columeList: result,
				  },
		  })
  	}
  }

  return (

    <Modal {...modalOpts} width="700px">
      <Form >
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="user" />基本信息</span>} key="1">
            <FormItem label="视图名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('viewName', {
            	initialValue: currentView.name,
            	rules: [
		              {
		                required: true,
		              },
		          ],
          	})(<Input />)}
            </FormItem>
            <div style={{ position: 'relative' }} id="area9" />
            <FormItem label="类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
            	initialValue: currentView.type,
            	rules: [
		              {
		                required: true,
		              },
		          ],
          	})(<Select
            getPopupContainer={() => document.getElementById('area9')}
          	>
            <Select.Option value="true">Global</Select.Option>
            <Select.Option value="false">Private</Select.Option>
              </Select>)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="trademark" />列选择</span>} key="1">
            <Row>
              <div className="col-part-left">
                <Col span={11}>
                  <div className="col-part-in-01">
                    <Tree
                      showLine
                      defaultExpandedKeys={['00']}
                      selectedKeys={[selectKey1]}
                      onSelect={onSelect1}
                    >
                      {treeNode1}
                    </Tree>
                  </div>
                </Col>

                <Col span={2}>
                  <br />
                  <br />
                  <br />
                  <div className="col-button-01">
                    <Row>
                      <Button style={{ float: 'middle', margin: 5 }} onClick={toRight} ><Icon type="right" /></Button>
                    </Row>
                    <Row>
                      <Button style={{ float: 'middle', margin: 5 }} onClick={toLeft} ><Icon type="left" /></Button>
                    </Row>
                  </div>
                </Col>

                <Col span={11}>
                  <div className="col-part-in-02">
                    <Tree
                      showLine
                      defaultExpandedKeys={['01']}
                      selectedKeys={[selectKey2]}
                      onSelect={onSelect2}
                    >
                      {treeNode2}
                    </Tree>
                  </div>
                  <div className="col-button-02">
                    <Button onClick={upTop}><span className="icons-top" /></Button>
                    <Button onClick={up}><Icon type="up" /></Button>
                    <Button onClick={down}><Icon type="down" /></Button>
                    <Button onClick={downTop}><span className="icons-down" /></Button>
                  </div>
                </Col>
              </div>

              <Col span={10}>


                <br />
                <br />
                <br />
                <FormItem label="列名" {...formItemLayout}>
                  {getFieldDecorator('alias', {
            initialValue: columeInfo.alias,
          })(<Input disabled />)}
                </FormItem>
                <FormItem label="列宽" {...formItemLayout}>
                  {getFieldDecorator('width', {
            initialValue: (columeInfo.width && columeInfo.width !== 0 ? columeInfo.width : 200),
            rules: [
					  	{
							required: true,
					  	},
					  	],
          })(<InputNumber min="0" />)}px
                </FormItem>
                {

                  <FormItem label="是否锁定" {...formItemLayout}>
                    {getFieldDecorator('locked', {
            			initialValue: columeInfo.locked,
            			valuePropName: 'checked',
                })(<Checkbox />)}
                  </FormItem>

		}
                <div style={{ position: 'relative' }} id="area1" />
              </Col>
            </Row>
          </TabPane>
        </Tabs>

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
