import React, { useState } from 'react'
import { Input } from 'antd';

const InputForm = (props) => {
    const [valueInput, setValueInput] = useState('');
    const { placeholder = 'Text', ...rests } = props;
    return (
        <Input placeholder={placeholder} valueInput={valueInput} {...rests} />
    )
}

export default InputForm
