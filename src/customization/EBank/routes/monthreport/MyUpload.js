import React, { useState } from "react"
import { Modal, Upload, Icon, message, Button } from 'antd'
import Cookie from '../../../../utils/cookie'
import './upload.css'
const cookie = new Cookie('cebcookie')

const myUpload = ({ url , dispatch}) => {
    const [listData, setListData] = useState([])
    const [listShow, setListShow] = useState(true)
    const [upFileName, setUpFileName] = useState('')

    const mybeforeUpload = (file) => {
        return new Promise(
            function (resolve, reject) {
                Modal.confirm({
                    title: '注意',
                    content: `请确保导入的数据符合要求，确定导入${file.name}吗？`,
                    okText: '是',
                    cancelText: '否',
                    onOk: () => {
                        if (file.name && (file.name.endsWith('pptdaor') || file.name.endsWith('pptx'))) {
                            setUpFileName(file.name)
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
        setListData(fileList)
    }
    const myonSuccess = (ret, file) => {
        setListShow(false)
        message.success(`${file.name} file uploaded successfully`)

        dispatch({
            type:'monthreport/query',
            Payload:{}
        })
    }

    const onError = (err, result, file) => {
        setListShow(false)
    }
    const uploadprops = {
        action: url,
        supportServerRender: true,
        showUploadList: listShow,
        headers: {
            Authorization: 'Bearer ' + cookie.getCookie(),
        },
        beforeUpload: mybeforeUpload,
        data: { filename: upFileName },
        fileList: listData,
        onChange: myonchange,
        onSuccess: myonSuccess,
        onError: onError,
        listType: "picture-card",
        className: "monthreport-uploader"
    }

    return (
        <Upload {...uploadprops}>
            <Button className='but_down' size="default" type="link"  ><Icon type="plus" /><div>添加</div></Button>
        </Upload>
    )
}

export default myUpload