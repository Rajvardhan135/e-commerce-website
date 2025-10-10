import { Outlet } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg'
import { ReactComponent as Bag } from '../../assets/bag.svg'
import { ReactComponent as Menu } from '../../assets/menu-bar.svg'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { signOutUser } from '../../utils/firebase/firebase.utils';
import './navigation.styles.scss'
import { useState, useRef, useEffect } from 'react';
import { selectCartCount } from '../../store/cart/cart.selector';
import { selectIsCartOpen, selectCartItems } from '../../store/cart/cart.selector';
import { setCartOpen } from '../../store/cart/cart.action';
import { useDispatch } from 'react-redux';
import CartPreview from '../../components/cart-preview/cart-preview.component';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isCartOpen = useSelector(selectIsCartOpen);
    const cartItems = useSelector(selectCartItems);
    const dispatch = useDispatch()
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef();
    const cartCount = useSelector(selectCartCount);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onMenuClick = () => {
        setMenuOpen(!isMenuOpen);
        isCartOpen && dispatch(setCartOpen(false));
    }

    const onCartClick = () => {
        dispatch(setCartOpen(!isCartOpen));
        isMenuOpen && setMenuOpen(false);
    }

    const onLogoClick = () => {
        navigate('/')
    }

    const menu = isMenuOpen ? 'drawer-nav open' : 'drawer-nav'
    const cartMenu = isCartOpen ? 'cart-nav open' : 'cart-nav'

    return (
        <div>
            <nav className='nav'>
                <Logo onClick={onLogoClick} />
                <div className='nav-links'>
                    <NavLink className='nav-link' to='/shop/mens'>MEN</NavLink>
                    <NavLink className='nav-link' to='/shop/womens'>WOMEN</NavLink>
                    <NavLink className='nav-link' to='/shop/jewelery'>JEWELERY</NavLink>
                    <NavLink className='nav-link' to='/shop/electronics'>ELECTRONIC</NavLink>
                </div>
                <div className='nav-buttons'>
                    {currentUser ? (
                        <div className="profile-section" ref={profileRef}>
                            <div
                                className="profile-trigger"
                                onClick={() => setProfileOpen((open) => !open)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <img
                                    src={
                                        currentUser.photoURL
                                            || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                currentUser.displayName
                                                    || (currentUser.email ? currentUser.email.split('@')[0] : 'User')
                                            )}&background=FFC802&color=181b1e`
                                    }
                                    alt="profile"
                                    className="profile-img"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        marginRight: 8,
                                        objectFit: 'cover',
                                        border: '2px solid #FFC802'
                                    }}
                                />
                                <span style={{ fontWeight: 600, color: '#181b1e' }}>
                                    {currentUser.displayName || currentUser.email}
                                </span>
                            </div>
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    <div className="profile-info">
                                        <img
                                            src={
                                                currentUser.photoURL
                                                    || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        currentUser.displayName
                                                            || (currentUser.email ? currentUser.email.split('@')[0] : 'User')
                                                    )}&background=FFC802&color=181b1e`
                                            }
                                            alt="profile"
                                            className="profile-img"
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                marginBottom: 8,
                                                border: '2px solid #FFC802'
                                            }}
                                        />
                                        <div style={{ fontWeight: 700, marginBottom: 4 }}>
                                            {currentUser.displayName || currentUser.email}
                                        </div>
                                    </div>
                                    <button className="profile-signout" onClick={signOutUser}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to='/sign-in' className='nav-button nav-link'>
                            SIGN IN
                        </NavLink>)
                    }
                    <div className='shopping-bag'>
                        <Bag className='nav-button' onClick={onCartClick} />
                        <span className='item-num'>{cartCount}</span>
                    </div>
                    <div onClick={onMenuClick}>
                        <Menu className='nav-button menu' />
                    </div>
                </div>
            </nav>
            <div className={cartMenu}>
                <CartPreview cartItems={cartItems} />
            </div>
            <div className={menu}>
                <NavLink className='nav-link drawer-nav-link drawer-first-link' to='/shop/mens' onClick={onMenuClick}>MEN</NavLink>
                <NavLink className='nav-link drawer-nav-link' to='/shop/womens' onClick={onMenuClick}>WOMEN</NavLink>
                <NavLink className='nav-link drawer-nav-link' to='/shop/jewelery' onClick={onMenuClick}>JEWELERY</NavLink>
                <NavLink className='nav-link drawer-nav-link drawer-last-link' to='/shop/electronics' onClick={onMenuClick}>ELECTRONIC</NavLink>
            </div>
            {(isMenuOpen || isCartOpen) && (
                <div
                    className="nav-backdrop"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.18)',
                        zIndex: 1099,
                        transition: 'opacity 0.3s',
                    }}
                    onClick={() => {
                        setMenuOpen(false);
                        dispatch(setCartOpen(false));
                    }}
                />
            )}
            <Outlet />
        </div>
    );
};

export default Navigation;

/*
    categories: {
        mens: [
            {

            },
            {

            }
        ],

        womens: [

        ],

        jewelery: [

        ]
    }


    ["mens", "womens", "jewelery"],
    [
        {}, {}, {}, {}
    ]

*/



