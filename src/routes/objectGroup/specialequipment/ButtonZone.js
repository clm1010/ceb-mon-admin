import React from 'react'
import { Modal, Row, Col, Icon, Button, Upload, message } from 'antd'
import { config } from '../../../utils'
import BranchNameInfo from '../../../utils/fenhang'
import Cookie from '../../../utils/cookie'
const { objectsMO, exportExcelURL } = config.api
const confirm = Modal.confirm

const buttonZone = ({
	dispatch, loading, batchDelete, selectedRows, showUploadList, moImportResultVisible, moImportResultdataSource, moImportResultType, user, moImportFileList,
}) => {
	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}
	const onAdd = () => {
		dispatch({
			type: 'specialequipment/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
		dispatch({
			type: 'specialequipment/setState',
			payload: {
				modalVisible: true,
				type: 'create',
				alertMessage: '请输入设备信息',
				alertType: 'info',
				appCode: '',
				currentItm: {},
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.mo.uuid))
				dispatch({
					type: 'specialequipment/remove',
					payload: {
						uuid: ids,
					},
				})
			},
		})
	}

	//下载模板
	const exportExcelInfo = () => {
		let branchcode = ((user && user.branch) ? user.branch : '')
		let branchmap = new Map()
		if (BranchNameInfo && BranchNameInfo.length > 0) {
			BranchNameInfo.forEach((obj, index) => {
				branchmap.set(obj.key, obj.value)
			})
		}
		let branchname = '分行'//branchmap.get(branchcode)
		if (branchcode === '' || !branchcode) {
			branchname = '全行'
		} if (branchcode === 'ZH') {
			branchname = '总行'
		}

		window.open(`${exportExcelURL}/static2/excel/${branchname}-监控对象模板.xlsx`, '_parent')
	}

	//导入模板
	const toshowupload = () => {
		dispatch({
			type: 'specialequipment/setState',
			payload: {
				showUploadList: true,
			},
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
			message.success(`${info.file.name} file uploaded successfully`)
		}
		if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
		dispatch({
			type: 'specialequipment/setState',
			payload: {
				moImportFileList: fileList,
			},
		})
	}

	const myonSuccess = (ret, file) => {
		dispatch({
			type: 'specialequipment/setState',
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
		dispatch({
			type: 'specialequipment/setState',
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: [],
				moImportResultType: 'fail',
			},
		})
	}
	let cookie = new Cookie('cebcookie')
	const uploadprops = {
		action: `${objectsMO}import`,
		supportServerRender: true,
		showUploadList,
		data: {
			branchName: ((user && user.branch) ? user.branch : ''),
		},
		headers: {
			Authorization: `Bearer ${cookie.getCookie()}`,
		},
		beforeUpload: mybeforeUpload,
		fileList: moImportFileList,
		onChange: myonchange,
		onSuccess: myonSuccess,
		onError,

	}


	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				{
					disPower ?
						<>
							<Button size="default" type="primary" onClick={onAdd}>新增</Button>
							<Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete} icon="delete" />
							<Button style={{ marginLeft: 8 }} onClick={exportExcelInfo}>
								<Icon type="download" />模板
							</Button>
							<span style={{ width: 78, height: 28, marginLeft: 8 }}>
								<Upload {...uploadprops}>
									<Button onClick={toshowupload}>
										<Icon type="upload" /> 导入
									</Button>
								</Upload>
							</span>
						</>
						:
						null
				}
			</Col>
		</Row>
	)
}

export default buttonZone
