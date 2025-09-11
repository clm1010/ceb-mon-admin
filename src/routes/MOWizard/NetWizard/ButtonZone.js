import React from 'react'
import { Modal, Row, Col, Icon, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, batchDelete, checkAll, q, batchSelect }) => {
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

	const onDelete = () => {
    let ids = []
    batchSelect.forEach((record) => {
      ids.push(record.uuid)
    })
    confirm({
      title: '您确定要将这些设备批量下线吗?',
      // content: <div>
      //           <Button style={{position:'absolute',right:'108px',bottom:'24px'}}
      //           onClick={() =>{
                  
      //             Modal.destroyAll();
      //           }}>取消</Button>
      //       </div>,
      okText: '下发',
      cancelText: '取消',
      cancelButtonProps:{style:{position:'absolute',left:'40px',bottom:'24px'}},
      onOk () {
        // dispatch({
        //   type: 'mowizard/deleteNe',				//@@@
        //   payload: {
        //     uuids:ids,
        //     save: 'save',
        //     q: q === undefined ? '' : q,
        //   },
        // })
        dispatch({
          type: 'mowizard/issueOffline',				//@@@
          payload: {
            uuids:ids,
            next: 'queryMOs',
            q: q === undefined ? '' : q,
          },
        });
      },
      onCancel () {
        Modal.destroyAll();
      }
    })
	}
  
	const onSycn = () => {
		confirm({
			title: '您确定要批量同步这些记录吗?',
			onOk() {
				let ids = []
				batchSelect.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'mowizard/batchSync',				//@@@
					payload: {
						moFirstClass: 'NETWORK',
						uuids: ids
					},
				})
				dispatch({
					type: 'mowizard/setState',				//@@@
					payload: {
						batchSyncModalVisible: true,
					},
				})
			},
		})
	}

//<Icon type="layout" />
	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <Button style={{ marginLeft: 8 }} size="default" type="primary" icon="arrow-up" onClick={onIssue}>
        上线
      </Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete} icon="arrow-down" >
			  下线
			</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onSycn} disabled={!batchDelete} icon="sync" />
    </Col>
  </Row>
	)
}

export default buttonZone
