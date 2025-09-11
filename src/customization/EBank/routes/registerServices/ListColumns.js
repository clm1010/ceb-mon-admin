import React from 'react'
import { Checkbox, Menu } from 'antd'
import style from './List.less'

const ListColumns = ({ dispatch, regColumns }) => {

	const onChange = (checkedValues) => {
		let value = checkedValues.target.value
		let checked = checkedValues.target.checked
		if (checked) {
			regColumns.push(value)
		} else {
			let index = regColumns.indexOf(value)
			regColumns.splice(index, 1)
		}
		dispatch({
			type: 'registerServices/updateState',
			payload: {
				regColumns: regColumns
			}
		})
	}

	return (
		<div className={style.cols}>
			<Menu >
				<Menu.Item>
					<Checkbox value="name" onChange={onChange} defaultChecked>服务名</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="tags" onChange={onChange} defaultChecked>标签</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="address" onChange={onChange} defaultChecked>地址</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="id" onChange={onChange} defaultChecked>ID</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="port" onChange={onChange} defaultChecked>端口</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="registerStatus" onChange={onChange} defaultChecked>状态</Checkbox>
				</Menu.Item>
				{/* <Menu.Item> 
				<Checkbox value="namespace" onChange={onChange}>命名空间</Checkbox>
			</Menu.Item>
			<Menu.Item>
				<Checkbox value="domain" onChange={onChange}>部门信息</Checkbox>
			</Menu.Item> */}
				<Menu.Item>
					<Checkbox value="meta" onChange={onChange}>Meta</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="project" onChange={onChange}>项目</Checkbox>
				</Menu.Item>
				{/* <Menu.Item>
				<Checkbox value="nodeChecks" onChange={onChange} >节点检查</Checkbox>
			</Menu.Item>
			<Menu.Item>
				<Checkbox value="serviceChecks" onChange={onChange} >服务检查</Checkbox>
			</Menu.Item> */}
				<Menu.Item>
					<Checkbox value="createdBy" onChange={onChange}>创建人</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="updatedBy" onChange={onChange}>更新人</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="serviceArea" onChange={onChange}>服务域</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="origin" onChange={onChange}>创建方式</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="createdTime" onChange={onChange}>创建时间</Checkbox>
				</Menu.Item>
				<Menu.Item>
					<Checkbox value="updatedTime" onChange={onChange}>更新时间</Checkbox>
				</Menu.Item>
			</Menu>
		</div>

	)
}

export default ListColumns
