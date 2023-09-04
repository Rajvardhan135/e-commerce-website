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
        height: '80%'
    }

    const onClickHandler = () => {
        dispatch(addItemToCart(product));
    }

    return (
        <div className="product-card">
            <div style={style} />
            <p>Price: ${product.price}</p>
            <CartButton onClick={onClickHandler} style={{ margin: '10px 0' }}>Add to Cart</CartButton>
        </div>
    )
}

export default ProductCard