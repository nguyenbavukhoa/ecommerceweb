import React from 'react'
import { Input } from 'antd';

const InputComponent = ({ placeholder, size, bordered, backgroundColorInput }) => {
  return (
       <Input placeholder={placeholder} 
            size={size} bordered={bordered} 
            style={{ backgroundColor: backgroundColorInput }} />
  )
}

export default InputComponent
