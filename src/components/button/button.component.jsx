import React from 'react';
import './button.styles.scss'

const Button = (props) => {
    return (
        <button className='button-container' {...props} />
    );
};

export default Button;