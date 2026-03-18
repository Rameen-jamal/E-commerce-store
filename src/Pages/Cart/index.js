import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="emptyCart">
                <div className="emptyCartInner">
                    <FaShoppingBag className="emptyCartIcon" />
                    <h3>Your cart is empty</h3>
                        <p>Add some items to your cart to get started.</p>
                    <Link to="/products" className="btn btn-primary px-4 py-2 mt-3">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="cartPage">
            <div className="container py-5">
                <h2 className="cartTitle">Shopping Cart <span>({totalItems} items)</span></h2>

                <div className="row">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        {cartItems.map((item) => (
                            <div className="cartItem" key={item._id}>
                                <div className="cartItemImg">
                                    <img src={item.images[0]} alt={item.name} />
                                </div>
                                <div className="cartItemInfo">
                                    <p className="cartItemBrand">{item.brand}</p>
                                    <p className="cartItemName">{item.name}</p>
                                    <p className="cartItemPrice">${item.price}</p>
                                </div>
                                <div className="cartItemControls">
                                    <div className="quantityBox">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}>
                                            <FaMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <p className="cartItemTotal">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button className="removeBtn" onClick={() => removeFromCart(item._id)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-4">
                        <div className="orderSummary">
                            <h4>Order Summary</h4>
                            <div className="summaryRow">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summaryRow">
                                <span>Shipping</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <div className="summaryDivider" />
                            <div className="summaryRow total">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                className="checkoutBtn"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                            <Link to="/products" className="continueShopping">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;