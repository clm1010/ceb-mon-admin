import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, Switch, Route } from 'dva/router'
import { Row, Col, Tree, Button, Tooltip, Modal } from 'antd'
import Label from '../label'
import GroupModal from './GroupModal'

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm

function labelGroup({
    location, dispatch, labelGroup, loading, label
}) {
    const {
        treeDatas, selectTreeNode, selectKeys, modalVisible, modalType, isClose
    } = labelGroup
    const labelProps = {
        labelGroup,
        location,
        dispatch,
        label,
        loading,
    }
    const { expand } = label
    const onSelect = (selectedKeys, info) => {
        let nodes = selectTreeNodesInfo(selectedKeys) //获取后台传入的树节点。以便在修改弹出框进行回填赋值
        dispatch({ //把选择中的 key 保存到state中，以便在其他触发事件中使用
            type: 'labelGroup/setState',
            payload: {
                selectTreeNode: nodes,
                selectKeys: selectedKeys,
            },
        })
        dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
            type: 'label/updateState',
            payload: {
                groupUUID: selectedKeys,
                filterKey: `${new Date().getTime()}`,
            },
        })
        dispatch(routerRedux.push(`/labelGroup/label`)) //显示第三级页面
    }

    const selectTreeNodesInfo = (keys) => {
        let mynodes = []
        if (keys && keys.length > 0) {
            const loopkeys = (data, mykey) => {
                let falg = false
                data.forEach((key) => {
                    if (key === mykey) {
                        falg = true
                    }
                })
                return [falg]
            }
            const loopnodes = (data) => {
                data.forEach((item) => {
                    if (item.children && item.children.length > 0) {
                        loopnodes(item.children)
                    }
                    let falg = loopkeys(keys, item.uuid)
                    if (falg && falg[0]) {
                        if (mynodes && mynodes.length > 0) {
                            mynodes = [...mynodes, item]
                        } else {
                            mynodes = [item]
                        }
                    }
                })
            }
            loopnodes(treeDatas)
        }
        return mynodes
    }

    const groupModalProps = {									//这里定义的是弹出窗口要绑定的数据源
        dispatch,
        item: modalType === 'create' ? {} : selectTreeNode[0],		//要展示在弹出窗口的选中对象
        selectparentKeys: modalType === 'create' ? selectKeys : [],
        type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
        visible: modalVisible,									//弹出窗口的可见性是true还是false
        isClose,
    }

    const onAdd = () => {
        dispatch({
            type: 'labelGroup/setState',
            payload: {
                modalType: 'create',
                modalVisible: true,
                isClose: false,
            },
        })
    }

    const onEdit = () => {
        if (selectKeys && selectKeys.length > 0) {
            dispatch({
                type: 'labelGroup/setState',
                payload: {
                    modalType: 'update',
                    modalVisible: true,
                    isClose: false,
                },
            })
        } else {
            Modal.warning({
                title: '请选择编辑的节点',
                okText: 'OK',
            })
        }
    }

    const onDelete = () => {
        if (selectKeys && selectKeys.length > 0) {
            confirm({
                title: '您确定要删除这些结点吗?',
                onOk() {
                    dispatch({
                        type: 'labelGroup/delete',
                        payload: selectKeys[0],
                    })
                },
            })
        } else {
            Modal.warning({
                title: '请选择删除的节点',
                okText: 'OK',
            })
        }
    }

    //定义默认展开的节点数组
    let expandKeys = []
    const loop = data => data.map((item) => {
        if (item.children && item.children.length > 0) {
            expandKeys.push(item.uuid)
            return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
        }
        return <TreeNode title={item.name} key={item.uuid} isLeaf />
    })

    let treeNodes = []
    if (treeDatas && treeDatas.length > 0) {
        treeNodes = loop(treeDatas)
    }
    return (
        <Row gutter={12} className="content-tree">
            <Col lg={expand ? 5 : 0} md={expand ? 6 : 0} sm={expand ? 7 : 0} xs={24} style={{ padding: 0 }}>
                <div className="content-left">
                    <div>标签树
                        <span>
                            <GroupModal {...groupModalProps} />
                            <Tooltip placement="top" title="删除">
                                <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="delete" shape="circle" onClick={onDelete} />
                            </Tooltip>
                            <Tooltip placement="top" title="编辑">
                                <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="edit" shape="circle" onClick={onEdit} />
                            </Tooltip>
                            <Tooltip placement="top" title="新增">
                                <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="plus" shape="circle" onClick={onAdd} />
                            </Tooltip>
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '100%', float: 'left', overflow: 'scroll' }}>
                        <Tree
                            showLine
                            autoExpandParent={false}
                            defaultExpandAll={false}
                            onSelect={onSelect}
                        >
                            {treeNodes}
                        </Tree>
                    </div>
                </div>
            </Col>
            <Col lg={expand ? 19 : 24} md={expand ? 18 : 24} sm={expand ? 17 : 24} xs={24} className="content-right">
                <div className="lines" />
                <Switch>
                    <Route path='/labelGroup/label' render={() => (<Label {...labelProps} />)} />
                </Switch>
            </Col>
        </Row>
    )
}


labelGroup.propTypes = {
    labelGroup: PropTypes.object,
}

export default connect(({ labelGroup, label, loading }) => ({ labelGroup, label, loading: loading.models.labelGroup }))(labelGroup)
