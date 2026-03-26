import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaExclamationCircle, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const OrderSuccess = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Order details load nahi hue.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, user, navigate]);

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    if (error || !order) return (
        <div className="container py-5 text-center">
            <div className="successHeader">
                <FaCheckCircle className="successIcon" />
                <h2>Order Placed Successfully!</h2>
                <p>Order ID: <strong>#{id.slice(-8).toUpperCase()}</strong></p>
            </div>
            <div className="text-center mt-4">
                <Link to="/my-orders" className="btn btn-primary px-5 py-2">My Orders Dekho</Link>
                <Link to="/products" className="btn btn-outline-primary px-5 py-2 ms-3">Continue Shopping</Link>
            </div>
        </div>
    );

    const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentStep = statusSteps.indexOf(order.orderStatus);
    const isPaid = order.paymentMethod === 'Card';

    return (
        <div className="orderSuccessPage">
            <div className="container py-5">

                {/* Success Header */}
                <div className="successHeader">
                    <FaCheckCircle className="successIcon" />
                    <h2>Order Placed Successfully!</h2>
                    <p>Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></p>

                    {/* Payment Status Badge */}
                    <div className="paymentStatusBadge">
                        {isPaid ? (
                            <span className="paidBadge">
                                <FaCreditCard className="me-2" />
                                ✅ Payment Received — Card
                            </span>
                        ) : (
                            <span className="codBadge">
                                <FaMoneyBillWave className="me-2" />
                                💵 Cash on Delivery
                            </span>
                        )}
                    </div>
                </div>

                {/* Order Status Tracker */}
                <div className="statusTracker">
                    {statusSteps.map((s, i) => (
                        <div key={s} className={`statusStep ${i <= currentStep ? 'active' : ''}`}>
                            <div className="statusDot">
                                {i === 0 && <FaBox />}
                                {i === 1 && <FaBox />}
                                {i === 2 && <FaTruck />}
                                {i === 3 && <FaHome />}
                            </div>
                            <span>{s}</span>
                            {i < statusSteps.length - 1 && (
                                <div className={`statusLine ${i < currentStep ? 'active' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Order Details */}
                <div className="row mt-4">
                    <div className="col-lg-7">
                        <div className="checkoutCard">
                            <h4>Order Items</h4>
                            {order.orderItems.map((item, i) => (
                                <div className="reviewItem" key={i}>
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <p>{item.name}</p>
                                        <p className="text-muted">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="reviewPrice">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="orderSummary">
                            <h4>Delivery Info</h4>
                            <p>
                                <strong>Address:</strong><br />
                                {order.shippingAddress.address},<br />
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                            </p>
                            <div className="summaryDivider" />

                            {/* Payment Info */}
                            <div className="orderPaymentInfo">
                                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                <p>
                                    <strong>Payment Status:</strong>{' '}
                                    {isPaid ? (
                                        <span className="badge" style={{background:'#10b981', color:'white', padding:'4px 10px', borderRadius:'20px'}}>
                                            ✅ Paid
                                        </span>
                                    ) : (
                                        <span className="badge" style={{background:'#f59e0b', color:'white', padding:'4px 10px', borderRadius:'20px'}}>
                                            💵 Pay on Delivery
                                        </span>
                                    )}
                                </p>
                                {isPaid && order.paymentResult?.id && (
                                    <p style={{fontSize:'0.8rem', color:'#64748b'}}>
                                        Transaction ID: {order.paymentResult.id.slice(-12)}
                                    </p>
                                )}
                            </div>

                            <div className="summaryDivider" />
                            <p><strong>Order Status:</strong>{' '}
                                <span className="badge bg-warning text-dark">{order.orderStatus}</span>
                            </p>
                            <div className="summaryDivider" />
                            <div className="summaryRow total">
                                <span>Total</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <Link to="/products" className="btn btn-primary px-5 py-2">Continue Shopping</Link>
                    <Link to="/my-orders" className="btn btn-outline-primary px-5 py-2 ms-3">My Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;