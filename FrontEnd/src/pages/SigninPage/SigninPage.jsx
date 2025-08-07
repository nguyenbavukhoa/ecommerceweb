import React from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm';
import { Image } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import Img from '../../assets/images/slider1.png';
import {
  GoogleCircleFilled,
  FacebookOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';


const SigninPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ccc' }}>
      <div style={{ width: '800px', height: '400px', borderRadius: '10px', backgroundColor: 'white', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1>Sign In</h1>
          <InputForm style={{ marginBottom: '12px' }} placeholder="Email" />
          <div style={{ position: 'relative', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <InputForm style={{ marginBottom: '12px' }} placeholder="Password" />
            <EyeInvisibleOutlined />
            <EyeOutlined />
          </div>
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: 'pink',
              border: 'none'
            }}
            textButton={'Sign In'}
            styleTextButton={{
              color: 'white',
              fontSize: '16px'
            }}
          ></ButtonComponent>
          <p><WrapperText>Forgot your password?</WrapperText></p>
          <p>Don't have an account?<WrapperText>Sign up</WrapperText></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            <GoogleCircleFilled style={{ fontSize: '50px', color: 'pink' }} />
            <FacebookOutlined style={{ fontSize: '50px', color: 'pink' }} />
          </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={Img} alt="Sign In" preview={false} style={{ width: '200px', height: '200px' }} />
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SigninPage
