import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, TreeSelect, Radio, Checkbox, InputNumber, message } from 'antd'
import { getFilterUrlMap } from '../../utils/FunctionTool'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import queryString from "query-string";
import debounce from 'throttle-debounce/debounce'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
	style: { marginBottom: 4 },
}
const formItemLayoutdate = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}

class Filter extends React.Component {
	constructor(props) {
		super(props)
		//this.state.expand = props.expand
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMap(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的sql查询条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
		this.state.pathname = props.location !== undefined ? props.location.pathname : ''
		this.state.optionSelectAppName = props.optionSelectAppName
		this.state.modalName=props.modalName
	}

	componentWillReceiveProps(props) {
		//this.state.expand = props.expand
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMap(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
		this.state.pathname = props.location !== undefined ? props.location.pathname : ''
		this.state.optionSelectAppName = props.optionSelectAppName
		this.state.modalName=props.modalName
	}

	state = {
		expand: false,
		schema: [],
		fieldsObj: {},
		moTypeTree: {},
		buttonZone: {},
		optionSelectAppName:[],
		modalName:''
	}

	toggle = () => {
		this.setState({
			...this.state,
			expand: !this.state.expand,
		})
	}

	getStringTypeValue = (key, val, objmap) => {
		let result = `${key}=='*${val}*';`
		if (key === 'oz_AlarmID') {
			result = `${key}=cs='${val}';`
		}
		if(key == "tags"){
			result = `${key}=='${val}';`
		}
		if(key == "alarmId"){
			result = `${key}=='${val}';`
		}
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
			} else if (bean && bean.showType && bean.showType === 'radio') {
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
		if(key == "severity" || key == "froms"){
			result = `${key}=='*${val}*';`
		}
		return result
	}

	getArrayTypeValue = (key, val, objmap) => {
		let result = ''
		if (objmap && objmap.size > 0) {
			let bean = objmap.get(key)

			if (bean && bean.showType && bean.showType === 'multiSelect') {
				let internalSql = ''
				val.forEach(item => internalSql += `${key}==${item} or `)
				internalSql = internalSql.substring(0, internalSql.length - 4)
				result = `(${internalSql});`
			} else if (bean && bean.showType && bean.showType === 'between') {
				if (bean.dataType && bean.dataType === 'datetime') {
					result += `${key}>=${Date.parse(val[0])};`
					result += `${key}<=${Date.parse(val[1])};`
				} else {
					result = `${key}=='${val}';`
				}
			} else if (bean && bean.showType && bean.showType === 'cascader') {
				result =`${key}=='${val.join("-")}';` 
			}
		}
		return result
	}

	query = () => {
		let data = this.props.form.getFieldsValue()
		if(!data.hiscope || data.hiscope === undefined){
			for (let [key, value] of Object.entries(data)) {
				if (key === 'firstOccurrence----' && (value === undefined || value.length == 0) &&( !data.hasOwnProperty('oz_AlarmID')|| data.oz_AlarmID=='') ) {
					message.error("时间范围和起止时间至少选择一个")
					return
				}
			}
		}
		if(this.state.pathname.includes('notficationView') && !data.alarmId && !(data.sendTime && data.sendTime.length>0) && !(data.firstOccurrence && data.firstOccurrence.length>0) ){
			message.error("告警ID和告警发生时间、告警通知时间必须选择一个")
			return
		}else if(this.state.pathname.includes('notficationView') && !data.alarmId && data.sendTime && data.sendTime.length>0){
			const c = moment(data.sendTime[0] / 1000, 'X')
			const d = moment(data.sendTime[1] / 1000, 'X')
			let res = d.diff(c,"days")
			if(res >= 90){
				message.error("起止时间间隔不能大于90天")
				return
			}
		}

		if (this.state.queryPreProcess !== undefined) {
			data = this.state.queryPreProcess(data)
		}

		const fields = this.state.schema
		let myMap = new Map()
		if (fields && fields.length > 0) {
			fields.forEach((bean, index) => {
				myMap.set(bean.key, bean)
			})
		}
		let q = ''
		for (let [key, value] of Object.entries(data)) {
			//历史告警和u1历史告警特殊模块，如果传参包含告警序列号oz_AlarmID，则使用这个条件进行查询，忽略其他条件  
			if (key === 'oz_AlarmID' && value !== '' && this.state.pathname.includes('historyview')) {
				q = this.getStringTypeValue(key, value, myMap)
				break
			} else if (key === 'serial' && value !== '' && this.state.pathname.includes('u1Historyview')) {
				q = this.getStringTypeValue(key, value, myMap)
				break
			} 
			// else if (key === 'alarmId' && value !== '' && this.state.pathname.includes('notficationView')) {
			// 	q = this.getStringTypeValue(key, value, myMap)
			// 	break
			// }

			//特殊控件mo树形菜单,查询条件特殊处理
			else if (key === 'moClass') {
				let classes = value.split('-')

				if (classes[0] !== undefined && classes[0] !== 'MO') {
					q += `firstClass=='${classes[0]}';`
				}
				if (classes[1] !== undefined) {
					q += `secondClass=='${classes[1]}';`
				}
				if (classes[2] !== undefined) {
					q += `thirdClass=='${classes[2]}';`
				}
			} else if (key === 'firstOccurrence----' && value !== undefined && value.length > 0) {
				const a = moment(value[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				const b = moment(value[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')

				const c = moment(value[0] / 1000, 'X')
				const d = moment(value[1] / 1000, 'X')

				// let c = moment(value[0] / 1000, 'X').utc(8).format('YYYY-MM-DD')
				// c = c.split('-')
				// c = parseInt(c[0])*12+parseInt(c[1])

				// let d = moment(value[1] / 1000, 'X').utc(8).format('YYYY-MM-DD')
				// d = d.split('-')
				// d = parseInt(d[0])*12+parseInt(d[1])
				// let num = Math.abs(c-d)
				let res = d.diff(c,"days")
				if(res >= 90){
					message.error("起止时间间隔不能大于三个月")
					return
				}
				q += `firstOccurrence=timein=(${a},${b});`
			} else if (key === 'time----' && value !== undefined && value.length > 0) {
				const a = moment(value[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				const b = moment(value[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				q += `time=timein=(${a},${b});`
			} else if (key === 'discoveryIP---' && value !== '') {
				let arrIP
				let strs = ''
				if (value.includes(',')) {
					arrIP = value.split(',')
					for (let i = 0; i < arrIP.length; i++) {
						arrIP[i] = `discoveryIP---=='${arrIP[i]}'`
					}
					strs = '(' + arrIP.join(' or ') + ')'
				} else {
					strs = `discoveryIP---=='${value}'`
				}

				q += strs;
			} else if (key === 'filters_filterItems_value---' && value !== '') {
				q += `filters_filterItems_value---=='${value}'`
			}else if(key === 'n_AppName_1' && value !== '' && value !== undefined && value.length > 0){	
						q+=`n_AppName=='${value[1]}';`					
				 }
			//普通控件，查询条件普通处理
			else {
				switch (typeof (value)) {
					case 'number':
						q += `${key}==${value};`
						break
					case 'float':
						q += `${key}==${value};`
						break
					case 'string':
						if (value && value.length > 0) {
							q += this.getStringTypeValue(key, value, myMap)
						}
						break
					case 'boolean':
						q+=`${key}==${value};`
						break
					case 'object':
						if (value.length > 0) {
							q += this.getArrayTypeValue(key, value, myMap)
						}
				}
			}
		}

		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		if (q !== '') {
			q = `${q};${this.state.externalSql}`
		} else {
			q = this.state.externalSql
		}
		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		this.props.onSearch(q)
	}

	handleReset = () => {
		this.props.form.resetFields()
	}

	parse(schema, getFieldDecorator) {
		const rows = []
		let cols = []

		let spaceLeft = 24

		const children = []
		let fieldsObj = this.state.fieldsObj

		for (let i = 0; i < schema.length; i++) {
			// 当地址栏查询url存在这个控件名，就把url里的值显示在控件中
			if (fieldsObj[schema[i].key] !== undefined && (schema[i].showType === 'multiSelect' || schema[i].showType === 'between')) {
				// 判断对象是否是数组
				if (Array.isArray(fieldsObj[schema[i].key])) {
					schema[i].defaultValue = fieldsObj[schema[i].key]
				} else {
					schema[i].defaultValue = new Array(fieldsObj[schema[i].key])
				}
			} else if (fieldsObj[schema[i].key] !== undefined && schema[i].showType !== 'multiSelect') {
				schema[i].defaultValue = fieldsObj[schema[i].key]
			}
			//把url的监控对象class映射成树形列表的默认值
			//当FilterSchema配置文件中有mo类型树状菜单控件时
			//需要把url查询串里的mo类型拣出来拼装成控件能识别默认value
			//拼装格式为firstClass-secondClass-thirdClass
			//如果任何class为空，该class不参与拼装
			else if (schema[i].key === 'moClass') {
				//从url里取三类class值
				let firstClass = fieldsObj.firstClass
				let secondClass = fieldsObj.secondClass
				let thirdClass = fieldsObj.thirdClass
				//拼装三类class，形成树形下拉列表默认值
				if (firstClass !== undefined) {
					schema[i].defaultValue = firstClass
				} else {
					schema[i].defaultValue = 'MO'
				}
				if (secondClass !== undefined) {
					schema[i].defaultValue = `${schema[i].defaultValue}-${secondClass}`
				}
				if (thirdClass !== undefined) {
					schema[i].defaultValue = `${schema[i].defaultValue}-${thirdClass}`
				}
			}

			switch (schema[i].showType) {
				case 'treeSelect':
					children.push(this.transformTreeSelect(schema[i], i, getFieldDecorator))
					break
				case 'select':
					children.push(this.transformSelect(schema[i], i, getFieldDecorator))
					break
				case 'checkbox':
					children.push(this.transformCheckbox(schema[i], i, getFieldDecorator))
					break
				case 'radio':
					children.push(this.transformRadio(schema[i], i, getFieldDecorator))
					break
				case 'multiSelect':
					children.push(this.transformMultiSelect(schema[i], i, getFieldDecorator))
					break
				case 'cascader':
					children.push(this.transformCascader(schema[i], i, getFieldDecorator))
					break
				case 'between':
					children.push(this.transformBetween(schema[i], i, getFieldDecorator))
					break
				case 'transformAsySelect':
					children.push(this.transformAsySelect(schema[i], i, getFieldDecorator))
					break
				default:
					children.push(this.transformNormal(schema[i], i, getFieldDecorator))
			}
		}

		return children
	}

	transformMultiSelect(field, key, getFieldDecorator) {
		const options = []
		const mySearchInfo = (input, option) => {
			return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
		}
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear mode="multiple" optionFilterProp="children" filterOption={mySearchInfo} placeholder={field.placeholder || '请选择'} getPopupContainer={() => document.body}>{options}</Select>)}
		</FormItem>
		</Col>)
	}

	transformSelect(field, key, getFieldDecorator) {
		const options = []
		const mySearchInfo = (input, option) => {
			return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
		}
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key} disabled={option.disabled || false}>{option.value}</Option>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.body}>{options}</Select>)}
		</FormItem>
		</Col>)
	}

	transformTreeSelect(field, key, getFieldDecorator) {
		let query = {}
		let stringified = ''
		const moChange = (value, label, obj) => {
			switch (value) {
				case 'MO':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/mo',
					}))
					break
				case 'NETWORK-ROUTER':
					this.handleReset()
					query = {
						page: 0,
						//firstClass: 'NETWORK',
						//secondClass: 'ROUTER',
						q: 'firstClass==\'NETWORK\';secondClass==\'ROUTER\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/router',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-SWITCH':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'SWITCH\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/switcher',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-SSL':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'SSL\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/ssl',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-SEC_DEVICE':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'SEC_DEVICE\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/secdevice',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-FIREWALL':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'FIREWALL\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/firewall',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-NM':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'NM\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/netmanager',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-F5':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'F5\'',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/f5',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-ROUTER-NET_INTF':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'ROUTER\';thirdClass==\'NET_INTF\'',
						firstClass: 'NETWORK',
						secondClass: 'ROUTER',
						thirdClass: 'NET_INTF',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/interfacer',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-SWITCH-NET_INTF':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'SWITCH\';thirdClass==\'NET_INTF\'',
						firstClass: 'NETWORK',
						secondClass: 'SWITCH',
						thirdClass: 'NET_INTF',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/interfacer',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-FIREWALL-NET_INTF':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'FIREWALL\';thirdClass==\'NET_INTF\'',
						firstClass: 'NETWORK',
						secondClass: 'FIREWALL',
						thirdClass: 'NET_INTF',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/interfacer',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-F5-NET_INTF':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'NETWORK\';secondClass==\'F5\';thirdClass==\'NET_INTF\'',
						firstClass: 'NETWORK',
						secondClass: 'F5',
						thirdClass: 'NET_INTF',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/interfacer',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-HA_LINE':
					this.handleReset()
					query = {
						q: 'firstClass==\'NETWORK\';secondClass==\'HA_LINE\'',
						page: 0
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/line',
						search: stringified,
						query: query,
					}))
					break
				case 'NETWORK-BRANCH_IP':
					this.handleReset()
					query = {
						q: 'firstClass==\'NETWORK\';secondClass==\'BRANCH_IP\'',
						page: 0
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/branchIp',
						search: stringified,
						query: query,
					}))
					break
				case 'SERVER':
					this.handleReset()
					query = {
						q: 'firstClass==\'SERVER\'',
						page: 0
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/server',
						search: stringified,
						query: query,
					}))
					break
				case 'MW':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
					}))
					break

				case 'MW-MW_WEBSPHERE':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_WEBSPHERE\'',
						firstClass: 'MW',
						secondClass: 'MW_WEBSPHERE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break


				case 'MW-MW_WEBLOGIC':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_WEBLOGIC\'',
						firstClass: 'MW',
						secondClass: 'MW_WEBLOGIC',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break
				case 'MW-MW_TOMCAT':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_TOMCAT\'',
						firstClass: 'MW',
						secondClass: 'MW_TOMCAT',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break

				case 'MW-MW_NGINX':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_NGINX\'',
						firstClass: 'MW',
						secondClass: 'MW_NGINX',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break


				case 'MW-MW_APACHE':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_APACHE\'',
						firstClass: 'MW',
						secondClass: 'MW_APACHE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break
				case 'MW-MW_KAFKA':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'MW\';secondClass==\'MW_KAFKA\'',
						firstClass: 'MW',
						secondClass: 'MW_KAFKA',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
						search: stringified,
						query: query,
					}))
					break
				case 'DB':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
					}))
					break
				case 'DB-DB_ORACLE-null':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==null',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: null,
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_ORACLE-DB_INST': //实例
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_INST\'',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: 'DB_INST',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbinst',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_ORACLE-DB_TABLE_SPACE': //表空间
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_TABLE_SPACE\'',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: 'DB_TABLE_SPACE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbTableSpace',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_ORACLE-DB_TABLE_SPACE_TEMP': //临时表空间
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_TABLE_SPACE_TEMP\'',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: 'DB_TABLE_SPACE_TEMP',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbTableSpaceTemp',
						search: stringified,
						query: query,
					}))
					break
				
				case 'DB-DB_ORACLE-DB_USERNAME': //用户名
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_USERNAME\'',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: 'DB_USERNAME',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbUsername',
						search: stringified,
						query: query,
					}))
					break


				case 'DB-DB_ORACLE-DB_SERVICE': //服务
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_SERVICE\'',
						firstClass: 'DB',
						secondClass: 'DB_ORACLE',
						thirdClass: 'DB_SERVICE'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbService',
						search: stringified,
						query: query,
					}))
					break

				/* 	case 'DB-DB_ORACLE-DB_SERVICE': //服务
						this.handleReset()
						query = {
							page: 0,
							q: 'firstClass==\'DB\';secondClass==\'DB_ORACLE\';thirdClass==\'DB_SERVICE\'',
							firstClass: 'DB',
							secondClass: 'DB_ORACLE',
							thirdClass: 'DB_SERVICE'
						}
						stringified = queryString.stringify(query)
						this.state.dispatch(routerRedux.push({
							pathname: '/dbService',
							search: stringified,
							query: query,
						}))
						break */
				case 'DB-DB_MYSQL-null':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MYSQL\';thirdClass==null',
						firstClass: 'DB',
						secondClass: 'DB_MYSQL',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_MYSQL-DB_INST': //实例
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MYSQL\';thirdClass==\'DB_INST\'',
						firstClass: 'DB',
						secondClass: 'DB_MYSQL',
						thirdClass: 'DB_INST',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbinst',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_MYSQL-DB_TABLE_SPACE': //表空间  key: 'DB-DB_MYSQL-DB_TABLE_SPACE',
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MYSQL\';thirdClass==\'DB_TABLE_SPACE\'',
						firstClass: 'DB',
						secondClass: 'DB_MYSQL',
						thirdClass: 'DB_TABLE_SPACE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbTableSpace',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_MYSQL-DB_SERVICE': //服务
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MYSQL\';thirdClass==\'DB_SERVICE\'',
						firstClass: 'DB',
						secondClass: 'DB_MYSQL',
						thirdClass: 'DB_SERVICE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbService',
						search: stringified,
						query: query,
					}))
					break

				// DB-DB_MYSQL-DB_DATABASE
				case 'DB-DB_MYSQL-DB_DATABASE': //服务   key: 'DB-DB_MYSQL-DB_DATABASE',
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MYSQL\';thirdClass==\'DB_DATABASE\'',
						firstClass: 'DB',
						secondClass: 'DB_MYSQL',
						thirdClass: 'DB_DATABASE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbDataBase',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_REDIS-null':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_REDIS\';thirdClass==null',
						firstClass: 'DB',
						secondClass: 'DB_REDIS',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_REDIS-DB_INST': //实例
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_REDIS\';thirdClass==\'DB_INST\'',
						firstClass: 'DB',
						secondClass: 'DB_REDIS',
						thirdClass: 'DB_INST',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbinst',
						search: stringified,
						query: query,
					}))
					break

				case 'DB-DB_REDIS-DB_TABLE_SPACE': //表空间
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_REDIS\';thirdClass==\'DB_TABLE_SPACE\'',
						firstClass: 'DB',
						secondClass: 'DB_REDIS',
						thirdClass: 'DB_TABLE_SPACE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbTableSpace',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_REDIS-DB_SERVICE': //服务
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_REDIS\';thirdClass==\'DB_SERVICE\'',
						firstClass: 'DB',
						secondClass: 'DB_REDIS',
						thirdClass: 'DB_SERVICE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/dbService',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_DB2-null':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_DB2\';thirdClass==null',
						firstClass: 'DB',
						secondClass: 'DB_DB2',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
						search: stringified,
						query: query,
					}))
					break
				case 'DB-DB_MSSQL-null':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'DB\';secondClass==\'DB_MSSQL\';thirdClass==null',
						firstClass: 'DB',
						secondClass: 'DB_MSSQL',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
						search: stringified,
						query: query,
					}))
					break
				case 'OS':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\'',
						firstClass: 'OS',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_AIX':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_AIX\'',
						firstClass: 'OS',
						secondClass: 'OS_AIX',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_LINUX':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_LINUX\'',
						firstClass: 'OS',
						secondClass: 'OS_LINUX',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_HP_UX':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_HP_UX\'',
						firstClass: 'OS',
						secondClass: 'OS_HP_UX',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_K_UX':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_K_UX\'',
						firstClass: 'OS',
						secondClass: 'OS_K_UX',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_KIRIN':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_KIRIN\'',
						firstClass: 'OS',
						secondClass: 'OS_KIRIN',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OTHER':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OTHER\'',
						firstClass: 'OS',
						secondClass: 'OTHER',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_WINDOWS':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_WINDOWS\'',
						firstClass: 'OS',
						secondClass: 'OS_WINDOWS',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
						search: stringified,
						query: query,
					}))
					break
				case 'OS-OS_WINDOWS-OS_FS':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_WINDOWS\';thirdClass==\'OS_FS\'',
						firstClass: 'OS',
						secondClass: 'OS_WINDOWS',
						thirdClass: 'OS_FS'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/osFs',
						search: stringified,
						query: query,
					}))
					break

				case 'OS-OS_LINUX-OS_FS':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_LINUX\';thirdClass==\'OS_FS\'',
						firstClass: 'OS',
						secondClass: 'OS_LINUX',
						thirdClass: 'OS_FS'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/osFs',
						search: stringified,
						query: query,
					}))
					break

				case 'OS-OS_WINDOWS-OS_DISK':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_WINDOWS\';thirdClass==\'OS_DISK\'',
						firstClass: 'OS',
						secondClass: 'OS_WINDOWS',
						thirdClass: 'OS_DISK'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/osDisk',
						search: stringified,
						query: query,
					}))
					break

				case 'OS-OS_LINUX-OS_DISK':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'OS\';secondClass==\'OS_LINUX\';thirdClass==\'OS_DISK\'',
						firstClass: 'OS',
						secondClass: 'OS_LINUX',
						thirdClass: 'OS_DISK'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/osDisk',
						search: stringified,
						query: query,
					}))
					break
				case 'APP':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
					}))
					break

				case 'APP-APP_URL':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APP\';secondClass==\'APP_URL\'',
						firstClass: 'APP',
						secondClass: 'APP_URL'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
						search: stringified,
						query: query,
					}))
					break

				case 'APP-APP_PROC':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APP\';secondClass==\'APP_PROC\'',
						firstClass: 'APP',
						secondClass: 'APP_PROC'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
						search: stringified,
						query: query,
					}))
					break


				case 'APP-APP_PORT':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APP\';secondClass==\'APP_PORT\'',
						firstClass: 'APP',
						secondClass: 'APP_PORT'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
						search: stringified,
						query: query,
					}))
					break


				case 'APP-APP_LOG':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APP\';secondClass==\'APP_LOG\'',
						firstClass: 'APP',
						secondClass: 'APP_LOG'
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-STORAGE-NAS_STORAGE_DEVICE':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'STORAGE\';thirdClass==\'NAS_STORAGE_DEVICE\'',
						firstClass: 'HARDWARE',
						secondClass: 'STORAGE',
						thirdClass: 'NAS_STORAGE_DEVICE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/storages',
						search: stringified,
						query: query,
						/*query: {
							page: 0,
							q: 'firstClass==\'HARDWARE\';secondClass==\'STORAGE\';thirdClass==\'NAS_STORAGE_DEVICE\'',
							firstClass: 'HARDWARE',
							secondClass: 'STORAGE',
							thirdClass: 'NAS_STORAGE_DEVICE',
					   },*/
					}))
					break
				case 'HARDWARE-STORAGE-NAS_FSWITCH':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'STORAGE\';thirdClass==\'NAS_FSWITCH\'',
						firstClass: 'HARDWARE',
						secondClass: 'STORAGE',
						thirdClass: 'NAS_FSWITCH',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/storages',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-STORAGE-OTHER':
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'STORAGE\';thirdClass==\'OTHER\'',
						firstClass: 'HARDWARE',
						secondClass: 'STORAGE',
						thirdClass: 'OTHER',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/storages',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-HWSERVER-MINICOMPUTER'://小型机
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'HWSERVER\';thirdClass==\'MINICOMPUTER\'',
						firstClass: 'HARDWARE',
						secondClass: 'HWSERVER',
						thirdClass: 'MINICOMPUTER',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/hardwareServer',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-HWSERVER-PCSERVER'://PC服务器
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'HWSERVER\';thirdClass==\'PCSERVER\'',
						firstClass: 'HARDWARE',
						secondClass: 'HWSERVER',
						thirdClass: 'PCSERVER',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/hardwareServer',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-HWSERVER-BLADE_CONSOLE'://刀笼及控制台
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'HWSERVER\';thirdClass==\'BLADE_CONSOLE\'',
						firstClass: 'HARDWARE',
						secondClass: 'HWSERVER',
						thirdClass: 'BLADE_CONSOLE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/hardwareServer',
						search: stringified,
						query: query,
					}))
					break//HARDWARE-SERVERS-OTHER
				case 'HARDWARE-HWSERVER-OTHER'://硬件服务器-其它
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'HWSERVER\';thirdClass==\'OTHER\'',
						firstClass: 'HARDWARE',
						secondClass: 'HWSERVER',
						thirdClass: 'OTHER',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/hardwareServer',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-SPECIALDEVICE'://特殊设备
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'SPECIALDEVICE\'',
						firstClass: 'HARDWARE',
						secondClass: 'SPECIALDEVICE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/specialequipment',
						search: stringified,
						query: query,
					}))
					break
				case 'HARDWARE-CLOUDDEVICE'://云设备
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'HARDWARE\';secondClass==\'CLOUDDEVICE\'',
						firstClass: 'HARDWARE',
						secondClass: 'CLOUDDEVICE',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/cloudequipment',
						search: stringified,
						query: query,
					}))
					break
				case 'IP'://IP
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'IP\'',
						firstClass: 'IP',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/IP',
						search: stringified,
						query: query,
					}))
					break
				case 'APPLICATION-PAGESET'://页面
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APPLICATION\';secondClass==\'PAGESET\'',
						firstClass: 'APPLICATION',
						secondClass: 'PAGESET',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/page',
						search: stringified,
						query: query,
					}))
					break
				case 'APP-APP_URL_DNS'://页面
					this.handleReset()
					query = {
						page: 0,
						q: 'firstClass==\'APP\';secondClass==\'APP_URL_DNS\'',
						firstClass: 'APP',
						secondClass: 'APP_URL_DNS',
					}
					stringified = queryString.stringify(query)
					this.state.dispatch(routerRedux.push({
						pathname: '/urlDns',
						search: stringified,
						query: query,
					}))
					break
			}
		}

		const loop = (data, _parent) => data.map((item) => {
			/*
			*因为路由器接口、交换机接口、防火墙接口没有唯一key
			*所以这里根据树的父节点，以减号做分隔符，拼装成唯一key，例：
			*NETWORK-ROUTER:路由器
			*NETWORK-ROUTER-NET_INTF:路由器接口
			*/
			if (item.children && item.children.length > 0) {
				return <TreeNode title={item.name} key={item.key} isLeaf={false} value={item.key} disabled={item.disabled || false}>{loop(item.children)}</TreeNode>
			}

			return <TreeNode title={item.name} key={item.key} isLeaf value={item.key} disabled={item.disabled || false} />
		})

		let treeNodes = []
		if (this.state.moTypeTree && this.state.moTypeTree.length > 0) {
			treeNodes = loop(this.state.moTypeTree, '')
		}

		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} lg={{ span: 8 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<TreeSelect treeDefaultExpandAll onChange={moChange} getPopupContainer={() => document.body} style={{ width: '100%' }} size="default" dropdownStyle={{ maxHeight: '300px', overFlow: 'scroll' }} placeholder={field.placeholder}>{treeNodes}
		</TreeSelect>)}
		</FormItem>
		</Col>)
	}


	transformRadio(field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
		</FormItem>
		</Col>)
	}

	transformCheckbox(field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push({
				label: option.value,
				value: option.key,
			})
		})

		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
	}

	transformNormal(field, key, getFieldDecorator) {
		switch (field.dataType) {
			case 'int':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'float':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'datetime':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>

			default:
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue || '' })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}

	transformCascader(field, key, getFieldDecorator) {
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
	}

	transformBetween(field, key, getFieldDecorator) {
		switch (field.dataType) {
			/*case 'int':
				return <Col span={8} key={key}><Row><Col span={12}>12</Col><Col span={12}>12</Col></Row></Col>

			case 'float':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>)}</FormItem></Col>*/

			case 'datetime':
				//let defaultValue = [moment(Date.parse(new Date())).add(-1, 'hour'), moment(Date.parse(new Date()))],  // 注意日期类型defaultValue的格式
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key} id={`date_time_area_${key}`}>
					<FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
					<RangePicker showTime format="YYYY-MM-DD HH:mm:ss"  getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}
					</FormItem></Col>

			/*default:
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>*/
		}
	}
	searches = (value) => {
		if (value != '') {
		  let q = `systemName=='*${value}*'`
		  this.state.dispatch({
			type: `${this.state.modalName}/queryApp`,
			payload: {
			  q,
			},
		  })
		}
	  }
	
	  transformAsySelect (field, key, getFieldDecorator) {
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}>
		  <FormItem {...formItemLayout} label={field.title}>
			{getFieldDecorator(field.key, { initialValue: '' })
			(<Select
			  showSearch
			  allowClear
			  placeholder="请输入应用系统"
			  onSearch={debounce(800, this.searches)}
			>
			  {this.state.optionSelectAppName}
			</Select>)}
		  </FormItem>
		</Col>)
	  }
	getBtZone() {
		let btZone = null
		if (this.state.buttonZone !== undefined && this.state.buttonZoneProps != undefined) {
			btZone = <this.state.buttonZone {...this.state.buttonZoneProps} />
		}
		return btZone
	}


	render() {
		const {
			expand,
			schema,
			buttonZone,
			buttonZoneProps,
		} = this.state
		const {
			getFieldDecorator,
		} = this.props.form

		const children = this.parse(schema, getFieldDecorator)
		const shownCount = expand ? children.length : 3
		const btZone = this.getBtZone()

		return (
			<Form>
				<Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
					{children.slice(0, shownCount)}
				</Row>
				<Row gutter={4} style={{ marginTop: 8, marginBottom: 20 }}>
					<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
						<span style={{ float: 'left' }}>
							{buttonZone}
						</span>

						<span style={{ float: 'right', marginTop: 8 }}>
							<Button htmlType="submit" onClick={this.query}>查询</Button>
							{/*<Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
					    	重置
					   </Button>*/}
							<a style={{ marginLeft: 8 }} onClick={this.toggle}>
								<Icon type={expand ? 'caret-up' : 'caret-down'} style={{ fontSize: 8, color: '#333' }} />
							</a>
						</span>
					</Col>
				</Row>
			</Form>
		)
	}
}

export default Form.create()(Filter)
