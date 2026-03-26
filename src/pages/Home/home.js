import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FaPlus, FaArrowRight, FaStar, FaShieldAlt, FaTruck, FaBolt, FaHeadset } from "react-icons/fa";
import { useCart } from '../../context/CartContext';
import PageTransition from '../../components/PageTransition';
import api from '../../api';

// ── Real Unsplash images for categories ──────────────────────
const categories = [
    {
        name: "Electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
        color: "#4F46E5"
    },
    {
        name: "Fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
        color: "#EC4899"
    },
    {
        name: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        color: "#F59E0B"
    },
    {
        name: "Bags",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
        color: "#10B981"
    },
    {
        name: "Kids",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
        color: "#EF4444"
    },
    {
        name: "Watches",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        color: "#8B5CF6"
    },
];

const features = [
    { icon: <FaTruck />, title: 'Free Delivery', desc: 'On orders above $50' },
    { icon: <FaShieldAlt />, title: 'Secure Payment', desc: '100% protected' },
    { icon: <FaBolt />, title: 'Fast Shipping', desc: '3-5 business days' },
    { icon: <FaHeadset />, title: '24/7 Support', desc: 'Always here for you' },
];

// ── 3D Tilt Card ─────────────────────────────────────────────
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
        card.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)';
    };

    return (
        <div ref={cardRef} className="tiltCard" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
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

// ── Scroll reveal ─────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 48 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}>
            {children}
        </motion.div>
    );
};

// ── Main ──────────────────────────────────────────────────────
const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 600], [0, 120]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

        useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const { data } = await api.get('/api/products');

                if (isMounted) {
                    setProducts(data);
                }

            } catch (err) {
                console.error('Products load failed:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);


    return (
        <PageTransition>

            {/* ══ HERO ══════════════════════════════════════════ */}
            <section className="heroSection">
                <div className="heroBg">
                    <div className="heroBlobA" />
                    <div className="heroBlobB" />
                    <div className="heroGrid" />
                </div>

                <div className="container heroContainer">
                    <motion.div className="heroLeft" style={{ y: heroY, opacity: heroOpacity }}>
                        <motion.span className="heroBadge"
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            ✦ New Collection 2025
                        </motion.span>

                        <motion.h1 className="heroHeading"
                            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}>
                            Redefine Your<br />
                            <span className="heroGradientText">Style.</span>
                        </motion.h1>

                        <motion.p className="heroSubtext"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            Premium fashion, electronics & lifestyle products. Fast delivery across Pakistan.
                        </motion.p>

                        <motion.div className="heroCtas"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                            <Link to="/products" className="heroPrimaryBtn">
                                Shop Now <FaArrowRight />
                            </Link>
                            <Link to="/about" className="heroSecondaryBtn">Our Story</Link>
                        </motion.div>

                        <motion.div className="heroStats"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                            {[['10K+', 'Customers'], ['500+', 'Products'], ['4.9★', 'Rating']].map(([n, l]) => (
                                <div key={l} className="heroStat">
                                    <span className="heroStatNum">{n}</span>
                                    <span className="heroStatLabel">{l}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Hero — real lifestyle image */}
                    <motion.div className="heroRight"
                        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.9 }}>
                        <motion.div className="heroImgWrapper"
                            animate={{ y: [0, -14, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                            <div className="heroImgGlow" />
                            <img
                                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=85"
                                alt="Fashion Shopping"
                                className="heroProductImg"
                            />
                            <motion.div className="heroFloatBadge1"
                                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}>
                                🛍️ Free Delivery
                            </motion.div>
                            <motion.div className="heroFloatBadge2"
                                animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}>
                                ⚡ New Arrivals
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div className="heroScrollIndicator"
                    animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <div className="scrollDot" />
                </motion.div>
            </section>

            {/* ══ FEATURES BAR ══════════════════════════════════ */}
            <Reveal>
                <section className="featuresBar">
                    <div className="container">
                        <div className="featuresBarGrid">
                            {features.map((f, i) => (
                                <motion.div key={i} className="featureBarItem"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}>
                                    <div className="featureBarIcon">{f.icon}</div>
                                    <div>
                                        <p className="featureBarTitle">{f.title}</p>
                                        <p className="featureBarDesc">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ══ CATEGORIES — Daraz style image cards ═════════ */}
            <Reveal delay={0.1}>
                <section className="categoriesSection">
                    <div className="container">
                        <div className="sectionHeader">
                            <div>
                                <h2 className="sectionTitle">Shop by Category</h2>
                                <p className="sectionSubtitle">Explore our curated collections</p>
                            </div>
                        </div>
                        <div className="catImgGrid">
                            {categories.map((cat, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ y: -6 }}>
                                    <Link to={`/products?category=${cat.name}`} className="catImgCard">
                                        <div className="catImgBox">
                                            <img src={cat.image} alt={cat.name} loading="lazy" />
                                            <div className="catImgOverlay" style={{ '--cat-clr': cat.color }} />
                                        </div>
                                        <p className="catImgName" style={{ color: cat.color }}>{cat.name}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ══ FEATURED PRODUCTS ═════════════════════════════ */}
            <Reveal delay={0.1}>
                <section className="featuredSection">
                    <div className="container">
                        <div className="sectionHeader">
                            <h2 className="sectionTitle">Featured Products</h2>
                            <Link to="/products" className="sectionViewAll">
                                View All <FaArrowRight />
                            </Link>
                        </div>
                        {loading ? (
                            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                        ) : (
                            <div className="productsGrid">
                                {products.slice(0, 8).map((product, i) => (
                                    <motion.div key={product._id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.07, duration: 0.5 }}>
                                        <TiltCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </Reveal>

            {/* ══ EDITORIAL BANNER ══════════════════════════════ */}
            <Reveal>
                <section className="editorialBanner">
                    <div className="container">
                        <div className="editorialGrid">
                            {/* Left big card */}
                            <motion.div className="editorialBig" whileHover={{ scale: 1.01 }}>
                                <img
                                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80"
                                    alt="Fashion"
                                />
                                <div className="editorialContent">
                                    <span className="editorialTag">New Season</span>
                                    <h3>Women's Collection</h3>
                                    <Link to="/products?category=Fashion" className="editorialBtn">
                                        Shop Now <FaArrowRight />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Right two stacked */}
                            <div className="editorialStack">
                                <motion.div className="editorialSmall" whileHover={{ scale: 1.02 }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
                                        alt="Footwear"
                                    />
                                    <div className="editorialContent">
                                        <span className="editorialTag">Trending</span>
                                        <h3>Footwear</h3>
                                        <Link to="/products?category=Footwear" className="editorialBtn">
                                            Explore <FaArrowRight />
                                        </Link>
                                    </div>
                                </motion.div>
                                <motion.div className="editorialSmall" whileHover={{ scale: 1.02 }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80"
                                        alt="Electronics"
                                    />
                                    <div className="editorialContent">
                                        <span className="editorialTag">Best Sellers</span>
                                        <h3>Electronics</h3>
                                        <Link to="/products?category=Electronics" className="editorialBtn">
                                            Explore <FaArrowRight />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            {/* ══ PROMO BANNER ══════════════════════════════════ */}
            <Reveal>
                <section className="promoBanner">
                    <div className="container">
                        <motion.div className="promoBannerInner"
                            whileHover={{ scale: 1.01 }}>
                            <div className="promoBannerLeft">
                                <span className="promoBannerTag">Limited Time Offer</span>
                                <h3 className="promoBannerTitle">Up to 50% OFF<br />on Selected Items</h3>
                                <Link to="/products" className="heroPrimaryBtn mt-3"
                                    style={{ display: 'inline-flex', textDecoration: 'none' }}>
                                    Grab the Deal <FaArrowRight />
                                </Link>
                            </div>
                            <div className="promoBannerRight">
                                <img
                                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80"
                                    alt="Sale"
                                    className="promoBannerImg"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            </Reveal>

        </PageTransition>
    );
};

export default Home;