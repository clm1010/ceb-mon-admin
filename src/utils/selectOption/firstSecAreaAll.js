import React from 'react'
import { Select } from 'antd'
import { genDictOptsByName } from '../FunctionTool'
import {ozr} from '../clientSetting'
const { OptGroup } = Select
/*
* 描述设备厂商下拉列表
*/
export default  [
  <OptGroup key="ZH" label={ozr('firstSecAreaLabel1')}>
    {genDictOptsByName('firstSecAreaZH')}
  </OptGroup>,
  <OptGroup key="FH" label={ozr('firstSecAreaLabel2')}>
    {genDictOptsByName('firstSecAreaFH')}
  </OptGroup>,
]
