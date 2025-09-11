import React from 'react'
import { Form, Button, Input, Row, Col,Cascader } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const eventsQuery = ({ dispatch, form }) => {
	
	const { getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue, } = form

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  	}
		  	let IP = ''
			let Appname = ''  
		  	let data = {
				...getFieldsValue(),
		  	}
			  console.log(data)
		  	if(data.nodeAlias !== ''){
				IP = data.nodeAlias
		  	}
			if(data.n_Appname && data.n_Appname !== ''&& data.n_Appname.length>0){
				Appname = data.n_Appname[1]
			}
		  	dispatch({
		  		type: 'performance/querysysEvent',
		  		payload:{
					IP: IP,
					Appname:Appname
		  		}
		  	})
		})
	}
  let  options = [
	{
	  label: '分行云服务域',
	  value: '分行云服务域',
	  key: '分行云服务域',
	  children: [
		{ label: '网络|分行云服务域', value: '网络|分行云服务域', key: '网络|分行云服务域' },
		{ label: '网络|分行云中间业务DMZ区', value: '网络|分行云中间业务DMZ区', key: '网络|分行云中间业务DMZ区', },
	  ],
	}, {
	  label: '互联网服务域',
	  value: '互联网服务域',
	  key: '互联网服务域',
	  children: [
		{ label: '网络|互联网服务域邮件接入区', value: '网络|互联网服务域邮件接入区', key: '网络|互联网服务域邮件接入区' },
		{ label: '网络|互联网服务域互联网DMZ区', value: '网络|互联网服务域互联网DMZ区', key: '网络|互联网服务域互联网DMZ区' },
		{ label: '网络|互联网服务域公众服务区', value: '网络|互联网服务域公众服务区', key: '网络|互联网服务域公众服务区' },
		{ label: '网络|互联网服务域办公DMZ区', value: '网络|互联网服务域办公DMZ区', key: '网络|互联网服务域办公DMZ区' },
	  ],
	}, {
	  label: '办公服务域',
	  value: '办公服务域',
	  key: '办公服务域',
	  children: [
		{ label: '网络|办公服务域城域网接入区', value: '网络|办公服务域城域网接入区', key: '网络|办公服务域城域网接入区' },
		{ label: '网络|办公服务域办公服务器区', value: '网络|办公服务域办公服务器区', key: '网络|办公服务域办公服务器区' },
	  ],
	}, {
	  label: '核心交换域',
	  value: '核心交换域',
	  key: '核心交换域',
	  children: [
		{ label: '网络|核心交换域光传输区', value: '网络|核心交换域光传输区', key: '网络|核心交换域光传输区' },
		{ label: '网络|核心交换域核心交换区', value: '网络|核心交换域核心交换区', key: '网络|核心交换域核心交换区' },
		{ label: '网络|核心交换域数据中心互联区', value: '网络|核心交换域数据中心互联区', key: '网络|核心交换域数据中心互联区' },
	  ],
	}, {
	  label: '生产服务域',
	  value: '生产服务域',
	  key: '生产服务域',
	  children: [
		{ label: '网络|生产服务域生产A区', value: '网络|生产服务域生产A区', key: '网络|生产服务域生产A区' },
		{ label: '网络|生产服务域生产B区', value: '网络|生产服务域生产B区', key: '网络|生产服务域生产B区' },
	  ],
	}, {
	  label: '开发测试域',
	  value: '开发测试域',
	  key: '开发测试域',
	  children: [
		{ label: '网络|开发测试域', value: '网络|开发测试域', key: '网络|开发测试域' },
		{ label: '网络|开发测试域投产准备区', value: '网络|开发测试域投产准备区', key: '网络|开发测试域投产准备区' },
	  ],
	}, {
	  label: '容器云服务域',
	  value: '容器云服务域',
	  key: '容器云服务域',
	  children: [
		{ label: '网络|容器云服务域', value: '网络|容器云服务域', key: '网络|容器云服务域' },
	  ],
	}, {
	  label: '海外分行域',
	  value: '海外分行域',
	  key: '海外分行域',
	  children: [
		{ label: '网络|海外分行域海外接入区', value: '网络|海外分行域海外接入区', key: '网络|海外分行域海外接入区' },
		{ label: '网络|海外分行域海外服务器区', value: '网络|海外分行域海外服务器区', key: '网络|海外分行域海外服务器区' },
	  ],
	}, {
	  label: '业务服务域',
	  value: '业务服务域',
	  key: '业务服务域',
	  children: [
		{ label: '网络|业务服务域', value: '网络|业务服务域', key: '网络|业务服务域' },
	  ],
	}, {
	  label: '第三方服务域',
	  value: '第三方服务域',
	  key: '第三方服务域',
	  children: [
		{ label: '网络|第三方服务域中间业务区', value: '网络|第三方服务域中间业务区', key: '网络|第三方服务域中间业务区' },
		{ label: '网络|第三方服务域集团接入区', value: '网络|第三方服务域集团接入区', key: '网络|第三方服务域集团接入区' },
	  ],
	}, {
	  label: '数据域',
	  value: '数据域',
	  key: '数据域',
	  children: [
		{ label: '网络|数据域专属备份区', value: '网络|数据域专属备份区', key: '网络|数据域专属备份区' },
		{ label: '网络|数据域大数据区', value: '网络|数据域大数据区', key: '网络|数据域大数据区' },
		{ label: '网络|数据域专属存储区', value: '网络|数据域专属存储区', key: '网络|数据域专属存储区' },
		{ label: '网络|数据域专属分布式存储区', value: '网络|数据域专属分布式存储区', key: '网络|数据域专属分布式存储区' },
	  ],
	},
	{
	  label: 'IT管理域',
	  value: 'IT管理域',
	  key: 'IT管理域',
	  children: [
		{ label: '网络|IT管理域', value: '网络|IT管理域', key: '网络|IT管理域' },
	  ],
	},
	{
	  label: '骨干网络域',
	  value: '骨干网络域',
	  key: '骨干网络域',
	  children: [
		{ label: '网络|骨干网络域', value: '网络|骨干网络域', key: '网络|骨干网络域' },
	  ],
	},
	{
	  label: '总行云服务域',
	  value: '总行云服务域',
	  key: '总行云服务域',
	  children: [
		{ label: '网络|总行云服务域', value: '网络|总行云服务域', key: '网络|总行云服务域' },
	  ],
	}, {
	  label: '总行办公网',
	  value: '总行办公网',
	  key: '总行办公网',
	  children: [
		{ label: '总行办公网', value: '总行办公网', key: '总行办公网' },
	  ],
	},
	{
	  label: '未纳入14域管理的区域',
	  value: '未纳入14域管理的区域',
	  key: '未纳入14域管理的区域',
	  children: [
		{ label: '网络|天津后台中心', value: '网络|天津后台中心', key: '网络|天津后台中心' },
		{ label: '网络|武汉客户满意中心', value: '网络|武汉客户满意中心', key: '网络|武汉客户满意中心' },
		{ label: '网络|武汉灾备中心', value: '网络|武汉灾备中心', key: '网络|武汉灾备中心' },
		{ label: '网络流量采集系统（NTC-GM）', value: '网络流量采集系统（NTC-GM）', key: '网络流量采集系统（NTC-GM）' },
		{ label: '信用卡中心-网络|信用卡中心网络', value: '信用卡中心-网络|信用卡中心网络', key: '信用卡中心-网络|信用卡中心网络' },
		{ label: '理财子公司-理财子公司青岛办公网', value: '理财子公司-理财子公司青岛办公网', key: '理财子公司-理财子公司青岛办公网' },
		{ label: '网络|网银武汉异地接入区', value: '网络|网银武汉异地接入区', key: '网络|网银武汉异地接入区' },
	  ],
	}
  ]
	return (
  <Form layout="horizontal">
    <div style={{ marginTop: '10px' }}>
      <Row>
        <Col xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xm={{ span: 5 }}>
          <FormItem label="IP" key= "nodeAlias" hasFeedback {...formItemLayout}>
            {getFieldDecorator('nodeAlias', {
							initialValue: '',
						})(<Input/>)}
          </FormItem>
        </Col>
		<Col xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 5 }} xm={{ span: 5 }}>
          <FormItem label="网络域" key="n_Appname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('n_Appname', {
							initialValue: '',
						})(<Cascader options={options} expandTrigger ='hover' />)}
          </FormItem>
        </Col>
        <Col xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
	        <span style={{ float: 'left', marginTop: '4px', marginLeft: '10px' }}>
	          <Button htmlType="submit" onClick={onOk}>查询</Button>
	        </span>
	      </Col>
      </Row>
    </div>
  </Form>
	)
}

export default Form.create()(eventsQuery)
