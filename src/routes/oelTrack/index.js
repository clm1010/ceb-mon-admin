import React from 'react'
import List from './List'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { routerRedux } from 'dva/router'
import ButtonZone from './ButtonZone'
import Countdown from './Countdown'
import ShowTime from './ShowTime'
import SeeModal from './seeModal'
import EditModal from './editModal'
import AddModal from './addModal'
import TrackRuleModal from './trackRuleModal'
import queryString from "query-string";

const oelTrack = ({
 location, dispatch, oelTrack, loading,
}) => {
  const {
    q, list, pagination, initValue, countState, batchDelete, choosedRows, seeModalvisible, editModalvisible, expand, timeFileinfo, timertype, typeValue, currentItem,
    addModalvisible,trackRuleModalvisible,rulelist,rulepagination,ruleInfoVal,expands,fullstyle,onlyOne,forbind,tkey,nowDate
   } = oelTrack
    const filterProps = { //这里定义的是查询页面要绑定的数据源
        expand: false,
        filterSchema: FilterSchema,
        onSearch (q) {
          const { search, pathname } = location
          const query = queryString.parse(search);
            dispatch(routerRedux.push({
                pathname,
                search: search,
                query: {
                    ...query,
                    page: 0,
                    q,
                },
            }))
        },
    }
    const listProps = {
      dispatch,
      dataSource: list,
      loading: loading.effects['oelTrack/query'],
      pagination,
      q,
      onlyOne,
      forbind,
      nowDate
  }
  const seeModalProps = {
      dispatch,
      item: currentItem,
      visible: seeModalvisible,
      expands,
      fullstyle,
      forbind,
      tkey,
      nowDate
  }
  const editModalProps = {
      dispatch,
      visible: editModalvisible,
      filter: timeFileinfo,
      timertype,
      typeValue,
      item: currentItem,
  }
  const addModalProps = {
    dispatch,
    ruleInfoVal,
    visible: addModalvisible,
}
const trackRuleModalProps = {
  dispatch,
  dataSource:rulelist,
  pagination:rulepagination,
  visible: trackRuleModalvisible,
  loading: loading,
}
  const countdownProps = {
      dispatch,
      initValue,
      countState,
  }
  const buttonZoneProps = {
      dispatch,
      batchDelete,
      choosedRows,
      expand,
  }
  let buton = <ButtonZone {...buttonZoneProps} />
  return (
    <div className="content-inner">
      <div >
        <Row gutter={24} style={{ backgroundColor: 'white', paddingBottom: 4 }}>
          <Col className="content-inner2">
            <ShowTime />
            <Countdown {...countdownProps} />
          </Col>
        </Row>
      </div>
      <div >
        <Filter {...filterProps} buttonZone={buton} />
        <List {...listProps} />
        <SeeModal {...seeModalProps} />
        <EditModal {...editModalProps} />
        <AddModal {...addModalProps} />
        <TrackRuleModal {...trackRuleModalProps} />
      </div>
    </div>
  )
}

export default connect(({ oelTrack, loading }) => ({ oelTrack, loading }))(oelTrack)
