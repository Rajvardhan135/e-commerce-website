import { Outlet } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg'
import { ReactComponent as Bag } from '../../assets/bag.svg'
import { ReactComponent as Menu } from '../../assets/menu-bar.svg'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { signOutUser } from '../../utils/firebase/firebase.utils';
import './navigation.styles.scss'
import { useState } from 'react';
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
    const cartCount = useSelector(selectCartCount);
    const navigate = useNavigate();

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
                        <NavLink as='span' onClick={signOutUser} className='nav-button nav-link'>SIGN OUT</NavLink>
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



