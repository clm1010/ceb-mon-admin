import React from 'react'
import { Form, Button, Select, Row, Col, Alert } from 'antd'
import { onSearchInfo, genDictOptsByName } from '../../../../../utils/FunctionTool'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const filterForm = ({
 dispatch, form, org, deviceType, vendor, firstSecArea, discoveryIP,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue,
} = form

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  	}
		  	let data = {
				...getFieldsValue(),
		  	}
		  	let q = 'firstClass==NETWORK;thirdClass==null'
		  	if (data.deviceType) {
		  		if (data.deviceType.length > 0) {
			  		q = `${q};secondClass==${data.deviceType}`
			  	}
		  	}
		  	if (data.discoveryIP) {
		  		if (data.discoveryIP.length > 0) {
			  		q = `${q};discoveryIP==${data.discoveryIP}`
			  	}
		  	}
		  	if (data.firstSecArea) {
		  		if (data.firstSecArea.length > 0) {
			  		q = `${q};firstSecArea==${data.firstSecArea}`
			  	}
		  	}
		  	if (data.org) {
		  		if (data.org.length > 0) {
			  		q = `${q};branchName==${data.org}`
			  	}
		  	}
		  	if (data.vendor) {
		  		if (data.vendor.length > 0) {
			  		q = `${q};vendor==${data.vendor}`
			  	}
		  	}
		  	dispatch({
		  		type: 'interfaces/querySuccess',
		  		payload: {
		  			tableState: true,
		  			currentItem: {},
		  			InterfaceNum: 0,
		  		},
			})
		  	dispatch({
		  		type: 'interfaces/query',
		  		payload: {
		  			q,
		  		},
		  	})
		})
	}

	const onCancel = () => {
		resetFields()
	}

	const orgOnSelect = (value) => {
		resetFields(['firstSecArea'])
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				firstSecArea: '',
			},
		})
		if (value) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					org: value,
				},
			})
		} else if (value === undefined) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					org: '',
				},
			})
		}
	}

	const vendorOnSelect = (value) => {
		if (value) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					vendor: value,
				},
			})
		} else if (value === undefined) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					vendor: '',
				},
			})
		}
	}

	const deviceTypeOnSelect = (value) => {
		if (value) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					deviceType: value,
				},
			})
		} else if (value === undefined) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					deviceType: '',
				},
			})
		}
	}

	const firstSecAreaOnSelect = (value) => {
		if (value) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					firstSecArea: value,
				},
			})
		} else if (value === undefined) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					firstSecArea: '',
				},
			})
		}
	}

	const discoveryIPOnSelect = (value) => {
		if (value) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					discoveryIP: value,
				},
			})
		} else if (value === undefined || value === '') {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					discoveryIP: '',
				},
			})
		}
	}
	let infos = (org === '' ? '' : `检索设备的分行属性为：${org}, `) + (deviceType === '' ? '' : `设备类型为：${deviceType}, `) + (vendor === '' ? '' : `设备厂商为：${vendor}, `) + (firstSecArea === '' ? '' : `设备第一安全域为：${firstSecArea}, `) + (discoveryIP === '' ? '' : `设备IP为：${discoveryIP}`)
	if (infos === '') {
		infos = '请输入搜索条件'
	}
	let options = []
	if (org === 'ZH') {
		options = [
      genDictOptsByName('firstSecAreaZH'),

		]
	} else if (org != 'ZH') {
		options = [
      genDictOptsByName('firstSecAreaFH'),

		]
	}
	return (
  <Form layout="horizontal">
    <Row>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xm={{ span: 24 }}>
        <Alert
          message="条件组合提示"
          description={infos}
          type="info"
          showIcon
        />
      </Col>
    </Row>
    <div style={{ marginTop: '10px' }}>
      <Row>
        <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xm={{ span: 8 }}>
          <FormItem label="所属机构" key="org" hasFeedback {...formItemLayout}>
            {getFieldDecorator('org', {
							initialValue: [],
						})(<Select allowClear showSearch filterOption={onSearchInfo} placeholder="请选择" onChange={orgOnSelect}>
  {genDictOptsByName('branch')}
</Select>)}
          </FormItem>
        </Col>
        <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xm={{ span: 8 }}>
          <FormItem label="设备类型" key="deviceType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('deviceType', {
							initialValue: [],
						})(<Select allowClear showSearch filterOption={onSearchInfo} placeholder="请选择" onChange={deviceTypeOnSelect}>
              {/*{genDictOptsByName('equipType')}*/}
              <Option key="ROUTER" value="ROUTER" name="路由器">路由器</Option>
              <Option key="SWITCH" value="SWITCH" name="交换机">交换机</Option>
              <Option key="FIREWALL" value="FIREWALL" name="防火墙">防火墙</Option>
              <Option key="F5" value="F5" name="负载均衡">负载均衡</Option>
         </Select>)}
          </FormItem>
        </Col>
        <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xm={{ span: 8 }}>
          <FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
							initialValue: [],
						})(<Select allowClear showSearch filterOption={onSearchInfo} placeholder="请选择" onChange={vendorOnSelect}>
              {/*{genDictOptsByName('vendor')}*/}
                <Option key="CISCO" value="CISCO" name="思科">思科</Option>
                <Option key="H3C" value="H3C" name="华为">华为</Option>
                <Option key="RUIJIE" value="RUIJIE" name="锐捷">锐捷</Option>
                <Option key="MP" value="MP" name="MP">MP</Option>
                <Option key="OTHER" value="OTHER" name="OTHER">其他</Option>
              </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xm={{ span: 8 }}>
          <FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstSecArea', {
							initialValue: [],
						})(<Select allowClear showSearch filterOption={onSearchInfo} placeholder="请选择" onChange={firstSecAreaOnSelect}>
  {options}
</Select>)}
          </FormItem>
        </Col>
        <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xm={{ span: 8 }}>
          <FormItem label="设备IP" key="discoveryIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discoveryIP', {
							initialValue: '',
						})(<Select placeholder="*IP*模糊匹配,不使用 * 精确查询" mode='combobox' showSearch notFoundContent={null} showArrow={false} onChange={discoveryIPOnSelect} />)}
          </FormItem>
        </Col>
      </Row>
    </div>
    <Row>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <span style={{ float: 'right' }}>
          <Button htmlType="submit" onClick={onOk}>查询</Button>
        </span>
      </Col>
    </Row>
  </Form>
	)
}

export default Form.create()(filterForm)
