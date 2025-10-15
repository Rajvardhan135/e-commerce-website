import { Outlet } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/logo.svg'
import { ReactComponent as Bag } from '../../assets/bag.svg'
import { ReactComponent as Menu } from '../../assets/menu-bar.svg'
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { signOutUser } from '../../utils/firebase/firebase.utils';
import './navigation.styles.scss'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { selectCartCount } from '../../store/cart/cart.selector';
import { selectIsCartOpen, selectCartItems } from '../../store/cart/cart.selector';
import { setCartOpen } from '../../store/cart/cart.action';
import { useDispatch } from 'react-redux';
import CartPreview from '../../components/cart-preview/cart-preview.component';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../utils/firebase/firebaseStoreServices';

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
                <div className='nav-search'>
                    <SearchBar />
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

// Local SearchBar component (defined before Navigation)
function SearchBar() {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [show, setShow] = useState(false)
    const allProductsRef = useRef([])
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const prods = await getAllProducts()
                if (!mounted) return
                allProductsRef.current = prods || []
            } catch (err) {
                // ignore
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (!query) return setSuggestions([])
        const q = query.toLowerCase()
        const s = allProductsRef.current.filter(p => {
            const label = (p.name || p.title || '').toLowerCase()
            return label.includes(q)
        }).slice(0,6)
        setSuggestions(s)
    }, [query])

    const onSubmit = useCallback((e) => {
        e && e.preventDefault()
        // dispatch a custom event so pages can listen and apply query
        window.dispatchEvent(new CustomEvent('global:search', { detail: { query } }))
        // try to find an exact product match by name/title
        const match = allProductsRef.current.find(p => ((p.name || p.title || '').toLowerCase() === (query || '').toLowerCase()))
        if (match) {
            const category = match.category || ''
            if (category) navigate(`/shop/${category}?productId=${match.id}`)
            else navigate('/shop')
        } else if (suggestions && suggestions.length > 0) {
            // fallback to first suggestion
            const first = suggestions[0]
            if (first.category) navigate(`/shop/${first.category}?productId=${first.id}`)
            else navigate('/shop')
        } else {
            navigate('/shop')
        }
        setShow(false)
    }, [query, suggestions, navigate])

    const onFilterClick = () => {
        window.dispatchEvent(new CustomEvent('global:toggleFilters'))
    }

    return (
        <div className='global-search'>
            <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                    className='search-input'
                    placeholder='Search products...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShow(true)}
                    onBlur={() => setTimeout(() => setShow(false), 150)}
                />
                <button type='submit' className='search-go'>Search</button>
            </form>
            {show && suggestions.length > 0 && (
                <ul className='suggestions-list'>
                    {suggestions.map(s => (
                        <li key={s.id} onMouseDown={() => {
                            const label = s.name || s.title || ''
                            setQuery(label)
                            window.dispatchEvent(new CustomEvent('global:search', { detail: { query: label } }))
                            setShow(false)
                            let cat = s.category
                            if (!cat) {
                                const full = allProductsRef.current.find(p => p.id === s.id)
                                cat = full?.category
                            }
                            if (cat) navigate(`/shop/${cat}?productId=${s.id}`)
                        }}>{s.name || s.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

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



