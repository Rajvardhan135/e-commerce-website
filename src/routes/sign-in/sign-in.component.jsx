import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './sign-in.styles.scss';
import Button from '../../components/button/button.component';
import { signInAuthWithEmailAndPassword, signInWithGooglePopup } from '../../utils/firebase/firebase.utils';
import GoogleButton from '../../components/button/googleButton.component';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.action';

const defaultFormFields = {
    email: '',
    password: '',
};

const sanitizeInput = (input) => input.replace(/[<>"'`]/g, '');

const SignIn = () => {
    const [formFields, setFormFilds] = useState(defaultFormFields);
    const { email, password } = formFields;
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFilds((prevState) => ({ ...prevState, [name]: sanitizeInput(value) }));
    };

    const resetFormFields = () => setFormFilds(defaultFormFields);

    const signInWithGoogle = async () => {
        setGoogleLoading(true);
        try {
            const { user } = await signInWithGooglePopup();
            if (user) {
                dispatch(setCurrentUser(user));
                navigate('/');
            }
        } catch {
            alert('Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { user } = await signInAuthWithEmailAndPassword(email, password);
            resetFormFields();
            if (user) {
                dispatch(setCurrentUser(user));
                navigate('/');
            }
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                case "auth/user-not-found":
                    alert('Invalid email or password.');
                    break;
                default:
                    alert('Sign-in failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="sign-in-main">
            <section className="sign-in-card">
                <div className="sign-in-image" />
                <div className="sign-in-content">
                    <h2 className="sign-in-header">Welcome Back</h2>
                    <form className="sign-in-form" onSubmit={handleSubmit} autoComplete="on">
                        <label htmlFor="email" className="sign-in-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="sign-in-input"
                            onChange={handleChange}
                            required
                            value={email}
                            autoComplete="username"
                            disabled={loading || googleLoading}
                        />
                        <label htmlFor="password" className="sign-in-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="sign-in-input"
                            onChange={handleChange}
                            required
                            value={password}
                            autoComplete="current-password"
                            disabled={loading || googleLoading}
                        />
                        <Button type="submit" disabled={loading || googleLoading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <GoogleButton type="button" onClick={signInWithGoogle} loading={googleLoading}>
                            Google Sign In
                        </GoogleButton>
                    </form>
                    <p className="sign-in-footer">
                        Don't have an account?
                        <NavLink className="sign-up-link" to="/sign-up">Sign up</NavLink>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignIn;