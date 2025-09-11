import React from 'react'
import { Row, Col, Button, Icon } from 'antd'

function buttonZone ({
 dispatch, batchDelete, selectedRows, expand,
}) {
	const onAdd = () => {
		dispatch({
			type: '',
			payload: {
				modalVisible: true,
				modalType: 'create',
			},
		})
	}

	const onDelete = () => {
		confirm({
	        title: '您确定要批量删除这些记录吗?',
	        onOk () {
	      	let ids = []
	      	//selectedRows.forEach(record=>ids.push())
	        dispatch({
			      	type: '',
			      	payload: {
			      		uuid: ids,
			      	},
			    })
	        },
        })
	}

	const toggle = () => {
		dispatch({
			type: 'formConfiguration/setState',
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
        <Button type="primary" disabled onClick={onAdd} >新增</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled onClick={onDelete}>删除</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled>统计</Button>
      </Col>
    </Row>
  )
}

export default buttonZone
