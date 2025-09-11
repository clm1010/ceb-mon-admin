import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Icon, message } from 'antd'
import { config } from '../../utils'
const { lookup } = config.api
const confirm = Modal.confirm

function buttonZone ({
 dispatch, batchDelete, choosedRows, selectInfo, q, moState, expand,
}) {
	let isAdd = false
	if (selectInfo && selectInfo.node && selectInfo.node.hierarchy === 3) {
		isAdd = true
	}
	//判断是否可以新增
	const onAdd = () => {
		if (moState === 1) {
			message.info('该外表数据来自源于监控对象禁止新增！')
		} else {
			dispatch({
			type: 'lookupinfo/controllerModal',
				payload: {
					modalType: 'create',
					currentItem: {},
	//				modalVisible: true,
					modalVisible: selectInfo.node.hierarchy === 3,
					isClose: false,
				},
			})
		}
	} 

	const onDelete = () => {
		if (moState === 1) {
			message.info('该外表数据来自源于监控对象禁止刪除！')
		} else {
			confirm({
		        title: '您确定要批量删除这些记录吗?',
		        onOk () {
		          dispatch({
					type: 'lookupinfo/delete',
				  	payload: choosedRows,
				  })
		        },
		    })
		}
	}

	const toggle = () => {
		dispatch({
			type: 'lookupinfo/controllerModal',
			payload: {
				expand: !expand,
			},
		})
	}

	const downloadLookUpFile = () => {
		confirm({
			title: '您确定要导出lookup外表吗?',
			onOk () {
				message.info('正在为您生成历史告警数据,请稍后...', 3)
				//window.open(`${lookup}download/?q=${q}`, '_parent')
				dispatch({
					type: 'lookupinfo/onDown',
					payload: {
					  url: `${lookup}download/?q=${q}`,
					},
				  })
			},
		})
	}
  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <a onClick={toggle}>
          <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
        </a>
        <Button type="primary" onClick={onAdd} disabled={!isAdd}>新增</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={downloadLookUpFile}>
	          导出
        </Button>
      </Col>
    </Row>
  )
}

export default buttonZone
