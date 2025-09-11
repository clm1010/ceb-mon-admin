import React, { useEffect, useState } from "react";
import { connect } from "dva";
import { Col, Row, Card, Table, DatePicker, Button } from "antd";
import Menus from "../dashboard/performance/Menus.js";
import Modal from "./Modal.js";
import LineChart from "./LineChart.js";
import { Link } from "dva/router";
import Search from "./Search.js";
import { genDictArrToTreeByName } from "../../utils/FunctionTool.js";

const qps = ({ dispatch, location, qps, loading }) => {
  // const { ipSource, monameSource } = singleSSL
  const { list } = qps;
  const [selectedDateString, setSelectedDateString] = useState("");
  const [datePickerKey, setDatePickerKey] = useState(0); // 用于重置DatePicker

  useEffect(() => {
    const time = setInterval(() => {
      dispatch({
        type: "qps/query",
        payload: {},
      });
    }, 60000);
    return () => clearInterval(time);
  }, []);

  // 处理日期选择
  const handleDateChange = (date, dateString) => {
    setSelectedDateString(dateString);
  };

  // 查询按钮点击事件
  const handleSearch = () => {
    const payload = {};
    if (selectedDateString) {
      // 将日期字符串转换为ISO格式
      const targetDate = new Date(selectedDateString);
      payload.date = targetDate.toISOString();
    }

    dispatch({
      type: "qps/query",
      payload: payload,
    });
  };

  // 重置按钮点击事件
  const handleReset = () => {
    setSelectedDateString("");
    setDatePickerKey(prev => prev + 1); // 强制重新渲染DatePicker
    dispatch({
      type: "qps/query",
      payload: {},
    });
  };

  //菜单组件
  const menuProps = {
    current: "qps",
    dispatch,
  };

  const columns = [
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: "200px",
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };

        // 动态计算行合并
        const currentRole = text;

        // 找到当前角色在连续组中的位置
        let groupStart = index;
        while (groupStart > 0 && list[groupStart - 1].role === currentRole) {
          groupStart--;
        }

        // 找到当前连续组的结束位置
        let groupEnd = index;
        while (
          groupEnd < list.length - 1 &&
          list[groupEnd + 1].role === currentRole
        ) {
          groupEnd++;
        }

        // 如果是连续组的第一个，设置rowSpan
        if (index === groupStart) {
          const groupSize = groupEnd - groupStart + 1;
          obj.props.rowSpan = groupSize;
        } else {
          // 不是第一个，隐藏单元格
          obj.props.rowSpan = 0;
        }

        return obj;
      },
    },
    {
      title: "厂商",
      dataIndex: "vendor",
      key: "vendor",
      width: "80px",
    },
    {
      title: "设备名",
      dataIndex: "device",
      key: "device",
      width: "300px",
      render: (text, record, index) => {
        return <Link to={`/chddetail`}>{text} </Link>;
      },
    },
    {
      title: "设备IP",
      dataIndex: "hostip",
      key: "hostip",
      width: "130px",
      render: (text, record, index) => {
        return <Link to={`/chddetail`}>{text} </Link>;
      },
    },
    {
      title: "曲线图",
      dataIndex: "chart",
      key: "chart",
      width: "200px",
      render: (text, record, index) => <LineChart data={record.chartData} />,
    },
  ];

  // 使用来自model的真实数据，如果没有数据则使用空数组
  const data = list || [];

  const filterSchema = [];
  const filterProps = {
    filterSchema: filterSchema,
    dispatch,
    onSearch(queryTerms) {
      dispatch({
        type: "qps/query",
        payload: {
          queryTerms: queryTerms,
        },
      });
    },
  };
  return (
    <div>
      <Modal></Modal>
      <Row gutter={6}>
        <Col md={24} lg={24} xl={24}>
          <Menus {...menuProps} />
        </Col>
      </Row>
      <Row gutter={6}>
        <Col md={24} lg={24} xl={24}>
          <div style={{ marginTop: "10px" }}>
            <Card>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <DatePicker
                    showTime
                    placeholder="选择日期时间"
                    onChange={handleDateChange}
                    format="YYYY-MM-DD HH:mm:ss"
                    key={datePickerKey}
                    style={{ marginRight: "8px" }}
                  />
                  <Button
                    type="primary"
                    onClick={handleSearch}
                    disabled={!selectedDateString}
                    style={{ marginRight: "8px" }}
                  >
                    查询6小时QPS数据
                  </Button>
                  <Button
                    onClick={handleReset}
                    style={{ marginRight: "8px" }}
                  >
                    重置为实时数据
                  </Button>
                  {selectedDateString && (
                    <span style={{ color: "#666", fontSize: "12px" }}>
                      已选择: {selectedDateString}
                    </span>
                  )}
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={data}
                bordered
                loading={loading.effects["qps/query"]}
                pagination={{ defaultPageSize: 100 }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ qps, loading }) => ({
  qps,
  loading: loading,
}))(qps);
