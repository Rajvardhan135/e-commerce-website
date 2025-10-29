import './wishlist-preview-item.styles.scss'
import { useDispatch } from 'react-redux'
import { removeFromWishlist } from '../../store/wishlist/wishlist.reducer'
import { useCurrency } from '../../context/CurrencyContext'
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils'

const WishlistPreviewItem = ({ item }) => {
    const dispatch = useDispatch()
    const { currency } = useCurrency()
    const symbol = getCurrencySymbol(currency)
    const displayPrice = convertPrice(Number(item.price || 0), currency)

    const onRemove = () => dispatch(removeFromWishlist(item.id))

    return (
        <div className='wishlist-preview-item'>
            <div className='image-wrap'>
                <img src={item.image} alt={item.name || item.title} />
            </div>
            <div className='details'>
                <h4 className='title'>{item.name || item.title || 'Untitled'}</h4>
                <p className='desc'>{item.description || item.desc || ''}</p>
                <div className='meta'>
                    <span className='price'>{symbol}{displayPrice.toFixed ? displayPrice.toFixed(2) : displayPrice} {currency}</span>
                    <button className='remove' onClick={onRemove}>Remove</button>
                </div>
            </div>
        </div>
    )
}

export default WishlistPreviewItem
