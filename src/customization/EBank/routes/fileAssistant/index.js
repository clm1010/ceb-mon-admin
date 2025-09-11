import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Icon, Table, Row, Col, Button, message, Empty, Upload } from 'antd'

const { Dragger } = Upload;

const fileAssistant = ({
    location, dispatch, loading, fileAssistant
}) => {
    const {
        list,
        dataSource
    } = fileAssistant

    const ondown = (value) => {
        dispatch({
            type: 'fileAssistant/down',
            payload: {
                path: value
            }
        })
    }
    const ondelet = (value) => {
        dispatch({
            type: 'fileAssistant/delete',
            payload: {
                file: value
            }
        })
    }

    function splitStringByRegex(str, regex, limit) {
        let result = [];
        let match;
        let lastIndex = 0;
        let splitCount = 0;

        while ((match = regex.exec(str)) !== null && splitCount < limit) {
            result.push(str.substring(lastIndex, match.index));
            lastIndex = match.index + match[0].length;
            splitCount++;
        }

        result.push(str.substring(lastIndex));
        return result;
    }


    const columns = [
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                // let rest = ''
                // if (text) {
                //     let aa = text.split(" ")
                //     rest = aa[aa.length - 1]
                // }
                let regex = /\s+/g; // 匹配一个或多个空格
                let result = splitStringByRegex(text, regex, 8);

                return result[8]
            },
        }, {
            title: '大小',
            dataIndex: 'name',
            key: 'size',
            render: (text, record) => {
                let rest = ''
                if (text) {

                    // let aa = text.split(" ").filter(t => t)
                    // rest = parseFloat(aa[aa.length - 5])

                    let regex = /\s+/g; // 匹配一个或多个空格
                    let result = splitStringByRegex(text, regex, 8);
                    rest = result[4]
                }
                switch (true) {
                    case rest < 1024:
                        rest = rest + 'b'
                        break;
                    case rest >= 1024 * 1024 * 1024:
                        rest = (rest / (1024 * 1024 * 1024)).toFixed(2) + 'G'
                        break;
                    case rest >= 1024 * 1024:
                        rest = (rest / (1024 * 1024)).toFixed(2) + 'M'
                        break;
                    case rest >= 1024:
                        rest = (rest / (1024)).toFixed(2) + 'K'
                        break;
                }
                return rest
            },
        }, {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                let rest = ''
                if (text.name) {
                    let aa = text.name.split(" ")
                    rest = aa[aa.length - 1]
                }
                return (
                    <div>
                        <Button size="small" type="ghost" shape="circle" icon="download" onClick={() => ondown(rest)} />
                        <Button style={{ marginLeft: 10 }} size="small" type="ghost" shape="circle" icon="delete" onClick={() => ondelet(rest)} />
                    </div>
                )
            },
        },
    ]
    const props = {
        name: 'file',
        multiple: true,
        action: '/fileAssistantAPI/api/file/upload',
        headers: {
            Authorization: 'Basic dXNlcjpDaGluYUA5MzA5MjA=',
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                dispatch({ type: 'fileAssistant/requery' })
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return (
        <div className="content-inner" id="1">
            <Row gutter={24}>
                <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或者拖拽进行文件上传</p>
                    </Dragger>
                    <div style={{ height: 20 }}></div>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        simple
                        rowKey={record => record.uuid}
                        size="small"
                        pagination={false}
                    />
                </Col>
            </Row>
        </div>
    )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ fileAssistant, loading }) => ({ fileAssistant, loading: loading.models.fileAssistant }))(fileAssistant)
