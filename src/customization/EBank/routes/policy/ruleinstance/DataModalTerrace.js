import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Row, Col, Checkbox, message, Icon,Tree } from 'antd'


const TreeNode = Tree.TreeNode


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
	issueFlag,
	criteria,
	moCritera,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	checkedTerrList,
}) => {
	// const checkedTerrList = [
	// 	{
	// 		typ: "root",
	// 		name: "全选/全不选",
	// 		value: "root",
	// 		children: [
	// 		  {
	// 			typ: "env",
	// 			name: "分布式数据库",
	// 			value: "EDB",
	// 			children: [
	// 			  {
	// 				typ: "tool",
	// 				name: "测试数据",
	// 				value: "829837c7-9304-4b17-82b8-833690c077f7",
	// 				children: []
	// 			  },
	// 			  {
	// 				typ: "tool",
	// 				name: "EDB-P1",
	// 				value: "0d9d0689-448d-4fc9-9a7c-5c165ce1e840",
	// 				children: []
	// 			  }
	// 			]
	// 		  },
	// 		  {
	// 			typ: "env",
	// 			name: "容器云平台",
	// 			value: "CPAAS",
	// 			children: [
	// 			  {
	// 				typ: "cluster",
	// 				name: "cpaas cluster1",
	// 				value: "cluster1",
	// 				children: [
	// 				  {
	// 					"typ": "tool",
	// 					"name": "容器云Prometheus",
	// 					"value": "a8aad2e2-7559-4a54-87d6-8f6608536b9c",
	// 					"children": []
	// 				  }
	// 				]
	// 			  }
	// 			]
	// 		  },
	// 		  {
	// 			"typ": "env",
	// 			"name": "云管理平台",
	// 			"value": "FSCP",
	// 			"children": [
	// 			  {
	// 				"typ": "tool",
	// 				"name": "性能曲线测试工具",
	// 				"value": "e3dc28f9-9f0e-4e28-869a-2ca45eda5e92",
	// 				"children": []
	// 			  },
	// 			  {
	// 				"typ": "cluster",
	// 				"name": "测试数据03",
	// 				"value": "471f9c90-bcbb-4ac2-8605-f904f113f59d",
	// 				"children": [{
	// 					"typ": "tool",
	// 					"name": "容器云Prometheus",
	// 					"value": "a8aad2e2-7562-4a54-87d6-8f6608536b22",
	// 				  },{
	// 					"typ": "tool",
	// 					"name": "容器云Prometheus",
	// 					"value": "a8aad2e2-7562-4a54-87d6-8f6608536b4c",
	// 				  },{
	// 					"typ": "tool",
	// 					"name": "容器云Prometheus",
	// 					"value": "a8aad2e2-7562-4a54-87d6-8f6608536b44",
	// 				  }]
	// 			  },
	// 			  {
	// 				"typ": "tool",
	// 				"name": "测试数据02",
	// 				"value": "2226ac0f-f511-4aba-99c7-0716e463ce4d",
	// 				"children": []
	// 			  },
	// 			  {
	// 				"typ": "tool",
	// 				"name": "aaa",
	// 				"value": "89aaa179-9883-4d5b-a652-b6e1f133be95",
	// 				"children": []
	// 			  },
	// 			  {
	// 				"typ": "tool",
	// 				"name": "测试数据001",
	// 				"value": "90167326-c3f2-4e51-a8e3-fa5c26bfada6",
	// 				"children": []
	// 			  }
	// 			]
	// 		  }
	// 		]
	// 	  }
	// ]
	let TerrList = [
		{
			name: '全选/全不选',
			value: '',
			children: checkedTerrList
		}
	]
	
	const permissionsTrees = tree => tree.map((item) => {
		if (item.children) {
				return <TreeNode title={item.name} key={item.value} value={item.typ} uuid={item.uuid}>{permissionsTrees(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.value} value={item.typ} uuid={item.uuid}/>
	})
	let TreeDates = []
	if (checkedTerrList && checkedTerrList.length > 0) {
		TreeDates = permissionsTrees(checkedTerrList)
	}
	//end
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}

			let arr2 = new Array()
			let arr1 = new Array()
			for (let i = 0; i < criteria.length; i++) {
					if(criteria[i] === '0-0'){
						continue
					}
					arr2[i] = `value=='${criteria[i]}'`
			}

			let strs = ''
			strs = arr2.join(' or ')
			for (let i = 0; i < moCritera.length; i++) {
				arr1[i] = `uuid==${moCritera[i]}`
			}
			let strs1 = ''
			strs1 = arr1.join(' or ')
			dispatch({
				type: 'ruleInstance/terrIssue',
				payload: {
					criteria: strs,
					moCriteria:strs1
				},
			})

			dispatch({
				type: 'ruleInstance/updateState',
				payload: {
					terrVisible: false,
				},
			})

		})
	}

	const onCancel = () => {
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				terrVisible: false,
				checkedTerrList: [],
			},
		})
	}
	const childrenNode = tree => {
		tree.map((item) => {
			if (item.props.children) {
				if(item.props.value=='tool') {
					nocriteria.push(item.key)
				}
				return childrenNode(item.props.children)
			}
			return item.props.value=='tool' ? nocriteria.push(item.key) :''
		})
	}
	const nocriteria = []  //删除多余的工具
	const onCheck = (selectedKeys, info) => {
		const criteria = []
		const moCritera = []
		info.checkedNodes.forEach(element => {
			if(element.props.value=='env'){
				criteria.push(element.key)
				childrenNode(element.props.children)
			}
			if(element.props.value=='tool'){
				moCritera.push(element.key)
			}
		});
		let _nocriteria = new Set(nocriteria);
		let _moCritera = moCritera.filter(item => !_nocriteria.has(item))
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				issueFlag:(selectedKeys.length===0),
				criteria:criteria,
				moCritera:_moCritera
			},
		})
		
	}
	const modalOpts = {
		title: '选择下发平台',
		visible,
		onOk,
		okText: '下发',
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 350,
		maskClosable: false,
	}
  
	return (
  	<Modal {...modalOpts} okButtonProps={{ disabled: issueFlag }} height="400px">
		<Tree
            //defaultCheckedKeys={selectedKeys}
              checkable
            //defaultExpandAll
			  onCheck={onCheck}
            >
              {TreeDates}
    	</Tree>
     
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