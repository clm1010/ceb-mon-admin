import React from 'react'
import { Row, Col, Modal, Button, Upload, Icon } from 'antd'
import { message } from 'antd'
import Cookie from '../../../../../utils/cookie'
import { config } from '../../../../../utils'

const confirm = Modal.confirm

const { flinkPolicy, flinkDevice } = config.api

const buttonZone = ({ dispatch, batchDelete, choosedRows, showUploadList, moImportFileList, tableStatue, contions }) => {
	let cookie = new Cookie('cebcookie')
	const mybeforeUpload = (file) => {
		return new Promise(
			function (resolve, reject) {
				confirm({
					title: '注意',
					content: `确定导入${file.name}吗？`,
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

	const myonSuccess = (ret, file) => {
		if (ret.status == "200") {
			message.success(ret.data)
		} else {
			message.err(ret.data)
		}
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: ret,
				moImportResultType: 'success',
			},
		})
	}

	const onError = (err, result, file) => {
		message.success(err.data)
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: [],
				moImportResultType: 'fail',
			},
		})
	}

	const myonchange = (info) => {
		let { fileList } = info
		if (info.file.status === 'uploading') {

		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`)
		}
		if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				moImportFileList: fileList,
			},
		})
	}

	const uploadprops = {
		action:`${flinkPolicy}uploadDoc` ,
		supportServerRender: true,
		showUploadList,
		headers: {
			Authorization: `Basic dXNlcjpDaGluYUA5MzA5MjA=`,
		},
		beforeUpload: mybeforeUpload,
		fileList: moImportFileList,
		onChange: myonchange,
		onSuccess: myonSuccess,
		onError,
	}

	const onDownOut = () => {
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type:  'flinkComputPlat/onDown' ,
					payload: {
						contions,
						filename: '监控策略',
					}
				})
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量下线这些策略吗?',
			onOk() {
				dispatch({
					type: 'flinkComputPlat/delete',
					payload: {
						ids: choosedRows
					},
				})
			},
		})
	}

	const toshowupload = () => {
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				showUploadList: true,
			},
		})
	}

	const onRun = () => {
		dispatch({
			type: 'flinkComputPlat/Run',
			payload: {},
		})
	}
	const onGetstatus = () => {
		dispatch({
			type: 'flinkComputPlat/RunStatus',
			payload: {},
		})
	}

	const onDict = () => {
		dispatch({
			type: 'flinkComputPlat/getDict',
			payload: {
				page: 1,
				level: 1
			},
		})
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				dictModalVisible: true,
			},
		})
	}
	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button size="default" type="primary" onClick={onDict} >字典表</Button>
				<Button size="default" type="ghost" onClick={onDelete} disabled={!batchDelete} style={{ marginLeft: 10 }}>策略下线</Button>
				<Button size="default" type="ghost" onClick={onRun} style={{ marginLeft: 10 }}>下发</Button>
				<Button size="default" type="ghost" onClick={onGetstatus} style={{ marginLeft: 10 }}>下发进度 </Button>
				<Button style={{ marginLeft: 10 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
				<Upload {...uploadprops}><Button onClick={toshowupload} style={{ marginLeft: 10 }}><Icon type="upload" />导入</Button></Upload>
			</Col>
		</Row>
	)
}

export default buttonZone
