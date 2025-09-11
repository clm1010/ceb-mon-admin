import React from 'react'
import { Modal, Row, Col, Icon, Button, TreeSelect, Upload, message } from 'antd'
import { config } from '../../../utils'
import BranchNameInfo from '../../../utils/fenhang'
import Cookie from '../../../utils/cookie'

const { objectsMO, exportExcelURL } = config.api
const TreeNode = TreeSelect.TreeNode
const confirm = Modal.confirm
const ButtonGroup = Button.Group

function buttonZone({
	dispatch, loading, batchDelete, selectedRows, user, moImportFileList, showUploadList, moImportResultVisible, moImportResultdataSource, moImportResultType,
}) {
	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}
	let cookie = new Cookie('cebcookie')
	const onAdd = () => {
		dispatch({
			type: 'firewall/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
		dispatch({
			type: 'firewall/setState',				//@@@
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入防火墙信息',
				appCode: '',
				c1: '',
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
					type: 'firewall/deleteAll',				//@@@
					payload: ids,
				})
			},
		})
	}

	const onSycn = () => {
		confirm({
			title: '您确定要批量同步这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.mo.uuid))
				dispatch({
					type: 'firewall/batchSync',				//@@@
					// payload: ids,
					payload: {
						moFirstClass: 'NETWORK',
						uuids: ids
					},
				})
				dispatch({
					type: 'firewall/setState',				//@@@
					payload: {
						batchSyncModalVisible: true,
					},
				})
			},
		})
	}

	//批量下发预览
	const onRulePreview = () => {
		let ids = []
		let branches = []
		selectedRows.forEach((record) => {
			ids.push(record.mo.uuid)
			branches.push(record.mo.branchName)
		})
		window.open(`/rulespreview?ids=${ids}&branches=${branches}`, '批量下发预览', '', 'false')
	}

	//批量纳管
	const onManaged = () => {
		confirm({
			title: '您确定要批量纳管这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.mo.uuid))
				dispatch({
					type: 'firewall/managed',				//@@@
					payload: {
						uuids: ids,
						managedStatus: '纳管',
					},
				})
				dispatch({
					type: 'firewall/setState',
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
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.mo.uuid))
				dispatch({
					type: 'firewall/managed',				//@@@
					payload: {
						uuids: ids,
						managedStatus: '未管',
					},
				})
				dispatch({
					type: 'firewall/setState',
					payload: {
						managedModalVisible: true,
						managedType: 'unManaged',
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
			type: 'firewall/setState',
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
			type: 'firewall/setState',
			payload: {
				moImportFileList: fileList,
			},
		})
	}

	const myonSuccess = (ret, file) => {
		dispatch({
			type: 'firewall/setState',
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
			type: 'firewall/setState',
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: [],
				moImportResultType: 'fail',
			},
		})
	}

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
							<Button type="primary" onClick={onAdd}>新增</Button>
							<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
							<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onSycn} disabled={!batchDelete} icon="sync" />
							<ButtonGroup style={{ marginLeft: 8 }} size="default" type="ghost">
								<Button disabled={!batchDelete} onClick={onManaged}>批量纳管</Button>
								<Button disabled={!batchDelete} onClick={onCancelonManaged}>批量取消纳管</Button>
								<Button disabled={!batchDelete} onClick={onRulePreview}>批量下发预览</Button>
							</ButtonGroup>
							<Button style={{ marginLeft: 8 }} onClick={exportExcelInfo} >
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
