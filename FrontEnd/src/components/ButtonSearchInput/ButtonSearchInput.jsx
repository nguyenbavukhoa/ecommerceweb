import React from 'react'
import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';


const ButtonSearchInput = (props) => {
    const { size, placeholder, textButton, bordered,
        backgroundColorInput = 'white',
        backgroundColorButton = 'pink',
        colorButton = 'white' } = props;
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                placeholder={placeholder}
                size={size}
                bordered={bordered}
                backgroundColorInput={backgroundColorInput}
            />

            <ButtonComponent
                size={size}
                styleButton={{ background: backgroundColorButton, border: !bordered && 'none' }}
                icon={<SearchOutlined color={colorButton} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div>
    )
}

export default ButtonSearchInput
