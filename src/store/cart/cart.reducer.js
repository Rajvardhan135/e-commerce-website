import { CART_ACTION_TYPES } from "./cart.types";

const initialState = {
    isCartOpen: false,
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
}

const addCartItem = (cartItems, productToAdd) => {
    const existingCartItem = cartItems.find((cartItem) => cartItem.id === productToAdd.id);
    if (existingCartItem) {
        return cartItems.map((cartItem) => cartItem.id === productToAdd.id ? {
            ...cartItem, quantity: cartItem.quantity + 1
        } : cartItem);
    }
    return [...cartItems, { ...productToAdd, quantity: 1 }];
}

const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id)
}

const removeCartItem = (cartItems, cartItemToRemove) => {
    if (cartItemToRemove.quantity === 1) return clearCartItem(cartItems, cartItemToRemove);
    return cartItems.map((cartItem) => cartItem.id === cartItemToRemove.id ? {
        ...cartItem, quantity: cartItem.quantity - 1
    } : cartItem);
}

const updateCartItems = (newCartItems) => {
    const newCartCount = newCartItems.reduce((cartTotal, cartItem) => cartTotal + cartItem.quantity, 0);
    const newPrice = newCartItems.reduce((cartTotal, cartItem) => cartTotal + cartItem.quantity * cartItem.price, 0);
    const payload = {
        cartItems: newCartItems,
        cartCount: newCartCount,
        cartTotal: newPrice,
    }
    return payload
}

export const cartReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CART_ACTION_TYPES.SET_IS_CART_OPEN: return {
            ...state,
            isCartOpen: payload,
        }

        case CART_ACTION_TYPES.ADD_ITEM: {
            return {
                ...state,
                ...updateCartItems(addCartItem(state.cartItems, payload))
            }
        }
        case CART_ACTION_TYPES.REMOVE_ITEM: return {
            ...state,
            ...updateCartItems(removeCartItem(state.cartItems, payload))
        }

        case CART_ACTION_TYPES.CLEAR_ITEM: return {
            ...state,
            ...updateCartItems(clearCartItem(state.cartItems, payload))
        }

        default: return state
    }
}