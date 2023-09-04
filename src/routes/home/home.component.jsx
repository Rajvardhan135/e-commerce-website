import React, { useEffect, useState } from 'react';
import './home.styles.scss'
import Button from '../../components/button/button.component';
import { ReactComponent as Ship } from '../../assets/shipping.svg';
import { ReactComponent as Refund } from '../../assets/refund.svg';
import { ReactComponent as Payment } from '../../assets/payment.svg';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../utils/fakestore/fakestore.utils';
import CategoryPreview from '../../components/categoryPreview/category-preview.component';

const Home = () => {
    const navigate = useNavigate();
    const [highetRatedItems, setHighestRatedItems] = useState([]);

    const onNavigateHandler = (route) => {
        navigate(route)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getAllProducts();
                setHighestRatedItems(products.filter(product => product.rating.rate > 4.5))
            } catch (error) {
                alert('Please reload error in fetchind data from api')
            }
        }
        fetchData();
    }, [])

    return (
        <div className='home'>
            <div className='hero-section' >
                <div className='hero-img' />
                <div className='hero-container'>
                    <div className='header-container'>
                        <div className='head-bar' />
                        <h1 className='hero-h1'>Trending Women's Collection</h1>
                    </div>
                    <p className='hero-text'>Effortlessly Fortable</p>
                    <Button className='hero-button' onClick={onNavigateHandler.bind(this, 'shop/womens')}>Shop now</Button>
                </div>
            </div>

            <div className='features'>
                <div className='feature-container'>
                    <Ship className='feature-icon' />
                    <span className='feature-text'>Free shipping</span>
                </div>
                <div className='feature-container'>
                    <Payment className='feature-icon' />
                    <span className='feature-text'>Secure Payment</span>
                </div>
                <div className='feature-container'>
                    <Refund className='feature-icon' />
                    <span className='feature-text'>Easy Return</span>
                </div>
            </div>

            <div className='collection-section'>
                <h1 className='collection-header'>OUR COLLECTION</h1>
                <div className='collections'>
                    <div className='collection-container women-collection' onClick={onNavigateHandler.bind(this, 'shop/womens')} />
                    <div className='collection-container jewelery-collection' onClick={onNavigateHandler.bind(this, 'shop/jewelery')} />
                    <div className='collection-container men-collection' onClick={onNavigateHandler.bind(this, 'shop/mens')} />
                    <div className='collection-container electronic-collection' onClick={onNavigateHandler.bind(this, 'shop/electronics')} />
                </div>
            </div>

            <div className='highest-rated-product-container'>
                <h1 className='rating-header'>Our highest Rated Products</h1>
                {highetRatedItems && <CategoryPreview products={highetRatedItems} />}
            </div>
        </div>
    );
};

export default Home;