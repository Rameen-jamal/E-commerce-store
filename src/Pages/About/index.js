import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const stats = [
        { number: '10K+', label: 'Happy Customers' },
        { number: '500+', label: 'Products Available' },
        { number: '50+', label: 'Brands' },
        { number: '99%', label: 'Satisfaction Rate' },
    ];

    return (
        <div className="aboutPage">
            <div className="aboutHero">
                <h1>About ShopNow</h1>
                <p>
                ShopNow is Pakistan's leading online shopping destination, offering a vast selection of products across categories like electronics, fashion, home goods, and more. We are committed to providing a seamless shopping experience with quality products at unbeatable prices. Our mission is to make online shopping accessible and enjoyable for everyone in Pakistan.
                </p>
            </div>
            <div className="aboutStats">
                <div className="container">
                    <div className="row g-4">
                        {stats.map((s, i) => (
                            <div className="col-6 col-md-3" key={i}>
                                <div className="statCard">
                                    <div className="statNumber">{s.number}</div>
                                    <div className="statLabel">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container py-5">
                <div className="row align-items-center g-5">
                    <div className="col-md-6">
                        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
                        <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 16 }}>
                        Our mission is to bring world-class products within easy reach of everyone in Pakistan at affordable prices. We strive to deliver a seamless shopping experience from the comfort of your home — with no compromises. 
                        </p>
                        <Link to="/products" className="buyNowBtn" style={{ display: 'inline-flex', marginTop: 20, textDecoration: 'none' }}>
                            Shop Now →
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <div style={{
                            background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
                            borderRadius: 24,
                            padding: 40,
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 64 }}>🛍️</div>
                            <h3 style={{ fontWeight: 800, marginTop: 16 }}>ShopNow</h3>
                            <p style={{ opacity: 0.8, marginTop: 8 }}>Quality • Trust • Convenience</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;