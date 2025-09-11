import React from 'react'
import { Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

function buttonZone ({ dispatch, batchDelete, selectedRows }) {
	const onAdd = () => {
		dispatch({
			type: 'periodconfig/setState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
				timeList: [
					{
						index: 1,
						checked: true,
    		    week: '一',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 2,
						checked: true,
    		    week: '二',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 3,
						checked: true,
    		    week: '三',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 4,
						checked: true,
    		    week: '四',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 5,
						checked: true,
    		    week: '五',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 6,
						checked: true,
    		    week: '六',
    		    stime: '',
    		    etime: '',
					},
					{
						index: 7,
						checked: true,
    		    week: '日',
    		    stime: '',
    		    etime: '',
					},
				],
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
		        type: 'periodconfig/delete',
		        payload: ids,
		      })
        },
      })
	}

  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Button size="default" type="primary" onClick={onAdd}>新增</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
      </Col>
    </Row>
  )
}

export default buttonZone
