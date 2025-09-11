import React from "react";
import { Drawer, Form, Row, Col, Select, Input, Button, Spin } from 'antd';
import { genDictOptsByName } from "../../utils/FunctionTool";
import debounce from 'throttle-debounce/debounce'
const Option = Select.Option


const SearchFilter = ({ form, visibleSearchFilter, dispatch, tagFilters, currentSelected, appNameList, fetchingApp }) => {

    const { getFieldDecorator, validateFields, getFieldsValue, resetFields } = form

    const onClose = () => {
        resetFields()
        dispatch({
            type: 'oelcompression/updateState',
            payload: {
                visibleSearchFilter: false,
            },
        })
    }

    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            for (let key in data) {
                let N_CustomerSeverity
                if (key === 'N_CustomerSeverity' && data[key] && data[key] !== '') {
                    switch (data[key]) {
                        case "一级故障": N_CustomerSeverity = 1
                            break;
                        case "二级告警": N_CustomerSeverity = 2
                            break;
                        case "三级预警": N_CustomerSeverity = 3
                            break;
                        case "四级提示": N_CustomerSeverity = 4
                            break;
                        case "五级信息": N_CustomerSeverity = 100
                            break;
                    }
                    currentSelected = N_CustomerSeverity
                }
                let maxValue = 0
                for (let [key, value] of tagFilters) {
                    if (key > maxValue) { maxValue = key }
                }
                if (data[key] && data[key] !== '') {
                    if (key === "Severity") {
                        if (data[key] == '已恢复') {
                            tagFilters.set(maxValue + 1, { name: key, op: '=', value: "0" })
                        } else {
                            tagFilters.set(maxValue + 1, { name: key, op: '!=', value: "0" })
                        }
                    } else if (key === "N_CustomerSeverity") {
                        tagFilters.set(maxValue + 1, { name: key, op: '=', value: currentSelected })
                    } else if (key === "N_SummaryCN" || key === "N_NodeName") {
                        tagFilters.set(maxValue + 1, { name: key, op: 'like', value: data[key] })
                    } else {
                        tagFilters.set(maxValue + 1, { name: key, op: '=', value: data[key] })
                    }
                }
            }
            dispatch({
                type: 'oelcompression/query',
                payload: {
                    tagFilters,
                    currentSelected: currentSelected,
                    pagination: {																		//分页对象
                        showSizeChanger: true,												//是否可以改变 pageSize
                        showQuickJumper: true, //是否可以快速跳转至某页
                        showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
                        current: 1,																		//当前页数
                        total: null,																	//数据总数？
                        pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
                        pageSize: 100,
                    },
                },
            })
            resetFields()
        })
    }

    const queryApp = (value) => {
        //先改变当前状态为正在查询中
        dispatch({
            type: `oelcompression/updateState`,
            payload: {
                fetchingApp: true,	//修改下拉列表状态为查询中
                appNameList: [], //每次查询都清空上一次查到的集合
            },
        })
        dispatch({
            type: `oelcompression/queryApp`,
            payload: {
                q: `affectSystem == *${value}*`,
                pageSize: 100,
            },
        })
    }
    let optionApp = []
    appNameList.forEach((item, index) => {
        let values = item.affectSystem
        let keys = Date.parse(new Date()) + index
        optionApp.push(<Option key={keys} value={values}>{values}</Option>)
    })

    return (
        <Drawer
            closable={false}
            onClose={onClose}
            width={660}
            visible={visibleSearchFilter}
        >
            <Form layout="vertical" hideRequiredMark>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="告警序列号">
                            {getFieldDecorator('OZ_AlarmID', {
                            })(<Input allowClear />,
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="管理机构">
                            {getFieldDecorator('N_MgtOrgId', {
                                rules: [],
                            })(
                                <Select allowClear showSearch>
                                    {genDictOptsByName("branch")}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="告警级别">
                            {getFieldDecorator('N_CustomerSeverity')(
                                <Select allowClear>
                                    {genDictOptsByName("alertLevel")}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="IP">
                            {getFieldDecorator('NodeAlias', {
                            })(<Input allowClear />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="告警恢复状态">
                            {getFieldDecorator('Severity', {
                                rules: [],
                            })(
                                <Select allowClear>
                                    {genDictOptsByName("isRecovery")}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="分类告警">
                            {getFieldDecorator('N_ComponentType', {
                                rules: [],
                            })(
                                <Select allowClear showSearch>
                                    <Option value="操作系统">操作系统</Option>
                                    <Option value="数据库">数据库</Option>
                                    <Option value="中间件">中间件</Option>
                                    <Option value="存储">存储</Option>
                                    <Option value="硬件">硬件</Option>
                                    <Option value="应用">应用</Option>
                                    <Option value="安全">安全</Option>
                                    <Option value="网络">网络</Option>
                                    <Option value="自检">自检</Option>
                                    <Option value="机房环境">机房环境</Option>
                                    <Option value="私有云">私有云</Option>
                                    <Option value="桌面云">桌面云</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="应用系统">
                            {getFieldDecorator('N_AppName', {
                                rules: [],
                            })(<Select
                                notFoundContent={fetchingApp ? <Spin size="small" /> : null}
                                allowClear
                                showSearch
                                onSearch={debounce(800, queryApp)}
                                getPopupContainer={() => document.body}
                                filterOption={false}
                            >
                                {optionApp}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="接管状态">
                            {getFieldDecorator('Acknowledged', {
                            })(
                                <Select allowClear>
                                    <Option value="0">未接管</Option>
                                    <Option value="1">已接管</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="告警描述">
                            {getFieldDecorator('N_SummaryCN', {
                                rules: [],
                            })(<Input allowClear />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="主机名">
                            {getFieldDecorator('N_NodeName', {
                                rules: [],
                            })(<Input allowClear />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div
                style={{
                    right: 0,
                    top: 20,
                    width: '100%',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={onOk} type="primary">
                    确定
                </Button>
            </div>
        </Drawer>
    )

}

export default Form.create()(SearchFilter)