import React from 'react'
import { Modal, Row, Col, Icon, Button, } from 'antd'
const confirm = Modal.confirm
const ButtonGroup = Button.Group

function buttonZone ({
 dispatch, batchDelete, selectedRows
}) {
	const onAdd = () => {
		dispatch({
			type: 'fs/setState',				//@@@
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入操作系统信息',				//@@@
				appCode: '',
				c1: '',
			},
		})
	}

	const onDelete = () => {
		confirm({
      title: '您确定要批量删除这些记录吗?',
      onOk () {
		let ids = []
      	selectedRows.forEach(record => ids.push(record.uuid))
        dispatch({
		      type: 'fs/deleteAll',				//@@@
		      payload: ids,
		    })
      },
    })
	}
		//批量纳管
	const onManaged = () => {
		confirm({
			title: '您确定要批量纳管这些记录吗?',
			onOk () {
				let ids = []
	    		selectedRows.forEach(record => ids.push(record.uuid))
	    		dispatch({
	    			type: 'fs/managed',				//@@@
	    			payload: {
	    				uuids: ids,
	    				managedStatus: '纳管',
	    			},
	    		})
	    		dispatch({
	    			type: 'fs/setState',
	    			payload: {
	    				managedModalVisible: true,
	    				managedType: 'managed',
	    			},
	    		})
			},
		})
	}

	//批量取消纳管
	const onCancelonManaged = () => {
		confirm({
			title: '您确定要批量取消纳管这些记录吗?',
			onOk () {
				let ids = []
	    		selectedRows.forEach(record => ids.push(record.uuid))
	    		dispatch({
	    			type: 'fs/managed',				//@@@
	    			payload: {
	    				uuids: ids,
	    				managedStatus: '未管',
	    			},
	    		})
	    		dispatch({
	    			type: 'fs/setState',
	    			payload: {
	    				managedModalVisible: true,
	    				managedType: 'unManaged',
	    			},
	    		})
			},
		})
	}

  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col lg={24} md={24} sm={24} xs={24}>
        <Button size="default" type="primary" onClick={onAdd}>新增</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
        <ButtonGroup style={{ marginLeft: 8 }} size="default" type="ghost">
          <Button disabled={!batchDelete} onClick={onManaged}>批量纳管</Button>
          <Button disabled={!batchDelete} onClick={onCancelonManaged}>批量取消纳管</Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}

export default buttonZone
