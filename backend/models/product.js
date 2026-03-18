const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
    },
    oldPrice: {
        type: Number,
    },
    brand: {
        type: String,
        required: [true, 'Please enter brand name'],
    },
    category: {
        type: String,
        required: [true, 'Please enter category'],
        enum: ['Electronics', 'Fashion', 'Footwear', 'Bags', 'Kids', 'Watches'],
    },
    images: [{
        type: String,
    }],
    stock: {
        type: Number,
        required: [true, 'Please enter stock quantity'],
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    badge: {
        type: String,
        enum: ['Hot', 'New', 'Sale', 'Best'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);