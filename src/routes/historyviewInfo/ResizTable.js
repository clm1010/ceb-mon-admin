import React from 'react'
import { Button, Table } from 'antd';
import { Resizable } from 'react-resizable';
import './ResizTable.css'
import debounce from 'throttle-debounce/debounce'
const user = JSON.parse(sessionStorage.getItem('user'))

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class ResizTable extends React.Component {

  constructor(props) {
    super(props)
    const { dispatch, dataSource, columns, timeStamp, ...otherProps } = props
    this.state.dispatch = dispatch
    this.state.dataSource = dataSource
    this.state.columns = columns
    this.state.otherProps = otherProps
    this.state.timeStamp = timeStamp
  }

  static getDerivedStateFromProps(props, state) {
    const { dispatch, dataSource, columns, timeStamp, saveCulumFlag, ...otherProps } = props
    if (timeStamp != state.timeStamp && props.saveCulumFlag) {
      return {
        dispatch,
        dataSource,
        otherProps,
        timeStamp,
        columns,
        saveCulumFlag
      }
    }
    return null
  }

  state = {
    dataSource: [],
    otherProps: [],
    columns: [],
    timeStamp: 0,
    count: 0,
    saveCulumFlag: true
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };


  saveCoumsFun = () => {
    if (this.state.otherProps.ColumState) {
      let tempColums = [...this.state.columns]
      tempColums.splice(this.state.columns.length - 1)
      this.state.dispatch({
        type: 'historyview/setState',
        payload:{
          saveCulumFlag: false
        }
      })
      if (this.state.otherProps.initColumState == '') {
        this.state.dispatch({
          type: 'historyview/createDefindColums',
          payload: {
            user: user.username,
            viewInfo: JSON.stringify(tempColums),
            viewKey: 'historyview'
          }
        })
      } else {
        this.state.dispatch({
          type: 'historyview/saveDefindColums',
          payload: {
            user: user.username,
            viewInfo: JSON.stringify(tempColums),
            viewKey: 'historyview',
            uuid: this.state.otherProps.initColumState,
          }
        })
      }
    }
  }

  debounceFun = debounce(2000, this.saveCoumsFun)

  handleResize = index => (e, { size }) => {
    let saveColums
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      saveColums = nextColumns
      return { columns: nextColumns };
    });
    this.debounceFun() // 防抖函数 解决 多次请求的问题
  }

  render() {
    let totalWidth = 150
    const columns = this.state.columns.map((col, index) => {
      totalWidth += col.width ? col.width : 0
      return {
        ...col,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      }
    });

    return (
      <>
        <Table bordered
          components={this.components}
          columns={columns}
          dataSource={this.state.dataSource}
          scroll={{ y: 700, x: totalWidth }}
          {...this.state.otherProps} />
      </>
    )
  }
}

export default ResizTable