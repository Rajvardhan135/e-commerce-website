import { useDispatch } from 'react-redux';
import { useCurrency } from '../../context/CurrencyContext';
import { addItemToCart, clearItemFromCart, removeItemFromCart } from '../../store/cart/cart.action';
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils';
import './checkout-item.styles.scss';

const CheckoutItem = ({ item }) => {
    const { title, description, image, quantity, price } = item;
    const dispatch = useDispatch();
    const { currency } = useCurrency();
    const symbol = getCurrencySymbol(currency);
    const displayPrice = convertPrice(Number(price || 0), currency);

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
                <span>Price: {symbol}{displayPrice.toFixed(2)} {currency}</span>
            </div>
        </div>
    )
}

export default CheckoutItem;