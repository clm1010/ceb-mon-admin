import React from 'react'
import { Modal, Row, Col, Icon, Button, Upload, message} from 'antd'
import Cookie from '../../utils/cookie'
import { config } from '../../utils'
import { adminRoles } from '../policy/utils/userRole'
const confirm = Modal.confirm
const { ulIndicatorImpl } = config.api

const buttonZone = ({ dispatch, batchDelete, choosedRows, expand, q, groupUUID ,moImportFileList, showUploadList, user}) => {

	let cookie = new Cookie('cebcookie')
	const onAdd = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				stdInfoVal: {}, //指标信息
				moFilterValue: {}, //对象特征信息
				moFilterOldValue: {}, //保存对象特征最初时的状态
				//setModelKey:`${new Date().getTime()}`,
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'zabbixItemsInfo/delete',
		        payload: choosedRows,
		      })
        },
      })
	}

	const onCopy = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalType: 'copy',
				modalVisibleCopyOrMove: true,
				isClose: false,
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalType: 'move',
				modalVisibleCopyOrMove: true,
				isClose: false,
			},
		})
	}
	const onDownOut = () => {
		confirm({
			title: '您确定要导出这些记录吗?',
			onOk() {
				dispatch({
					type: 'zabbixItemsInfo/onDown',
					payload: {
						q: q,
						groupUUID: groupUUID.toString(),
						filename: '指标实现'
					}
				})
			},
		})

	}
		//导入模板
		const toshowupload = () => {
			dispatch({
				type: 'zabbixItemsInfo/setState',
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
              //var falg = false
			        if (file.name && (file.name.endsWith('xls') || file.name.endsWith('xlsx'))) {
				        //falg = true
                resolve()
			        } else {
				        message.error('You can only upload excel file!');
				        //falg = false
                reject()
			        }
			        //return falg
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
				type: 'zabbixItemsInfo/setState',
				payload: {
					moImportFileList: fileList,
				}
			})
		}
		const myonSuccess = (ret, file) => {
			dispatch({
				type: 'zabbixItemsInfo/setState',
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
				type: 'zabbixItemsInfo/setState',
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
			//action: zabbixIO + 'import',
			action: ulIndicatorImpl,
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
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				expand: !expand,
			},
		})
	}

	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <a onClick={toggle}>
        <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
      </a>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} >新增</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>批量复制</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
	  <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDownOut} ><Icon type="download" />导出</Button>
	  <Upload style={{ marginLeft: 8 }} {...uploadprops}><Button onClick={toshowupload} disabled={adminRoles()}><Icon type="upload" />导入</Button></Upload>
    </Col>
  </Row>
	)
}

export default buttonZone
