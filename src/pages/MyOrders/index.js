import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBox } from 'react-icons/fa';
import api from '../../api';

const statusColors = {
    Pending: '#f59e0b',
    Processing: '#3b82f6',
    Shipped: '#8b5cf6',
    Delivered: '#10b981',
    Cancelled: '#ef4444',
};

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user?.token) return;

                const { data } = await api.get('/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div className="myOrdersPage">
            <div className="container py-5">
                <h2 className="cartTitle">My Orders</h2>

                {orders.length === 0 ? (
                    <div className="emptyCart">
                        <div className="emptyCartInner">
                            <FaBox className="emptyCartIcon" />
                            <h3>NOO !! ORDERS YET</h3>
                            <Link to="/products" className="btn btn-primary mt-3">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                ) : (
                    orders.map(order => (
                        <div className="orderCard" key={order._id}>
                            <div className="orderCardHeader">
                                <div>
                                    <p className="orderCardId">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="orderCardDate">
                                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <span
                                        className="orderStatus"
                                        style={{
                                            background: statusColors[order.orderStatus] + '20',
                                            color: statusColors[order.orderStatus]
                                        }}
                                    >
                                        {order.orderStatus}
                                    </span>

                                    <Link
                                        to={`/order/${order._id}`}
                                        className="viewOrderBtn"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            <div className="orderCardItems">
                                {order.orderItems.map((item, i) => (
                                    <div className="orderCardItem" key={i}>
                                        <img src={item.image} alt={item.name} />
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-muted">
                                                Qty: {item.quantity} × ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="orderCardFooter">
                                <span>
                                    Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                                </span>
                                <span>{order.paymentMethod}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;