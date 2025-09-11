import React from 'react'
import fenhang from '../../../../../utils/fenhang'
import { Modal, Row, Col, Icon, Button, Upload, message } from 'antd'
import Cookie from '../../../../../utils/cookie'
import { config } from '../../../../../utils'
const { policyRuleIO } = config.api

const confirm = Modal.confirm

const buttonZone = ({dispatch, batchDelete, choosedRows, expand,q,groupUUID, moImportFileList, showUploadList,user}) => {
	let cookie = new Cookie('cebcookie')
	const onDelete = () => {
		confirm({
        		title: '您确定要批量删除这些记录吗?',
	        onOk () {
	        		let ids = []
	        		choosedRows.forEach(record => ids.push(record.uuid))
	          	dispatch({
			        type: 'policyRule/delete',
			        payload: ids,
			    	})
	        	},
      	})
	}

		const calculate = () => {
//		dispatch({
//		    type: 'policyRule/calc',
//				payload: {
//					calculateVisible: true,
//				}
//		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				branchVisible: true,
			},
		})
		let criteriaArr = []
		fenhang.forEach((item) => {
			criteriaArr.push(item.key)
		})
		//查询所有分行下发状态
		dispatch({
			type: 'policyRule/status',
			payload: {
				criteriaArr,
			},
		})
	}

	const onCopy = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				copyOrMoveModalType: 'copy',
				copyOrMoveModal: true,
				keys: new Date().getTime(),
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				copyOrMoveModalType: 'move',
				copyOrMoveModal: true,
				keys: new Date().getTime(),
			},
		})
	}

	const onAdd = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
				tempList: [{
					index: 1,
				   	tempid: '',
				   	tempname: '',
				   	tool: '',
				}],
				/*
				alarmFilterType:'create',
				alarmFilterInfo:'',
				ruleValue1:'未配置',
				ruleValue:'',
				*/
				alarmFilterInfo: {},
				alarmFilterOldInfo: {},
				name: '',
				modalVisibleKey: `${new Date().getTime()}`,
			},
		})
	}
	const onDownOut = () => {
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type: 'policyRule/onDown',
					payload:{
						q: q,
						groupUUID:groupUUID.toString(),
						filename:'策略规则'
					}
				})
			},
		})
	}
		//导入模板
		const toshowupload = () => {
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					showUploadList: true,
				}
			})
		}
		const mybeforeUpload = (file) => {
			return new Promise(
				function (resolve, reject) {
					confirm({
						title: '注意',
						content: `导入可能覆盖某些数据，确定导入${file.name}吗？`,
						okText: '是',
						cancelText: '否',
						onOk: () => {
							if (file.name && (file.name.endsWith('xls') || file.name.endsWith('xlsx'))) {
								resolve()
							} else {
								message.error('You can only upload excel file!');
								reject()
							}
						},
						onCancel: () => {
							reject()
						}
					})
				})
		}
		const myonchange = (info) => {
			let { fileList } = info
			if (info.file.status === 'uploading') {
	
			}
			if (info.file.status === 'done') {
				message.success(`${info.file.name} file uploaded successfully`);
	
	
			}
			if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					moImportFileList: fileList,
				}
			})
		}
		const myonSuccess = (ret, file) => {
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					moImportFileList: moImportFileList,
					showUploadList: false,
					moImportResultVisible: true,
					moImportResultdataSource: ret,
					moImportResultType: 'success',
				}
			})
		}
	
		const onError = (err, result, file) => {
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					moImportFileList: moImportFileList,
					showUploadList: false,
					moImportResultVisible: true,
					moImportResultdataSource: [],
					moImportResultType: 'fail',
				}
			})
		}
		const uploadprops = {
			action: policyRuleIO + 'import',
			supportServerRender: true,
			showUploadList: showUploadList,
			headers: {
				Authorization: 'Bearer ' + cookie.getCookie(),
			},
			beforeUpload: mybeforeUpload,
			fileList: moImportFileList,
			onChange: myonchange,
			onSuccess: myonSuccess,
			onError: onError,
		}
	const toggle = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				expand: !expand,
			},
		})
	}
	const onDCSIssue = () => {
		let ids = []
		for (let record = 0; record < choosedRows.length; record++) {
			if (choosedRows[record].ruleType != 'DISTRIBUTE') {
				let title = <span>所选规则<b style={{ fontWeight: 'bold' }}>{choosedRows[record].name}</b>不是分布式规则</span>
				confirm({ title: title })
				return
			} else if (choosedRows[record].ruleType == 'DISTRIBUTE') {
				ids.push(`uuid==${choosedRows[record].uuid}`)
			}
		}
		if (ids.length == 0) {
			message.warn(`请选择分布式类型的规则`);
		} else {
			let ruleCriteria = ids.join(' or ')
			dispatch({
				type: 'policyRule/DCSIssue',
				payload: {
					ruleCriteria,
					incr: true,
				}
			})
		}
	}
	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <a onClick={toggle}>
        <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
      </a>
      <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd} >新增</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={calculate} >计算</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>批量复制</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
	  <Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
	  <Upload style={{ marginLeft: 8 }} {...uploadprops}><Button onClick={toshowupload} disabled={user.username == 'admin' ? false : true}><Icon type="upload" />导入</Button></Upload>
	  <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDCSIssue} >分布式增量下发</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
