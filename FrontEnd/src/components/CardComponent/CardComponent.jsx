import React from 'react'
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { StyleNameProduct, WrapperPrice, WrapperReportText } from './style';
import { StarFilled } from '@ant-design/icons';
import  slider1 from '../../assets/images/slider1.png';

const CardComponent = () => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      bodyStyle={{ padding: '10px' }}
      cover={<img alt="example" src={slider1} />}
    >
      <StyleNameProduct>tropical pizza</StyleNameProduct>
      <WrapperReportText>
        5.00
        <StarFilled style={{ fontSize: '16px', color: '#fadb14' }} />
      </WrapperReportText>
      <WrapperPrice>$20.00</WrapperPrice>
    </Card>

  )
}

export default CardComponent
