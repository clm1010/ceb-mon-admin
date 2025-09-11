import React from 'react'
import { Form, Select, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const OptGroup = Select.OptGroup

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 9,
  },
}

//onChange={onChangeFirst}
class firstValueSelect extends React.Component {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
    this.firstValue = this.props.firstValue
    this.querySql = this.props.querySql
  }

  onChangeFirst = (value) => {
    const { resetFields, setFieldsValue } = this.props.form
    if (value.length === 0) {
      message.info('必须选择查询条件!', 5)
    } else if (value.length === 1 && value[0] === '全部') {

    } else if (value.length > 1 && value.join(',').includes('ALL')) {
      message.info('逻辑错误!', 5)
      setFieldsValue()
    } else {
      this.dispatch({
        type: 'performance/querySuccess',
        payload: {
          firstValue: value,
        },
      })
    }
  }
//{genDictOptsByNames('firstSecAreaZH','firstSecAreaFH')}
  render () {
    const {
      getFieldDecorator, initialValue, resetFields, setFieldsValue,
    } = this.props.form
    const user = JSON.parse(sessionStorage.getItem('user'))
    let branch
    if(user.branch){
      branch = user.branch
    }else{
      branch = 'ZH'
    }
    return (
      <div>
        <FormItem label="服务域：" {...formItemLayout}>
          {
            getFieldDecorator('apps', {
              initialValue: this.querySql,
              rules: [],
            })(<Select
              style={{ width: 250 }}
              showSearch
              mode="multiple"
              onChange={this.onChangeFirst}
            >
              <OptGroup label="全局条件">
                <Option value="ALL">全部</Option>
              </OptGroup>
              {
                branch === 'ZH' ?
                  <OptGroup label="服务域">
                    <Option value="生产服务域生产A区">生产服务域生产A区</Option>
                    <Option value="生产服务域生产B区">生产服务域生产B区</Option>
                    <Option value="第三方服务域">第三方服务域</Option>
                    <Option value="业务服务域">二级分行</Option>
                    <Option value="办公服务域">分行中间业务区</Option>
                    <Option value="办公服务域城域网接入区">办公服务域城域网接入区</Option>
                    <Option value="IT管理域">分行办公区</Option>
                    <Option value="互联网服务域公众服务区">互联网服务域公众服务区</Option>
                    <Option value="互联网服务域办公DMZ区">互联网服务域办公DMZ区</Option>
                    <Option value="互联网服务域外联区">互联网服务域外联区</Option>
                    <Option value="互联网服务域邮件接入区">互联网服务域邮件接入区</Option>
                    <Option value="数据域专属备份区">数据域专属备份区</Option>
                    <Option value="数据域大数据区">数据域大数据区</Option>
                    <Option value="数据域专属存储区">数据域专属存储区</Option>
                    <Option value="骨干网络域">骨干网络域</Option>
                    <Option value="武汉灾备中心">武汉灾备中心</Option>
                    <Option value="开发测试域">开发测试域</Option>
                    <Option value="分行云服务域">分行云服务域</Option>
                    <Option value="核心交换域核心交换区">核心交换域核心交换区</Option>
                    <Option value="天津后台中心">天津后台中心</Option>
                    <Option value="网银武汉异地接入区">网银武汉异地接入区</Option>
                    <Option value="集团接入区">集团接入区</Option>
                    <Option value="投产准备域">投产准备域</Option>
                    <Option value="netflow">netflow</Option>
                    <Option value="kelai">kelai</Option>
                    <Option value="武汉客户满意中心">武汉客户满意中心</Option>
                  </OptGroup>
                  :
                  <OptGroup label="服务域">
                    <Option value="支行">支行</Option>
                    <Option value="分行核心交换区">分行核心交换区</Option>
                    <Option value="分行上联区">分行上联区</Option>
                    <Option value="分行下联区">分行下联区</Option>
                    <Option value="分行生产区">分行生产区</Option>
                    <Option value="分行中间业务区">分行中间业务区</Option>
                    <Option value="分行视频接入区">分行视频接入区</Option>
                    <Option value="分行办公区">分行办公区</Option>
                    <Option value="二级分行">二级分行</Option>
                    <Option value="社区银行">社区银行</Option>
                    <Option value="办公网">办公网</Option>
                    <Option value="自助银行">自助银行</Option>
                    <Option value="生产网">生产网</Option>
                    <Option value="苏州广域网区">苏州广域网区</Option>
                    <Option value="苏州灾备区">苏州灾备区</Option>
                    <Option value="苏州生产应用区">苏州生产应用区</Option>
                    <Option value="苏州核心区">苏州核心区</Option>
                    <Option value="苏州应用测试区">苏州应用测试区</Option>
                    <Option value="苏州外卡区">苏州外卡区</Option>
                    <Option value="苏州运管区">苏州运管区</Option>
                    <Option value="石景山标准区">石景山标准区</Option>
                    <Option value="石景山广域网接入区">石景山广域网接入区</Option>
                    <Option value="石景山运管接入区">石景山运管接入区</Option>
                    <Option value="石景山外卡接入区">石景山外卡接入区</Option>
                    <Option value="石景山应用服务器接入区">石景山应用服务器接入区</Option>
                    <Option value="石景山网络核心区">石景山网络核心区</Option>
                    <Option value="石景山灾备接入区">石景山网络核心区</Option>
                  </OptGroup>
              }
            </Select>)
          }
        </FormItem>
      </div>
    )
  }
}

export default Form.create()(firstValueSelect)
