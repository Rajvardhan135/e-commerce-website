import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist } from '../../store/wishlist/wishlist.reducer';
import { useCurrency } from '../../context/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils';
import { addItemToCart } from '../../store/cart/cart.action';
import { Spinner } from '../../components/spinner/spinner.component';
import './wishlist.styles.scss';

const WishlistPage = () => {
    const wishlistItems = useSelector(selectWishlistItems);
    const dispatch = useDispatch();
    const { currency } = useCurrency();
    const symbol = getCurrencySymbol(currency);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    }, []);

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    const handleAddToCart = (product) => {
        dispatch(addItemToCart(product));
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className='spinner-container'>
                    <Spinner />
                </div>
            );
        }

        if (wishlistItems.length === 0) {
            return (
                <div className='empty-wishlist'>
                    <p>Your wishlist is empty</p>
                    <p>Add items to your wishlist by clicking the heart icon on products</p>
                </div>
            );
        }

        return (
            <div className='wishlist-items-grid'>
                {wishlistItems.map((item) => (
                    <div key={item.id} className='wishlist-product-card'>
                        <div className='product-image-container'>
                            <img src={item.image} alt={item.name || item.title} className='product-image' />
                        </div>
                        <div className='product-details'>
                            <h2 className='product-title'>{item.name || item.title}</h2>
                            <p className='product-description'>{item.description}</p>
                            <div className='product-meta'>
                                <span className='product-category'>Category: {item.category}</span>
                                <span className='product-price'>
                                    {symbol}{convertPrice(item.price, currency).toFixed(2)} {currency}
                                </span>
                            </div>
                            <div className='product-actions'>
                                <button 
                                    className='add-to-cart-button'
                                    onClick={() => handleAddToCart(item)}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    className='remove-button'
                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                >
                                    Remove from Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='wishlist-page-container'>
            <div className='wishlist-header'>
                <h1>My Wishlist</h1>
                <span className='item-count'>({wishlistItems.length} items)</span>
            </div>
            {renderContent()}
        </div>
    );
};

export default WishlistPage;