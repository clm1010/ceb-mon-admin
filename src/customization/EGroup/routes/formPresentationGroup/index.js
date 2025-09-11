import React from 'react'
import { connect } from 'dva'
import { Row, Col, Tree, notification } from 'antd'

const TreeNode = Tree.TreeNode
function formPresentationGroup ({
 location, loading, formPresentationGroup, dispatch, children, formPresentation,
}) {
	const { tree, defaultExpandedKeys } = formPresentationGroup
	const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			defaultExpandedKeys.push(item.id)
			return <TreeNode title={item.name} key={item.id} id={item.id} urls={item.url} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.id} id={item.id} isLeaf urls={item.url} />
	})
	let treeNode = []
	if (tree) {
		treeNode = loop(tree)
	}
	const onSelect = (value, node, extra) => {
		if (node.node.props.urls === undefined) {
			notification.warning({
			    message: '此选项为配置项，无历史数据报表',
			})
		} else if (node.node.props.urls !== undefined && value.length > 0) {
			dispatch({
				type: 'formPresentation/query',
				payload: {
					id: value[0],
					name: node.node.props.title,
				},
			})
			dispatch({
				type: 'formPresentation/setState',
				payload: {
					id: value[0],
					defaultActiveKey: '1',
					template: 'week',
					keys: new Date().getTime(),
					name: node.node.props.title,
				},
			})
		} else if (value.length === 0) {
			dispatch({
				type: 'formPresentation/query',
				payload: {
				},
			})
			dispatch({
				type: 'formPresentation/setState',
				payload: {
					id: '8a81873851ab439f015262b8abcf0001',
					template: 'week',
					defaultActiveKey: '1',
					keys: new Date().getTime(),
					name: '手机客户端登录情况报表',
				},
			})
		}
	}
	return (
  <Row gutter={24} className="content-tree">
    <Col lg={5} md={6} sm={7} xs={24}>
      <div className="content-left">
        <Tree
          defaultExpandedKeys={['8a81878639b427c60139c3af40510001', '8a81878639b427c60139c3b1d1af0002', '8a8187863acee6ca013b01f1a3a90002',
											  '8a81878639b427c60139c4243958001b', '8a81878649743c5b01498d23f9de0001', '8a81878639b427c60139c3bed4c10014',
											  '8a8187874977b8210149e11387e90001', '8a8187863b1c7808013b4b1936840001', '8a81878639b427c60139c3b2c4ae0003',
											  '8a81878639b427c60139c3bd188b000e', '8a81878639b427c60139c3b3b4570004', '8a81878639b427c60139c3b4d9d60007']}
          onSelect={onSelect}
        >
          {treeNode}
        </Tree>
      </div>
    </Col>
    <Col lg={19} md={18} sm={17} xs={24} className="content-right">
      <div className="lines" />
      {children}
    </Col>
  </Row>
	)
}

export default connect(({ formPresentationGroup, formPresentation, loading }) => ({ formPresentationGroup, formPresentation, loading: loading.models.formPresentationGroup }))(formPresentationGroup)
