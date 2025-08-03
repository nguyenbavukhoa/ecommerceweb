import React from "react";
import { Row, Col } from "antd";
import { Input } from 'antd';
import { WapperAccount, WapperHeader, WapperHeaderText, WapperCart } from "./style";
import ButtonSearchInput from "../ButtonSearchInput/ButtonSearchInput";
import { UserOutlined 
, CaretDownOutlined
, ShoppingCartOutlined
} from '@ant-design/icons';

const { Search } = Input;

const HeaderComponent = () => {
    return (
        <div>
            <WapperHeader>
                <Col span={8}>
                    <WapperHeaderText>KHK Shop</WapperHeaderText>
                </Col>
                <Col span={8}>
                    <ButtonSearchInput
                        size="large"
                        bordered={false}
                        textButton="Search"
                        placeholder="input search text"
                    />
                </Col>
                <Col style={{ display: 'flex', gap: '100px' }} span={8}>
                <WapperAccount>
                    <UserOutlined style={{ fontSize: '20px'}} />
                    <div>
                        <span >sign up/sign in</span>
                        <CaretDownOutlined />
                    </div>
                </WapperAccount>
                <WapperCart>
                    <ShoppingCartOutlined style={{ fontSize: '20px'}} />
                    <span>0</span>
                    <span> items</span>
                </WapperCart>
                </Col>
            </WapperHeader>
        </div>
    );
}

export default HeaderComponent;
