import React from 'react';
import { ReactComponent as GoogleIcon } from '../../assets/google-icon.svg'
import './googleButton.styles.scss'

const GoogleButton = ({ children, loading, ...props }) => {
    return (
        <button
            className='google-btn'
            {...props}
            aria-label="Sign in with Google"
            disabled={loading}
        >
            <GoogleIcon className='google-icon' />
            {loading ? <span style={{ marginLeft: 8 }}>Signing in...</span> : children}
        </button>
    );
};

export default GoogleButton;