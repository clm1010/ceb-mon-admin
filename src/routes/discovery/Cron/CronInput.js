import React, { PureComponent } from 'react';
import { Dropdown, Input } from 'antd';
import Cron from './index';

class CronInput extends PureComponent {
  onOk = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { style, inputStyle, value, ...passThroughProps } = this.props;

    return (
      <Dropdown
        trigger={['click']}
        placement="bottomLeft"
        overlay={<Cron onOk={this.onOk} value={value} style={style} />}
      >
        <Input.Search value={value} style={inputStyle} {...passThroughProps} />
      </Dropdown>
    );
  }
}
export default CronInput;
