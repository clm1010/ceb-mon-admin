import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { config } from '../../utils'
import BranchNameInfo from '../../utils/fenhang'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select, Radio, Checkbox, InputNumber, Upload, message, notification } from 'antd'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const { objectsMO, exportExcelURL } = config.api

const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
}
const formItemLayoutdate = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
}


const MoFilter = ({
	dispatch,
	location,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
    filterSchema = [],
	expand,
	expandName,
	queryPath,
	moImportFileList,
	showUploadList,
	user, //用户信息
	//schema,

}) => {
	const getStringTypeValue = (key, val, objmap) => {
	  let result = `${key}=='*${val}*';`
	  if (objmap && objmap.size > 0) {
		  let bean = objmap.get(key)

		  if (bean && bean.showType && bean.showType === 'select') {
			  if (bean.dataType && bean.dataType === 'boolean') {
				  if (val === 'true') {
					  result = `${key}==true;`
				  } else {
					  result = `${key}==false;`
				  }
			  } else {
				 result = `${key}=='${val}';`
			  }
		  }
	  }
	  return result
  }

  const query = () => {
  	const data = {
		...getFieldsValue(),
	}
	const fields = [...filterSchema]
	let myMap = new Map()
	if (fields && fields.length > 0) {
		fields.forEach((bean, index) => {
			myMap.set(bean.key, bean)
		})
	}
  	let q = ''
  	for (let [key, value] of Object.entries(data)) {
		  switch (typeof (value)) {
		  	case 'number':
		  		q += `${key}==${value};`
		  		break
		  	case 'float':
		  		q += `${key}==${value};`
		  		break
		  	case 'string':
			    if (value && value.length > 0) {
					q += getStringTypeValue(key, value, myMap)
				}
				break
		  	case 'object':
		  		if (value.length === 2) {
		  			q += `${key}>=${Date.parse(value[0])};`
		  			q += `${key}<=${Date.parse(value[1])};`
		  		}
		  }
		}

		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		onSearch(q)
   }

   const onSearch = (q) => {
		const { search, pathname } = location
		const query = queryString.parse(search);
	  dispatch(routerRedux.push({
			 pathname,
			 search:search,
	      query: {
	      	...query,
	        page: 0,
	        q,
	      },
	   }))
   }

  const handleReset = () => {
    resetFields()
  }


  const toggle = () => {
		dispatch({
			type: `${queryPath}`,
			payload: {
				[expandName]: !expand,
			},
		})
  }


 const parse = (schema) => {
  	const children = []

  	for (let i = 0; i < schema.length; i++) {
  		switch (schema[i].showType) {
  			case 'select':
          children.push(transformSelect(schema[i], i))
          break
        case 'checkbox':
          children.push(transformCheckbox(schema[i], i))
          break
        case 'radio':
          children.push(transformRadio(schema[i], i))
          break
        case 'multiSelect':
          children.push(transformMultiSelect(schema[i], i))
          break
        case 'cascader':
          children.push(transformCascader(schema[i], i))
          break
        case 'between':
          children.push(transformBetween(schema[i], i))
          break
        default:
          children.push(transformNormal(schema[i], i))
  		}
  	}

		return children
  }

  const transformMultiSelect = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
    return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear="true" mode="multiple" placeholder={field.placeholder || '请选择'}>{options}</Select>)}
                                                                               </FormItem>
            </Col>)
  }

  const transformSelect = (field, key) => {
		const options = []
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
		return (<div key={`div_${key}`} style={{ position: 'relative', paddingLeft: '0px', paddingRight: '0px' }} id={`div_area_${key}`}><Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear="true" showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.getElementById(`div_area_${key}`)}>{options}</Select>)}
</FormItem>
</Col>
          </div>)
  }

const mySearchInfo = (input, option) => {
	return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
}

  const transformRadio = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
    })
    return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
                                                                               </FormItem>
            </Col>)
  }

  const transformCheckbox = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push({ label: option.value, value: option.key })
    })

    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
  }

  const transformNormal = (field, key) => {
		switch (field.dataType) {
			case 'int':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'float':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'datetime':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>


			default:
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}

   const transformCascader = (field, key) => {
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
  }

  const transformBetween = (field, key) => {
		switch (field.dataType) {
			case 'datetime':
				return (<div key={`date_time_${key}`}
  style={{
 position: 'relative', paddingLeft: '0px', paddingRight: '0px', right: '0px',
}}
  id={`date_time_area_${key}`}
				><Col xl={{ span: 15 }} md={{ span: 15 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayoutdate} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}</FormItem></Col>
            </div>)
		}
	}

	//const { expand, schema } = this.state
	//const { getFieldDecorator } = this.props.form

	const children = parse(filterSchema)
	const count = children.length
	const shownCount = expand ? count : 3


	const mybeforeUpload = (file) => {
		return new Promise(
			function (resolve, reject) {
				confirm({
					title: '注意',
					content: `导入可能覆盖某些数据，确定导入${file.name}吗？`,
					okText: '是',
					cancelText: '否',
					onOk: () => {
						if (file.name && (file.name.endsWith('xls') || file.name.endsWith('xlsx'))) {
							resolve()
						} else {
							message.error('You can only upload excel file!');
							reject()
						}
					},
					onCancel: () => {
						reject()
					}
				})
			})
	}

	const onStart = (file) => {
	}

	const myonSuccess = (ret, file) => {
		//message.success(`file uploaded successfully :${result}`,10)
		dispatch({
			type: `${queryPath}`,
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: ret,
				moImportResultType: 'success',
			},
		})
    		//return true
  	}

	const onProgress = (step, file) => {
	}

	const onError = (err, result, file) => {
		dispatch({
			type: `${queryPath}`,
			payload: {
				moImportFileList,
				showUploadList: false,
				moImportResultVisible: true,
				moImportResultdataSource: [],
				moImportResultType: 'fail',
			},
		})
      }

	const myonchange = (info) => {
		let { fileList } = info
		if (info.file.status === 'uploading') {

		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`)
		}
		if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
		dispatch({
			type: `${queryPath}`,
			payload: {
				moImportFileList: fileList,
			},
		})
	}

	const toshowupload = () => {
		dispatch({
			type: `${queryPath}`,
			payload: {
				showUploadList: true,
			},
		})
	  }

	const uploadprops = {
		action: `${objectsMO}import`,
		supportServerRender: true,
		showUploadList,
		data: {
			branchName: ((user && user.branch) ? user.branch : ''),
		},
		beforeUpload: mybeforeUpload,
		fileList: moImportFileList,
		//onStart: onStart,
		onChange: myonchange,
		onSuccess: myonSuccess,
		//onProgress: onProgress,
		onError,

	}

	const exportExcelInfo = () => {
		//window.open(objectsMO + 'export?branchname=' + ((user && user.branch) ? user.branch : ""), "_parent");
		//return objectsMO + 'export'
		let branchcode = ((user && user.branch) ? user.branch : '')
		let branchmap = new Map()
		if (BranchNameInfo && BranchNameInfo.length > 0) {
				BranchNameInfo.forEach((obj, index) => {
					branchmap.set(obj.key, obj.value)
				})
		}
		let branchname = branchmap.get(branchcode)
		if (branchname === '' || !branchname) {
			branchname = '全行'
		}
		//message.success(`file uploaded successfully :${branchname}`,10)

		window.open(`${exportExcelURL}/static2/excel/${branchname}-监控对象模板.xlsx`, '_parent')
  	}


	return (
  <Form className="filter-form">
    <Row gutter={4}>
      {children.slice(0, shownCount)}
    </Row>
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        {(count > 3 ?
          <a style={{
 width: 40, height: 28, lineHeight: '28px', marginLeft: 8, fontSize: 12, float: 'right',
}}
            onClick={toggle}
          >
            {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
          </a>
					 : null)}

        <Button style={{
 width: 60, height: 28, float: 'right', marginLeft: 8,
}}
          onClick={handleReset}
        >清空
        </Button>
        <Button style={{
 width: 128, height: 28, float: 'right', marginLeft: 8,
}}
          onClick={exportExcelInfo}
        >
          <Icon type="download" />	下载导入模板
          {/*<a href = "http://localhost:8080/api/v1/mos/export"  download><Icon type="download" />	下载导入模板</a>*/}
        </Button>
        <span style={{
 width: 78, height: 28, float: 'right', marginLeft: 8,
}}
        >
          <Upload {...uploadprops}>
            <Button onClick={toshowupload}>
              <Icon type="upload" /> 导入
            </Button>
          </Upload>
        </span>


        <Button style={{
 width: 60, height: 28, float: 'right', marginLeft: 8,
}}
          htmlType="submit"
          onClick={query}
        >查询
        </Button>
      </Col>
    </Row>
  </Form>
		)
}

MoFilter.propTypes = {
  form: PropTypes.object.isRequired,
  expand: PropTypes.bool,
}

export default Form.create()(MoFilter)
