import { Typography } from 'antd'
const { Paragraph } = Typography
export default  [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: '分行',
    dataIndex: 'branchNameCn',
    key: 'branchNameCn',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: 'IP',
    dataIndex: 'discoveryIP',
    key: 'discoveryIP',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: '主机名',
    dataIndex: 'hostname',
    key: 'hostname',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  }
]
