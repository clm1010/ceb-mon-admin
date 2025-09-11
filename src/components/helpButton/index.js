import React from 'react'
import { Tooltip, Drawer, Icon, Divider   } from 'antd'
import styles from'./index.less'
import DomSelector from '../../utils/domparser'

class helpButton extends React.Component {
  state = { 
    visible: false,
    title:'帮助',
    tag:'',
    html:'帮助内容'
  };

  constructor(props) {
    super(props);
    //this.state.title = props.title;
    //this.state.tag = props.tag;
    //this.getTaginfo(this.state.tag);
  }

  componentDidMount() {
    this.state.title = this.props.title;
    this.state.tag = this.props.tag;
    this.getTaginfo(this.state.tag);
  }

  componentWillReceiveProps(props) {
    this.state.title = props.title;
    this.state.tag = props.tag;
    this.getTaginfo(this.state.tag);
  }

  getTaginfo = (tag) =>{
    let rootNode = DomSelector(window.helpdoc,`id="${tag}"`);
    //let helpDetail = rootNode.getElementById(tag);
    this.setState({
      html: rootNode,
    });
  };

	onShowHelp = () => {
    window.open(`${window.location.origin}/helpdoc/configurationHelp.html`, '配置帮助', '', 'false')
	};

  onShowDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
	  return (
    <div>
	      <Tooltip title="寻求帮助">
            <div className={styles.bottom_btns}  onClick={this.onShowDrawer}></div>
        </Tooltip>
        <Drawer
          title={null}/* {this.state.title} */
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <div className={styles.layout}>
        <div className={styles.content}>
          {<div dangerouslySetInnerHTML={{__html:this.state.html}}></div>}
        </div>
        {/* <iframe
        title="resg"
        srcDoc={data}
        style={{ width: '100%', border: '0px', height: '100%' }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        scrolling="auto"
      /> */}
      
      <div>
      <Divider type="horizontal"/>

        <a href={`${window.location.origin}/helpdoc/configurationHelp.html#examples`} target='_blank'><Icon type="bars"/>&nbsp;例子</a>
        <Divider type="vertical"/>
        <a href={`${window.location.origin}/helpdoc/configurationHelp.html#${this.state.tag}`} target='_blank'><Icon type="home" />&nbsp;帮助</a>
      </div>
	</div>
          
        </Drawer>
    </div>
    );
  }
}

export default helpButton;
