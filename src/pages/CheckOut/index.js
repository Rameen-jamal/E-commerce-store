import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

import {
    FaCreditCard,
    FaMoneyBillWave,
    FaLock,
    FaTimes
} from 'react-icons/fa';

import api from '../../api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const ELEMENT_STYLE = {
    style: {
        base: {
            color: '#1e293b',
            fontFamily: '"Outfit", sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: '#94a3b8' },
        },
        invalid: { color: '#ef4444' },
    },
};
const PaymentModal = ({ onClose, onSuccess, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePay = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            const { data: intentData } = await api.post(
                '/api/payment/create-payment-intent',
                { amount: totalPrice },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(intentData.clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: {
                            name: user.name
                        },
                    },
                });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            onSuccess(paymentIntent);
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="paymentModal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="paymentModalHeader">
                    <div className="paymentModalTitle">
                        <FaLock className="me-2" />
                        Secure Payment
                    </div>
                    <button className="modalCloseBtn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="paymentModalAmount">
                    <span>Total Amount</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                </div>

                <div className="paymentModalBody">
                    <div className="cardField">
                        <label>Card Number</label>
                        <div className="stripeInput">
                            <CardNumberElement options={ELEMENT_STYLE} />
                        </div>
                    </div>

                    <div className="cardFieldRow">
                        <div className="cardField">
                            <label>Expiry Date</label>
                            <div className="stripeInput">
                                <CardExpiryElement options={ELEMENT_STYLE} />
                            </div>
                        </div>
                        <div className="cardField">
                            <label>CVV</label>
                            <div className="stripeInput">
                                <CardCvcElement options={ELEMENT_STYLE} />
                            </div>
                        </div>
                    </div>
                    <div className="testCardNote">
                         Test: <strong>4242 4242 4242 4242</strong> · 12/26 · 123
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-3" style={{fontSize: '0.85rem'}}>
                            {error}
                        </div>
                    )}

                    <button
                        className="payNowBtn"
                        onClick={handlePay}
                        disabled={loading || !stripe}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                        ) : (
                            <><FaLock className="me-2" />Pay ${totalPrice.toFixed(2)}</>
                        )}
                    </button>
                </div>
                <div className="paymentModalFooter">
                    <FaLock /> Powered by Stripe — 256-bit SSL encrypted
                </div>
            </div>
        </div>
    );
};
const CheckoutForm = () => {
    const { cartItems, cartLoaded, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const orderPlaced = useRef(false);

    const [shipping, setShipping] = useState({
        address: '', city: '', postalCode: '', country: 'Pakistan'
    });
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    useEffect(() => {
        if (cartLoaded && cartItems.length === 0 && !orderPlaced.current) {
            navigate('/cart');
        }
    }, [cartLoaded, cartItems, navigate]);

    const handleShippingChange = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    // COD Order
    const handleCODOrder = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderItems = cartItems.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.images?.[0] || '',
            }));

            const { data } = await api.post(
                '/api/orders',
                {
                    orderItems,
                    shippingAddress: shipping,
                    paymentMethod: 'Cash on Delivery',
                    totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            orderPlaced.current = true;
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Order has not been placed.');
        } finally {
            setLoading(false);
        }
    };
        const handlePaymentSuccess = async (paymentIntent) => {
        setShowPaymentModal(false);
        setLoading(true);

        try {
            const orderItems = cartItems.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.images?.[0] || '',
            }));

            const { data } = await api.post(
                '/api/orders',
                {
                    orderItems,
                    shippingAddress: shipping,
                    paymentMethod: 'Card',
                    totalPrice,
                    paymentResult: {
                        id: paymentIntent.id,
                        status: paymentIntent.status,
                        email: user.email,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            orderPlaced.current = true;
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (err) {
            setError('Payment successful but order not created.');
        } finally {
            setLoading(false);
        }
    };
    

    const handlePlaceOrder = () => {
        if (paymentMethod === 'Card') {
            setShowPaymentModal(true);
        } else {
            handleCODOrder();
        }
    };

    if (!cartLoaded) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div className="checkoutPage">
            <div className="container py-5">
                <h2 className="checkoutTitle">Checkout</h2>

                {/* Progress Steps */}
                <div className="checkoutSteps">
                    {['Shipping', 'Payment', 'Review'].map((s, i) => (
                        <div key={s} className={`stepItem ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                            <div className="stepCircle">{step > i + 1 ? '✓' : i + 1}</div>
                            <span>{s}</span>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col-lg-7">

                        {/* Step 1 — Shipping */}
                        {step === 1 && (
                            <div className="checkoutCard">
                                <h4>Shipping Address</h4>
                                <div className="mb-3">
                                    <label>Street Address</label>
                                    <input type="text" className="form-control" name="address"
                                        value={shipping.address} onChange={handleShippingChange}
                                        placeholder="House #, Street name" />
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label>City</label>
                                        <input type="text" className="form-control" name="city"
                                            value={shipping.city} onChange={handleShippingChange}
                                            placeholder="Karachi" />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label>Postal Code</label>
                                        <input type="text" className="form-control" name="postalCode"
                                            value={shipping.postalCode} onChange={handleShippingChange}
                                            placeholder="75500" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label>Country</label>
                                    <input type="text" className="form-control" name="country"
                                        value={shipping.country} onChange={handleShippingChange} />
                                </div>
                                <button className="nextStepBtn" onClick={() => setStep(2)}
                                    disabled={!shipping.address || !shipping.city || !shipping.postalCode}>
                                    Continue to Payment →
                                </button>
                            </div>
                        )}

                        {/* Step 2 — Payment */}
                        {step === 2 && (
                            <div className="checkoutCard">
                                <h4>Payment Method</h4>
                                <div className={`paymentOption ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Cash on Delivery')}>
                                    <FaMoneyBillWave className="payIcon" />
                                    <div>
                                        <p className="payTitle">Cash on Delivery</p>
                                        
                                    </div>
                                    <div className="payRadio">
                                        {paymentMethod === 'Cash on Delivery' && <div className="payRadioFill" />}
                                    </div>
                                </div>
                                <div className={`paymentOption ${paymentMethod === 'Card' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Card')}>
                                    <FaCreditCard className="payIcon" />
                                    <div>
                                        <p className="payTitle">Credit / Debit Card</p>
                                        <p className="payDesc">Secure payment from strip</p>
                                    </div>
                                    <div className="payRadio">
                                        {paymentMethod === 'Card' && <div className="payRadioFill" />}
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mt-4">
                                    <button className="backStepBtn" onClick={() => setStep(1)}>← Back</button>
                                    <button className="nextStepBtn" onClick={() => setStep(3)}>Review Order →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Review */}
                        {step === 3 && (
                            <div className="checkoutCard">
                                <h4>Review Your Order</h4>
                                {cartItems.map(item => (
                                    <div className="reviewItem" key={item._id}>
                                        <img src={item.images?.[0]} alt={item.name} />
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-muted">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="reviewPrice">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="reviewAddress">
                                    <p><strong>Ship to:</strong> {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
                                    <p><strong>Payment:</strong> {paymentMethod}</p>
                                </div>
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                                <div className="d-flex gap-3 mt-4">
                                    <button className="backStepBtn" onClick={() => setStep(2)}>← Back</button>
                                    <button className="placeOrderBtn" onClick={handlePlaceOrder} disabled={loading}>
                                        {loading ? 'Processing...' : paymentMethod === 'Card' ? '💳 Pay & Place Order' : '🛒 Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-5">
                        <div className="orderSummary">
                            <h4>Order Summary</h4>
                            {cartItems.map(item => (
                                <div className="summaryItem" key={item._id}>
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="summaryDivider" />
                            <div className="summaryRow">
                                <span>Shipping</span>
                                <span className="text-success">FREE</span>
                            </div>
                            <div className="summaryRow total">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="secureNote">
                                <FaLock /> <span>Secure & Encrypted Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                    totalPrice={totalPrice}
                />
            )}
        </div>
    );
};

// ── Wrapper ───────────────────────────────────────────────────────
const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Checkout;