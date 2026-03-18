import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existing = state.items.find(i => i._id === action.payload._id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i._id === action.payload._id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    )
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter(i => i._id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(i =>
                    i._id === action.payload.id
                        ? { ...i, quantity: action.payload.quantity }
                        : i
                )
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'LOAD_CART':
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });
    const [cartLoaded, setCartLoaded] = useState(false); 
    useEffect(() => {
        try {
            const saved = localStorage.getItem('shopnow_cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.length > 0) {
                    dispatch({ type: 'LOAD_CART', payload: parsed });
                }
            }
        } catch (e) {
            console.log('Cart load error:', e);
        } finally {
            setCartLoaded(true); 
        }
    }, []);
    useEffect(() => {
        if (cartLoaded) {
            localStorage.setItem('shopnow_cart', JSON.stringify(state.items));
        }
    }, [state.items, cartLoaded]);

    const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems: state.items,
            cartLoaded,           
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);