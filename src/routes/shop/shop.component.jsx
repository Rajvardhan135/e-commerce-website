import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Category from '../category/category.component';

import Home from '../home/home.component';

const Shop = () => {
    return (
        <div>
            <Routes>
                <Route index element={<Home />} />
                <Route path=':category' element={<Category />} />
            </Routes>
        </div>
    );
};

export default Shop;