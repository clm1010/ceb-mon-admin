import React from "react"
import { Table, PageHeader, Tag, Rate } from 'antd'
import style from './DetailModal.css'

class KnowledgeItem extends React.Component {
    constructor(props) {
        super(props)
        this.state.title = this.props.title
        this.state.size = this.props.size
        this.state.bordered = this.props.bordered
        this.state.item = this.props.item
    }

    componentWillReceiveProps(nextProps) {
        this.state.title = this.props.title
        this.state.size = this.props.size
        this.state.bordered = this.props.bordered
        this.state.item = this.props.item
    }

    state = {
        title: {},  //标题
        size: '',	//描述大小   在bordere为true时起作用
        bordered: false,//边框可见性
        item: []//JSON对象数组   
    }

    render() {
        const columns = [
            {
                title: '',
                dataIndex: 'content',
                key: 'content',
                render: (text, record, index) => {
                    return <div style={{
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: '#eb2f96',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        opacity: record.score
                    }}>{`方案${index + 1}`}</div>
                },
                width: "10%"
            },
            {
                title: '方案',
                dataIndex: 'content',
                key: 'content',
                width: '75%',
                render: (text, record, index) => {
                    let steps, plan, cause
                    if (text.includes("[诊断步骤]")) {
                        if (text.includes("[处置方案]")) {
                            steps = text.match(/\[诊断步骤\]:(.*)\[处置方案\]/)[1]
                        } else if (text.includes("[故障原因]")) {
                            steps = text.match(/\[诊断步骤\]:(.*)\[故障原因\]/)[1]
                        } else {
                            steps = text.match(/\[诊断步骤\]:(.*)/)[1]
                        }
                    }
                    if (text.includes("[处置方案]")) {
                        if (text.includes("[故障原因]")) {
                            plan = text.match(/\[处置方案\]:(.*)\[故障原因\]/)[1]
                        } else {
                            plan = text.match(/\[处置方案\]:(.*)/)[1]
                        }
                    }
                    if (text.includes("[故障原因]")) {
                        cause = text.match(/\[故障原因\]:(.*)/)[1]
                    }
                    return (
                        <div style={{ textAlign: "left" }}>
                            {
                                (text && !steps && !plan && !cause) ? <div className={style.nowledgeSty}> <span>{text}</span></div>
                                    :
                                    <div>
                                        <div className={style.nowledgeSty}><Tag color='green'>[诊断步骤]</Tag><span>{steps}</span></div>
                                        <div className={style.nowledgeSty}><Tag color='green'>[处置方案]</Tag><span>{plan}</span></div>
                                        <div className={style.nowledgeSty}><Tag color='green'>[故障原因]</Tag><span>{cause}</span></div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '置信值',
                dataIndex: 'score',
                key: 'score',
                width: "15%",
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.score - b.score,
                render: (text, record) => {
                    let a = parseInt((text * 2.5).toFixed(1).split('.')[1])
                    let b = parseInt((text * 2.5).toFixed(1).split('.')[0])
                    let value = a > 5 ? b + 1 : b + 0.5
                    return (
                        <div>
                            <Rate allowHalf disabled defaultValue={value} style={{ fontSize: 15 }} />
                            <Tag color='green'>{text}</Tag>
                        </div>
                    )
                }
            },
        ];
        return (
            <div>
                <PageHeader
                    ghost={false}
                    title={this.state.title}
                ></PageHeader>
                <Table
                    columns={columns}
                    dataSource={this.state.item}
                    bordered={this.state.bordered}
                    simple
                    rowKey={record => record.uuid}
                    size="small"
                    pagination={false}
                />
            </div>

        )
    }
}

export default KnowledgeItem