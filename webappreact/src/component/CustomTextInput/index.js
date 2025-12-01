import React from 'react';
import './style.css';

const CustomTextInput = ({
    id,
    rows,
    cols,
    placeholder,
    value,
    onChange,
    ...props
}) => {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...(rows && { rows })}
            {...(cols && { cols })}
            {...props}
        ></textarea>
    );
};

export default CustomTextInput;
