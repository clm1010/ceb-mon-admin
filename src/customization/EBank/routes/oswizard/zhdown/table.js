import React from 'react'
import { Form, Table, Input, Row, Col, Button } from 'antd'
import _columns from '../Columns'
import AppSelect from '../../../../../components/appSelectComp'
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
}

function list({
    dispatch, loading, dataSource, pagination, q, appSelect, form, item = {},down_os_uuids
}) {
    const user = JSON.parse(sessionStorage.getItem('user'))

    const {
        getFieldDecorator,
    } = form

    if (appSelect.currentItem.affectSystem !== undefined) {
        item.appName = appSelect.currentItem.affectSystem
        item.uniqueCode = appSelect.currentItem.c1
        item.appCode = appSelect.currentItem.englishCode
    }

    const onSearch = () => {
        const appName = form.getFieldValue('appName')
        const discoveryIP = form.getFieldValue('discoveryIP')
        let qs = user.branch ? `;branchName=='${user.branch}'` : ''
        if (appName && appName != '') {
            qs += `;appName=='${appName}'`
        }
        if (discoveryIP && discoveryIP != '') {
            if (discoveryIP.includes(',')) {
                qs += `;discoveryIP=in=(${discoveryIP})`
            } else {
                qs += `;discoveryIP=='${discoveryIP}'`
            }
        }
        dispatch({
            type: 'oswizard/getOS',
            payload: {
                q: `firstClass=in=('OS','IP','HARDWARE')` + qs
            },
        })
    }

    const onPageChange = (page) => {
        dispatch({
            type: 'oswizard/getOS',
            payload: {
                pageSize: page.pageSize,
                page: page.current - 1,
                q,
            },
        })
    }

    const rowSelection = {
        selectedRowKeys: down_os_uuids,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            const down_os_uuids = selectedRowKeys
            const down_os_ips = []
            selectedRows.forEach(element => {
                down_os_ips.push(element.discoveryIP)
            });
            dispatch({
                type: 'oswizard/updateState',
                payload: {
                    down_os_uuids,
                    down_os_ips
                }
            })
        }
    };

    const appSelectProps = Object.assign({}, appSelect, {
        placeholders: '',
        name: '应用分类名称',
        modeType: 'combobox',
        required: false,
        dispatch,
        form,
        disabled: false,
        compName: 'appName',
        formItemLayout,
        currentItem: { affectSystem: item.appName },
    })

    const validaticket = (rule, value, callback) => {

        let reg = /^(CHG|CHD)-[0-9]{8}-[0-9]{5}$/
        let reg1 = /^RQ[0-9]{16}$/
        let reg2 = /^BCHG-[0-9]{8}-[0-9]{5}$/

        if (value === undefined || value == '') {
            callback()
        } else if (!(reg1.test(value) || reg.test(value) || reg2.test(value))) {
            callback('请正确填写工单号！')
        } else {
            callback()
        }
    }


    return (
        <div style={{ marginTop: 25 }}>
            <Row gutter={[16, 0]}>
                <Col xs={{ span: 16, offset: 1 }} sm={{ span: 16, offset: 1 }} md={{ span: 16, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 16, offset: 1 }}>
                    <FormItem label="工单号" key="ticket" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('ticket', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请填写工单号!'
                                },
                                {
                                    validator: validaticket,
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                </Col>
                {/* <Col xs={{ span: 16, offset: 1 }} sm={{ span: 16, offset: 1 }} md={{ span: 16, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 16, offset: 1 }}>
                    <AppSelect {...appSelectProps} />
                </Col> */}
                <Col xs={{ span: 16, offset: 1 }} sm={{ span: 16, offset: 1 }} md={{ span: 16, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 16, offset: 1 }}>
                    <FormItem label="发现ip" key="discoveryIP" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('discoveryIP', {
                            initialValue: '',
                        })(<Input placeholder='支持查询多个ip,多个ip以","分割' />)}
                    </FormItem>
                </Col>
                <Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                    <Button type="primary" shape="circle" icon="search" onClick={onSearch} />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Table
                    scroll={{ x: 980 }} //滚动条
                    bordered
                    columns={_columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    onChange={onPageChange}
                    rowSelection={rowSelection}
                    simple
                    rowKey={record => record.uuid}
                    size="small"
                />
            </Row>
        </div>
    )
}

export default list
