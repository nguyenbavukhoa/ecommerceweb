import React from 'react'
import { WrapperLabel } from './style';
import { Checkbox, Rate } from 'antd';

const NavBarComponent = () => {
    const onChange = (checkedValues) => {
        console.log('Checked values:', checkedValues);
    };
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return <p>{option}</p>
                });
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                       {options.map((option) => {
                           return (
                               <Checkbox key={option.value} value={option.value}>
                                   {option.label}
                               </Checkbox>
                           )
                       })}
                    </Checkbox.Group>
                );
            case 'rate':
                return options.map((option) => {
                    return (
                        <Rate disabled defaultValue={option} />
                    )
                });
                ;
            default:
                return null;
        }
    };
    return (
        <div>
            <WrapperLabel>Label</WrapperLabel>
            {renderContent('text', ['Option 1', 'Option 2', 'Option 3'])}
            {renderContent('checkbox', [
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' }
            ])}
            {renderContent('rate', [1, 2, 3, 4, 5])}
            
        </div>
    )
}

export default NavBarComponent
