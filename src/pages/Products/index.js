import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaPlus } from "react-icons/fa";
import { FaLaptop, FaShoePrints } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { GiNecklace } from "react-icons/gi";
import { FaBabyCarriage } from "react-icons/fa";
import { MdWatch } from "react-icons/md";
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';

const categories = [
    { name: "All", icon: null },
    { name: "Electronics", icon: <FaLaptop /> },
    { name: "Fashion", icon: <GiNecklace /> },
    { name: "Footwear", icon: <FaShoePrints /> },
    { name: "Bags", icon: <BsHandbag /> },
    { name: "Kids", icon: <FaBabyCarriage /> },
    { name: "Watches", icon: <MdWatch /> },
];

// 3D Tilt Card — same as Home
const TiltCard = ({ product }) => {
    const cardRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -8;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(79,70,229,0.18)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
    };

    return (
        <div ref={cardRef} className="tiltCard"
            onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
            <div className="tiltCardImg" onClick={() => navigate(`/product/${product._id}`)}>
                <img src={product.images?.[0]} alt={product.name} loading="lazy" />
                {product.badge && <span className="productBadge">{product.badge}</span>}
                <div className="tiltCardOverlay">
                    <button className="quickViewBtn">Quick View</button>
                </div>
            </div>
            <div className="tiltCardBody">
                <p className="tiltCardBrand">{product.brand}</p>
                <h4 className="tiltCardName" onClick={() => navigate(`/product/${product._id}`)}>
                    {product.name}
                </h4>
                <div className="tiltCardRating">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < Math.round(product.rating) ? '#f5a623' : '#e2e8f0'} size={12} />
                    ))}
                    <span>({product.reviews})</span>
                </div>
                <div className="tiltCardFooter">
                    <div className="tiltCardPrice">
                        <span className="priceNow">${product.price}</span>
                        {product.oldPrice && <span className="priceOld">${product.oldPrice}</span>}
                    </div>
                    <button className="tiltAddBtn" onClick={() => addToCart(product)}>
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Products = () => {
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'All');

    useEffect(() => {
        if (categoryFromUrl) setActiveCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = activeCategory === 'All'
                    ? '/api/products'
                    : `/api/products?category=${activeCategory}`;
                const { data } = await axios.get(url);
                setProducts(data);
            } catch (err) {
                setError('Products load nahi hue.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory]);

    return (
        <PageTransition>
            <div className="productsPage">
                <div className="container">
                    {/* Page Header */}
                    <motion.div className="py-4"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 28, color: '#0f172a' }}>
                            {activeCategory === 'All' ? 'All Products' : activeCategory}
                        </h3>
                        <p className="text-muted">{products.length} products found</p>
                    </motion.div>

                    {/* Category Tabs */}
                    <motion.div className="categoryTabs mb-4"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`catFilterBtn ${activeCategory === cat.name ? 'active' : ''}`}>
                                {cat.icon && <span className="me-1">{cat.icon}</span>}
                                {cat.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Loading */}
                    {loading && <div className="text-center py-5"><div className="spinner-border text-primary" /></div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && !error && products.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">No products in this category.</p>
                        </div>
                    )}

                    {/* Products Grid — 3D tilt cards */}
                    {!loading && !error && products.length > 0 && (
                        <div className="productsGrid mb-5">
                            {products.map((product, i) => (
                                <motion.div key={product._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.45 }}>
                                    <TiltCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Products;