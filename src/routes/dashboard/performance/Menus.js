import React from 'react'
import { Link } from 'dva/router'
import { Menu } from 'antd'
const { SubMenu } = Menu
class Menus extends React.Component {
  constructor(props) {
    super(props);
    this.current = this.props.current;
    this.dispatch = this.props.dispatch
    this.userbranch = this.props.userbranch;
    this.state = {
      current: this.current,
      userbranch: this.userbranch
    };
  }

  //	state = {
  //  		current: 'Home',
  //	}

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    this.props.dispatch({
      type: 'interfaces/querySuccess',
      payload: {
        currentItem: {},
        InterfaceNum: 0,
        org: '',
        deviceType: '',
        vendor: '',
        firstSecArea: '',
        discoveryIP: ''
      }
    })
  }
//<Menu.Item key='customMonitor'>
//                 <Link to='/dashboard/customMonitor'>网络闭环</Link>
//               </Menu.Item>
  render() {
    return (
      <div>
        {
          this.state.userbranch === 'ZH' || this.state.userbranch === undefined ?
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              theme={this.props.theme ? this.props.theme : 'light'}
            >
              <Menu.Item key="Home">
                <Link to="/dashboard/performance">主页</Link>
              </Menu.Item>
              {/*
			    		<Menu.Item key="Top 10">
			    			<Link to="/dashboard/top10">Top 10</Link>
			    		</Menu.Item>
			    		*/}
              <Menu.Item key="Events">
                <Link to="/dashboard/events">SYSLOG告警</Link>
              </Menu.Item>
              <Menu.Item key="Response">
                <Link to="/dashboard/Response">响应时间</Link>
              </Menu.Item>
              <Menu.Item key="Loss">
                <Link to="/dashboard/Loss">丢包率</Link>
              </Menu.Item>
              <Menu.Item key="CPU">
                <Link to="/dashboard/CPU">CPU利用率</Link>
              </Menu.Item>
              <Menu.Item key="Memory">
                <Link to="/dashboard/Memory">内存利用率</Link>
              </Menu.Item>
              <Menu.Item key="Discard_error">
                <Link to="/dashboard/Discard_error">丢包数和错包数</Link>
              </Menu.Item>
              <Menu.Item key="Interfaces">
                <Link to="/dashboard/interfaces">设备清单</Link>
              </Menu.Item>
              <Menu.Item key="notwork">
                <a href="/oelCust?q=Severity!=0 and N_RecoverType=1 and (N_MaintainStatus=1) and (N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3) and (N_ComponentType='网络')" target="_blank">网络域未恢复告警</a>
              </Menu.Item>
              {/* <Menu.Item key="ReportCenter">
                <a href="http://10.218.36.17/itumpsub/app/PB_ReportCenter.jsp" target="_blank">容量报表</a>
              </Menu.Item> */}
              <Menu.Item key="internetBank">
                <Link to="/monitorZH?4">实时监控</Link>
              </Menu.Item>
              <Menu.Item key ='delayed'>    
              		<Link to='/dashboard/netLine'>线路实时延时</Link>
              </Menu.Item>
              {/* <Menu.Item>
              	<a href='http://10.218.32.72/d/ZehaNldWk/wang-luo-xing-neng-shu-ju-zi-ding-yi-cha-xun?orgId=1' target="_blank">性能自定义查询</a>
              </Menu.Item> */}
              <Menu.Item key="bizarea">
              	<Link to='/dashboard/bizarea'>防火墙集中监控</Link>
              </Menu.Item>
              <Menu.Item key="f5Monitoring">
              	<Link to='/dashboard/f5Monitoring'>负载均衡集中监控</Link>
              </Menu.Item>
              <Menu.Item key="dataCenterTransaction">
              	<Link to='/dataCenterTransaction'>数据中心互联区</Link>
              </Menu.Item>
              <Menu.Item key="singleSSL">
              	<Link to='/dashboard/singleSSL'>单SSL</Link>
              </Menu.Item>
              <Menu.Item key="colonySSL">
              	<Link to='/colonySSL'>SSL集群</Link>
              </Menu.Item>
              <Menu.Item key="qps">
              	<Link to='/dashboard/qps'>QPS性能曲线</Link>
              </Menu.Item>
            </Menu>
            :
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              theme={this.props.theme ? this.props.theme : 'light'}
            >
              <Menu.Item key="Home">
                <Link to="/dashboard/performance">主页</Link>
              </Menu.Item>
              {/*
                <Menu.Item key="Top 10">
                  <Link to="/dashboard/top10">Top 10</Link>
                </Menu.Item>
                */}
              <Menu.Item key="Events">
                <Link to="/dashboard/events">SYSLOG告警</Link>
              </Menu.Item>
              <Menu.Item key="Response">
                <Link to="/dashboard/Response">响应时间</Link>
              </Menu.Item>
              <Menu.Item key="Loss">
                <Link to="/dashboard/Loss">丢包率</Link>
              </Menu.Item>
              <Menu.Item key="CPU">
                <Link to="/dashboard/CPU">CPU利用率</Link>
              </Menu.Item>
              <Menu.Item key="Memory">
                <Link to="/dashboard/Memory">内存利用率</Link>
              </Menu.Item>
              <Menu.Item key="Interfaces">
                <Link to="/dashboard/interfaces">设备清单</Link>
              </Menu.Item>
              <Menu.Item key="notwork">
                <a href="/oelCust?q=Severity!=0 and N_RecoverType=1 and (N_MaintainStatus=1) and (N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3) and (N_ComponentType='网络')" target="_blank">网络域未恢复告警</a>
              </Menu.Item>
              <Menu.Item key ='delayed'>    
              		<Link to='/dashboard/netLine'>线路实时延时</Link>
              </Menu.Item>
            </Menu>
        }

      </div>
    )
  }
};

export default Menus
