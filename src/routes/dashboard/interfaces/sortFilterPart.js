import React from 'react'
import myStyle from './myStyle.css'
import { Col, Icon, Input } from 'antd'
const Search = Input.Search

const sortFilterPart = ({ dispatch, loading, location }) => {
	const searchIP = (value) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				IPvalue: value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: {
				IPvalue: value,
			},
		})
	}
	return (
  <Col span={24} className={myStyle.nextPart}>
    <div className={myStyle.sortLeft}>
      {/*
				<Button size='small'>名称<Icon type="arrow-up" /></Button>
				<Button size='small'>IP<Icon type="arrow-up" /></Button>
				<Button size='small'>接口数<Icon type="arrow-up" /></Button>
				<Button size='small'>告警数<Icon type="arrow-up" /></Button>
				*/}
      {/*
				<Button size='small'>机构<Icon type="arrow-up" /></Button>
				<Button size='small'>型号<Icon type="arrow-up" /></Button>
				<Button size='small'>厂商<Icon type="arrow-up" /></Button>
				<Button size='small'>类型<Icon type="arrow-up" /></Button>
				*/}
    </div>
    <div className={myStyle.sortRight}>
      <Search
        placeholder="在结果中搜索IP"
        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
        onSearch={searchIP}
        style={{ width: 200 }}
      />

    </div>
  </Col>
	)
}
export default sortFilterPart
