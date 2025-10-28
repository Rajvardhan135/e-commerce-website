import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserOrders, addOrder as addOrderToFirestore } from '../../utils/firebase/firebaseStoreServices';

const ORDER_HISTORY_INITIAL_STATE = {
    orders: [],
    isLoading: false,
    error: null
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
    'orderHistory/fetchOrders',
    async (userId) => {
        try {
            const orders = await fetchUserOrders(userId);
            return orders;
        } catch (error) {
            throw error;
        }
    }
);

// Async thunk for adding a new order
export const createOrder = createAsyncThunk(
    'orderHistory/createOrder',
    async (orderData) => {
        try {
            const orderId = await addOrderToFirestore(orderData);
            return { id: orderId, ...orderData };
        } catch (error) {
            throw error;
        }
    }
);

export const orderHistorySlice = createSlice({
    name: 'orderHistory',
    initialState: ORDER_HISTORY_INITIAL_STATE,
    reducers: {
        clearOrderHistory: (state) => {
            state.orders = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearOrderHistory } = orderHistorySlice.actions;
export const selectOrders = (state) => state.orderHistory.orders;
export const selectOrdersLoading = (state) => state.orderHistory.isLoading;
export const selectOrdersError = (state) => state.orderHistory.error;

export default orderHistorySlice.reducer;