import React from 'react';
import Cron from './index';

class Page extends React.Component {
  render() {
    return <Cron value="* * * * * ? *" onOk={(value) => {console.log('cron:', value);}} />;
  }
}
