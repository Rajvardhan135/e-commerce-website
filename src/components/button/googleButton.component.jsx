import React from 'react';
import { ReactComponent as GoogleIcon } from '../../assets/google-icon.svg'
import './googleButton.styles.scss'

const GoogleButton = (props) => {
    return (
        <button className='google-btn' {...props} >
            <GoogleIcon className='google-icon' />
            {props.children}
        </button>

    );
};

export default GoogleButton;