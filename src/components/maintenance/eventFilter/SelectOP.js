import React from 'react'
import { Select } from 'antd'

export default  [
  <Select.Option key="=" value="=">=</Select.Option>,
  <Select.Option key="!=" value="!=">!=</Select.Option>,
		//<Select.Option key=">" value=">">></Select.Option>,
		//<Select.Option key=">=" value=">=">>=</Select.Option>,
		//<Select.Option key="<" value="<">&lt;</Select.Option>,
		//<Select.Option key="<=" value="<=">&lt;=</Select.Option>,
		<Select.Option key="like" value="like">包含</Select.Option>,
		<Select.Option key="not like" value=" not like">不包含</Select.Option>,
		<Select.Option key="startsWith" value="startsWith">前缀匹配</Select.Option>,
		<Select.Option key="endsWith" value="endsWith">后缀匹配</Select.Option>,
		<Select.Option key="matches" value="matches">正则匹配</Select.Option>,
	]
