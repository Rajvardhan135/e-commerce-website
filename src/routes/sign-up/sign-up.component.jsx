import React from 'react';
import { NavLink } from 'react-router-dom';
import './sign-up.styles.scss'
import Button from '../../components/button/button.component';
import { useState } from 'react';
import { createAuthWithEmailAndPassword } from '../../utils/firebase/firebase.utils';
import { useNavigate } from 'react-router-dom';

const defaultFormFields = {
    email: '',
    password: '',
}


const SignUp = () => {
    const [formFields, setFormFilds] = useState(defaultFormFields);
    const { email, password } = formFields;
    const navigate = useNavigate();

    const handleChange = async (event) => {
        const { name, value } = event.target;
        setFormFilds((prevState) => ({ ...prevState, [name]: value }));
    }
    const resetFormFields = () => setFormFilds(defaultFormFields)

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log('triggered');
        try {
            const { user } = await createAuthWithEmailAndPassword(email, password);
            if (user) return navigate('/')


        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('cannot create user, email already in use');
                resetFormFields();
            } else if (error.code === 'auth/weak-password') {
                alert('Passwordd must be atleast 6 character long');
            }
            else {
                console.log('user creation encountered an error ', error);
            }
        }
    }


    return (
        <div className='sign-up-container'>
            <div className='sign-up-image-container'>
                <div className='sign-up-image' />
            </div>
            <div className='sign-up-form-container'>
                <h2 className='sign-up-header'>Let us get started</h2>
                <form className='sign-up-form' onSubmit={handleSubmit}>
                    <input type='email' name='email' placeholder='Email' className='sign-up-input' onChange={handleChange} required value={email} />
                    <input type='password' name='password' placeholder='Password' className='sign-up-input' onChange={handleChange} required value={password} />
                    <Button type='submit'>Sign Up</Button>
                </form>
                <p >Already have an account? <NavLink className='sign-in-link' to='/sign-in'>Sign in</NavLink></p>
            </div>
        </div>
    );
};

export default SignUp;