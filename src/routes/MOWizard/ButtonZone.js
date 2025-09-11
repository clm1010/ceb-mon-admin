import React from 'react'
import { Row, Col, Icon, Button } from 'antd'


const buttonZone = ({ dispatch, batchDelete, checkAll }) => {
	const onIssue = () => {
		dispatch({
			//type: 'mowizard/setState',
			type: 'mowizard/neCreate',
			payload: {
				wizardVisible: true,
				modalType: 'create',
				currentStep: 0,
				selectedRows:[],
			},
		})
	}


	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onIssue}>
        <Icon type="layout" />上线
      </Button>
    </Col>
  </Row>
	)
}

export default buttonZone
