import { useCurrency } from '../../context/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils';
import './cart-preview-item.styles.scss';

const CartPreviewItem = ({ item }) => {
    const { currency } = useCurrency();
    const symbol = getCurrencySymbol(currency);
    const displayPrice = convertPrice(Number(item.price || 0), currency);
    return (
        <div className='category-preview-item-container'>
            <div className='cart-preview-image-container'>
                <img src={item.image} alt='' className='cart-preview-image' />
            </div>
            <div className='category-preview-content'>
                <span className='category-preview-title'>{item.title}</span>
                <span>{item.quantity} x {symbol}{displayPrice.toFixed(2)} {currency}</span>
            </div>
        </div>
    )
}

export default CartPreviewItem