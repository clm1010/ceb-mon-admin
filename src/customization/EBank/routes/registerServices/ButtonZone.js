import React from 'react'
import { Row, Col, Modal, Button, Upload, Icon, message } from 'antd'
import Cookie from '../../../../utils/cookie'
import { config } from '../../../../utils'
const { registServeImport } = config.api
const confirm = Modal.confirm

const buttonZone = ({ dispatch, moImportFileList, showUploadList, q, choosedRows, batchDelete,user }) => {
	let cookie = new Cookie('cebcookie')
	const onAdd = () => {
		dispatch({
			type: 'registerServices/updateState',
			payload: {
				modalVisible: true,
				currentItem: {},
				modalType: 'create',
				tempListMeta: [
					{
						index: 1,
						key: 'ump_project',
						value: '',
					},
				],
				tempListChecks: [
					{
						index: 1,
						key: '',
						value: '',
					},
				],
			}
		})
		dispatch({
			type:'registerServices/findRegion',
			payload:{}
		})
		dispatch({
			type:'registerServices/getProjectsAndCluster',
			payload:{}
		})
	}
	const onRegister = () => {
		confirm({
			title: '您确定要注册记录吗?',
			onOk() {
				let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'registerServices/register',
					payload: ids,
				})
			},
		})
	}

	const onUpload = (e) => {
		dispatch({
			type: 'registerServices/updateState',
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
			type: 'registerServices/updateState',
			payload: {
				moImportFileList: fileList,
			}
		})
	}
	const myonSuccess = (ret, file) => {
		dispatch({
			type: 'registerServices/updateState',
			payload: {
				moImportFileList: moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: ret,
				moImportResultType: 'success',
			}
		})
		dispatch({
			type: 'registerServices/requery'
		})
	}

	const onError = (err, result, file) => {
		dispatch({
			type: 'policyTemplet/updateState',
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
		action: registServeImport,
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

	const onDownOut = () => {
		let ids = []
		choosedRows.forEach(record => ids.push(`uuid == ${record.uuid}`))
		let qq = ids.join(' or ')
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type: 'registerServices/onDown',
					payload: {
						q: choosedRows.length > 0 ? qq : q,
						filename: '服务注册'
					}
				})
			},
		})
	}

	const onDeregister = () => {
		confirm({
			title: '您确定要注销记录吗?',
			onOk() {
				let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'registerServices/deregister',
					payload: ids,
				})
			},
		})
	}
	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'registerServices/delete',
					payload: ids,
				})
			},
		})
	}
	const onSyncStatus = () => {
		dispatch({
			type: 'registerServices/syncStatus'
		})
	}
	const onsystemPJ = () =>{
		dispatch({
			type: 'registerServices/updateState',
			payload:{
				oneSystemEvaluate:true
			}
		})
	}

	const onSyncSystem = ()=>{
		dispatch({
			type: 'registerServices/syncSystem',
			payload:{}
		})
	}
	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete}>批量删除</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" disabled={!batchDelete} onClick={onRegister}>注册 </Button>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" disabled={!batchDelete} onClick={onDeregister}>注销 </Button>
				{
					user.username == 'k00930'  ?
					<>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onSyncStatus} >同步 </Button>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onsystemPJ} >单系统监控评价 </Button>
					</>
					:
					null
				}
				{
					(new Date().getTime() < 1734710400000 && user.username == 'admin') ? 
					<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onSyncSystem} >同步应用系统 </Button>
					:
					null
				}

				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
				<Upload {...uploadprops}><Button onClick={onUpload} ><Icon type="upload" />导入</Button></Upload>
			</Col>
		</Row>
	)
}

export default buttonZone
