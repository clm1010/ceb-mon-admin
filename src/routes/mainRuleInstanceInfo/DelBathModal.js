import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Descriptions, Typography, Tag, Divider, message } from 'antd'
import fenhang from './../../utils/fenhang'
import moment from 'moment'
const { Title } = Typography
let state = ''
let maps = new Map()
fenhang.forEach((obj, index) => {
    let keys = obj.key
    let values = obj.value
    maps.set(keys, values)
})


const modal = ({
    dispatch,
    del_bath_visible,
    dataSource,
    choosedRows
}) => {
    const onCancel = () => {
        dispatch({
            type: 'mainRuleInstanceInfo/updateState',
            payload: {
                del_bath_visible: false,
            },
        })
    }

    const onOk = () => {
        let flag = true
        dataSource.forEach(item => {
            const time = moment(item.timeDef.range[0].begin)
            item.timeDef.range[0].begin
            if (!moment(time).isBefore(moment().toDate())) {
                flag = false
            }
        })
        if (!flag) {
            message.error('维护期中存在有未开始的维护期,不可以批量结束维护期,请选择已开始的维护期进行批量结束!')
        } else {
            dispatch({
                type: 'mainRuleInstanceInfo/disablePatch',
                payload: choosedRows,
            })
        }
    }

    const modalOpts = {
        title: '批量停止维护期',
        visible: del_bath_visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 1000,
        width: 777,
    }

    const columns = [
        {
            title: '维护期名',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (text, record) => <div title={text}>{text}</div>,
            // className: 'ellipsis',
        }, {
            title: '适用范围',
            dataIndex: 'branch',
            key: 'branch',
            render: (text, record) => {
                let typename = maps.get(text)
                return typename
            },
        }, {
            title: '维护期起止时间',
            dataIndex: 'timeDef.range[0]',
            key: 'timeDefRangeBegin',
            width: 175,
            render: (text, record) => {
                if (record.timeDef.range && record.timeDef.range.length > 0) {
                    if (record.timeDef.repeatType === 'BY_DAY') {
                        state = '每天'
                    } else if (record.timeDef.repeatType === 'OTHER') {
                        state = ''
                    }
                    return `${state + record.timeDef.range[0].begin} - ${record.timeDef.range[0].end}`
                } else if (record.timeDef.weekRange.length > 0) {
                    if (record.timeDef.weekRange[0].weekday === 'MON') {
                        state = '每周一'
                    } else if (record.timeDef.weekRange[0].weekday === 'TUE') {
                        state = '每周二'
                    } else if (record.timeDef.weekRange[0].weekday === 'WED') {
                        state = '每周三'
                    } else if (record.timeDef.weekRange[0].weekday === 'THU') {
                        state = '每周四'
                    } else if (record.timeDef.weekRange[0].weekday === 'FRI') {
                        state = '每周五'
                    } else if (record.timeDef.weekRange[0].weekday === 'SAT') {
                        state = '每周六'
                    } else if (record.timeDef.weekRange[0].weekday === 'SUN') {
                        state = '每周日'
                    }
                    return `${state}  ${record.timeDef.weekRange[0].range[0].begin} - ${record.timeDef.weekRange[0].range[0].end}`
                }
            },
        },
        {
            title: '申请人',
            dataIndex: 'applicant',
            key: 'applicant',
        }, {
            title: '变更号',
            dataIndex: 'ticket',
            key: 'ticket',
        },
    ]

    return (
        <Modal {...modalOpts}>
            <Descriptions column={2}>
                <Descriptions.Item label='批量停止维护期总数'> <Title type='dager' level={3}> <Tag color="#eb2f96">  {dataSource.length} </Tag> </Title> </Descriptions.Item>
                <Descriptions.Item label='说明'> <Tag color="volcano">以下维护期结束时间更改为1分钟后</Tag></Descriptions.Item>
            </Descriptions>
            <Divider orientation='left'> 维护期信息</Divider>
            <Table
                scroll={{ x: 900 }} //滚动条
                bordered
                columns={columns} //表结构字段
                dataSource={dataSource} //表数据
                simple
                size="small"
                rowKey={record => record.uuid}
                pagination={false}
            />
        </Modal>
    )
}

modal.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
}

export default modal