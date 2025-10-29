import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { categoryReducer } from "./categories/category.reducer";
import { cartReducer } from "./cart/cart.reducer";
import wishlistReducer from "./wishlist/wishlist.reducer";
import orderHistoryReducer from "./orders/order-history.reducer";

export const rootReducer = combineReducers({
    user: userReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orderHistory: orderHistoryReducer,
})
