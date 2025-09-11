import React from 'react'
import { connect } from 'dva'
import { Row, Col, Tree } from 'antd'

const TreeNode = Tree.TreeNode
function formConfigurationGroup ({
 location, loading, formConfigurationGroup, formConfiguration, dispatch, children,
}) {
	const {
		cebTree,
	    creditCardTree,
	    eventTree,
	} = formConfigurationGroup
	const { expand } = formConfiguration

	const loop = data => data.map((item) => {
      if (item.children && item.children.length > 0) {
        return <TreeNode title={item.name} key={item.id} id={item.id} isLeaf={false}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode title={item.name} key={item.id} id={item.id} isLeaf disabled />
	})
	//光大
	let TreeDates = []
	if (cebTree) {
	  	TreeDates = loop(cebTree)
	}
	//信用卡
	let creditCardTreeDates = []
	if (creditCardTree) {
	  	creditCardTreeDates = loop(creditCardTree)
	}
	//事件
	let eventTreeDates = []
	if (creditCardTree) {
	  	eventTreeDates = loop(eventTree)
	}

	const cebOnSelect = (selectedKeys, event) => {
		if (selectedKeys.length > 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {
					q: `parentId==${selectedKeys[0]}`,
				},
			})
		} else if (selectedKeys.length === 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {},
			})
		}
	}

	const credOnSelect = (selectedKeys, event) => {
		if (selectedKeys.length > 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {
					q: `parentId==${selectedKeys[0]}`,
			},
		})
		} else if (selectedKeys.length === 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {},
			})
		}
	}

	const eventOnSelect = (selectedKeys, event) => {
		if (selectedKeys.length > 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {
					q: `parentId==${selectedKeys[0]}`,
			},
		})
		} else if (selectedKeys.length === 0) {
			dispatch({
				type: 'formConfiguration/query',
				payload: {},
			})
		}
	}

	return (
  <Row gutter={24} className="content-tree">
    <Col lg={expand ? 5 : 0} md={expand ? 6 : 0} sm={expand ? 7 : 0} xs={24}>
      <div className="content-left">
        <div>报表</div>
        <br />
        <div>
          <Tree onSelect={cebOnSelect}>
            {TreeDates}
          </Tree>
          <Tree onSelect={credOnSelect}>
            {creditCardTreeDates}
          </Tree>
          <Tree onSelect={eventOnSelect}>
            {eventTreeDates}
          </Tree>
        </div>
      </div>
    </Col>
    <Col lg={expand ? 19 : 24} md={expand ? 18 : 24} sm={expand ? 17 : 24} xs={24} className="content-right">
      <div className="lines" />
      {children}
    </Col>
  </Row>
	)
}

export default connect(({ formConfigurationGroup, formConfiguration, loading }) => ({ formConfigurationGroup, formConfiguration, loading }))(formConfigurationGroup)
