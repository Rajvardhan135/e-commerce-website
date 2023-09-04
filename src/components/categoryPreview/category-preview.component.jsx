import ProductCard from "../product-card/product-card.component"
import './category-preview.styles.scss'

const CategoryPreview = ({ products }) => {
    return (
        <div className="preview-container">
            {products.map(product => <ProductCard product={product} key={product.id}/>)}
        </div>
    )
}

export default CategoryPreview