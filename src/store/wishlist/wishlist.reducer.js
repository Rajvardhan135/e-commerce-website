import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_INITIAL_STATE = {
    wishlistItems: [],
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: WISHLIST_INITIAL_STATE,
    reducers: {
        addToWishlist(state, action) {
            const existingItem = state.wishlistItems.find(
                item => item.id === action.payload.id
            );
            if (!existingItem) {
                state.wishlistItems.push(action.payload);
            }
        },
        removeFromWishlist(state, action) {
            state.wishlistItems = state.wishlistItems.filter(
                item => item.id !== action.payload
            );
        },
        clearWishlist(state) {
            state.wishlistItems = [];
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export default wishlistSlice.reducer;