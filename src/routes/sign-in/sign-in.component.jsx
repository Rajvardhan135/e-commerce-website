import React from 'react';
import { NavLink } from 'react-router-dom';
import './sign-in.styles.scss'
import Button from '../../components/button/button.component';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAuthWithEmailAndPassword, signInWithGooglePopup } from '../../utils/firebase/firebase.utils';
import GoogleButton from '../../components/button/googleButton.component';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.action';

const defaultFormFields = {
    email: '',
    password: '',
}


const SignIn = () => {
    const [formFields, setFormFilds] = useState(defaultFormFields);
    const { email, password } = formFields;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = async (event) => {
        const { name, value } = event.target;
        setFormFilds((prevState) => ({ ...prevState, [name]: value }));
    }

    const resetFormFields = () => setFormFilds(defaultFormFields)

    const signInWithGoogle = async () => {
        const { user } = await signInWithGooglePopup();
        if (user) {
            dispatch(setCurrentUser(user))
            navigate('/');
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { user } = await signInAuthWithEmailAndPassword(email, password);
            resetFormFields();
            if (user) {
                dispatch(setCurrentUser(user))
                navigate('/');
            }

        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    alert('Incorrect password')
                    break;
                case "auth/user-not-found":
                    alert('No user associated with this email');
                    break
                default:
                    console.log(error);
            }
            console.log(error);
        }
    }

    return (
        <div className='sign-in-container'>
            <div className='sign-in-image-container'>
                <div className='sign-in-image' />
            </div>
            <div className='sign-in-form-container'>
                <h2 className='sign-in-header'>Welcome Back</h2>
                <form className='sign-in-form' onSubmit={handleSubmit}>
                    <input type='email' name='email' placeholder='Email' className='sign-in-input' onChange={handleChange} required password={email} />
                    <input type='password' name='password' placeholder='Password' className='sign-in-input' onChange={handleChange} required value={password} />
                    <Button type='submit'>Sign In</Button>
                    <GoogleButton type="button" onClick={signInWithGoogle}>Google Sign In</GoogleButton>
                </form>
                <p >Do not have an account? <NavLink className='sign-up-link' to='/sign-up'>Sign up</NavLink></p>
            </div>
        </div>
    );
};

export default SignIn;