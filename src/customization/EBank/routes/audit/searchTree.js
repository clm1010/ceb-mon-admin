import React from 'react'
import { Tree, Input } from 'antd'

const { TreeNode } = Tree;
const { Search } = Input;



class SearchTree extends React.Component {

    constructor(props) {
        super(props)
        this.state.treeData = props.TreeList
        this.state.dataList = props.dataList
        this.state.dispatch = props.dispatch
        this.state.searchArr = props.searchArr
    }

    static getDerivedStateFromProps(props, state) {
        return {
            treeData: props.TreeList,
            dataList: props.dataList,
            searchArr: props.searchArr,
            dispatch: props.dispatch,
        }
    }

    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
    };

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    onChange = e => {
        const { value } = e.target;
        let expandedKeys = []
        if (value != "") {
            expandedKeys = this.state.dataList
                .map(item => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.key, this.state.treeData);
                    }
                    return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
        }
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    onSelect = (selectedKeys, e) => {
        if (!e.node.props.fNode) {
            return
        }
        if (selectedKeys.length == 0) {
            return
        }
        for (let item of this.state.searchArr) {
            if (item.value == selectedKeys[0]) {
                return
            }
        }
        this.state.searchArr.push({ name: e.node.props.fNode, value: selectedKeys[0] })
        this.state.dispatch({
            type: 'audit/setState',
            payload: {
                searchArr: this.state.searchArr
            }
        })
    };

    render() {
        const { searchValue, expandedKeys, autoExpandParent, treeData } = this.state;
        const loop = data =>
            data.map(item => {
                const index = item.title.indexOf(searchValue);
                const beforeStr = item.title.substr(0, index);
                const afterStr = item.title.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: '#eb2f96' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.title}</span>
                    );
                if (item.children) {
                    return (
                        <TreeNode key={item.key} title={title} fNode={item.fNode}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={title} fNode={item.fNode} />;
            });

        return (
            <div>
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                    onExpand={this.onExpand}
                    onSelect={this.onSelect}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                >
                    {loop(treeData)}
                </Tree>
            </div>
        );
    }
}

export default SearchTree