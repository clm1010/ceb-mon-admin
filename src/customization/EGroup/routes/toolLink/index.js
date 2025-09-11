import React from 'react'
import { connect } from 'dva'
import { Row, Col, Table } from 'antd'
import { Link } from 'dva/router'

const toolLink = ({
 location, dispatch, monitor, loading,
}) => {
    function openView (url, title) {
        let obj = window.open(url, title)
        obj.document.title = title
      }
    const columns = [
        {
          title: '分类',
          dataIndex: 'calssify',
          key: 'calssify',
          render: (text, row, index) => {
              const obj = {
                  children: text,
                  props: {},
              }
              if (index === 0) {
                    obj.props.rowSpan = 8
                } else if (index < 8) {
                    obj.props.rowSpan = 0
                } else if (index == 9 || index == 11) {
                    obj.props.rowSpan = 2
                } else if (index == 10 || index == 12) {
                    obj.props.rowSpan = 0
                }
              return obj
          },
        }, {
          title: '工具',
          dataIndex: 'tool',
          key: 'tool',
          render: (text, record, index) => {
              return <a onClick={() => openView(record.url, record.describe)}>{text}</a>
          },
        }, {
          title: '描述',
          dataIndex: 'describe',
          key: 'describe',
        }, /* {
          title: 'url',
          dataIndex: 'url',
          key: 'url',

        }, */{
            title: '只读用户',
            dataIndex: 'use',
            key: 'use',
        },
      ]

      const data = [{
        key: '1',
        calssify: '系统监控',
        tool: 'Nagios（10.1.37.238)',
        describe: '生产系统Windows服务器监控',
        url: 'http://10.1.37.238/nagios',
        use: 'monitor',

      }, {
        key: '2',
        calssify: '系统监控',
        tool: 'Nagios（10.1.37.92)',
        describe: '生产系统Linux、专用设备等服务器监控',
        url: 'http://10.1.37.92/nagios',
        use: 'monitor',

      }, {
        key: '3',
        calssify: '系统监控',
        tool: 'Nagios（10.1.71.66)',
        describe: '生产系统HPUX、AIX等服务器监控',
        url: 'http://10.1.71.66/nagios',
        use: 'monitor',

      }, {
        key: '4',
        calssify: '系统监控',
        tool: 'Nagios（10.1.71.155)',
        describe: '生产系统大数据区服务器监控',
        url: 'http://10.1.71.155/nagios',
        use: 'monitor',

      }, {
        key: '5',
        calssify: '系统监控',
        tool: 'Nagios（10.1.3.60）',
        describe: '生产系统互联网外联区服务器监控',
        url: 'http://10.1.3.60/nagios',
        use: 'monitor',

      }, {
        key: '6',
        calssify: '系统监控',
        tool: 'Nagios（10.1.97.8)',
        describe: '生产系统互联网服务域服务器监控',
        url: 'http://10.1.97.8/nagios',
        use: 'monitor',

      }, {
        key: '7',
       calssify: '系统监控',
        tool: 'Nagios（10.1.97.204)',
        describe: '生产系统互联网服务域服务器监控',
        url: 'http://10.1.97.204/nagios',
        use: 'monitor',

      }, {
        key: '8',
        calssify: '系统监控',
        tool: 'Nagios（10.225.7.146)',
        describe: '武汉灾备环境服务器监控',
        url: 'http://10.225.7.146/nagios',
        use: 'monitor',
      }, /* {
        key : '9',
        calssify: '网络监控',
        tool: '网络监控管理平台（10.1.71.82）',
        describe: '统一监控管理平台网络监控平台',
        url : '',
        use: '',
      }, */{
        key: '10',
        calssify: '网络监控',
        tool: 'Solarwinds',
        describe: '网络团队专用监控工具',
        url: 'http://10.1.35.5/Orion/Login.aspx?Username=monitor&Password=monitor',
        use: '',
      }, {
        key: '11',
        calssify: '数据库监控',
        tool: 'OMS 10',
        describe: 'Oracle 10g数据库专用监控工具',
        url: 'http://10.1.37.119:4889/em/console/logon/logon',
        use: 'monitor',
      }, {
        key: '12',
        calssify: '数据库监控',
        tool: 'OMS 12',
        describe: 'Oracle 11g及以上数据库专用监控工具',
        url: 'http://10.1.37.153:7788/em',
        use: 'monitor',
      }, {
        key: '13',
        calssify: '应用监控',
        tool: 'BPC',
        describe: '应用交易监控工具(请使用chrome浏览器)',
        url: 'http://10.1.71.71',
        use: 'monitor',
      }, {
        key: '14',
        calssify: '应用监控',
        tool: 'UPM',
        describe: '科来业务性能管理系统(请使用chrome浏览器）',
        url: 'https://10.1.71.28/',
        use: 'monitor',
      }, {
        key: '15',
        calssify: '性能展示',
        tool: 'HP Performance Management',
        describe: 'HPUX服务器性能图表工具',
        url: 'http://10.1.71.99:8081/OVPM',
        use: '',
      }, {
        key: '16',
        calssify: '日志采集',
        tool: '日志分析平台',
        describe: '服务器系统日志查看工具(请使用chrome浏览器)',
        url: 'http://10.1.71.92:84/#/login',
        use: 'loglogic',
      },
    ]
    return (
      <div className="content-inner">
        <Row gutter={24}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              bordered
              columns={columns}
              dataSource={data}
              simple
              pagination={false}
              rowKey={record => record.uuid}
              loading={loading}
              size="small"
            />
          </Col>
        </Row>
      </div>
    )
}
export default connect(({ toolLink, loading }) => ({ toolLink, loading: loading.models.toolLink }))(toolLink)
