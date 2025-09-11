import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree, Table, Row, Col, Input, notification } from 'antd'

//MO字段的统一引用
import RouterColumns from '../../../components/MOColumns/RouterColumns'
import RouterInterfaceColumns from '../../../components/MOColumns/RouterInterfaceColumns'
import FireWallColumns from '../../../components/MOColumns/FireWallColumns'
import FireWallInterfaceColumns from '../../../components/MOColumns/FireWallInterfaceColumns'
import SwitchColumns from '../../../components/MOColumns/SwitchColumns'
import SwitchInterfaceColumns from '../../../components/MOColumns/SwitchInterfaceColumns'
import F5Columns from '../../../components/MOColumns/F5Columns'
import LinesColumns from '../../../components/MOColumns/LinesColumns'

import ApplicationsColumns from '../../../components/MOColumns/ApplicationsColumns'
import DatabasesColumns from '../../../components/MOColumns/DatabasesColumns'
import MiddleWaresColumns from '../../../components/MOColumns/MiddleWaresColumns'
import OSColumns from '../../../components/MOColumns/OSColumns'
import ServersColumns from '../../../components/MOColumns/ServersColumns'
import BranchIPColumns from '../../../components/MOColumns/BranchIPColumns'
const TreeNode = Tree.TreeNode
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
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
    objectMOsModal,
	obInfoValName,
	objectVisible,
	objectVisibleName,
	statePath,


}) => {
	const {
 treeDatas, treeMap, firstClass, secondClass, thirdClass, selectuuid, pagination, list,
} = objectMOsModal

	let selectItemObj = []
	let searchobj = {}
	let treeNodes = [] //树节点
	let Columns = [] //table显示的列名

	//定义默认展开的节点数组
	let expandKeys = []
	//定义默认选中的节点数组
	let selectedKeys = []
	//let myMap = new Map()
	const loop = data => data.map((item) => {
		//如果路径中包含节点的key字符串，则设置为默认选中节点
		if (selectuuid === item.uuid) {
			selectedKeys.push(item.uuid)
		}
		if (item.children && item.children.length > 0) {
			//只要是父节点，都放到该数组中，作为默认展开
			expandKeys.push(item.uuid)
			//let arrs = [...myarrs,item.key]
			return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})


	if (treeDatas && treeDatas.length > 0) {
		treeNodes = loop(treeDatas)
	}

	/*
		获取table对应的字段
	*/
	const getMoInfoByType = (firstClass, secondClass, thirdClass) => {
		let showInfoKeys = ''
		if (firstClass && firstClass !== '') {
			showInfoKeys = firstClass
		}
		if (secondClass && secondClass !== '') {
			showInfoKeys = `${showInfoKeys}_${secondClass}`
		}
		if (secondClass && secondClass !== '' && thirdClass && thirdClass !== '') {
			showInfoKeys = `${showInfoKeys}_${thirdClass}`
		}

		let fields = SwitchColumns
		if (showInfoKeys === 'NETWORK_SWITCH') {
			fields = SwitchColumns
		} else if (showInfoKeys === 'NETWORK_ROUTER') {
			fields = RouterColumns
		} else if (showInfoKeys === 'NETWORK_FIREWALL') {
			fields = FireWallColumns
		} else if (showInfoKeys === 'NETWORK_F5') {
			fields = F5Columns
		} else if (showInfoKeys === 'NETWORK_HA_LINE') {
			fields = LinesColumns
		} else if (showInfoKeys === 'NETWORK_BRANCH_IP') {
			fields = BranchIPColumns
		} else if (showInfoKeys === 'NETWORK_SWITCH_NET_INTF') {
			fields = SwitchInterfaceColumns
		} else if (showInfoKeys === 'NETWORK_ROUTER_NET_INTF') {
			fields = RouterInterfaceColumns
		} else if (showInfoKeys === 'NETWORK_FIREWALL_NET_INTF') {
			fields = FireWallInterfaceColumns
		} else if (showInfoKeys === 'NETWORK_F5_NET_INTF') {
			fields = FireWallInterfaceColumns
		} else if (showInfoKeys === 'OS') {
			fields = OSColumns
		} else if (showInfoKeys === 'DB') {
			fields = DatabasesColumns
		} else if (showInfoKeys === 'MW') {
			fields = MiddleWaresColumns
		} else if (showInfoKeys === 'APP') {
			fields = ApplicationsColumns
		} else if (showInfoKeys === 'SERVER') {
			fields = ServersColumns
		}
		return fields
	}

	let fields = getMoInfoByType(firstClass, secondClass, thirdClass)
	if (fields && fields.length > 0) {
	   fields.forEach((bean) => {
		   if (bean && bean.application && bean.application.includes('show')) {
			   let temp = {}
			   temp.title = bean.displayName
			   temp.dataIndex = bean.name
			   temp.key = bean.name
			   if (bean.tpe === 'int' && bean.name === 'intfNum') {
				   temp.render = ((text, record) => {
					let count = 0
					if (text) {
						return text
					} else if (record.discoveryIP) {
						return count
					}
					return ''
				  })
			   } else if (bean.tpe === 'long' && bean.name.endsWith('Time') && bean.applicationType && bean.applicationType === 'date') {
				 temp.render = ((text, record) => {
					if (text && text > 0) {
						return new Date(text).format('yyyy-MM-dd hh:mm:ss')
					}
						return ''
				})
			   } else if (bean.paramsType && bean.paramsType !== '') {
				 temp.render = ((text, record) => {
					return text
				})
			   } else if (bean.tpe === 'boolean') {
				  temp.render = ((text, record) => {
					let val = '否'
					if (text) {
						val = '是'
					}
					return val
				})
			   }
			   Columns.push(temp)
		   }
	   })
   }


	const onOk = () => {
		if (selectItemObj && selectItemObj.length > 0) {
			//let obj = {uuid:selectItemObj[0].uuid,name:selectItemObj[0].name}
			/*
			此处需要把选择的信息，保存到state中去
			*/
			dispatch({
				type: `${statePath}`,
				payload: {
					[obInfoValName]: selectItemObj[0],
				},
			})
			onCancel()
		} else {
			Modal.info({
				title: '请选择一个监控对象',
				okText: '确定',
				//content: 'some messages...some messages...',
		  })
		}
	}

	const onCancel = () => {
		/*
			此处需要把选择的信息，保存到state中去
			*/
		dispatch({
			type: `${statePath}`,
			payload: {
				[objectVisibleName]: false,
			},
		})

		dispatch({
			type: 'objectMOsModal/controllerModal',
			payload: {
				modalVisible: false,
				selectuuid: '',
				firstClass: '',
				secondClass: '',
				thirdClass: '',
				list: [],
			},
		})
	}

	const onSelect = (selectedKeys, info) => {
		let groupkey = selectuuid
		if (selectedKeys && selectedKeys.length > 0) {
			groupkey = selectedKeys[0]
		}

		let selfirstclass = firstClass
		let selsecondclass = secondClass
		let selthirdclass = thirdClass
		let falg = true
		if (treeMap && treeMap.size > 0) {
			let selectParams = treeMap.get(groupkey)
			if (selectParams && (selectParams.length > 1 || (selectParams.length === 1 && selectParams[0] !== 'NETWORK'))) {
				if (selectParams.length === 1) {
					selfirstclass = selectParams[0]
					selsecondclass = ''
					selthirdclass = ''
				} else if (selectParams.length === 2) {
					selfirstclass = selectParams[0]
					selsecondclass = selectParams[1]
					selthirdclass = ''
				} else {
					selfirstclass = selectParams[0]
					selsecondclass = selectParams[1]
					selthirdclass = selectParams[2]
				}
			} else {
				notification.info({
					message: '此分类，没有对应的监控对象信息',
					style: {
						background: '#AEEEEE',
					},
				})
				falg = false
			}
		}

		/*
			获取列表
		*/
		if (falg) {
			dispatch({
				type: 'objectMOsModal/queryMOsInfo',
				payload: {
					firstClass: selfirstclass,
					secondClass: selsecondclass,
					thirdClass: selthirdclass,
				},
			})

			dispatch({
				type: 'objectMOsModal/controllerModal',
				payload: {
					selectuuid: groupkey,
					showModalKey: `${new Date().getTime()}`,
					list: [],
				},
			})
		}
	}

	const rowSelection = {
			type: 'radio',
		onChange: (selectedRowKeys, selectedRows) => {
			let obj = {}
			if (selectedRowKeys && selectedRowKeys.length > 0) {
				obj = { uuid: selectedRowKeys[0], name: selectedRows[0].name }
			}
			selectItemObj = selectedRows
	//type: 'checkbox',
		//onChange: (selectedRowKeys, selectedRows) => {
			//selectItemObj = selectedRows
		},
	}

	const onSearch = (val) => {
		let data = {
			firstClass,
			secondClass,
			thirdClass,
		}
		if (val) {
			data = { ...data, q: `name=='*${val}*'` }
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'objectMOsModal/queryMOsInfo',
			payload: {
				...data,
			},
		})
	}

	const onPageChange = (page) => {
		let data = {
				current: page.current - 1,
				page: page.current - 1,
				pageSize: page.pageSize,
				firstClass,
				secondClass,
				thirdClass,
			}

		dispatch({
			type: 'objectMOsModal/queryMOsInfo',
			payload: {
				...data,
			},
		})
		dispatch({
			type: 'objectMOsModal/controllerModal',
			payload: {
				showModalKey: `${new Date().getTime()}`,
			},
		})
	}

	function getChild (child) { //這个就是获取组件对象
		searchobj = child
	}


	const modalOpts = {
		title: '监控对象选择器',
		visible: objectVisible,
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
        <div>监控对象分类
        </div>
        <div>
          <Tree
            loading
            showLine
            selectedKeys={selectedKeys}
						//defaultSelectedKeys={selectKeys}
						//expandedKeys={expandKeys}
            defaultExpandAll
            autoExpandParent
            onSelect={onSelect}
            defaultExpandAll
          >
            {treeNodes}
          </Tree>

        </div>

      </Col>
      <Col lg={20} md={19} sm={19} xs={24}>
        <Row gutter={24}>
          <Col key={objectMOsModal.showModalKey} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>

            <Search
              id="moselectnameInfo"
              placeholder="请输入监控对象名称"
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
              key={`${objectMOsModal.showModalKey}_d`}
              loading
              scroll={{ x: 1000 }} //滚动条
              bordered
              columns={Columns} //表结构字段
              simple
              size="small"

              dataSource={list} //表数据
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
