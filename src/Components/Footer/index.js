import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footerWave">
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
                    <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0f172a"/>
                </svg>
            </div>

            <div className="footerMain">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="footerBrand">
                                <span className="footerLogo">🛍️ ShopNow</span>
                            </div>
                            <p className="footerAbout">
                                ShopNow is your one-stop online store for the latest in fashion, electronics, and lifestyle products. We are committed to providing a seamless shopping experience with top-notch customer service and unbeatable deals.
                            </p>
                            <div className="footerSocials">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-lg-2 col-md-6 mb-5">
                            <h5 className="footerHeading">Quick Links</h5>
                            <ul className="footerLinks">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/products">Products</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                                <li><Link to="/my-orders">My Orders</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="col-lg-2 col-md-6 mb-5">
                            <h5 className="footerHeading">Categories</h5>
                            <ul className="footerLinks">
                                <li><Link to="/products?category=Electronics">Electronics</Link></li>
                                <li><Link to="/products?category=Fashion">Fashion</Link></li>
                                <li><Link to="/products?category=Footwear">Footwear</Link></li>
                                <li><Link to="/products?category=Bags">Bags</Link></li>
                                <li><Link to="/products?category=Watches">Watches</Link></li>
                                <li><Link to="/products?category=Kids">Kids</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="col-lg-4 col-md-6 mb-5">
                            <h5 className="footerHeading">Contact Us</h5>
                            <div className="footerContact">
                                <div className="footerContactItem">
                                    <div className="footerContactIcon"><FaMapMarkerAlt /></div>
                                    <span>123 Main Street, Karachi, Pakistan</span>
                                </div>
                                <div className="footerContactItem">
                                    <div className="footerContactIcon"><FaPhone /></div>
                                    <span>+92 300 123 4567</span>
                                </div>
                                <div className="footerContactItem">
                                    <div className="footerContactIcon"><FaEnvelope /></div>
                                    <span>support@shopnow.pk</span>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="footerNewsletter">
                                <p>Subscribe for deals & updates</p>
                                <div className="newsletterForm">
                                    <input type="email" placeholder="Enter your email" />
                                    <button>Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footerBottom">
                <div className="container">
                    <div className="footerBottomInner">
                        <p>© 2025 ShopNow. All rights reserved.</p>
                        <div className="footerBottomLinks">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                        <div className="footerPayments">
                            <span>💳</span><span>🏦</span><span>📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;