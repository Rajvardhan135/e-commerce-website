import './wishlist-preview.styles.scss'
import WishlistPreviewItem from '../wishlist-preview-item/wishlist-preview-item.component'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectWishlistItems } from '../../store/wishlist/wishlist.reducer'

const WishlistPreview = () => {
    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)

    const onGoToWishlist = () => {
        navigate('/wishlist')
    }

    return (
        <div className="wishlist-preview">
            {wishlistItems && wishlistItems.length > 0 ? (
                wishlistItems.map(item => <WishlistPreviewItem key={item.id} item={item} />)
            ) : (
                <p style={{ textAlign: 'center' }}>Your wishlist is empty</p>
            )}
            <button className='wishlist-go' onClick={onGoToWishlist}>View Full Wishlist</button>
        </div>
    )
}

export default WishlistPreview
