import * as config from './config'
import menu from './menu'
import request from './request'
import request_t from './request_t'
import classnames from 'classnames'
import { color } from './theme'
import lodash from 'lodash'
import download from './downloadMonitoring'
import xykrequest  from './xykrequest'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
	return this.replace(/-(\w)/g, (...args) => {
		return args[1].toUpperCase()
	})
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
	return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
	const o = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'H+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3),
		S: this.getMilliseconds(),
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
		}
	}
	return format
}
// 数组删除某一项
Array.prototype.remove = function (val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
}

/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
	let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
	let r = window.location.search.substr(1).match(reg)
	if (r != null) return decodeURI(r[2])
	return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
	if (!(array instanceof Array)) {
		return null
	}
	const item = array.filter(_ => _[keyAlias] === key)
	if (item.length) {
		return item[0]
	}
	return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
	let data = lodash.cloneDeep(array)
	let result = []
	let hash = {}
	data.forEach((item, index) => {
		hash[data[index][id]] = data[index]
	})

	data.forEach((item) => {
		let hashVP = hash[item[pid]]
		if (hashVP) {
			!hashVP[children] && (hashVP[children] = [])
			hashVP[children].push(item)
		} else {
			result.push(item)
		}
	})
	return result
}
/**
 * 根据OS表字段描述生成sql语句，如果字符串加单引号，如果数值，不加。
 */
const filterAdapter = (filter, fieldDesc) => {
	let q = ''

	if (filter.filterMode === 'BASIC') {
		for (let i = 0; i < filter.filterItems.length; i++) {
			//如果字段是数值型的，生成整型查询sql
			if (fieldDesc.indexOf(filter.filterItems[i].field) >= 0) {
				q += `${filter.filterItems[i].field} ${filter.filterItems[i].op} ${filter.filterItems[i].value}`
			}
			//如果字段是字符串型的，生成字符串型查询sql
			else {
				q += `${filter.filterItems[i].field} ${filter.filterItems[i].op} '${filter.filterItems[i].value}'`
			}

			if (i != filter.filterItems.length - 1) {
				q += ` ${filter.basicLogicOp} `
			}
		}
	} else if (filter.filterMode === 'ADVANCED') {
		for (let i = 0; i < filter.filterItems.length; i++) {
			let leftBrackets = filter.filterItems[i].leftBrackets ? filter.filterItems[i].leftBrackets : ''
			let rightBrackets = filter.filterItems[i].rightBrackets ? filter.filterItems[i].rightBrackets : ''
			let logicOp = filter.filterItems[i].logicOp ? filter.filterItems[i].logicOp : ''

			//如果字段是数值型的，生成整型查询sql
			if (fieldDesc.indexOf(filter.filterItems[i].field) >= 0) {
				q += `${leftBrackets + filter.filterItems[i].field + filter.filterItems[i].op} ${filter.filterItems[i].value} ${rightBrackets}`
			}
			//如果字段是字符串型的，生成字符串型查询sql
			else {
				q += `${leftBrackets + filter.filterItems[i].field + filter.filterItems[i].op} '${filter.filterItems[i].value}'${rightBrackets}`
			}

			q += ` ${logicOp} `
		}
	} else if (filter.filterMode === 'OTHER') {
		q = filter.filterItems[0].value
	}

	q = q.replace(/\*/g, '%2A')
	q = q.replace(/\(/g, '%28')
	q = q.replace(/\)/g, '%29')

	return q
}

const localFilter = (tagFilters, list) => {
	//循环过滤条件
	for (let [key, value] of tagFilters) {
		//循环告警集合
		for (let i = list.length - 1; i >= 0; i--) {
			let record = list[i]
			//如果告警不满足条件
			if (!validateRecord(record, value)) {
				//从集合中删除这条告警
				list.splice(i, 1)
			}
		}
	}

	return list
}

const localSeverityFilter = (list) => {
	let severityMap = new Map()
	let s5 = 0
	let s4 = 0
	let s3 = 0
	let s2 = 0
	let s1 = 0
	let s0 = 0

	for (let record of list) {
		switch (record.severity) {
			case 0:
				s0 += 1
				break
			case 1:
				s1 += 1
				break
			case 2:
				s2 += 1
				break
			case 3:
				s3 += 1
				break
			case 4:
				s4 += 1
				break
			case 5:
				s5 += 1
				break
		}
	}

	severityMap.set('s0', s0)
	severityMap.set('s1', s1)
	severityMap.set('s2', s2)
	severityMap.set('s3', s3)
	severityMap.set('s4', s4)
	severityMap.set('s5', s5)
	severityMap.set('all', list.length)

	return severityMap
}

//这是一个校验函数，判断大于小于等于like的各种情况
const validateRecord = (record, condition) => {
	let name = condition.name
	let op = condition.op
	let value = condition.value

	let res = false

	//判断op
	switch (op) {
		case '=':
			if (String(record[name]) === value) {
				res = true
			}
			break
		case '!=':
			if (String(record[name]) !== value) {
				res = true
			}
			break
		case '>':
			if (String(record[name]) > value) {
				res = true
			}
			break
		case '<':
			if (String(record[name]) < value) {
				res = true
			}
			break
		case '>=':
			if (String(record[name]) >= value) {
				res = true
			}
			break
		case '<=':
			if (String(record[name]) <= value) {
				res = true
			}
			break
		case 'like':
			if (String(record[name]).includes(value)) {
				res = true
			}
			break
	}
	return res
}

export {
	config,
	menu,
	request,
	color,
	classnames,
	queryURL,
	queryArray,
	arrayToTree,
	filterAdapter,
	localFilter,
	localSeverityFilter,
	validateRecord,
	download,
	xykrequest,
	request_t,
}
