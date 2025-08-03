import React from 'react'
import { Row, Col } from 'antd';
import imageProduct from '../../assets/images/slider1.png';
import imageProductSmall from '../../assets/images/slider1.png';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import InputNumber from 'antd/es/input-number';



const ProductDetailsComponent = () => {
    const onChange = () => { }
    return (
        <Row>
            <Col span={12}>
                <img src={imageProduct} alt="Product" preview="false" />
                <div>
                    <img src={imageProductSmall} alt="Product Small" style={{ width: '100px', height: '100px' }} />
                </div>
            </Col>
            <Col span={12}>
                <h1>Product Name</h1>
                <p>Description of the product goes here.</p>
                <h2>$29.99</h2>
                <p>quantity:</p>
                <div>
                    <PlusOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;
                    <MinusOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                </div>
                <div>
                    <ButtonComponent
                        size={40}
                        textButton="Add to Cart"
                        styleButton={{ background: 'pink', border: 'none' }}
                        styleTextButton={{ color: 'white' }}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default ProductDetailsComponent
