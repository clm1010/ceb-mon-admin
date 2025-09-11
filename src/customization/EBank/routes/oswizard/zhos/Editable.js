import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Select } from 'antd';
import _columns from '../Columns'

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'select') {
      return <Select width='100%'>
        <Option value="OS_AIX">OS_AIX</Option>
        <Option value="OS_LINUX">OS_LINUX</Option>
        <Option value="OS_HP_UX">OS_HP_UX</Option>
        <Option value="OS_K_UX">OS_K_UX</Option>
        <Option value="OS_KIRIN">OS_KIRIN</Option>
        <Option value="OS_WINDOWS">OS_WINDOWS</Option>
        <Option value="OTHER">OTHER</Option>
      </Select>;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data, editingKey: '', currentStep: props.currentStep, dispatch: props.dispatch };
    this.columns = [..._columns]
  }

  componentWillReceiveProps(props) {
    this.state.currentStep = props.currentStep
    this.state.data = props.data
  }

  componentDidMount() {
    this.state.currentStep
    if (this.state.currentStep == 1) {
      this.columns.push({
        title: 'operation',
        dataIndex: 'operation',
        width:100,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.editingKey)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.editingKey)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.editingKey)}>
                编辑
            </a>
            );
        },
      })
      this.setState({ columns: this.columns })
    }
  }
  isEditing = record => record.editingKey === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.editingKey);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
      this.state.dispatch({
        type: 'oswizard/updateState',
        payload: {
          addMo: newData
        }
      })
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'secondClass' ? 'select' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    console.log('render_data:', this.state.data)
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          scroll={{ y: 600 }}
          pagination={false}
          rowKey={record => record.editingKey}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable