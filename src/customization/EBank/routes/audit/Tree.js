import React from 'react'
import { Tree, Spin, Col, Button } from 'antd'
import SearchTree from './searchTree'
const { TreeNode } = Tree


function tree({
    dispatch, loading, searchArr, treeValues
}) {

    const transTree = () => {
        const ListArr = [
            {
                title: '模块',
                key: 'typ',
                children: []
            },
            {
                title: '操作人',
                key: 'user',
                children: []
            },
            {
                title: '操作',
                key: 'action',
                children: []
            },
            {
                title: '记录UUID',
                key: 'uuid',
                children: []
            },
            {
                title: '结果码',
                key: 'responseCode',
                children: []
            },
        ]
        ListArr.forEach(item => {
            const ListVal = treeValues[`${item.key}_g`] || {}
            if (ListVal.buckets) {
                ListVal.buckets.forEach(element => {
                    item.children.push({ title: `${element.key} [${element.doc_count}]`, key: element.key, fNode: item.key })
                });
            }
        })
        return ListArr
    }
    let TreeList = transTree()

    const loop = data => data.map((item) => {
        if (item.children && item.children.length > 0) {
            return <TreeNode title={item.title} key={item.key} fNode={item.fNode} >{loop(item.children)}</TreeNode>
        }
        return <TreeNode title={item.title} key={item.key} fNode={item.fNode} />
    })

    const onSelect = (selectedKeys, e) => {
        for (let item of searchArr) {
            if (item.value == selectedKeys[0]) {
                return
            }
        }
        if (!e.node.props.fNode) {
            return
        }
        searchArr.push({ name: e.node.props.fNode, value: selectedKeys[0] })
        dispatch({
            type: 'audit/setState',
            payload: {
                searchArr: searchArr
            }
        })
    }
    const dataList = []
    const generateList = data => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key } = node;
            dataList.push({ key, title: key });
            if (node.children) {
                generateList(node.children);
            }
        }
    };
    generateList(TreeList)

    const searchTreeProps = {
        TreeList,
        dataList,
        dispatch,
        searchArr

    }
    return (
        <div style={{ background: "#fff", marginTop: 12, height: '78vh', overflow: "scroll", padding: 20 }}>
            <Spin tip="Loading..." spinning={loading}>
                {/* <Tree onSelect={onSelect}>
                    {loop(TreeList)}
                </Tree> */}
                <SearchTree {...searchTreeProps} />
            </Spin>
        </div>
    )
}

export default tree
