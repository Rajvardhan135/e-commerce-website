import './cart-preview-item.styles.scss'

const CartPreviewItem = ({ item }) => {
    return (
        <div className='category-preview-item-container'>
            <div className='cart-preview-image-container'>
                <img src={item.image} alt='' className='cart-preview-image' />
            </div>
            <div className='category-preview-content'>
                <span className='category-preview-title'>{item.title}</span>
                <span>{item.quantity} x ${item.price}</span>
            </div>
        </div>
    )
}

export default CartPreviewItem