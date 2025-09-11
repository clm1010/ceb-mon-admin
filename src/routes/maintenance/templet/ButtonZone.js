import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Icon, Upload } from 'antd'
import { config } from './../../../utils'
import Cookie from '../../../utils/cookie'
import { getSourceByKey, formatMinutes } from "../../../utils/FunctionTool"

const confirm = Modal.confirm
const { mtsinfo, mt_import } = config.api

function buttonZone({
	expand, dispatch, moImportFileList, showUploadList, selectKeys, batchDelete, choosedRows, Filters, selectTreeNode, user, q,
}) {
	const rhCfg = getSourceByKey('RenhangTime')
	function getDescriptionValue(arr, description) {
		let obj = null
		arr.map(item=> {
			if (item.name === description) {
				obj = item
			}
		})
		return obj
	}

	let cookie = new Cookie('cebcookie')
	let externalFilter = ''
	if (user.branch && user.branch !== '' && user.branch != 'QH' && user.branch != 'ZH') {
		externalFilter = `branch == ${user.branch}`
	}

	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员' || onPower[a].name == '一线服务台') {
			disPower = true
		}
	}
	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'maintenanceTemplet/delete',
					payload: ids,
				})
			},
		})
		//end
	}

	const onCopy = () => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				copyOrMoveModalType: 'copy',
				copyOrMoveModal: true,
				keysTime: new Date().getTime(),
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				copyOrMoveModalType: 'move',
				copyOrMoveModal: true,
				keysTime: new Date().getTime(),
			},
		})
	}

	const toggle = () => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				expand: !expand,
			},
		})
	}


	const onAdd = () => {
		dispatch({
			type: 'userSelect/setState',
			payload: {
				externalFilter,
			},
		})
		dispatch({
			type: 'maintenanceTemplet/queryNetwork',
			payload: {

			},
		})
		dispatch({
			type: 'maintenanceTemplet/queryQita',
			payload: {

			},
		})
		dispatch({
			type: 'maintenanceTemplet/queryApp',
			payload: {

			},
		})

		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalType: 'create',
				modalVisible: true,
				isClose: false,
				alarmType: 'BASIC',

				listHost2: [],
				listPort1: [],
				listPort2: [],
				listApp2: [],
				listQita2: [],
				listDistributed2: [],
				selectedKeysHost1: [],
				selectedKeysPort1: [],
				selectedKeysApp1: [],
				selectedKeysQita1: [],
				selectedKeysHost2: [],
				selectedKeysPort2: [],
				selectedKeysApp2: [],
				selectedKeysQita2: [],
				moFilterValue: { filterMode: 'ADVANCED' },
				hostOtherValue: '',
				appOtherValue: '',
				gjtzOtherValue: '',
				appNameAuto: '',
				appNameEditing: [],
				selectedReviewer: false,
			},
		})
	}
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
		dispatch({
			type: 'maintenanceTemplet/updateState',
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
			type: 'maintenanceTemplet/updateState',
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
			type: 'maintenanceTemplet/updateState',
			payload: {
				moImportFileList: fileList,
			},
		})
	}
	let objectData = {}
	if(selectKeys[0]){
		objectData.group = selectKeys[0]
	}

	const uploadprops = {
		action: `${mt_import}`,
		supportServerRender: true,
		showUploadList,
		headers: {
			Authorization: `Bearer ${cookie.getCookie()}`,
		},
		beforeUpload: mybeforeUpload,
		fileList: moImportFileList,
		onChange: myonchange,
		onSuccess: myonSuccess,
		onError,
		data: objectData
	}

	//导入模板
	const toshowupload = () => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				showUploadList: true,
			},
		})
	}

	let sceneName = ''
	selectTreeNode.forEach(element => {
		sceneName = element.name
	})

	const onInstance = () => {
		if (user.branch && user.branch !== '' && user.branch !== 'QH') {
			dispatch({
				type: 'maintenanceTemplet/queryReviewer',
				payload: {
					branch: `${user.branch}`
				},
			})
		}
		const obj = getDescriptionValue(rhCfg, sceneName)	//如果点击的树形菜单的名称，在数据字典中有，则返回数字；如果是null则代表没在数据字典里配置

		if ( obj === null ) {	//非数据字典里配置的场景
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					instanceVisible: true,
					timeValue: '',
					timeRange: null,
					ticket: '' //如果在数据字典里没有配置的，则不自动生成工单号
				},
			})
		} else {
			const range = formatMinutes(parseInt(obj.timeRange))
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					instanceVisible: true,
					...(parseInt(obj.timeRange) > 1440 && { timeOut: true }),			// 如果超过1天，则展示二次确认信息
					...(parseInt(obj.timeRange) > 1440 && { nameChange: '请再次确认' }), // 如果超过1天，则展示二次确认按钮
					timeValue: `维护期时长为：${range}`,
					ticket: obj.autoTicket ? obj.pre + new Date().format('yyyyMMddHHmmss') : '',	// 如果运行自动生成工单，则前缀+日期；反之则是空字符串
					timeRange: parseInt(obj.timeRange)
				},
			})
		}
	}
	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<a onClick={toggle}>
					<Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
				</a>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>批量复制</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
				{disPower ? <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onInstance} disabled={!batchDelete}>批量实例化</Button> : null}
				<Upload  {...uploadprops}><Button onClick={toshowupload} style={{ marginLeft: 8 }}><Icon type="upload" />导入</Button></Upload>
			</Col>
		</Row>
	)
}

export default buttonZone
