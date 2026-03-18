const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
    // ── Electronics ──────────────────────────────────────────
    {
        name: "iPhone 15 Pro Max",
        description: "Apple's most powerful iPhone with A17 Pro chip, titanium design, and a 48MP camera system. Features Action Button and USB-C connectivity.",
        price: 1199, oldPrice: 1399,
        brand: "Apple", category: "Electronics",
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"],
        stock: 50, rating: 4.8, reviews: 324, badge: "Hot"
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        description: "Samsung's flagship with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Perfect for productivity and creativity.",
        price: 899, oldPrice: 999,
        brand: "Samsung", category: "Electronics",
        images: ["https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80"],
        stock: 35, rating: 4.6, reviews: 210, badge: "New"
    },
    {
        name: "Sony WH-1000XM5 Headphones",
        description: "Industry-leading noise cancellation with 30-hour battery life. Crystal clear calls and exceptional sound quality.",
        price: 349, oldPrice: 449,
        brand: "Sony", category: "Electronics",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
        stock: 25, rating: 4.9, reviews: 512, badge: "Best"
    },
    {
        name: "MacBook Pro 14-inch",
        description: "Apple M3 Pro chip with 18-hour battery life, Liquid Retina XDR display. The ultimate laptop for professionals.",
        price: 1999, oldPrice: 2199,
        brand: "Apple", category: "Electronics",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"],
        stock: 20, rating: 4.9, reviews: 156, badge: "Hot"
    },
    {
        name: "iPad Pro M2",
        description: "Supercharged by M2 chip with stunning Liquid Retina display. Works with Apple Pencil and Magic Keyboard.",
        price: 799, oldPrice: 899,
        brand: "Apple", category: "Electronics",
        images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
        stock: 30, rating: 4.7, reviews: 203, badge: "New"
    },

    // ── Footwear ──────────────────────────────────────────────
    {
        name: "Nike Air Max 90",
        description: "Classic Nike running shoes with visible Air cushioning unit. Iconic design meets modern comfort for everyday wear.",
        price: 149, oldPrice: 199,
        brand: "Nike", category: "Footwear",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
        stock: 100, rating: 4.5, reviews: 150, badge: "Sale"
    },
    {
        name: "Adidas Ultraboost 23",
        description: "Adidas best running shoes with BOOST technology returning energy with every step. Primeknit upper for a sock-like fit.",
        price: 129, oldPrice: 179,
        brand: "Adidas", category: "Footwear",
        images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"],
        stock: 80, rating: 4.7, reviews: 189, badge: "Hot"
    },
    {
        name: "Nike Air Force 1",
        description: "The classic Nike basketball shoe turned streetwear icon. Clean white leather upper with Air-Sole unit for all-day comfort.",
        price: 110, oldPrice: 130,
        brand: "Nike", category: "Footwear",
        images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80"],
        stock: 60, rating: 4.6, reviews: 445, badge: "Hot"
    },
    {
        name: "New Balance 574",
        description: "Timeless New Balance sneaker with ENCAP midsole technology. Perfect blend of retro style and modern comfort.",
        price: 89, oldPrice: 110,
        brand: "New Balance", category: "Footwear",
        images: ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80"],
        stock: 45, rating: 4.4, reviews: 127, badge: "Sale"
    },

    // ── Bags ──────────────────────────────────────────────────
    {
        name: "Classic Leather Tote",
        description: "Premium full-grain leather tote bag with gold hardware. Spacious interior with multiple pockets for organized storage.",
        price: 599, oldPrice: 799,
        brand: "Gucci", category: "Bags",
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"],
        stock: 15, rating: 4.4, reviews: 98, badge: "New"
    },
    {
        name: "Leather Crossbody Bag",
        description: "Compact and stylish crossbody bag in genuine leather. Adjustable strap and secure zip closure for everyday use.",
        price: 299, oldPrice: 399,
        brand: "Coach", category: "Bags",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"],
        stock: 22, rating: 4.5, reviews: 134, badge: "Hot"
    },
    {
        name: "Canvas Backpack",
        description: "Durable canvas backpack with laptop compartment and multiple pockets. Perfect for work, travel, and everyday adventures.",
        price: 79, oldPrice: 99,
        brand: "Herschel", category: "Bags",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"],
        stock: 55, rating: 4.3, reviews: 267, badge: "Sale"
    },

    // ── Fashion ───────────────────────────────────────────────
    {
        name: "Premium Wool Overcoat",
        description: "Luxurious Italian wool overcoat with classic tailoring. Timeless design perfect for formal and smart-casual occasions.",
        price: 449, oldPrice: 599,
        brand: "Zara", category: "Fashion",
        images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"],
        stock: 18, rating: 4.6, reviews: 89, badge: "New"
    },
    {
        name: "Slim Fit Dress Shirt",
        description: "Premium cotton dress shirt with slim fit. Wrinkle-resistant fabric perfect for office or formal events.",
        price: 79, oldPrice: 99,
        brand: "H&M", category: "Fashion",
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80"],
        stock: 70, rating: 4.3, reviews: 312, badge: "Sale"
    },
    {
        name: "Summer Floral Dress",
        description: "Light and breezy floral midi dress perfect for summer. Made from sustainable materials with a flattering A-line silhouette.",
        price: 89, oldPrice: 119,
        brand: "Zara", category: "Fashion",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80"],
        stock: 40, rating: 4.5, reviews: 178, badge: "Hot"
    },

    // ── Watches ───────────────────────────────────────────────
    {
        name: "Classic Chronograph Watch",
        description: "Swiss-made automatic chronograph with sapphire crystal glass. Stainless steel case and genuine leather strap.",
        price: 599, oldPrice: 799,
        brand: "Fossil", category: "Watches",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
        stock: 12, rating: 4.7, reviews: 203, badge: "Best"
    },
    {
        name: "Smart Watch Series 9",
        description: "Advanced smartwatch with health monitoring, GPS, and 18-hour battery. Seamlessly connects with your iPhone.",
        price: 399, oldPrice: 499,
        brand: "Apple", category: "Watches",
        images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"],
        stock: 28, rating: 4.8, reviews: 445, badge: "Hot"
    },

    // ── Kids ──────────────────────────────────────────────────
    {
        name: "LEGO Creator Set",
        description: "3-in-1 LEGO Creator set with 300+ pieces. Build a house, car, or robot — let your child's imagination run wild.",
        price: 49, oldPrice: 65,
        brand: "LEGO", category: "Kids",
        images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80"],
        stock: 85, rating: 4.9, reviews: 567, badge: "Best"
    },
    {
        name: "Kids Wireless Headphones",
        description: "Safe volume-limiting headphones designed for children. Colorful design, foldable for easy storage, 20-hour battery.",
        price: 39, oldPrice: 55,
        brand: "JBL", category: "Kids",
        images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"],
        stock: 60, rating: 4.4, reviews: 189, badge: "New"
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
        await Product.deleteMany({});
        console.log('Old products deleted');
        await Product.insertMany(sampleProducts);
        console.log(`✅ ${sampleProducts.length} products added with real images!`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedDB();