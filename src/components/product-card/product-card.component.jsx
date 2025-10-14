import './product-card.styles.scss'
import CartButton from '../button/cart-button.component'
import { addItemToCart } from '../../store/cart/cart.action';
import { useDispatch } from 'react-redux';

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

    return (
        <div className="product-card">
            <div style={style} />
            <h3 className="product-title" style={{ margin: '8px 0', fontWeight: 700, fontSize: '1.1rem', color: '#181b1e' }}>
                {product.name || product.title}
            </h3>
            <p style={{ color: '#2563eb', fontWeight: 600, margin: '4px 0' }}>
                ${product.price}
            </p>
            <CartButton onClick={onClickHandler} style={{ margin: '10px 0' }}>Add to Cart</CartButton>
        </div>
    )
}

export default ProductCard