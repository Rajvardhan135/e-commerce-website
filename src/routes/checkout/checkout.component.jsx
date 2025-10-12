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

  const onClickHandler = async () => {
  if (cartTotal <= 0) {
    alert('No item to buy');
    return;
  }

  if (!currentUser) {
    navigate('/sign-in');
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/payu/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: cartTotal.toFixed(2),
        firstname: currentUser.displayName || "Guest",
        email: currentUser.email,
        phone: "9999999999",
        productinfo: "Cart Checkout",
      }),
    });

    const { action, params } = await response.json();

    // Build form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;

    Object.keys(params).forEach(key => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error("Payment Error:", error);
  }
};


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