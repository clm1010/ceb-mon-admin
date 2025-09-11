import { Typography } from 'antd'
const { Paragraph } = Typography
export default  [
  {
    title: '告警组',
    dataIndex: 'AlertGroup',
    key: 'AlertGroup',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: '发生时间',
    dataIndex: 'FirstOccurrence',
    key: 'FirstOccurrence',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: 'IP',
    dataIndex: 'NodeAlias',
    key: 'NodeAlias',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  },
  {
    title: '告警描述',
    dataIndex: 'N_SummaryCN',
    key: 'N_SummaryCN',
    render: (text, recode) => {
      return <Paragraph ellipsis>{text}</Paragraph>
    }
  }
]
