import React from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperText } from './style'
import InputForm from '../../components/InputForm/InputForm';
import { Image } from 'antd';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import Img from '../../assets/images/slider1.png';

const SignupPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ccc' }}>
    <div style={{ width: '800px', height: '400px', borderRadius: '10px', backgroundColor: 'white', display: 'flex' }}>
      <WrapperContainerLeft>
        <h1>Sign In</h1>
        <InputForm style={{ marginBottom: '12px' }} placeholder="Email" />
        <InputForm style={{ marginBottom: '12px' }} placeholder="Password" />
        <InputForm style={{ marginBottom: '12px' }} placeholder="Confirm Password" />
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
        <p>If you have an account ? <WrapperText>sign in</WrapperText></p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={Img} alt="Sign In" preview={false} style={{ width: '200px', height: '200px' }} />
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignupPage
