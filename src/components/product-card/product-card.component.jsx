import { useDispatch } from 'react-redux';
import { useCurrency } from '../../context/CurrencyContext';
import { addItemToCart } from '../../store/cart/cart.action';
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils';
import CartButton from '../button/cart-button.component';
import './product-card.styles.scss';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const style = {
        backgroundImage: `url(${product.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '180px',
        borderRadius: '10px',
        marginBottom: '16px'
    }

    const onClickHandler = () => {
        dispatch(addItemToCart(product));
    }

    const { currency } = useCurrency();
    let displayPrice = product.price || 0;
    try { displayPrice = convertPrice(Number(product.price || 0), currency); } catch (e) { /* ignore */ }
    const symbol = getCurrencySymbol(currency);

    return (
        <div className="product-card" id={`product-${product.id}`}>
            <div className="product-image" style={style} />
            <h3 className="product-name">{product.name || product.title || 'Untitled'}</h3>
            <p className="product-description">{product.description || product.desc || ''}</p>
            <p className="product-price">Price: {symbol}{displayPrice.toFixed ? displayPrice.toFixed(2) : displayPrice} {currency}</p>
            <CartButton onClick={onClickHandler} style={{ margin: '10px 0' }}>Add to Cart</CartButton>
        </div>
    )
}

export default ProductCard