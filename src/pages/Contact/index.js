import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contactPage">

            {/* Hero Banner */}
            <div className="contactHero">
                <div className="container">
                    <h1>Get In Touch</h1>
                    <p>Need help ? Ask questions please</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">

                    {/* Info Cards */}
                    <div className="col-lg-4">
                        <div className="contactInfoStack">
                            <div className="contactInfoCard">
                                <div className="contactInfoIcon" style={{ background: 'linear-gradient(135deg, #4f46e5, #818cf8)' }}>
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h6>Our Address</h6>
                                    <p>123 Main Street<br />Karachi, Pakistan</p>
                                </div>
                            </div>

                            <div className="contactInfoCard">
                                <div className="contactInfoIcon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                                    <FaPhone />
                                </div>
                                <div>
                                    <h6>Phone Number</h6>
                                    <p>+92 300 123 4567<br />+92 21 111 222 333</p>
                                </div>
                            </div>

                            <div className="contactInfoCard">
                                <div className="contactInfoIcon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h6>Email Address</h6>
                                    <p>support@shopnow.pk<br />info@shopnow.pk</p>
                                </div>
                            </div>

                            <div className="contactInfoCard">
                                <div className="contactInfoIcon" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
                                    <FaClock />
                                </div>
                                <div>
                                    <h6>Business Hours</h6>
                                    <p>Mon – Sat: 9am – 6pm<br />Sunday: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-lg-8">
                        <div className="contactFormCard">
                            <h3>Send Us a Message</h3>
                            <p className="contactFormSubtitle">We will contact you in 24 hours</p>

                            {submitted && (
                                <div className="contactSuccess">
                                    ✅Thanks !! We have recieved your message .We will contact you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="contactField">
                                            <label>Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Ali Khan"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="contactField">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="ali@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="contactField">
                                            <label>Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                placeholder="Order related query..."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="contactField">
                                            <label>Message</label>
                                            <textarea
                                                name="message"
                                                value={form.message}
                                                onChange={handleChange}
                                                placeholder="Write your message here.."
                                                rows={5}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="contactSubmitBtn">
                                            <FaPaperPlane /> Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="contactMap">
                    <div className="mapPlaceholder">
                        <FaMapMarkerAlt className="mapIcon" />
                        <h5>Karachi, Pakistan</h5>
                        <p>123 Main Street, Karachi</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;