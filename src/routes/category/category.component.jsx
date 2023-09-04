import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../utils/fakestore/fakestore.utils';
import './category.styles.scss'
import ProductCard from '../../components/product-card/product-card.component';

const Category = () => {
    const { category } = useParams()
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                switch (category) {
                    case 'mens': {
                        const productResponse = await getProducts(`men's clothing`);
                        setProducts(productResponse);
                        break;
                    }
                    case 'womens': {
                        const productResponse = await getProducts(`women's clothing`);
                        setProducts(productResponse)
                        break;
                    }
                    case 'jewelery': {
                        const productResponse = await getProducts(`jewelery`);
                        setProducts(productResponse);
                        break;
                    }
                    case 'electronics': {
                        const productResponse = await getProducts(`electronics`);
                        setProducts(productResponse);
                        break;
                    }
                    default: {
                        alert('wrong url');
                    }
                }
            } catch (error) {
                alert('Please Reload the page error while fetching data from api')
            }
        }
        fetchData();
    }, [category])

    return (
        <div className='category-section'>
            <h1 className='category-header'>{category}</h1>
            <div className='category-container'>
                {products.map((product) => <ProductCard product={product} key={product.id} />)}
            </div>
        </div>
    );
};

export default Category;