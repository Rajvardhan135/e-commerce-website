import { addItemToCart, removeItemFromCart, clearItemFromCart } from '../../store/cart/cart.action'
import './checkout-item.styles.scss';
import { useDispatch } from 'react-redux';

const CheckoutItem = ({ item }) => {
    const { title, description, image, quantity, price } = item;
    const dispatch = useDispatch();

    const onAddItem = () => {
        dispatch(addItemToCart(item))
    }
    const onRemoveItem = () => {
        dispatch(removeItemFromCart(item))
    }
    const onClearItem = () => {
        dispatch(clearItemFromCart(item))
    }

    return (
        <div className="checkout-item-container">
            <img src={image} alt='' className='checkout-item-image' />
            <div className='checkout-item-content'>
                <h2 className='checkout-title'>{title}</h2>
                <p className='checkout-description'>Description: {description}</p>
                <div className='checkout-quantity'>
                    Quantity <span className='quantity-arrow' onClick={onRemoveItem}>&#10094;</span> {quantity} <span className='quantity-arrow' onClick={onAddItem}>&#10095;</span>
                    <span className='clear-button' onClick={onClearItem}>&#10005;</span>
                </div>
                <span>Price: ${price}</span>
            </div>
        </div>
    )
}

export default CheckoutItem;