import { Tabs, Table } from 'antd';
import React from 'react'
const { TabPane } = Tabs;
class NestedTable extends React.Component {
  state = {
    activeKey: '',
    selectedRowKeys: [],
  };
  constructor(props) {
    super(props);
    if (props.panes && props.panes.length > 0) this.state.activeKey = props.panes[0].key
    if (props.dbinfos && Object.keys(props.dbinfos).length > 0)
      this.state.selectedRowKeys = props.dbinfos[props.panes[0].key].selectedRowKeys
  };
  componentWillReceiveProps(props) {
    if (props.panes && props.panes.length > 0) this.state.activeKey = props.panes[0].key
    if (props.dbinfos && Object.keys(props.dbinfos).length > 0)
      this.state.selectedRowKeys = props.dbinfos[props.panes[0].key].selectedRowKeys
  };
  
  onChange = activeKey => {
    this.setState({ activeKey });
    const { dbinfos } = this.props;
    const selectedRowKeys = dbinfos[activeKey].selectedRowKeys
    this.setState({ selectedRowKeys })
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { activeKey } = this.state;
    const { dbinfos, dispatch } = this.props;
    dbinfos[activeKey].selectedRowKeys = selectedRowKeys
    dbinfos[activeKey].selectedRows = selectedRows
    this.setState({ 
      selectedRowKeys, 
      activeKey: selectedRows.length>0? selectedRows[0].typ : this.state.activeKey
     });
    dispatch({
      type: 'dbwizard/updateDbinfos',				//@@@
      payload: {
        dbinfos: dbinfos,
      },
    })
  };
  render() {
    const { selectedRowKeys } = this.state;
    let { panes } = this.props;
    if (panes === undefined) { panes = [] }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div >
        <Tabs type="card"
          style={{ border: '1px dash black' }}
          tabPosition={'left'}
          onChange={this.onChange}
          activeKey={this.state.activeKey}
        >
          {panes.map(pane => (
            <TabPane tab={<span>{pane.title}</span>} key={pane.key}>
              {<Table rowSelection={rowSelection} columns={pane.columns} dataSource={pane.dataSrc} pagination={false} scroll={{ y: 180 }} />}
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
export default NestedTable