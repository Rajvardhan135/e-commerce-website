import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import './checkout.styles.scss'
import CartButton from '../../components/button/cart-button.component';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (cartTotal > 0) currentUser ? alert('Thank you') : navigate('/sign-in')
        else alert('No item to buy')
    }

    return (
        <div className='checkout'>
            <div className='checkout-container'>
                {cartItems.map((item) => <CheckoutItem item={item} key={item.id} />)}
            </div>
            <div className='checkout-total'>
                <span className='total'>Total $<span className='total-cost'>{cartTotal.toFixed(2)}</span></span>
            </div>
            <CartButton className='checkout-button' style={{ margin: '0px 50px 50px 50px', fontSize: 36, padding: '10px' }} onClick={onClickHandler}>Order now</CartButton>
        </div>
    );
};

export default Checkout;