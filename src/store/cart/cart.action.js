import { createAction } from "../../utils/reducer/reducer.utils";
import { CART_ACTION_TYPES } from "./cart.types";

export const setCartOpen = (cartOpenState) => (
    createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, cartOpenState)
)

export const addItemToCart = (cartItem) => (
    createAction(CART_ACTION_TYPES.ADD_ITEM, cartItem)
)


export const removeItemFromCart = (cartItem) => (
    createAction(CART_ACTION_TYPES.REMOVE_ITEM, cartItem)
)

export const clearItemFromCart = (cartItem) => (
    createAction(CART_ACTION_TYPES.CLEAR_ITEM, cartItem)
)