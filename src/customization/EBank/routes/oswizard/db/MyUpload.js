import React, { useState } from "react"
import { Modal, Upload, Icon, message, Button } from 'antd'
import Cookie from '../../../../../utils/cookie'
import * as XLSX from 'xlsx'
import '../index.css'
const cookie = new Cookie('cebcookie')

const myUpload = ({ dispatch, pathType, url, currentStep, onRule, os_type }) => {
    const [listData, setListData] = useState([])
    const [listShow, setListShow] = useState(true)

    const mybeforeUpload = (file) => {
        return new Promise(
            function (resolve, reject) {
                let reader = new FileReader()
                let loading_step
                reader.onload = function (e) {
                    let data = e.target.result
                    let workbook = XLSX.read(data, { type: 'binary' })
                    let row_obj = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
                    loading_step = row_obj.length
                }
                reader.readAsBinaryString(file)

                Modal.confirm({
                    title: '注意',
                    content: `请确保导入的数据符合要求，确定导入${file.name}吗？`,
                    okText: '是',
                    cancelText: '否',
                    onOk: () => {
                        if (file.name && (file.name.endsWith('xls') || file.name.endsWith('xlsx')) && loading_step < 51) {
                            resolve()
                            dispatch({
                                type: pathType,
                                payload: {
                                    loading_state: true,
                                    loading_step
                                }
                            })
                        } else {
                            message.error('请上传execl格式的文档且条数小于50');
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
        setListData(fileList)
    }

    const myonSuccess = (ret, file) => {
        setListShow(false)
        dispatch({
            type: pathType,
            payload: {
                loading_state: false
            }
        })
        if (os_type == 'ping') {
            Modal.success({
                title: '导入结果',
                content: '如果mo存在则获取mo信息,如果mo不存在则会在最后新建mo。',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    dispatch({
                        type: pathType,
                        payload: {
                            MOData: ret.items,
                            importItem: ret.items,
                            needMO:ret.needMO,
                            currentStep: currentStep + 2,
                            secondflag: false,
                            thirdRes:true
                        }
                    })
                },
                onCancel: () => {
                    dispatch({
                        type: pathType,
                        payload: {
                            currentStep,
                            MOData: [],
                            existMoint: [],
                            importItem: [],
                        }
                    })
                }
            });
        } else {
            if (ret.needMO && ret.needMO.length > 0) {
                let needSO = []
                ret.needMO.forEach(element => {
                    needSO.push(element.hostIP)
                });
                Modal.error({
                    title: '以下IP无缺少主机MO信息。请走操作系统自服务流程',
                    content: `${needSO.join(' , ')}`,
                    okText: '确定',
                    onOk: () => {
                        dispatch({
                            type: pathType,
                            payload: {
                                currentStep,
                            }
                        })
                    },
                })
            } else {
                let thirdRes = true
                if (ret.requestResult && ret.requestResult.length > 0) {
                    thirdRes = false
                }
                let mess = '导入结果存在,确认后进行MO信息的确认'
                Modal.success({
                    title: '导入结果',
                    content: mess,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        dispatch({
                            type: pathType,
                            payload: {
                                MOData: ret.mos,
                                existMoint: ret.requestResult,
                                importItem: ret.items,
                                currentStep: currentStep + 1,
                                secondflag: true,
                                thirdRes: thirdRes
                            }
                        })
                    },
                    onCancel: () => {
                        dispatch({
                            type: pathType,
                            payload: {
                                currentStep,
                                MOData: [],
                                existMoint: [],
                                importItem: [],
                            }
                        })
                    }
                });
            }
        }
    }

    const onError = (err, result, file) => {
        setListShow(false)
        dispatch({
            type: pathType,
            payload: {
                loading_state: false
            }
        })
        Modal.error({
            title: '导入结果',
            content: `${result.msg}`,
            okText: '确认',
            cancelText: '取消',
            onCancel: () => {
                dispatch({
                    type: pathType,
                    payload: {
                        findOSData: {},
                        currentStep,
                    }
                })
            }
        });
    }
    const uploadprops = {
        action: url,
        supportServerRender: true,
        showUploadList: listShow,
        headers: {
            Authorization: 'Bearer ' + cookie.getCookie(),
        },
        beforeUpload: mybeforeUpload,
        fileList: listData,
        onChange: myonchange,
        onSuccess: myonSuccess,
        onError: onError,
        listType: "picture-card",
        className: "avatar-uploader",
        data: { wizardType: os_type.toUpperCase() }
    }

    const onDownOut = (event) => {
        if (onRule()) {
            event.stopPropagation()
        }
    }
    return (
        <Upload {...uploadprops}>
            <Button className='but_down' size="default" type="link" onClick={onDownOut} ><Icon type="plus" /><div>导入</div></Button>
        </Upload>
    )
}

export default myUpload