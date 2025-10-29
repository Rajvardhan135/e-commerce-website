import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, selectOrdersLoading, selectOrdersError, fetchOrders } from '../../store/orders/order-history.reducer';
import { useCurrency } from '../../context/CurrencyContext';
import { convertPrice, getCurrencySymbol } from '../../utils/currency.utils';
import { Spinner } from '../../components/spinner/spinner.component';
import './order-history.styles.scss';


const OrderHistoryPage = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const isLoading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const currentUser = useSelector(state => state.user.currentUser);
    const { currency } = useCurrency();
    const symbol = getCurrencySymbol(currency);

    useEffect(() => {
        if (currentUser) {
            console.log('Current User:', currentUser); // Debug log
            dispatch(fetchOrders(currentUser.uid));
        }
    }, [dispatch, currentUser]);

    // Debug logs
    useEffect(() => {
        console.log('Orders from state:', orders);
        console.log('Loading state:', isLoading);
        console.log('Error state:', error);
    }, [orders, isLoading, error]);

    // ensure orders is an array and filter safely
    const filteredOrders = useMemo(() => {
        if (!currentUser) return [];
        if (!Array.isArray(orders)) {
            console.warn('orders is not an array in state:', orders);
            return [];
        }
        return orders.filter(order => order?.user?.uid === currentUser.uid);
    }, [orders, currentUser]);

    const getOrderDate = (order) => {
        if (order.createdAt && typeof order.createdAt.seconds === 'number') {
            // Firestore timestamp
            return new Date(order.createdAt.seconds * 1000 + Math.floor(order.createdAt.nanoseconds / 1000000));
        }
        if (order.date) {
            return new Date(order.date);
        }
        return new Date();
    };

    const calculateOrderTotal = (items = []) => {
        const total = items.reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 0)), 0);
        return convertPrice(total, currency);
    };

    // rendering part: guard the inner map over items
    return (
        <div className='order-history-container'>
            <h2>Order History</h2>
            {isLoading ? (
                <div className='spinner-container'>
                    <Spinner />
                </div>
            ) : error ? (
                <div className='error-message'>
                    <p>Error loading orders: {error}</p>
                </div>
            ) : (!filteredOrders || filteredOrders.length === 0) ? (
                <div className='empty-history'>
                    <p>No past transactions found.</p>
                    <p>Once you place an order, it will appear here.</p>
                </div>
            ) : (
                <div className='orders-list'>
                    {filteredOrders.map((order) => (
                        <div key={order.id} className='order-item'>
                            <div className='order-header'>
                                <span className='order-date'>
                                    Order Date: {getOrderDate(order).toLocaleString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                    })}
                                </span>
                                <span className='order-id'>
                                    Order ID: #{order.id}
                                </span>
                            </div>
                            <div className='order-products'>
                                {(() => {
                                    const items = Array.isArray(order.items) ? order.items : (Array.isArray(order.products) ? order.products : []);
                                    return items.map((item) => (
                                        <div key={item?.id ?? `${order.id}-${Math.random()}`} className='order-product'>
                                            <img src={item?.image} alt={item?.name} />
                                            <div className='product-details'>
                                                <h4>{item?.name}</h4>
                                                <p>Quantity: {item?.quantity}</p>
                                                <p>Price: {symbol}{(convertPrice(item?.price || 0, currency)).toFixed(2)}</p>
                                                <p>Category: {item?.category}</p>
                                                <p>Description: {item?.description}</p>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                            <div className='order-footer'>
                                <span className='order-total'>
                                    {(() => {
                                        const items = Array.isArray(order.items) ? order.items : (Array.isArray(order.products) ? order.products : []);
                                        return `Total: ${symbol}${calculateOrderTotal(items).toFixed(2)}`;
                                    })()}
                                </span>
                                <span className='order-status'>
                                    Status: {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;