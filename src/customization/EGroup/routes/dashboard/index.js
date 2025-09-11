import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Tree } from 'antd'

const TreeNode = Tree.TreeNode

const dashboard = ({
 children, dispatch, loading, location, objectGroup, objectMO, chd,
}) => {
	const {
 treeDatas, selectTreeNode, selectKeys, treeMap, defaultExpandAll, autoExpandParent, defaultExpandedKeys, isClosed,
} = objectGroup

	const {
 list, pagination, currentItem, modalVisible, linesmodalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, showInfoKey, modalPolicyVisible, firstClass, secondClass, thirdClass,
} = objectMO

	const onExpand = (expandedKeys, node) => {
		if (!node.expanded) {
			dispatch({
				type: 'objectGroup/controllerModal',
				payload: {
					defaultExpandedKeys: treeDatas[0].uuid,
				},
			})
		}
	}

	const switchSider = () => {
		dispatch({
			type: 'objectGroup/controllerModal',
			payload: {
				isClosed: !isClosed,
			},
		})
	}

	const goHome = () => {
		dispatch(routerRedux.push('/dashboard/performance'))
	}

	//
	const onSelect = (selectedKeys, e) => {
		if (e.node.props.isLeaf) {
			dispatch(routerRedux.push(`/chdlist/${selectedKeys[0]}`))
		}
	}

	//树形节点部分---start
	const onLoadData = (selectedKeys, info) => {
		if (selectedKeys.props.eventKey && selectedKeys.props.eventKey.length > 0) {
			let selectuuid = selectedKeys.props.eventKey
			let selectParams = treeMap.get(selectuuid)

			dispatch({
				type: 'objectGroup/controllerModal',
				payload: {
					defaultExpandedKeys: [selectedKeys.props.eventKey],
				},
			})

			//路由器交换机防火墙的情况
			if (selectParams && (selectParams.length > 1 || (selectParams.length === 1 && selectParams[0] !== 'NETWORK'))) {
				return new Promise((resolve, reject) => {
					dispatch({
						type: 'objectMO/query',
						payload: {
							firstClass: selectParams[0],
							secondClass: selectParams[1],
							page: 0,
							pageSize: 10, //全部2000条够呛，只取10条
							resolve,
							reject,
						},
					})
				})
			}
		}
	}

	//定义默认选中的节点数组
	let selectedKeys = []
	const loop = data => data.map((item) => {
		if (item.name === '网络') {
			if (item.children && item.children.length > 0) {
				return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
			}
		}
		if (item.name.includes('交换机') || item.name.includes('路由器') || item.name.includes('防火墙')) {
			//页面第一次打开的情况
			if (list.length === 0 || secondClass === '') {
				return <TreeNode title={item.name} key={item.uuid} isLeaf={false} />
			}
			//用户已经请求到某个节点下的子节点的情况
			else if (list.length > 0) {
				//遍历路由器交换机防火墙下的叶子节点
				if (secondClass === 'ROUTER' && item.name === '路由器' && !item.alias) {
					return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(list)}</TreeNode>
				} else if (secondClass === 'SWITCH' && item.name === '交换机' && !item.alias) {
					return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(list)}</TreeNode>
				} else if (secondClass === 'FIREWALL' && item.name === '防火墙' && !item.alias) {
					return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(list)}</TreeNode>
				}
				//展示逻辑意义上的叶子节点

					//展示没有包含叶子设备的防火墙、交换机、路由器节点。虽然他们是叶子节点，但是页面上要显示成未展开的非叶子节点
					if (item.name === '防火墙' || item.name === '交换机' || item.name === '路由器') {
						return <TreeNode title={item.name} key={item.uuid} isLeaf={false} />
					}
					//展示设备叶子节点

						return <TreeNode title={item.name} key={item.uuid} isLeaf />
			}
		} else {
			return null
		}
	})

	let treeNodes = []
	if (treeDatas && treeDatas.length > 0) {
		let treeData = loop(treeDatas)
		for (let treeNode of treeData) {
			if (treeNode !== null) {
				selectedKeys.push(treeNode.uuid)
				treeNodes.push(treeNode)
			}
		}
	}

	return (
  <Row gutter={12} className="content-tree">
    {/*
			<Col lg={isClosed ? 1 : 4} md={isClosed ? 1 : 4} sm={isClosed ? 1 : 4} xs={isClosed ? 1 : 4} style={{ backgroundColor: 'white'}} className="content-left">
				{ isClosed ?
				<div style={{ padding: '12px'}}>
					<span style={{ float: 'right'}} onClick={switchSider}>
						<Icon type='right-circle' />
					</span>
				</div>
					:
				<div style={{ padding: '12px'}} className='treeStyle'>
					<div>
						<span style={{ fontSize: '14px'}}>设备清单&nbsp;&nbsp;<Icon onClick={goHome} type='home' /></span>
						<span style={{ float: 'right'}}>
							<Icon onClick={switchSider} type={isClosed ? 'right-circle' : 'left-circle'} />
						</span>
					</div>
					<div>
						<Tree
							showLine={true}
							autoExpandParent={true}
							selectedKeys={selectedKeys}
							expandedKeys={defaultExpandedKeys}
							loadData={onLoadData}
							onExpand={onExpand}
							onSelect={onSelect}
							>
							{treeNodes}
						</Tree>
						</div>
					</div>
				}
			</Col>

			<Col lg={isClosed ? 23 : 20} md={isClosed ? 23 : 20} sm={isClosed ? 23 : 20} xs={isClosed ? 23 : 20} className="content-right" style={{backgroundColor: '#eef2f9'}}>
				<div className="lines"></div>
				{children}
			</Col>
			*/}
    <Col lg={24} md={24} sm={24} xs={24}style={{ backgroundColor: '#eef2f9' }}>
      {children}
    </Col>
  </Row>
	)
}
export default connect(({
 objectMO, objectGroup, chd, loading,
}) => ({
 objectMO, objectGroup, chd, loading: loading.models.objectGroup,
}))(dashboard)
