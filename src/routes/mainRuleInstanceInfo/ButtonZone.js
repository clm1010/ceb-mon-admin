import React from 'react'
import PropTypes from 'prop-types'
import Cookie from './../../utils/cookie'
import { config } from './../../utils'
import { genDictOptsByName, getSourceByKey } from './../../utils/FunctionTool'
import { Modal, Row, Col, Button, Icon, Upload, message } from 'antd'


const confirm = Modal.confirm
const { mtsinfo, exportExcelURL } = config.api
function buttonZone ({
 expand, dispatch, loading, dataSource, batchDelete, choosedRows, user, q, moImportFileList, showUploadList
}) {
	let cookie = new Cookie('cebcookie')

	let externalFilter = ''
	if (user.branch && user.branch !== '' && user.branch != 'QH' && user.branch != 'ZH') {
		externalFilter = `branch == ${user.branch}`
	}

	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}
	let yixianR = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '一线服务台') {
			yixianR = true
		}
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
			type: 'mainRuleInstanceInfo/updateState',
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
			type: 'mainRuleInstanceInfo/updateState',
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
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				moImportFileList: fileList,
			},
		})
	}

	const uploadprops = {
		action: `${mtsinfo}importFromExcel`,
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
	}

	const onCopy = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/controllerModal',
			payload: {
				modalType: 'copy',
				modalVisibleCopyOrMove: true,
				isClose: false,
				keysTime: new Date().getTime(),
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/controllerModal',
			payload: {
				modalType: 'move',
				modalVisibleCopyOrMove: true,
				isClose: false,
				keysTime: new Date().getTime(),
			},
		})
	}

	const onAdd = () => {
		const checkedValue = []
		getSourceByKey("whileList_Maintain").forEach(item => {
			if (item.description.includes("default-true")) {
				checkedValue.push(item.key)
			}
		})
		dispatch({
			type: 'userSelect/setState',
			payload: {
				externalFilter,
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/queryNetwork',
			payload: {

			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/queryQita',
			payload: {

			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/queryApp',
			payload: {

			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/controllerModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
				alarmType: 'BASIC',
				cycles: 'NON_PERIODIC',
				timeType: 'BY_WEEK',
				ruleInstanceKey: `${new Date().getTime()}`,
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
					branchArray: '',
					checkedList: [],
					branchStr: '',
					tempList: [{
 index: 1, tempid: '', begin: '', end: '',
}],
					tempDayList: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListMon: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListTue: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListWed: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListThu: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListFri: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListSat: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				tempWeekListSun: [{
 index: 1, tempid: '', begin: '', end: '',
}],
				moFilterValue: { filterMode: 'ADVANCED' },
				hostOtherValue: '',
				  appOtherValue: '',
				  gjtzOtherValue: '',
				  applicantInfo: '',
				  optionAppNameEditing: [],
				  optionCluster: [],
				  optionNamespace: [],
				  optionIndicator: [],
				  appNameAuto: '',
				  appNameEditing: [],
				  selectedReviewer:false,
				  checkedValue:checkedValue
			},
		})
		if (user.branch && user.branch !== ''&& user.branch !== 'QH') {
			dispatch({
				type: 'mainRuleInstanceInfo/queryReviewer',
				payload: {
					branch:`${user.branch}`
				},
			})
		}
	//end
}

const oldError = (ret) => {
	message.error(`failedRawRows:${ret.failedRawRows},failedU2MtNum:${ret.failedU2MtNum},successRawRows:${ret.successRawRows},successU2MtNum:${ret.totalRawRows},totalU2MtNum:${ret.totalU2MtNum}`, 8)
}

const oldSuccess = (ret) => {
	message.error(`failedRawRows:${ret.failedRawRows},failedU2MtNum:${ret.failedU2MtNum},successRawRows:${ret.successRawRows},successU2MtNum:${ret.totalRawRows},totalU2MtNum:${ret.totalU2MtNum}`, 8)
}

const onDelete = () => {
	confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk () {
			  dispatch({
				type: 'mainRuleInstanceInfo/delete',
				payload: choosedRows,
			  })
			},
  })
//end
}

const olduploadprops = {
	action: `${mtsinfo}import`,
	supportServerRender: true,
	//showUploadList: showUploadList,
	headers: {
		Authorization: `Bearer ${cookie.getCookie()}`,
	},
	onSuccess: oldError,
	onError: oldSuccess,
}

const exportExcelInfo = () => {
	window.open(`${exportExcelURL}/static2/excel/维护期普通模板.xlsx`, '_parent')
  }

const exportExcelInfoFirst = () => {
	window.open(`${exportExcelURL}/static2/excel/一线服务台专用模板.xlsx`, '_parent')
  }

  //导入模板
	const toshowupload = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				showUploadList: true,
			},
		})
	  }

	const toggle = () => {
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				expand: !expand,
			},
		})
	}

	const onDownOut = () => {
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type: 'mainRuleInstanceInfo/onDown',
					payload:{
						q: q,
						filename:'维护期'
					}
				})
			},
		})
	}

	const ondelBath = ()=>{
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload:{
				del_bath_visible:true
			}
		})
	}

	let forbind = true
	if(user.branch == undefined || user.branch=='ZH' || user.branch =='QH'){
		forbind = false
	}

  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <a onClick={toggle}>
          <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
        </a>
        <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>复制</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={exportExcelInfo} ><Icon type="download" />普通模板</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={exportExcelInfoFirst} ><Icon type="download" />一线服务台专用模板</Button>
        <Upload style={{ marginLeft: 8 }} {...uploadprops}><Button onClick={toshowupload} disabled={forbind}><Icon type="upload" />导入</Button></Upload>
        {/* <Upload style={{ marginLeft: 8 }} {...olduploadprops}><Button><Icon type="upload" />老平台上传</Button></Upload> */}
		<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
		{ disPower || yixianR ? <Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={ondelBath} >批量结束</Button> : null}
      </Col>
    </Row>
  )
}

export default buttonZone
