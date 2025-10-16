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
    <div className="product-card" id={`product-${product.id}`}>
            <div className="product-image" style={style} />
            <h3 className="product-name">{product.name || product.title || 'Untitled'}</h3>
            <p className="product-description">{product.description || product.desc || ''}</p>
            <p className="product-price">Price: ${product.price}</p>
            <CartButton onClick={onClickHandler} style={{ margin: '10px 0' }}>Add to Cart</CartButton>
        </div>
    )
}

export default ProductCard