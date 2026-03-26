import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal, setSearchVal] = useState('');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchVal.trim()) {
            navigate(`/products?search=${searchVal.trim()}`);
            setSearchOpen(false);
            setSearchVal('');
        }
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <>
            <header className={`siteHeader ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="headerInner">

                        {/* ── Logo ── */}
                        <Link to="/" className="headerLogo">
                            <div className="logoMark">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect width="28" height="28" rx="8" fill="url(#logoGrad)"/>
                                    <path d="M7 10h2l1.5 6h8l1.5-6H22" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="19" r="1.2" fill="white"/>
                                    <circle cx="18" cy="19" r="1.2" fill="white"/>
                                    <defs>
                                        <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                                            <stop offset="0%" stopColor="#4F46E5"/>
                                            <stop offset="100%" stopColor="#7C3AED"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="logoText">ShopNow</span>
                        </Link>

                        {/* ── Nav Links (desktop) ── */}
                        <nav className="headerNav">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`headerNavLink ${location.pathname === link.to ? 'active' : ''}`}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right Actions ── */}
                        <div className="headerActions">
                            {/* Search */}
                            <button className="headerIconBtn" onClick={() => setSearchOpen(s => !s)}>
                                <FaSearch />
                            </button>

                            {/* Cart */}
                            <Link to="/cart" className="headerIconBtn cartIconWrapper">
                                <FaShoppingCart />
                                <AnimatePresence>
                                    {totalItems > 0 && (
                                        <motion.span
                                            className="cartBadge"
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                            key={totalItems}>
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {/* User */}
                            {user ? (
                                <div className="userDropdown">
                                    <button className="userBtn">
                                        <div className="userAvatar">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="userName">{user.name?.split(' ')[0]}</span>
                                    </button>
                                    <div className="dropdownMenu">
                                        <Link to="/my-orders"><FaUser style={{marginRight:8}}/> My Orders</Link>
                                        {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                                        <button onClick={handleLogout}>
                                            <FaSignOutAlt style={{marginRight:8}}/> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="loginBtn">Login</Link>
                            )}

                            {/* Mobile hamburger */}
                            <button className="hamburgerBtn" onClick={() => setMenuOpen(s => !s)}>
                                {menuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Search Bar dropdown ── */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div className="headerSearchBar"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}>
                            <div className="container">
                                <div className="headerSearchInner">
                                    <FaSearch className="searchBarIcon" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products, brands..."
                                        value={searchVal}
                                        onChange={e => setSearchVal(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                    <button className="searchBarClose" onClick={() => setSearchOpen(false)}>
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div className="mobileMenu"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                        <div className="mobileMenuInner">
                            {navLinks.map(link => (
                                <Link key={link.to} to={link.to} className="mobileNavLink">
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mobileMenuDivider" />
                            {user ? (
                                <>
                                    <Link to="/my-orders" className="mobileNavLink">My Orders</Link>
                                    <button className="mobileNavLink mobileLogoutBtn" onClick={handleLogout}>
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="mobileNavLink mobileLoginLink">Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;