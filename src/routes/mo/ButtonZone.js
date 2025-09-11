import React from 'react'
import { Row, Col, Icon, Button } from 'antd'

const buttonZone = ({ dispatch, batchDelete, checkAll }) => {
	const onIssue = () => {
		dispatch({
			type: 'mo/setState',
			payload: {
				branchsType: 'edit',
				branchsVisible: true,
				checkAll,
				checkedList: [],
				ruleInstanceKey: `${new Date().getTime()}`,
			},
		})
	}

	const onRulePreview = () => {
		window.location.href="/MOwizard"
	}
	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onIssue}>
        <Icon type="download" />导出
      </Button>
			<Button style={{ marginLeft: 8 }} onClick={onRulePreview}>MO向导</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
