import React from 'react'
import { Select } from 'antd'
import { genDictOptsByName } from '../FunctionTool'

const { Option, OptGroup } = Select
/*
* 描述设备厂商下拉列表
*/
export default  [
  <OptGroup key="QJ" label="全局">
    <Option key="QH" value="QH">全行(QH)</Option>
  </OptGroup>,
  <OptGroup key="JG" label="机构">
    {genDictOptsByName('branch')}
  </OptGroup>,
]
