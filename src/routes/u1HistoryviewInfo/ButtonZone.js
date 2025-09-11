import React from 'react'
import { Row, Col, Icon, message } from 'antd'
//import { config } from '../../utils'

function buttonZone ({ dispatch, loadReporter, expand }) {
	const onClick = () =>　 {
		message.info('正在为您生成历史告警数据,请稍后...', 3)
	}

	const toggle = () => {
		dispatch({
			type: 'u1Historyview/setState',
			payload: {
				expand: !expand,
			},
		})
	}

  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col lg={24} md={24} sm={24} xs={24}>
        <a onClick={toggle}>
          <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
        </a>

      </Col>
    </Row>
  )
}

export default buttonZone
