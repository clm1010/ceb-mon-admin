
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
class MyTreeSelect extends React.Component {
    constructor(props) {
        super(props)
        this.dispatch =props.dispatch
        this.state.loading = true
        this.state.value = props.value
        this.treeData = loopSelect1(props.treeData)
        this.ArrNodes = props.ArrNodes
        this.valueMap = props.valueMap
        this.SelectedNode = props.SelectedNode
    }

    componentWillReceiveProps(nextProps) {
        this.dispatch = nextProps.dispatch
        this.state.loading = nextProps.loading
        this.value = nextProps.value
        this.treeData = loopSelect1(nextProps.treeData)
        this.ArrNodes = nextProps.ArrNodes
        this.valueMap = nextProps.valueMap
        this.SelectedNode = nextProps.SelectedNod
        this.setState({
            value:nextProps.SelectedNode
        })
    }
    state = {
        value: [],
    };

    onChange = (value, node, extra) => {
        if (!extra.checked) {  //取消选中时， 如果有孩子节点则孩子节点也取消掉
            let aa = new Set()
            let _ArrNodes = this.ArrNodes
            const loopSelect = data => data.map((item) => {
                if (item.props.children && item.props.children.length > 0) {
                    aa.add(item.props.value)
                    return loopSelect(item.props.children)
                }
                return aa.add(item.props.value)
            })

            if(extra.triggerNode.props.children){
                loopSelect(extra.triggerNode.props.children)
            }
            _ArrNodes.remove(extra.triggerValue)
            _ArrNodes = _ArrNodes.filter(x => !aa.has(x))
            this.dispatch({
                type: 'policyRule/updateState',
                payload: {
                    ArrNodes: _ArrNodes
                }
            })
        }
    };
    onSelect = label => {
        let _ArrNodes = this.ArrNodes
        _ArrNodes = Array.from(new Set(_ArrNodes.concat(this.getPath(label.value))))
        this.dispatch({
            type: 'policyRule/updateState',
            payload: {
                ArrNodes: _ArrNodes
            }
        })
    }
    // 获取父节点 信息 获取子节点信息
    getPath(uuid) {
        const path = [];
        let current = this.valueMap[uuid];
        // 添加子节点
        const loopSelect = data => data.map((item) => {
            if (item.children && item.children.length > 0) {
                path.push(item.uuid)
                return loopSelect(item.children)
            }
            return path.push(item.uuid)
        })
        if(current.children && current.children.length>0){
            loopSelect(current.children)
        }
        //添加父节点
        while (current) {
            path.unshift(current.uuid);
            current = current.parent;
        }
        return path;
    }

    render() {
        const tProps = {
            value: this.state.value,
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
