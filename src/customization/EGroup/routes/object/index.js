import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Tree } from 'antd'

const TreeNode = Tree.TreeNode

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function Objects ({
 children, location, dispatch, objects, loading,
}) {
	const { treeDatas, selectTreeNode, selectKeys } = objects

	const onSelect = (selectedKeys, info) => {
		dispatch(routerRedux.push(`/object/${selectedKeys}`))
	}

	//定义默认展开的节点数组
	let expandKeys = []
	//定义默认选中的节点数组
	let selectedKeys = []
	let myMap = new Map()
	const loop = (data, myarrs) => data.map((item) => {
		//如果路径中包含节点的key字符串，则设置为默认选中节点
		if (location.pathname.includes(item.key)) {
			selectedKeys.push(item.uuid)
		}
		myMap.set(item.uuid, [...myarrs, item.key])
		if (item.children && item.children.length > 0) {
			//只要是父节点，都放到该数组中，作为默认展开
			expandKeys.push(item.uuid)
			//let arrs = [...myarrs,item.key]
			return <TreeNode title={item.name} key={item.uuid} disabled={myarrs && myarrs.length > 0 ? false : false} isLeaf={false}>{loop(item.children, [...myarrs, item.key])}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})

	let treeNodes = []
	if (treeDatas && treeDatas.length > 0) {
		treeNodes = loop(treeDatas, [])
	}

	/*
	if(myMap && myMap.size > 0 && keyMapsize !== myMap.size){
		 dispatch({
			type: 'objects/controllerModal',
			payload: {
				keyMapsize: myMap.size,
			},
		})
	}
	*/

	return (
  <Row gutter={12}>
    <Col lg={4} md={5} sm={5} xs={24} className="content-inner">
      <div>对象分类
      </div>
      <div>
        <Tree
          showLine
						//selectedKeys={selectedKeys}
						//expandedKeys={expandKeys}
          defaultExpandAll
          autoExpandParent
          onSelect={onSelect}
        >
          {treeNodes}
        </Tree>
      </div>
    </Col>
    <Col lg={20} md={19} sm={19} xs={24}>
      {children}
    </Col>
  </Row>
	)
}

Objects.propTypes = {
  objects: PropTypes.object,
}

export default connect(({ objects, loading }) => ({ objects, loading: loading.models.objects }))(Objects)
