import React, { useState } from "react"
import { Modal, Upload, Icon, message, Button } from 'antd'
import Cookie from '../../../../../utils/cookie'
import * as XLSX from 'xlsx'
import '../index.css'
const cookie = new Cookie('cebcookie')

const myUpload = ({ dispatch, pathType, url, currentStep, onRule }) => {
    const [listData, setListData] = useState([])
    const [listShow, setListShow] = useState(true)

    const mybeforeUpload = (file) => {
        return new Promise(
            function(resolve, reject) {
                let reader = new FileReader()
                let loading_step
                reader.onload = function(e) {
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
        if (ret.agentPingFails && ret.agentPingFails.length > 0) {
            Modal.error({
                title: '以下IP无法联通监控代理，请检查：1.网络是否开通；2.是否安装监控代理；3.IP是否正确。',
                content: `${ret.agentPingFails.join(' , ')}`,
                okText: '确定',
                onOk: () => {
                    dispatch({
                        type: pathType,
                        payload: {
                            findOSData: {},
                            currentStep,
                        }
                    })
                },
            })
        } else if (ret.agentGetFails && ret.agentGetFails.length > 0) {
            Modal.error({
                title: '以下IP agentGetFails不通',
                content: `${ret.agentGetFails.join(' , ')},获取信息失败！`,
                okText: '确定',
                onOk: () => {
                    dispatch({
                        type: pathType,
                        payload: {
                            findOSData: {},
                            currentStep,
                        }
                    })
                },
            })
        }
        else {
            let mess = '导入结果存在,确认后进行MO信息的确认'
            let ips = []
            if (ret.additions && ret.additions.length > 0) {
                ret.additions.forEach(item => {
                    ips.push(item.discoveryIP)
                })
                mess = `以下MO不存在: ${ips.join('、')},是否继续添加？`
            }
            Modal.success({
                title: '导入结果',
                content: mess,
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    dispatch({
                        type: pathType,
                        payload: {
                            findOSData: ret,
                            addMo: ret.additions,
                            validateMO: ret.exists,
                            currentStep: currentStep + 1,
                            secondflag: true,
                        }
                    })
                },
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
        className: "avatar-uploader"
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