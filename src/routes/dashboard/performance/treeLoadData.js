import React from 'react'
import { Tree, Badge, Popover, Avatar, Descriptions, Card, Button } from 'antd'
import F5 from './F5.png'
import firewall from './firewall.png'
import switchs from './switch.png'
import router from './ROUTER.png'
import unfind from  './undefind.png'
const { TreeNode } = Tree
const { Meta } = Card
class treeLoadData extends React.Component{
  constructor (props){
    super(props)
    this.state.treeData = this.props.treeData
    this.state.loading = this.state.loading
  }

  state = {
    treeData: [],
    firstLocal:'',
  }

  onLoadData = (treeNode) =>{
    if(treeNode.props.pos.split('-').length==2){
      this.setState({
        firstLocal:treeNode.props.eventKey
      })
    }
    return new Promise((resolve) => {
      if(treeNode.props.children.length==0){
        this.props.dispatch({
          type: 'monitor/query',
          payload:{
            netDomainIndex: this.state.firstLocal,
            appNameIndex:treeNode.props.eventKey,
            locations: treeNode.props.title
          },
          callback: (res) => {
            resolve()
          }
        })
      }else{
        resolve()
      }
    })
    
  }
  handleAlert = item => {
    if (item.discoveryIP) {
     window.open(`/chdlistall?q=${item.discoveryIP}+${item.branchName}`, '_blank')
    }
  }

  loopSelect = data => data.map((item) => {
    if (item.children && !item. isLeaf) {
      return <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf}>{this.loopSelect(item.children)}</TreeNode>
    }else{
      console.log('单个树节点：',item)
      const content = (//item.secondClass
        <div style={{ width: '400px' }}>
          <Card bordered={false} >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  shape="square"
                  alt={item.secondClass}
                  src={item.secondClass === 'ROUTER' ? router : item.secondClass === 'F5' ? F5 : item.secondClass === 'SWITCH' ? switchs : item.secondClass === 'FIREWALL' ? firewall : unfind }
                />
              }
              title={item.secondClass}
            />
            <br/>
            <Descriptions column={2} size="small" layout="horizontal">
              <Descriptions.Item label="纳管状态">{item.managedStatus}</Descriptions.Item>
              <Descriptions.Item label="厂商">{item.vendor}</Descriptions.Item>
              <Descriptions.Item label="设备IP">{item.discoveryIP}</Descriptions.Item>
            </Descriptions>
          </Card>

        </div>
      );
      return <TreeNode title={item.isLeaf ? <Badge status={item.onlineStatus === '在线' ? "success" : "error" } 
      text={<Popover content={content} placement="rightTop" trigger="hover" onclick={onclick}> 
            <span onClick={() => this.handleAlert(item)} >{item.title}</span>
        </Popover>} /> : item.title}  key={item.key} isLeaf={item.isLeaf} ></TreeNode>
    }
  })

  componentWillReceiveProps(nextProps) {
    this.state.treeData = nextProps.treeData
    this.state.loading = nextProps.loading
  }

  render(){
    return (
      <Tree loadData={this.onLoadData} >
        {this.loopSelect(this.state.treeData)}
      </Tree>
    )
  }
}

export default treeLoadData
