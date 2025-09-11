import React from 'react'
import { Card, Icon, Avatar, Dropdown, Menu, Tooltip} from 'antd'

const { Meta } = Card;
export default class welcomeCard extends React.Component{
  constructor(props) {
    super(props)

  }

  componentWillReceiveProps(nextProps) {

  }

  openView = (url, title) => {
    let obj = window.open(url, title)
    obj.document.title = title
  }

  content = <Menu>
      {
        (this.props.menuItem && this.props.menuItem.length > 0) ?
          this.props.menuItem.map((item,index) => {
            return <Menu.Item key={index}>
                        <Tooltip placement="rightBottom" title={item.title}><Icon type="api"/><a onClick={() => this.openView(item.connet, item.source)}>{item.source}</a></Tooltip>
                    </Menu.Item>
          })
          :
          null
      }
  </Menu>
//img,  menuItem([{title: '生产系统Windows服务器监控',connet: 'http://10.1.37.238/nagios',source: '10.1.37.238'}]),  avatar, name,description
  render (){
    return (
      <Card
        style={{ width: this.props.width}}
        cover={
          this.props.show ?
          <img
            alt="example"
            src={this.props.img}
          />
            :
            null
        }
        actions={[
          <div><Icon type="user"/>{this.props.user}</div>,
          <Dropdown overlay={this.content} ><div><Icon type="link" />链接</div></Dropdown>
        ]}
      >
        <Meta
          avatar={<Avatar src={this.props.avatar} />}
          title={this.props.name}
          description={this.props.description}
        />
      </Card>
    )
    }
}
