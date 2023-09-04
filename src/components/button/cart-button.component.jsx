import './cart-button.styles.scss'

const CartButton = ({ children, onClick, style }) => {
    return (
        <button className="cart-button" style={style} onClick={onClick}>{children}</button>
    )
}

export default CartButton;