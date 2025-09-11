import React, { useState, useEffect } from 'react'
import { Form, Transfer, Row, Col, Button, Modal, Tree, Icon, Divider, Spin } from 'antd'
const { TreeNode } = Tree;

const TransferModal = ({
    dispatch,
    visible,
    loading,
    ruleType,   // ‘normal’ ‘basics’规则类型
    proData_original,  // 生产策略---原始
    preData_original,  // 准生产策略---原始

    proData_target, // 生产策略---初始值
    preData_target, // 准生产策略---初始值

}) => {
    const [type, setype] = useState('prod');
    const [protarget, setprotarget] = useState(proData_target);
    const [pretarget, setpretarget] = useState(preData_target);

    useEffect(() => {
        if (preData_target && preData_target != []) {
            setpretarget(preData_target)
        }
        if (proData_target && proData_target != []) {
            setprotarget(proData_target)
        }
    }, [preData_target, proData_target])

    const onOk = () => {
        let all_target = [...protarget, ...pretarget]
        let all_orginal = [...proData_original, ...preData_original]

        let resList = all_orginal.filter(item => {
            return all_target.indexOf(item.uuid) != -1
        })
        dispatch({
            type: 'clusterRule/setState',			//抛一个事件给监听这个type的监听器
            payload: {
                RuleVisible: false,
                [`${ruleType}List`]: resList
            },
        })
    }
    const onCancel = () => {
        dispatch({
            type: 'clusterRule/setState',			//抛一个事件给监听这个type的监听器
            payload: {
                RuleVisible: false,
                proData_original: [],
                preData_original: [],
                proData_target: [],
                preData_target: [],
            },
        })
    }
    const handleChange = targetKeys => type == 'prod' ? setprotarget(targetKeys) : setpretarget(targetKeys)

    const onSelect = value => setype(value[0])

    const filterOption = (inputValue, option) => option.name.indexOf(inputValue) > -1;

    const modalOpts = {
        title: ruleType === 'basics' ? '基础规则选择' : '普通规则选择',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
    }

    return (
        <Modal {...modalOpts}
            width="900px"
            style={{ top: -50 }}
            footer={[<Button key="cancel" onClick={onOk}>确定</Button>]}
        >
            <Row gutter={24}>
                <Col lg={4} md={4} sm={4} xs={4}>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp; 标签组</div>
                    <div >
                        <Tree
                            showIcon
                            defaultExpandAll
                            defaultSelectedKeys={['prod']}
                            onSelect={onSelect}
                        >
                            <TreeNode icon={<Icon type="control" />} title="生产策略" key="prod" />
                            <TreeNode icon={<Icon type="project" />} title="准生产策略" key="dev" />
                        </Tree>

                    </div>
                </Col>
                <Col lg={20} md={20} sm={20} xs={20} >
                    <Spin spinning={loading}>
                        <Transfer
                            dataSource={type === 'prod' ? proData_original : preData_original}
                            titles={['待选规则', '已选规则']}
                            showSearch
                            listStyle={{
                                width: '46%',
                                height: 450,
                            }}
                            filterOption={filterOption}
                            targetKeys={type === 'prod' ? protarget : pretarget}
                            onChange={handleChange}
                            render={item => item.name}
                        />
                    </Spin>
                </Col>
            </Row>

        </Modal>
    )
}

export default Form.create()(TransferModal)