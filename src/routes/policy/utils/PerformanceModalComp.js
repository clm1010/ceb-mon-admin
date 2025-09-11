import React from 'react'
import ReactEcharts from 'echarts-for-react'
import Echart from './chart'
import { Button, Row, Col, Select, Form, Tabs, Icon, Collapse, DatePicker, Input, Switch, Divider, message } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const TextArea = Input.TextArea
const RangePicker = DatePicker.RangePicker
const Panel = Collapse.Panel

const formItemLayout9 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 12,
	},
}

const formItemLayout10 = {
	labelCol: {
		span: 2,
	},
	wrapperCol: {
		span: 22,
	},
}

class PerformanceModalComp extends React.Component{

  constructor (props) {
    super(props);
	this.state.dispatch = props.dispatch;
	this.state.fileType = props.fileType;  
	
	this.state.advancedItem = props.advancedItem;  //公式
	if(!props.advancedItem.exprForFrontend && props.pane){
        this.state.advancedItem = props.pane.content
	}
	//this.state.content = props.content;  //Prometheus列表
	//this.state.yAais = props.performanceItem.yAais  //性能曲线结果
	//this.state.xyAais = props.performanceItem.xyAais  //性能曲线结果
	//this.state.option1 = props.performanceItem.option1  //性能曲线结果
	//this.state.legend = props.performanceItem.legend  //性能曲线结果
  };

  componentWillReceiveProps (props) {
	this.state.dispatch = props.dispatch;
	this.state.fileType = props.fileType;
	this.state.advancedItem = props.advancedItem;  //公式
	
  }

  state = {
	//flag,  //是否自定义
	selectValue:'1800',  //范围
	//content,  //Prometheus列表
	endtime:'',  //范围结束时间
	statrtime:'',  //起始时间
	flag:true,
  };

	onPreview = () => {	
		if (!this.state.advancedItem.expr||''===this.state.advancedItem.expr){
			message.error('公式内容为空，请先编辑。')
		} else{
			this.state.dispatch({
				type: `${this.state.fileType}/Formula`,
				payload: {
					formula: this.state.advancedItem.expr, 
					selectValue:this.state.selectValue,
					statrtime: this.state.statrtime,
					endtime: this.state.endtime,
					page: 0,
					q: `toolType=='PROMETHEUS';__distinct__==true`,
					sort:`name,asc`,
				},
			})
			this.setState({
				flag:false,
			});
			this.state.dispatch({
				type: `${this.state.fileType}/updateState`,
				payload: {
					showFlag:true
				}
			});
	
		}
	};

	onSure = () => {
		let Exprvalue = this.props.form.getFieldsValue(['expr'])
		let Prometheusuuid = this.props.form.getFieldsValue([`Prometheus`])
		//console.log(12345,Prometheusuuid)
		//console.log(this.props.performanceItem.content)
		let newArr = this.props.performanceItem.content? this.props.performanceItem.content.find(item => {
			return item.uuid === Prometheusuuid.Prometheus
		}) : ''
		//console.log(789,newArr)
		let promApiReq = {
			end: '',
			query: Exprvalue.expr,
			start: '',
			step: 60,
			timeout: 10
		}
		this.state.dispatch({
			type: `${this.state.fileType}/Perfdata`,
			payload: {
				promApiReq: promApiReq,
				tool: newArr,
				selectValue:this.state.selectValue,
				statrtime: this.state.statrtime,
			    endtime: this.state.endtime,
			},
		})
	}

	handleChange1 = (val) =>{
		let selectValue = val? val:1800
		//flag = ('1'===val)
		this.setState({
			selectValue,
			//flag
		})
	};

	lossOnOk = (dates) => {
		let statrtime =  moment(dates[0]).unix()
		let endtime = moment(dates[1]).unix()
		this.setState({
			statrtime: statrtime,
			endtime: endtime,
			//flag:true,
		});
	}

	toggle = () => {
		this.state.dispatch({
			type: `${this.state.fileType}/updateState`,
			payload: {
				showFlag:!this.props.performanceItem.showFlag
			}
		});
	  };

	render () {
		const {
			getFieldDecorator,
		} = this.props.form
	    const operations = (<div><Switch disabled={this.state.flag} checkedChildren="开" unCheckedChildren="关" onClick={this.toggle} checked={this.props.performanceItem.showFlag} />
		    <Divider type="vertical" />
	        <Button style={{ marginTop: 6 }} size="small" disabled={!this.props.isDS} onClick={this.onPreview}>预览数据</Button>
	        </div>)

	    const customPanelStyle = {
		    background: '#fff',
		    borderRadius: 4,
		    overflow: 'hidden',
		    border: 0,
	    };
    //Echart
    const echartProps = {
        title: '',
		tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.seriesName.split(',').join('<br/>')
        }},//tooltip
		toolbox: {},//toolbox
		dataZoom: [],//dataZoom
		subtext: '',
        legend: {},
		titleColor: '#D3D7DD',
		xAxis :[{ type : 'category', data : this.props.performanceItem.xyAais}],
		yAxis :[{ type : 'value'}],
		series : this.props.performanceItem.option1,
		//loading: loading.effects['policyTemplet/Perfdata']
    }
	    let Seroptions = []
	    this.props.performanceItem.content? this.props.performanceItem.content.forEach((option) => {
			Seroptions.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
			}):'';
	
	    return (<div>
            <Tabs activeKey={this.props.performanceItem.showFlag?"templet_4":""} size="small" type="line"  tabBarExtraContent={operations}>
		      <TabPane tab={<span><Icon type="user" />性能数据</span>} key="templet_4">
				<Row>
					<Row>
						<Col>
							<FormItem label="Prometheus: " hasFeedback {...formItemLayout9}>
								{getFieldDecorator(`Prometheus`, {
									initialValue: this.props.performanceItem.content && this.props.performanceItem.content.length > 0 ? this.props.performanceItem.content[0].uuid : '',
								})(<Select>
									{Seroptions}
								</Select>)}
							</FormItem>
						</Col>
					</Row>
					<Row /* style={{ marginTop: -25 }} */>
						<Col span={20} push={2}>
							{/* <Collapse defaultActiveKey='' bordered={false}> */}
								{/* <Panel header="表达式 :" key="1" style={customPanelStyle}>
									<Col span={24} > */}
										<FormItem label="表达式: " hasFeedback {...formItemLayout10}>
											{getFieldDecorator('expr', {
												initialValue: this.props.performanceItem.expr,
											})(<TextArea rows={3} />)}
										</FormItem>
									{/* </Col>
								</Panel> */}
							{/* </Collapse> */}
						</Col>
					</Row>
					<Row>
						<Row /* style={{ marginTop: 20 }} gutter={[0,0]} */>
							<Col span={4} /* push={2} */><span style={{ float: "right" }}>监控信息: &nbsp;&nbsp;</span></Col>

							<Col span={2} ></Col>
							<Col span={4} /* style={{ float: "right" }} */>范围:&nbsp;
								<Select id = "Select" style={{ width: 150 }} size="small" defaultValue='1800'  onChange={this.handleChange1}>
									<Select.Option key= "1800" value="1800">过去30分钟</Select.Option>
									<Select.Option key= "3600" value="3600">过去一小时</Select.Option>
									<Select.Option key= "10800" value="10800">过去6小时</Select.Option>
									<Select.Option key= "86400" value="86400">过去1天</Select.Option>
									<Select.Option key= "259200" value="259200">过去三天</Select.Option>
									<Select.Option key= "604800" value="604800">过去7天</Select.Option>
									<Select.Option key= "1" value="1">自定义</Select.Option>
								</Select>
							</Col>
							<Col span={10} /* style={{ float: "right"}} */ >
							
								{('1' !== this.state.selectValue)  ? '':<RangePicker onOk={this.lossOnOk} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" style={{ width: 260, marginLeft:-5 }} />}
							</Col>
							<Col span={4} /* pull={1} */ /* style={{ float: "right"}} */>
								<Button size="small" onClick={this.onSure}>确定</Button>
							</Col>
						</Row>
						<Row >
							<Col span={22} push={1} >
							    <Echart {...echartProps}/>
							</Col>
						</Row>
					</Row>
				</Row>
			  </TabPane>
		    </Tabs>
		</div>)
	}
}

export default PerformanceModalComp