import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaBolt, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import PageTransition from '../../components/PageTransition';
import api from '../../api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;

        addToCart(product);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="pageLoader">
                <div className="loaderRing" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">{error || 'Something went wrong'}</div>
            </div>
        );
    }

    const images = product.images || [];

    const discount = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : null;

    return (
        <PageTransition>
            <div className="productDetailPage">
                <div className="container py-5">

                    <motion.button
                        className="backBtn mb-4"
                        onClick={() => navigate(-1)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: -4 }}
                    >
                        <FaArrowLeft className="me-2" /> Back
                    </motion.button>

                    <div className="row">

                        {/* IMAGE */}
                        <motion.div className="col-md-5 mb-4"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="productDetailImgBox">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                />
                                {product.badge && (
                                    <span className="detailBadge">{product.badge}</span>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="imgThumbs">
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`imgThumb ${activeImg === i ? 'active' : ''}`}
                                            onClick={() => setActiveImg(i)}
                                        >
                                            <img src={img} alt={`thumb-${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* INFO */}
                        <motion.div className="col-md-7 ps-md-5"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <p className="detailBrand">{product.brand}</p>
                            <h2 className="detailName">{product.name}</h2>

                            <div className="detailRating">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        color={i < Math.round(product.rating) ? '#f5a623' : '#ddd'}
                                    />
                                ))}
                                <span className="ms-2">{product.rating}</span>
                                <span className="text-muted ms-1">
                                    ({product.reviews} reviews)
                                </span>
                            </div>

                            <div className="detailPrice">
                                <span className="currentPrice">${product.price}</span>
                                {product.oldPrice && (
                                    <>
                                        <span className="oldPriceDetail">
                                            ${product.oldPrice}
                                        </span>
                                        <span className="discountBadge">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="detailDesc">{product.description}</p>

                            <p className="detailStock">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="stockDot green" /> In Stock ({product.stock})
                                    </>
                                ) : (
                                    <>
                                        <span className="stockDot red" /> Out of Stock
                                    </>
                                )}
                            </p>

                            {/* QTY */}
                            <div className="detailQty">
                                <span>Quantity:</span>

                                <div className="quantityBox">
                                    <button
                                        onClick={() =>
                                            setQuantity(q => Math.max(1, q - 1))
                                        }
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>

                                    <span>{quantity}</span>

                                    <button
                                        onClick={() =>
                                            setQuantity(q =>
                                                Math.min(product.stock || 1, q + 1)
                                            )
                                        }
                                        disabled={quantity >= (product.stock || 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="detailBtns">
                                <motion.button
                                    className={`addToCartBtn ${added ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={!product.stock}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {added ? (
                                        <>
                                            <FaCheck /> Added!
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart /> Add to Cart
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    className="buyNowBtn"
                                    onClick={handleBuyNow}
                                    disabled={!product.stock}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <FaBolt /> Buy Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductDetail;