import React from 'react'
import { Modal, Row, Col, Button, Upload, Icon } from 'antd'
import Cookie from '../../utils/cookie'
import { adminRoles } from '../policy/utils/userRole'
import { config } from '../../utils'
const { ulNotificationRule } = config.api
const confirm = Modal.confirm
const ButtonGroup = Button.Group

function buttonZone({
	dispatch, loading, batchDelete, selectedRows, item, q, moImportFileList, showUploadList,user,
}) {
	let cookie = new Cookie('cebcookie')
	const onAdd = () => {
		const user = JSON.parse(sessionStorage.getItem('user'))
		let branch = ('branch' in user) ? user.branch : null//
		dispatch({
			type: 'notification/setState',				//@@@
			payload: {
				modalType: 'create',
				notificationType: 'ORDINARY',
				moUuid: [],
				AppUuid: [],
				appInfo: '',
				currentItem: {
					branch,
					targetKeys: [],
					userRoleSource: [],
				},
				modalVisible: true,
				TransferState: true,
			},
		})
		//因为添加默认打开的ORDINARY，所以直接请求用户集合
		dispatch({
			type: 'notification/queryUser',
			payload: {
				q: '',
				//(user.branch === undefined || user.branch==='' || user.branch==='ZH' || user.branch === 'QH')?'':`branch == '${user.branch}'`,
			},
		})
		// dispatch({
		// 	type: 'notification/queryApp',
		// 	payload: {
		// 		page: 0,
		// 		pageSize: 20,
		// 	},
		// })
		dispatch({
			type: 'alarmSeverity/setState',
			payload: {
				indeterminate: false,
				checkAll: false,
				checkedList: [],
			},
		})
		dispatch({
			type: 'alarmFrom/setState',
			payload: {
				indeterminate: false,
				checkAll: false,
				checkedList: [],
			},
		})
		dispatch({
			type: 'notifyWay/setState',
			payload: {
				indeterminate: false,
				checkAll: false,
				checkedList: [],
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'notification/delete',				//@@@
					payload: {
						uuid: ids,
					},
				})
			},
		})
	}

	//导出
	const onDownOut = () => {
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type: 'notification/onDown',
					payload: {
						q: q,
						filename: '通知规则'
					}
				})
			},
		})
	}
	//导入模板
	const toshowupload = () => {
		dispatch({
			type: 'notification/setState',
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
			type: 'notification/setState',
			payload: {
				moImportFileList: fileList,
			}
		})
	}
	const myonSuccess = (ret, file) => {
		dispatch({
			type: 'notification/setState',
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
			type: 'notification/setState',
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
		//action: notificationRulesIO + 'import',
		action: ulNotificationRule,
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

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button size="default" type="primary" onClick={onAdd}>新增</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
				<ButtonGroup>
					<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
					<Upload style={{ marginLeft: 8 }} {...uploadprops}>
						<Button onClick={toshowupload} disabled={adminRoles()}><Icon type="upload" />导入</Button>
					</Upload>
				</ButtonGroup>
			</Col>
		</Row>
	)
}

export default buttonZone
