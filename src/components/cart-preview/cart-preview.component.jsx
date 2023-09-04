import './cart-preview.styles.scss'
import CartButton from '../button/cart-button.component'
import CartPreviewItem from '../cart-preview-item/cart-preview-item.component'
import { useNavigate } from 'react-router-dom'

const CartPreview = ({ cartItems }) => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate('/checkout')
    }
    return (
        <div className="cart-preview">
            {cartItems.length > 0 ? cartItems.map((item) => <CartPreviewItem key={item.id} item={item} />) : <p style={{textAlign: 'center'}}>Your cart is empty</p>}
            <CartButton onClick={onClickHandler}>Go to Checkout</CartButton>
        </div>
    )
}

export default CartPreview