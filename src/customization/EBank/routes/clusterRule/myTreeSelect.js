
import React from 'react';
import { TreeSelect } from 'antd';
const TreeSelectNode = TreeSelect.TreeNode
const { SHOW_ALL } = TreeSelect;
const loopSelect1 = data => data.map((item) => {
    if (item.children && item.children.length > 0) {
        return <TreeSelectNode title={item.name} value={item.uuid} key={item.value} >{loopSelect1(item.children)}</TreeSelectNode>
    }
    return <TreeSelectNode title={item.name} value={item.uuid} key={item.value} />
})
const valueMap = {};
function loops(list, parent) {
    return (list || []).map(({ children, uuid }) => {
        const node = (valueMap[uuid] = {
            parent,
            uuid
        });
        node.children = loops(children, node);
        return node;
    });
}

class MyTreeSelect extends React.Component {
    constructor(props) {
        super(props)
        loops(props.treeData)
        this.dispatch = props.dispatch
        this.state.loading = true
        this.treeData = loopSelect1(props.treeData)
        this.ArrNodes = props.ArrNodes
        this.state.value = props.treeData
        this.state.type = props.type
    }

    componentWillReceiveProps(nextProps) {
        loops(nextProps.treeData)
        this.dispatch = nextProps.dispatch
        this.state.loading = nextProps.loading
        this.treeData = loopSelect1(nextProps.treeData)
        this.ArrNodes = nextProps.ArrNodes
        this.state.value = nextProps.treeData
        this.state.type = nextProps.type
    }
    state = {
        value: [],
        type:''
    };
    onChange = (value, node, extra) => {
        if (!extra.checked) {
            let aa = new Set()
            let _ArrNodes = this.ArrNodes
            const loopSelect = data => data.map((item) => {
                if (item.props.children && item.props.children.length > 0) {
                    aa.add(item.props.value)
                    return loopSelect(item.props.children)
                }
                return aa.add(item.props.value)
            })
            if (extra.triggerNode.props.children) {
                loopSelect(extra.triggerNode.props.children)
            }
            _ArrNodes.remove(extra.triggerValue)
            _ArrNodes = _ArrNodes.filter(x => !aa.has(x))
            this.dispatch({
                type: 'clusterRule/setState',
                payload: {
                    [this.state.type]: _ArrNodes
                }
            })
        }
    };
    onSelect = label => {
        let _ArrNodes = this.ArrNodes
        _ArrNodes = Array.from(new Set(_ArrNodes.concat(this.getPath(label.value))))
        this.dispatch({
            type: 'clusterRule/setState',
            payload: {
                [this.state.type]: _ArrNodes
            }
        })
    }

    getPath(uuid) {
        const path = [];
        let current = valueMap[uuid];
        while (current) {
            path.unshift(current.uuid);
            current = current.parent;
        }
        return path;
    }

    render() {
        const {
            value
        } = this.state
        const SelectedNode = []
        const loopNode = data => data.map((item) => {
            for (let i = 0; i < this.ArrNodes.length; i++) {
                if (this.ArrNodes[i] == item.uuid) {
                    let obj = {}
                    obj.label = item.name
                    obj.value = item.uuid
                    SelectedNode.push(obj)
                }
            }
            if (item.children && item.children.length > 0) {
                loopNode(item.children)
            }
        })
        loopNode(value)
        const tProps = {
            value: SelectedNode,
            onChange: this.onChange,
            onSelect: this.onSelect,
            treeCheckable: true,
            treeCheckStrictly: true,
            showCheckedStrategy: SHOW_ALL,
            searchPlaceholder: 'Please select',
            style: {
                width: '100%',
            },
        };
        return <TreeSelect {...tProps}>{this.treeData}</TreeSelect>;
    }
}
export default MyTreeSelect
