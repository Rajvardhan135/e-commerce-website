import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom';
// import { getProducts } from '../../utils/fakestore/fakestore.utils';
import { getProducts } from '../../utils/firebase/firebaseStoreServices';
import './category.styles.scss'
import ProductCard from '../../components/product-card/product-card.component';

const SORT_OPTIONS = [
    //{ value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    //{ value: 'newest', label: 'New Arrivals' },
];

const Category = () => {
    const { category } = useParams()
    const [products, setProducts] = useState([])
    const location = useLocation()

    // UI state
    const [query, setQuery] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [availabilityOnly, setAvailabilityOnly] = useState(false)
    const [selectedSort, setSelectedSort] = useState('relevance')

    // temporary filter state while the panel is open; applied only when user clicks Apply
    const [tempPriceRange, setTempPriceRange] = useState([0, 1000])
    const [tempAvailabilityOnly, setTempAvailabilityOnly] = useState(false)
    const [tempSelectedSort, setTempSelectedSort] = useState('relevance')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch products for the current category; be permissive about category values
                let productResponse = [];
                try {
                    productResponse = await getProducts(category || '')
                } catch (err) {
                    productResponse = []
                }

                // normalize data if needed (ensure price and createdAt)
                const normalized = productResponse.map(p => ({
                    ...p,
                    price: Number(p.price) || 0,
                    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
                    inStock: p.inStock === undefined ? true : Boolean(p.inStock),
                }))

                setProducts(normalized);
            } catch (error) {
                alert('Please Reload the page error while fetching data from api')
            }
        }
        fetchData();
    }, [category])

    // Listen for global search and filter toggle events from header
    useEffect(() => {
        const onGlobalSearch = (e) => {
            setQuery(e.detail?.query || '')
        }
        const onToggleFilters = () => setShowFilters(s => !s)

        window.addEventListener('global:search', onGlobalSearch)
        window.addEventListener('global:toggleFilters', onToggleFilters)
        return () => {
            window.removeEventListener('global:search', onGlobalSearch)
            window.removeEventListener('global:toggleFilters', onToggleFilters)
        }
    }, [])

    // sync temp state with actual state when opening the panel
    useEffect(() => {
        if (showFilters) {
            setTempPriceRange(priceRange)
            setTempAvailabilityOnly(availabilityOnly)
            setTempSelectedSort(selectedSort)
        }
    }, [showFilters])

    // Suggestions derived from products and query (use `name` as primary, fallback to `title`)
    const suggestions = useMemo(() => {
        if (!query) return []
        const q = query.toLowerCase()
        return products
            .filter(p => ((p.name && p.name.toLowerCase().includes(q)) || (p.title && p.title.toLowerCase().includes(q))))
            .slice(0, 6)
            .map(p => ({ id: p.id, title: p.name || p.title, category: p.category }))
    }, [products, query])

    // Filter + sort pipeline
    const displayedProducts = useMemo(() => {
        let list = [...products]

        // search
        if (query) {
            const q = query.toLowerCase()
            list = list.filter(p => (
                ((p.name && p.name.toLowerCase().includes(q)) || (p.title && p.title.toLowerCase().includes(q))) ||
                (p.description && p.description.toLowerCase().includes(q))
            ))
        }

        // availability
        if (availabilityOnly) {
            list = list.filter(p => p.inStock)
        }

        // price range
        list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

        // sort
        switch (selectedSort) {
            case 'price-asc':
                list.sort((a, b) => a.price - b.price)
                break;
            case 'price-desc':
                list.sort((a, b) => b.price - a.price)
                break;
            case 'newest':
                list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break;
            case 'relevance':
            default:
                // keep original order or leave as-is
                break;
        }

        return list
    }, [products, query, availabilityOnly, priceRange, selectedSort])

    // when navigated with ?productId=..., scroll to that product and highlight it briefly
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const productId = params.get('productId')
        if (!productId) return
        // wait a tick for products to render
        setTimeout(() => {
            const el = document.getElementById(`product-${productId}`)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('highlight')
                setTimeout(() => el.classList.remove('highlight'), 3000)
            }
        }, 300)
    }, [location.search, products])

    // handlers
    const onSuggestionClick = (title) => {
        setQuery(title)
        setShowSuggestions(false)
    }

    const onPriceChange = (e, idx, target = 'live') => {
        const val = Number(e.target.value)
        const setter = target === 'live' ? setPriceRange : setTempPriceRange
        setter(prev => {
            const copy = [...prev]
            copy[idx] = isNaN(val) ? prev[idx] : val
            return copy
        })
    }

    const onApplyFilters = () => {
        // copy temp values into active filters
        setPriceRange([...tempPriceRange])
        setAvailabilityOnly(Boolean(tempAvailabilityOnly))
        setSelectedSort(tempSelectedSort)
        setShowFilters(false)
    }

    return (
        <div className='category-section'>
            <div className='category-header-row'>
                <h1 className='category-header'>{category}</h1>
                <button className='category-filter-icon' title='Filters' onClick={() => window.dispatchEvent(new CustomEvent('global:toggleFilters'))}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5H21" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M7 12H17" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10 19H14" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>

            <div className='category-controls'>
                <div className='filters'>
                    <button className='filters-toggle-mobile' onClick={() => setShowFilters(s => !s)}>Filters</button>

                    {showFilters && (
                        <div className='filters-panel'>
                            <label>
                                Price
                                <div className='price-inputs'>
                                    <input type='number' min='0' value={tempPriceRange[0]} onChange={(e) => onPriceChange(e, 0, 'temp')} />
                                    <span>—</span>
                                    <input type='number' min='0' value={tempPriceRange[1]} onChange={(e) => onPriceChange(e, 1, 'temp')} />
                                </div>
                                <div className='price-display'>
                                    <strong>{tempPriceRange[0]}</strong>
                                    <span> to </span>
                                    <strong>{tempPriceRange[1]}</strong>
                                </div>
                            </label>

                            <label className='availability'>
                                <input type='checkbox' checked={tempAvailabilityOnly} onChange={(e) => setTempAvailabilityOnly(e.target.checked)} />
                                In stock only
                            </label>

                            <label>
                                Sort
                                <select value={tempSelectedSort} onChange={(e) => setTempSelectedSort(e.target.value)}>
                                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </label>

                            <div className='filters-actions'>
                                <button className='apply-filters' onClick={onApplyFilters}>Apply</button>
                                <button className='reset-filters' onClick={() => {
                                    setTempPriceRange([0, 1000])
                                    setTempAvailabilityOnly(false)
                                    setTempSelectedSort('relevance')
                                }}>Reset</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='category-container'>
                {displayedProducts.length === 0 && <p className='no-results'>No products match your filters.</p>}
                {displayedProducts.map((product) => <ProductCard product={product} key={product.id} />)}
            </div>
        </div>
    );
};

export default Category;