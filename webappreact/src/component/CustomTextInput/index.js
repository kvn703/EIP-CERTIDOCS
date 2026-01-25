import React, { useState, useEffect } from 'react';
import './style.css';

const CustomTextInput = ({
    id,
    rows,
    cols,
    placeholder,
    value,
    onChange,
    showCharCount = false,
    maxLength,
    ...props
}) => {
    const [charCount, setCharCount] = useState(0);
    
    useEffect(() => {
        if (value) {
            setCharCount(value.length);
        } else {
            setCharCount(0);
        }
    }, [value]);

    return (
        <div className="custom-text-input-wrapper">
        <textarea
            id={id}
            placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
            {...(rows && { rows })}
            {...(cols && { cols })}
                {...props}
        ></textarea>
            {showCharCount && (
                <div className="char-count">
                    <span className={charCount > 0 ? 'char-count-active' : ''}>
                        {charCount}
                    </span>
                    {maxLength && (
                        <span className="char-count-max"> / {maxLength}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomTextInput;
